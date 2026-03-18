from collections import deque
import asyncio
import math
import struct
import time
from typing import Any

import websockets

from networking import send, recv
from state import GlobalState
from user_window import mainloop

# Websocket URL
url = 'wss://supertanks-app-production-eu.herokuapp.com/'

# Get login token
token = open('token.txt').read().strip()

UP_ANGLE = -math.pi / 2
WAYPOINT_REACH_RADIUS = 24.0
PATH_LOOKAHEAD_STEPS = 1
CENTER_REACH_RADIUS = 55.0
PACKET_ORDER = [
    'playerSpawned',
    'JOIN_SUCCESS',
    'updateTankList',
    'leaderBoardInfo',
]


def clamp_i16(v: int) -> int:
    return max(-32768, min(32767, v))


def pack_input_packet(target_angle: float, tick_num: int, move_forward: bool, shoot: bool) -> bytes:
    # Protocol uses int16 angle packed as radians * 10000.
    packed_angle = clamp_i16(int(round(target_angle * 10_000)))
    flags = (1 if shoot else 0) | (2 if move_forward else 0)
    return struct.pack('>BhiB', 2, packed_angle, int(tick_num), flags)


class BotClient:
    def __init__(self, name: str, session_cookie: str | None):
        self.name = name
        self.session_cookie = session_cookie
        self.state = GlobalState()
        self.ws: websockets.ClientConnection | None = None
        self._listen_task: asyncio.Task | None = None
        self._control_task: asyncio.Task | None = None
        self._running = False
        self._tick = 0
        self._last_shot_ts = 0.0
        self._waypoints: list[tuple[float, float]] = []
        self._waypoint_idx = 0
        self._last_repath_ts = 0.0

    async def connect_and_bootstrap(self):
        self.ws = await websockets.connect(url)
        await send(self.ws, ['joinGame', {'name': self.name, 'sessionCookie': self.session_cookie}])

        for expected in PACKET_ORDER:
            msg = await recv(self.ws)
            if not isinstance(msg, list) or len(msg) != 2 or msg[0] != expected:
                raise Exception(f'Unexpected message during bootstrap for {self.name}: {msg}. Expecting: {expected}')
            self.state.update(msg[1], expected)

        self._rebuild_path_to_center()

    def start(self):
        if self.ws is None:
            raise Exception(f'Bot {self.name} not connected')
        self._running = True
        self._listen_task = asyncio.create_task(self._listen_loop())
        self._control_task = asyncio.create_task(self._control_loop())

    async def stop(self):
        self._running = False
        for task in (self._listen_task, self._control_task):
            if task is not None:
                task.cancel()
        await asyncio.gather(
            *(t for t in (self._listen_task, self._control_task) if t is not None),
            return_exceptions=True,
        )
        if self.ws is not None:
            await self.ws.close()

    async def _listen_loop(self):
        assert self.ws is not None
        while self._running:
            try:
                msg = await recv(self.ws)
                if isinstance(msg, list) and len(msg) == 2 and isinstance(msg[0], str):
                    self.state.update(msg[1], msg[0])
                    if msg[0] in ('JOIN_SUCCESS', 'playerSpawned'):
                        self._rebuild_path_to_center()
                elif isinstance(msg, dict):
                    packet_type = msg.get('_type', '')
                    if isinstance(packet_type, str):
                        self.state.update(msg, packet_type)
            except Exception:
                # Keep the reader alive even if one packet is malformed.
                await asyncio.sleep(0.01)

    async def _control_loop(self):
        assert self.ws is not None
        while self._running:
            await asyncio.sleep(1 / 60)
            self._tick += 1

            now = time.monotonic()
            if now - self._last_repath_ts >= 0.5:
                self._rebuild_path_to_center()
                self._last_repath_ts = now

            movement_angle, move_forward, at_center = self._movement_command()
            shoot = at_center and (now - self._last_shot_ts >= 0.35)

            if shoot:
                # fire a shot straight up
                packet = pack_input_packet(UP_ANGLE, self._tick, False, True)
                self._last_shot_ts = now
            else:
                packet = pack_input_packet(movement_angle, self._tick, move_forward, False)

            await self.ws.send(packet)

    def _get_own_tank_position(self) -> tuple[float, float] | None:
        own_id = self.state.tankID
        for t in self.state.tanks:
            if not isinstance(t, dict):
                continue
            if t.get('id') != own_id:
                continue
            x = t.get('x')
            y = t.get('y')
            if x is None or y is None:
                return None
            return (float(x), float(y))
        return None

    def _movement_command(self) -> tuple[float, bool, bool]:
        pos = self._get_own_tank_position()
        if pos is None:
            return (UP_ANGLE, False, False)

        if not self._waypoints:
            self._rebuild_path_to_center()
        if not self._waypoints:
            return (UP_ANGLE, False, False)

        x, y = pos

        # Progress through close waypoints quickly so bots don't brake/turn too often.
        while self._waypoint_idx < len(self._waypoints):
            tx, ty = self._waypoints[self._waypoint_idx]
            if math.hypot(tx - x, ty - y) < WAYPOINT_REACH_RADIUS:
                self._waypoint_idx += 1
            else:
                break

        if self._waypoint_idx >= len(self._waypoints):
            return (UP_ANGLE, False, True)

        # Aim a few nodes ahead to reduce zig-zagging and preserve speed.
        target_idx = min(self._waypoint_idx + PATH_LOOKAHEAD_STEPS, len(self._waypoints) - 1)
        tx, ty = self._waypoints[target_idx]
        angle = math.atan2(ty - y, tx - x)

        final_tx, final_ty = self._waypoints[-1]
        at_center = math.hypot(final_tx - x, final_ty - y) <= CENTER_REACH_RADIUS
        return (angle, True, at_center)

    def _rebuild_path_to_center(self):
        if not hasattr(self.state, 'map'):
            return

        cells_across = getattr(self.state.map, 'cellsAcross', 0)
        cells_down = getattr(self.state.map, 'cellsDown', 0)
        vertical = getattr(self.state.map, 'verticalWalls', [])
        horizontal = getattr(self.state.map, 'horisontalWalls', [])

        if not cells_across or not cells_down:
            return
        if not isinstance(vertical, list) or not isinstance(horizontal, list):
            return

        pos = self._get_own_tank_position()
        if pos is None:
            return

        sx, sy = pos
        start = (int(sy // 100), int(sx // 100))
        goal = (cells_down // 2, cells_across // 2)

        path = bfs_cell_path(start, goal, cells_across, cells_down, vertical, horizontal)
        if not path:
            self._waypoints = [(goal[1] * 100 + 50, goal[0] * 100 + 50)]
        else:
            self._waypoints = [(col * 100 + 50, row * 100 + 50) for row, col in path[1:]]
        self._waypoint_idx = 0


def bfs_cell_path(
    start: tuple[int, int],
    goal: tuple[int, int],
    cells_across: int,
    cells_down: int,
    vertical_walls: list[Any],
    horizontal_walls: list[Any],
) -> list[tuple[int, int]]:
    def infer_blocked_value() -> bool:
        # Infer wall encoding by checking map boundaries, which are expected blocked.
        samples: list[Any] = []

        # Vertical walls include left/right boundaries for each row.
        for r in range(cells_down):
            row_off = r * (cells_across + 1)
            samples.append(vertical_walls[row_off])
            samples.append(vertical_walls[row_off + cells_across])

        # Horizontal walls include top/bottom boundaries for each column.
        top_off = 0
        bottom_off = cells_down * cells_across
        for c in range(cells_across):
            samples.append(horizontal_walls[top_off + c])
            samples.append(horizontal_walls[bottom_off + c])

        ones = sum(1 for v in samples if bool(v))
        zeros = len(samples) - ones
        # If boundaries are mostly truthy, truthy means blocked, else falsy means blocked.
        return ones >= zeros

    def find_path(invert_wall_value: bool) -> list[tuple[int, int]]:
        blocked_value = infer_blocked_value()

        def is_blocked(value: Any) -> bool:
            blocked = (bool(value) == blocked_value)
            return (not blocked) if invert_wall_value else blocked

        def can_move(r: int, c: int, nr: int, nc: int) -> bool:
            if not in_bounds(nr, nc):
                return False

            # west/east checks use vertical wall boundaries
            if nr == r and nc == c - 1:
                return not is_blocked(vertical_walls[r * (cells_across + 1) + c])
            if nr == r and nc == c + 1:
                return not is_blocked(vertical_walls[r * (cells_across + 1) + (c + 1)])

            # north/south checks use horizontal wall boundaries
            if nr == r - 1 and nc == c:
                return not is_blocked(horizontal_walls[r * cells_across + c])
            if nr == r + 1 and nc == c:
                return not is_blocked(horizontal_walls[(r + 1) * cells_across + c])

            return False

        q: deque[tuple[int, int]] = deque([start])
        parent: dict[tuple[int, int], tuple[int, int] | None] = {start: None}
        dirs = [(-1, 0), (1, 0), (0, -1), (0, 1)]

        while q:
            r, c = q.popleft()
            if (r, c) == goal:
                break
            for dr, dc in dirs:
                nr, nc = r + dr, c + dc
                nxt = (nr, nc)
                if nxt in parent:
                    continue
                if not can_move(r, c, nr, nc):
                    continue
                parent[nxt] = (r, c)
                q.append(nxt)

        if goal not in parent:
            return []

        out: list[tuple[int, int]] = []
        cur: tuple[int, int] | None = goal
        while cur is not None:
            out.append(cur)
            cur = parent[cur]
        out.reverse()
        return out

    def in_bounds(r: int, c: int) -> bool:
        return 0 <= r < cells_down and 0 <= c < cells_across

    if not in_bounds(*start) or not in_bounds(*goal):
        return []

    # Use inferred wall semantics first, then retry inverted if no path.
    path = find_path(invert_wall_value=False)
    if path:
        return path
    return find_path(invert_wall_value=True)


async def main():
    players: list[BotClient] = []

    # Spawn 5 total players. First in list is used for visuals only by state selection.
    configs = [
        ('Omena0', token),
        ('Omena0', token),
        ('Omena0', token),
        ('Omena0', token),
        ('Omena0', token),
    ]

    try:
        for name, cookie in configs:
            bot = BotClient(name=name, session_cookie=cookie)
            await bot.connect_and_bootstrap()
            bot.start()
            players.append(bot)

        visual_bot = players[0]
        await mainloop(visual_bot.state)
    finally:
        await asyncio.gather(*(p.stop() for p in players), return_exceptions=True)

asyncio.run(main())

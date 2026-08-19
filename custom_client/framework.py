import asyncio
import struct
from dataclasses import dataclass
from typing import Any

import websockets

from networking import recv, send
from state import GlobalState

PACKET_ORDER = [
    'playerSpawned',
    'JOIN_SUCCESS',
    'updateTankList',
    'leaderBoardInfo',
]


def clamp_i16(v: int) -> int:
    return max(-32768, min(32767, v))


@dataclass(slots=True)
class InputCommand:
    # Angle in radians. Network packet packs this as int16(angle * 10000).
    angle: float
    move_forward: bool = False
    shoot: bool = False


def pack_input_packet(cmd: InputCommand, tick_num: int) -> bytes:
    packed_angle = clamp_i16(int(round(cmd.angle * 10_000)))
    flags = (1 if cmd.shoot else 0) | (2 if cmd.move_forward else 0)
    # type=2, int16 angle, int32 tick, uint8 flags
    return struct.pack('>BhiB', 2, packed_angle, int(tick_num), flags)


class CustomClientBase:
    def __init__(self, url: str, name: str, session_cookie: str | None):
        self.url = url
        self.name = name
        self.session_cookie = session_cookie

        self.state = GlobalState()
        self.ws: websockets.ClientConnection | None = None
        self.running = False

        self._recv_task: asyncio.Task | None = None
        self._control_task: asyncio.Task | None = None
        self._tick = 0

    async def connect_and_bootstrap(self):
        self.ws = await websockets.connect(self.url)
        await send(self.ws, ['joinGame', {'name': self.name, 'sessionCookie': self.session_cookie}])

        for expected in PACKET_ORDER:
            msg = await recv(self.ws)
            if not isinstance(msg, list) or len(msg) != 2 or msg[0] != expected:
                raise Exception(f'Unexpected bootstrap message: {msg}. Expected {expected}')
            self.state.update(msg[1], expected)

        await self.on_bootstrap_complete()

    async def start(self):
        if self.ws is None:
            raise Exception('Client is not connected. Call connect_and_bootstrap() first.')

        self.running = True
        self._recv_task = asyncio.create_task(self._recv_loop())
        self._control_task = asyncio.create_task(self._control_loop())

    async def stop(self):
        self.running = False

        for task in (self._recv_task, self._control_task):
            if task is not None:
                task.cancel()

        await asyncio.gather(
            *(t for t in (self._recv_task, self._control_task) if t is not None),
            return_exceptions=True,
        )

        if self.ws is not None:
            await self.ws.close()

    async def run_with_ui(self, ui_coro):
        await self.connect_and_bootstrap()
        await self.start()
        try:
            await ui_coro(self.state)
        finally:
            await self.stop()

    async def _recv_loop(self):
        assert self.ws is not None

        while self.running:
            try:
                msg = await recv(self.ws)
                if isinstance(msg, list) and len(msg) == 2 and isinstance(msg[0], str):
                    event_name, data = msg
                    self.state.update(data, event_name)
                    await self.on_event(event_name, data)
                elif isinstance(msg, dict):
                    packet_type = msg.get('_type', '')
                    if isinstance(packet_type, str):
                        self.state.update(msg, packet_type)
                        await self.on_binary_state(packet_type, msg)
            except asyncio.CancelledError:
                raise
            except Exception as ex:
                await self.on_exception(ex)
                await asyncio.sleep(0.01)

    async def _control_loop(self):
        assert self.ws is not None

        while self.running:
            await asyncio.sleep(1 / 60)
            self._tick += 1

            try:
                cmd = await self.on_control_tick(self._tick)
                if cmd is None:
                    continue
                await self.ws.send(pack_input_packet(cmd, self._tick))
            except asyncio.CancelledError:
                raise
            except Exception as ex:
                await self.on_exception(ex)

    # Hooks for custom clients
    async def on_bootstrap_complete(self):
        return None

    async def on_event(self, event_name: str, data: Any):
        return None

    async def on_binary_state(self, packet_type: str, packet: dict[str, Any]):
        return None

    async def on_control_tick(self, tick_num: int) -> InputCommand | None:
        return None

    async def on_exception(self, ex: Exception):
        print(f'[client:{self.name}] {ex}')
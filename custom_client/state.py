from typing import Any
import time

class Object: ...

class GlobalState:
    _assignment_map = {
        "JOIN_SUCCESS": {
            "newID": "tankID",
            "name": "name",
            "*": "map"
        },
        "updateTankList": "tanks"
    }
    __slots__ = [
        'name', 'x', 'y', 'tankID',
        'colourIndex',
        'tanks', 'bullets', 'lastBulletSyncTime', 'map', 'leaderBoard',
        'kingID', 'longestReigns', 'playerScores', 'kingStartTime'
    ]
    def __init__(self):
        self.name = ''
        self.x = 0
        self.y = 0
        self.tankID = 0
        self.colourIndex = 0
        self.tanks = []
        self.bullets = []
        self.lastBulletSyncTime = time.monotonic()
        self.map = Object()
        self.leaderBoard = []
        self.kingID = 0
        self.longestReigns = []
        self.playerScores = []
        self.kingStartTime = 0

    def update(self, values: dict[str, Any], packet_type:str=''):
        if packet_type == 'tank_state':
            self.update_tanks(values)
            return
        if packet_type == 'bullet_state':
            self.update_bullets(values)
            return

        map = self._assignment_map.get(packet_type, {})

        if isinstance(values, list):
            assert isinstance(map, str), f"Unhandled list-type .update: {packet_type}"
            setattr(self, map, values)

        else:
            if '*' in map:
                setattr(self, map['*'], Object())

            for k, v in values.items():
                if "*" in map:
                    if k not in map:
                        setattr(getattr(self, map['*']), k, v)
                    else:
                        if map[k]:
                            setattr(self, map[k], v)
                else:
                    setattr(self, map.get(k,k), v)

    def update_bullets(self, values: dict[str, Any]):
        # values expected shape: {'tickNum': int, 'bullets': [{'id': int, 'x': int, 'y': int, 'vx': float, 'vy': float}, ...]}
        if not isinstance(values, dict):
            return

        incoming = values.get('bullets', [])
        if not isinstance(incoming, list):
            return

        normalized: list[dict[str, Any]] = []
        for b in incoming:
            if not isinstance(b, dict):
                continue

            bullet_id = b.get('id', b.get('ID'))
            x = b.get('x')
            y = b.get('y')
            if bullet_id is None or x is None or y is None:
                continue

            normalized.append({
                'id': int(bullet_id),
                'x': x,
                'y': y,
                'vx': b.get('vx', 0.0),
                'vy': b.get('vy', 0.0),
            })

        # Bullet sync packets contain the live bullet set, so replace atomically.
        self.bullets = normalized
        self.lastBulletSyncTime = time.monotonic()

    def update_tanks(self, values):
        # values expected shape: { 'tickNum': int, 'tanks': [ { 'tankID': int, 'x': int, 'y': int, 'angle': float }, ... ] }
        if not isinstance(values, dict):
            return

        incoming = values.get('tanks', [])
        if not isinstance(incoming, list):
            return

        # Build index of existing tanks by id for fast lookup
        existing_by_id: dict[int, dict] = {}
        for t in self.tanks:
            if isinstance(t, dict) and 'id' in t:
                try:
                    existing_by_id[int(t['id'])] = t
                except Exception:
                    continue

        for inc in incoming:
            if not isinstance(inc, dict):
                continue

            tank_id = inc.get('tankID')
            if tank_id is None:
                continue

            # normalize to int
            try:
                tank_id = int(tank_id)
            except Exception:
                continue

            x = inc.get('x')
            y = inc.get('y')
            angle = inc.get('angle')

            existing = existing_by_id.get(tank_id)
            if existing is not None:
                # update position fields while preserving metadata
                existing['x'] = x
                existing['y'] = y
                existing['angle'] = angle
            else:
                # create a minimal tank entry preserving the workspace format
                new_tank = {
                    'id': tank_id,
                    'colourIndex': 0,
                    'name': '',
                    'beenHit': False,
                    'x': x,
                    'y': y,
                    'angle': angle
                }
                self.tanks.append(new_tank)

    def __str__(self) -> str:
        out = 'GlobalState('
        for k in self.__slots__:
            v = getattr(self, k)
            out += f'{k}={v}\n'

        out += '\n)'

        return out


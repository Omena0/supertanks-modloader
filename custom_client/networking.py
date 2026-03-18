from typing import Any, TypeGuard
from state import GlobalState
import websockets
import json


def _u8(data: bytes) -> int:
    return int.from_bytes(data, byteorder='big', signed=False)


def _u32(data: bytes) -> int:
    return int.from_bytes(data, byteorder='big', signed=False)


def _i16(data: bytes) -> int:
    return int.from_bytes(data, byteorder='big', signed=True)


async def send(ws: websockets.ClientConnection, msg):
    await ws.send(json.dumps(msg), text=True)

async def recv(ws: websockets.ClientConnection) -> list[Any] | dict[str, Any]:
    raw = await ws.recv()
    if isinstance(raw, str):
        return json.loads(raw)

    elif isinstance(raw, bytes):
        type, data = raw[0], raw[1:]
        if type == 0:
            tickNum, data = _u32(data[:4]), data[4:]
            tankCount, data = _u8(data[:1]), data[1:]

            tanks = []
            for _ in range(tankCount):
                tankID,    data = _u8(data[:1]), data[1:]
                tankX,     data = _i16(data[:2]), data[2:]
                tankY,     data = _i16(data[:2]), data[2:]
                tankAngle, data = _i16(data[:2]), data[2:]

                tanks.append({
                    "tankID": tankID,
                    "x": tankX,
                    "y": tankY,
                    "angle": tankAngle / 10_000
                })

            return {
                "_type": "tank_state",
                "tickNum": tickNum,
                "tanks": tanks
            }

        elif type == 1:
            tickNum,        data = _u32(data[:4]), data[4:]
            bulletsSpawned, data = _u8(data[:1]), data[1:]
            bulletCount,    data = _u8(data[:1]), data[1:]

            bullets = []
            for _ in range(bulletCount):
                bulletID, data = _u8(data[:1]), data[1:]
                bulletX,  data = _i16(data[:2]), data[2:]
                bulletY,  data = _i16(data[:2]), data[2:]
                bulletVX, data = _i16(data[:2]), data[2:]
                bulletVY, data = _i16(data[:2]), data[2:]

                bullets.append({
                    "id": bulletID,
                    "x": bulletX,
                    "y": bulletY,
                    "vx": bulletVX / 50_000,
                    "vy": bulletVY / 50_000
                })

            return {
                "_type": "bullet_state",
                "tickNum": tickNum,
                "bulletsSpawned": bulletsSpawned,
                "bulletCount": bulletCount,
                "bullets": bullets
            }

    raise Exception(f'Invalid reply from server: {raw}')

def ensure_format(packet: Any, message_type: str | int = '', format: str = 'json') -> TypeGuard[dict]:
    if format == 'json':
        if not isinstance(packet, list) or len(packet) != 2:
            return False

        if not isinstance(packet[0], str):
            return False

        if message_type and not packet[0] == message_type:
            return False

    elif format == 'decoded':
        if not isinstance(packet, dict):
            return False

    elif format == 'binary':
        if not isinstance(packet, bytes):
            return False

        if message_type and not packet[0] == message_type:
            return False

    else:
        return False

    return True

async def message_loop(state:GlobalState, ws: websockets.ClientConnection):
    while True:
        msg = await recv(ws)

        if ensure_format(msg, format='json'):
            type, data = msg
            try:
                state.update(data, type)
            except: ...

        elif ensure_format(msg, format='decoded'):
            try:
                state.update(msg, msg.get('_type', ''))
            except: ...

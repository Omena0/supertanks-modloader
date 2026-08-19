# Custom Client Framework

This directory now exposes a small framework for building custom SuperTanks clients.

## Files

- `framework.py`: base client lifecycle + hooks + input packet encoder.
- `networking.py`: protocol decoding (`recv`) and JSON helper (`send`).
- `state.py`: shared world state model updated from server packets.
- `user_window.py`: optional pygame visualizer.
- `main.py`: minimal example client using the framework.

## Quick Start

Run the default visual client:

```bash
cd custom_client
py main.py
```

## Building a Custom Client

Subclass `CustomClientBase` from `framework.py` and override hook methods.

### Hook methods

- `on_bootstrap_complete(self)`: called after initial join packets are processed.
- `on_event(self, event_name, data)`: called for JSON server events.
- `on_binary_state(self, packet_type, packet)`: called for decoded binary packets.
- `on_control_tick(self, tick_num)`: return `InputCommand` to send movement/shoot input; return `None` to send nothing.
- `on_exception(self, ex)`: centralized error handling.

### Example

```python
import asyncio
import math

from framework import CustomClientBase, InputCommand
from user_window import mainloop

URL = 'wss://supertanks-app-production-eu.herokuapp.com/'
TOKEN = open('token.txt').read().strip()


class MyClient(CustomClientBase):
    async def on_control_tick(self, tick_num: int):
        # Keep aiming up and occasionally fire.
        shoot = (tick_num % 20) == 0
        return InputCommand(angle=-math.pi / 2, move_forward=False, shoot=shoot)


async def main():
    client = MyClient(url=URL, name='Omena0', session_cookie=TOKEN)
    await client.run_with_ui(mainloop)


asyncio.run(main())
```

## Packet Angle Note

Input packet angle uses protocol packing:

- sent value = `int16(round(angle_radians * 10000))`

This is handled by `pack_input_packet(...)` in `framework.py`.

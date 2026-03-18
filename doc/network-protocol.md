# SuperTanks — Network Protocol

## Transport

All communication uses a single **WebSocket** connection per client. The protocol supports two message formats:

1. **JSON messages** — For infrequent, variable-structure events (join, kill, leaderboard)
2. **Binary messages** — For high-frequency, fixed-structure game state (tank positions, bullet positions, player input)

## How JSON vs Binary Is Distinguished

The client does **not** inspect the first byte for `{"` or `[`.

Dispatch is based on the runtime type of `event.data` in `socket.onmessage`:

- If `event.data instanceof ArrayBuffer`: treat as binary, read byte 0 as `messageType`, and route payload `data.slice(1)` to numeric handlers.
- Otherwise: treat as text, `JSON.parse(...)`, validate `[eventName, data]`, then route to string handlers.

This behavior is implemented in `socketWrapper.js` (both vanilla and modded variants).

Practical implication:

- Binary framing starts with a 1-byte type header.
- JSON framing starts as a text frame and is parsed as a 2-element array.
- There is no ambiguity because WebSocket already preserves frame type (text vs binary).

## Message Framing

### JSON Messages

JSON messages are serialized as a 2-element JSON array:

```js
[eventName, data]
```

Example:

```json
["joinGame", {"name": "Player1", "sessionCookie": "abc123"}]
```

The `SocketWrapper` parses incoming strings as JSON, validates the array length is 2, and routes to the handler registered for `eventName`.

### Binary Messages

Binary messages use a 1-byte **type header** followed by the payload:

```table
┌──────────┬────────────────────────────┐
│ Type (1B)│ Payload (variable length)  │
└──────────┴────────────────────────────┘
```

| Type ID | Direction | Name |
| ------- | --------- | ---- |
| `0` | Server → Client | `newStateFromServer` (tank positions) |
| `1` | Server → Client | `syncBullets` (bullet positions) |
| `2` | Client → Server | `tankInputToServer` (player input) |

## WebSocket Endpoint

### What is known from this repository

- `gameClient.beginClient(name, serverUrl)` receives the WebSocket URL as a function argument.
- `new WebSocket(serverUrl)` is called directly from that argument.
- The value assignment site for `serverUrl` is not present in the source modules in this repo (it is likely provided by surrounding page/bootstrap code outside these files).

### Explicit endpoint found in this workspace

`custom_client/main.py` currently uses:

```py
url = 'wss://supertanks-app-production-eu.herokuapp.com/'
```

Treat this as the custom client target endpoint, not guaranteed canonical for all deployments.

For additional notes and caveats, see `connection-auth.md`.

## Binary Message Formats

### Type 0: Tank State (`newStateFromServer`)

Sent by server at ~30 Hz. Contains positions of all tanks.

**Total size:** $5 + 7n$ bytes (where $n$ = tank count)

```table
Offset  Size    Type      Field
──────  ──────  ────────  ─────────────────────
0       4       uint32    tickNum
4       1       uint8     tankCount (n)

Per tank (repeated n times):src
5+7i    1       uint8     tank ID
6+7i    2       int16     x position
8+7i    2       int16     y position
10+7i   2       int16     angle (packed: angle × 10000)
```

**Angle packing:** The angle (in radians, range $[-\pi, \pi]$) is multiplied by 10000 and rounded to an int16. This gives a precision of 0.0001 radians (~0.006°).

**Position range:** int16 gives $[-32768, 32767]$, which supports maze worlds up to ~327 cells across (at 100 units/cell).

### Type 1: Bullet State (`syncBullets`)

Sent by server at ~6 Hz. Contains positions and velocities of all bullets.

**Total size:** $6 + 9n$ bytes (where $n$ = bullet count)

```table
Offset  Size    Type      Field
──────  ──────  ────────  ─────────────────────
0       4       uint32    tickNum
4       1       uint8     bulletsSpawnedCount
5       1       uint8     bulletCount (n)

Per bullet (repeated n times):
6+9i    1       uint8     bullet ID
7+9i    2       int16     x position
9+9i    2       int16     y position
11+9i   2       int16     x velocity (packed: xVel × 50000)
13+9i   2       int16     y velocity (packed: yVel × 50000)
```

**Velocity packing:** Velocity (in units/ms, typically ±0.18) is multiplied by 50000 and rounded. This maps `0.18` → `9000`, well within int16 range. Precision: 0.00002 units/ms.

**`bulletsSpawnedCount`:** The number of bullets the local player has fired that are still alive. Used for ammo counter reconciliation.

### Type 2: Player Input (`tankInputToServer`)

Sent by client every physics tick (60 Hz).

**Total size:** 7 bytes

```table
Offset  Size    Type      Field
──────  ──────  ────────  ─────────────────────
0       2       int16     targetAngle (packed: angle × 10000)
2       4       int32     tickNum
6       1       uint8     flags
```

**Flags byte:**

```flags
Bit 0: mouseClicked (1 = shooting this tick)
Bit 1: moveForward  (1 = moving, 0 = rotating only)
```

The client sends the **angle from the tank to the mouse cursor**, not the mouse position itself. This prevents the server from needing to know the client's screen size.

## JSON Message Reference

### Client → Server

#### `"joinGame"`

```json
{
  "name": "PlayerName",
  "sessionCookie": "token_value_or_null"
}
```

#### `"spawnPlayer"`

No payload (empty).

### Server → Client

#### `"JOIN_SUCCESS"`

```json
{
  "newID": 1,
  "name": "PlayerName",
  "colourIndex": 3,
  "cellsAcross": 16,
  "cellsDown": 16,
  "verticalWalls": [1, 0, 1, ...],
  "horisontalWalls": [1, 0, 0, ...],
  "wallCorners": [1, 0, 1, ...]
}
```

Wall arrays are flat:

- `verticalWalls`: $(cellsDown) \times (cellsAcross + 1)$ entries
- `horisontalWalls`: $(cellsDown + 1) \times cellsAcross$ entries
- `wallCorners`: $(cellsDown + 1) \times (cellsAcross + 1)$ entries

#### `"updateTankList"`

```json
[
  { "id": 1, "name": "Player1", "colourIndex": 0, "beenHit": false },
  { "id": 2, "name": "Player2", "colourIndex": 5, "beenHit": true }
]
```

#### `"playerSpawned"`

```json
{
  "tankID": 1,
  "x": 450,
  "y": 750
}
```

#### `"tankKilled"`

```json
3
```

(Just the killed tank's ID as a number.)

#### `"leaderBoardInfo"`

```json
{
  "leaderBoard": [
    { "id": 1, "name": "Player1", "score": 15 },
    { "id": 3, "name": "Player3", "score": 8 }
  ],
  "longestReigns": [...],
  "playerScores": [
    { "id": 1, "score": 15, "leaderBoardPos": 1 },
    { "id": 2, "score": 3, "leaderBoardPos": 3 }
  ],
  "kingID": 1,
  "kingStartTime": 1678900000000
}
```

#### `"NEW_BULLET_LIMIT"`

```json
5
```

(Just the new limit as a number.)

#### `"EXP"`

```json
7
```

(Experience points earned.)

## Connection Handshake and Join Flow

At transport level (WebSocket):

1. Browser performs HTTP Upgrade (and TLS handshake for `wss://`).
2. `socket.onopen` fires on success.

At game protocol level (application handshake):

1. Client immediately sends JSON `"joinGame"` with `{ name, sessionCookie }`.
2. Server replies with JSON `"JOIN_SUCCESS"` containing player identity and maze state.
3. Client can then request spawn via JSON `"spawnPlayer"`.
4. Server sends `"playerSpawned"` and periodic binary state updates begin/continue.

There is no separate binary handshake message type; join is done as JSON.

## Authentication and Session Cookie

### Mechanism used by client

On connect, the client reads browser cookies and extracts `session_token` from `document.cookie`:

- Cookie key looked up: `session_token`
- If found: value is sent as `sessionCookie` in `joinGame`
- If missing: `sessionCookie: null` is sent

### What this implies

- Session identity is attached at application level inside `joinGame`, not in the raw WebSocket frame format.
- Cookie content is treated as an opaque token by the client (no decoding logic present).
- Because JavaScript reads it, this cookie cannot be `HttpOnly` in the browser context where the game runs.

### Cookie contents

The exact internal structure of `session_token` is **not visible** in this repo.

- It may be random session ID, signed blob, JWT-like token, or other server-defined format.
- Client code never parses it; it forwards verbatim.

### How to obtain the cookie

From a normal browser session on the game site:

1. Open the site and let it load normally.
2. In DevTools, inspect Application/Storage → Cookies for the site origin.
3. Read `session_token` if present.

Or via console on that origin:

```js
document.cookie
```

Then extract `session_token=...`.

Important:

- Respect site Terms of Service and applicable laws.
- Never share active session tokens.
- Session tokens are credentials.

## Timing & Synchronization

```timing
Client tick 0   ──input──>   Server receives, queues
Client tick 1   ──input──>   Server receives, queues
                             Server tick N: processes all queued inputs
                <──state──   Server broadcasts tank state (tick N)
Client: discard buffer entries < tick N
Client: re-apply remaining buffered inputs
```

The `tickNum` in binary messages is the synchronization anchor. The client maintains growing input buffers and trims them when server acknowledgments arrive (by matching tick numbers).

## Endianness

All binary values use **big-endian** byte order (the default for `DataView` methods like `getInt16()`, `setInt16()`, etc., when no `littleEndian` parameter is passed).

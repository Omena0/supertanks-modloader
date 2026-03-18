# SuperTanks — Server Analysis

> **Note:** The server code is not available. This analysis is reverse-engineered entirely from the client code — message formats, event names, data structures, timing, and behavioral patterns.

## Server Overview

The server is a WebSocket-based game server that:

- Accepts connections and manages player sessions
- Maintains the authoritative game state (tank positions, bullets, scores)
- Processes player input at a tick-based rate
- Broadcasts state updates to all connected clients
- Handles kill detection, scoring, leaderboard, and king-of-the-hill logic

## Connection & Session Flow

```flow
Client                              Server
  |                                    |
  |--- WebSocket connect ------------->|
  |                                    |
  |<-- onopen -------------------------|
  |                                    |
  |--- "joinGame" { name,             |
  |     sessionCookie } ------------->|
  |                                    |  (validates session, assigns ID)
  |<-- "JOIN_SUCCESS" {               |
  |     newID, name, colourIndex,     |
  |     cellsAcross, cellsDown,       |
  |     verticalWalls, horisontalWalls,|
  |     wallCorners } <---------------|
  |                                    |
  |--- "spawnPlayer" ---------------->|
  |                                    |  (picks spawn location)
  |<-- "playerSpawned" {              |
  |     tankID, x, y } <-------------|
  |                                    |
  |    ... game loop begins ...        |
```

### Session Authentication

The client reads a `session_token` cookie from the browser and sends it in the `joinGame` message. This suggests:

- The server is behind a web server that sets session cookies
- The server uses the cookie for returning player identification (possibly preserving scores/stats across reconnects)
- If no cookie is found, `null` is sent — the server likely creates a new session

Clarifications from client implementation:

- The token is sent in the **application payload** (`joinGame.sessionCookie`), not as a WebSocket protocol extension/auth header.
- The client treats it as opaque and does not parse/decode it.
- Since the game client reads it via `document.cookie`, this cookie is readable by page JavaScript in the game context.

See also: `connection-auth.md` for a focused Q&A on transport type detection, handshake steps, endpoint discovery, and cookie handling.

### Endpoint Discovery

The game client itself does not hardcode the endpoint in `gameClient.js`; it accepts `serverUrl` from external bootstrap code and opens `new WebSocket(serverUrl)`.

The only explicit endpoint string present in this workspace is in `custom_client/main.py`:

- `wss://supertanks-app-production-eu.herokuapp.com/`

Treat this as a known target used by the custom client script, not necessarily the only/authoritative production endpoint for every deployment.

### Layered Handshake Summary

1. Transport handshake: HTTP Upgrade to WebSocket (plus TLS for `wss://`).
2. App handshake: client sends JSON `joinGame` with `{ name, sessionCookie }` on `onopen`.
3. Server responds with `JOIN_SUCCESS` (identity + maze).
4. Spawn phase via `spawnPlayer` and `playerSpawned`.

## Server Tick Model

Based on the client constants and behavior:

| Parameter | Value | Source |
| --------- | ----- | ------ |
| Physics tick rate | 60 Hz (16.67ms) | `PHYSICS_INTERVAL = 1000/60` |
| State broadcast rate | 30 Hz (33.33ms) | `SEND_STATE_INTERVAL = 1000/30` |
| Bullet sync rate | ~6 Hz (166.67ms) | `SEND_BULLETS_STATE_INTERVAL = 1000/6` |

The server likely runs its own physics simulation at 60 Hz (matching the client), but broadcasts tank state at 30 Hz and bullet state at ~6 Hz to save bandwidth.

## Server-to-Client Messages

### Binary Messages

| Type ID | Name | Description |
| ------- | ---- | ----------- |
| `0` | `newStateFromServer` | Authoritative tank positions for all tanks. Sent at ~30 Hz. |
| `1` | `syncBullets` | Authoritative bullet positions for all bullets. Sent at ~6 Hz. Also includes `bulletsSpawnedCount` per player. |

### JSON Messages

| Event Name | Payload | Description |
| ---------- | ------- | ----------- |
| `JOIN_SUCCESS` | `{ newID, name, colourIndex, cellsAcross, cellsDown, verticalWalls, horisontalWalls, wallCorners }` | Sent after successful join. Contains assigned ID, color, and full maze data. |
| `leaderBoardInfo` | `{ leaderBoard, longestReigns, playerScores, kingID, kingStartTime }` | Periodic leaderboard update with current king info. |
| `updateTankList` | `[{ id, name, colourIndex, beenHit }, ...]` | Sent when players join/leave. Full list of active tanks. |
| `tankKilled` | `killedID` (number) | Broadcast when a tank is destroyed. |
| `playerSpawned` | `{ tankID, x, y }` | Notification that a player has (re)spawned. |
| `NEW_BULLET_LIMIT` | `newLimit` (number) | Updates player's max bullet count (progression reward). |
| `EXP` | `exp` (number) | Awards experience points to the player. |

## Client-to-Server Messages

### Binary Messages

| Type ID | Name | Payload Size | Description |
| ------- | ---- | ------------ | ----------- |
| `2` | `tankInputToServer` | 7 bytes | Player input sent every physics tick (60 Hz). |

Input format (7 bytes):

- `int16` — target angle (packed: `angle * 10000`)
- `int32` — tick number
- `uint8` — flags: bit 1 = `moveForward`, bit 0 = `mouseClicked`

### JSON Messages

| Event Name | Payload | Description |
| ---------- | ------- | ----------- |
| `"joinGame"` | `{ name, sessionCookie }` | Initial join request |
| `"spawnPlayer"` | (none) | Request to spawn/respawn |

## Inferred Server Architecture

### Game State Management

The server must maintain:

```js
GameRoom {
  maze: {
    cellsAcross: number,
    cellsDown: number,
    verticalWalls: number[],
    horisontalWalls: number[],
    wallCorners: number[]
  },
  tanks: Map<ID, {
    id: number (uint8 — max 255),
    x: number,
    y: number,
    angle: number,
    name: string,
    colourIndex: number,
    beenHit: boolean,
    bulletsSpawnedCount: number,
    bulletLimit: number,
    score: number,
    leaderBoardPos: number,
    inputQueue: UserInput[]
  }>,
  bullets: Map<ID, {
    id: number (uint8),
    x: number,
    y: number,
    xVel: number,
    yVel: number
  }>,
  kingID: number,
  kingStartTime: timestamp,
  leaderBoard: [{ id, name, score }],
  tickNum: number
}
```

### Server Processing Pipeline (per tick)

```list
1. Receive all queued player inputs
2. For each player's input:
   a. Validate tick number
   b. Apply movement (tankMoveTowards / tankLookAtPoint)
   c. Process shooting:
      - Check cooldown (2 tick minimum between shots)
      - Check bullet limit
      - Spawn bullet if valid
3. Update all bullet positions (bounce off walls)
4. Check bullet-tank collisions:
   - Use OBB-circle intersection (collision.checkOBBCircleIntersection)
   - Bullets have radius 9, tank has OBB from TANK_BOUNDING_BOX
   - On hit: mark tank as beenHit, remove bullet, broadcast "tankKilled"
5. Check bullet TTL expiration (9000ms)
6. Update leaderboard and king status
7. Broadcast state updates at appropriate intervals
```

### Maze Generation

The maze is generated server-side. Based on the splash screen hardcoded maze (16×16) and the JOIN_SUCCESS data, the server generates mazes with:

- Configurable dimensions (`cellsAcross`, `cellsDown`)
- Standard maze generation algorithm (likely recursive backtracking or similar)
- Wall corners are pre-computed and sent to clients

### Kill & Scoring Logic

The server:

1. Detects bullet-tank collisions (likely same physics code as client)
2. Broadcasts `"tankKilled"` with the killed player's ID
3. Awards EXP to the killer (`"EXP"` event, `EXP_PER_KILL = 7`)
4. May increase the killer's bullet limit (`"NEW_BULLET_LIMIT"`)
5. Updates leaderboard scores and king status
6. Removes the bullet that caused the kill

### King of the Hill Logic

- The server tracks `kingID` (current #1 player) and `kingStartTime` (when they became king)
- Changes whenever the leaderboard #1 position changes
- Sent to all clients via `leaderBoardInfo`
- The client displays crown, "You are King!" text, timer, and off-screen arrow indicator

### Spawn System

- On receiving `"spawnPlayer"`, the server picks a valid spawn location in the maze
- Broadcasts `"playerSpawned"` with the tank ID and coordinates
- Likely ensures the spawn is away from other players and not inside walls

### Bullet Limit Progression

The client starts with `TANK_DEFAULT_BULLETCOUNT = 3` but the server can increase it up to `TANK_MAX_BULLET_COUNT = 12` via `"NEW_BULLET_LIMIT"`. This appears to be a kill-streak or score-based reward — the more you kill, the more bullets you can fire simultaneously.

## Shared Code

The `constants.js` and `networkProtocol.js` modules export values that are clearly shared between client and server:

- `SEND_STATE_INTERVAL` and `SEND_BULLETS_STATE_INTERVAL` are server-side timing constants exposed to the client for reference
- `tankStateToBinary` / `bulletStateToBinary` are the server's serialization functions
- `binaryToTankState` / `binaryToBulletState` are the client's deserialization functions
- `userInputToBinaryData` is the client's serialization; `binaryDataToUserInput` is the server's deserialization

This strongly suggests the server is also written in **Node.js** and shares these exact modules.

## Server Technology (Inferred)

| Component | Evidence |
| --------- | -------- |
| **Node.js** | Shared CommonJS modules, same binary protocol code |
| **WebSocket (ws library)** | Raw WebSocket with JSON + binary, no Socket.IO framework detected |
| **Session cookies** | `session_token` cookie read by client, sent on join |
| **HTTP server** | Serves the static HTML/JS assets, sets session cookies, provides the `/` homepage redirect |
| **Single-process** | Room capacity of 10, simple tick-based architecture suggests no need for clustering |

## Bandwidth Analysis

### Client → Server (per client)

At 60 Hz, each input is 8 bytes (1-byte type header + 7-byte payload):

- **480 bytes/second** per client
- **4.8 KB/s** for a full 10-player room

### Server → Client (per client)

Tank state at 30 Hz: $5 + 7n$ bytes per message, where $n$ = number of tanks:

- 10 players: $(5 + 70) \times 30 = 2,250$ bytes/sec = **2.25 KB/s**

Bullet state at 6 Hz: $6 + 9n$ bytes per message:

- With 30 bullets (10 players × 3 each): $(6 + 270) \times 6 = 1,656$ bytes/sec = **~1.66 KB/s**

Plus JSON messages (leaderboard, events): **~0.5 KB/s** estimated

**Total per client: ~4.4 KB/s download, ~0.5 KB/s upload**

## Disconnect Detection

The client detects server disconnect by monitoring input buffer growth. If `movementInputBuffer.length > 1500` (25 seconds of unacknowledged inputs at 60 Hz), the client shows a disconnect alert and redirects to `/`.

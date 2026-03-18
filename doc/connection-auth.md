
# SuperTanks — Connection and Authentication Details

This document answers practical connection/authentication questions with code-backed behavior from this repository.

## 1. How the client distinguishes JSON and binary messages

In `socketWrapper.js`, incoming WebSocket messages are dispatched by JavaScript data type:

- `ArrayBuffer` => binary path
- non-`ArrayBuffer` (string) => JSON path

Binary path:

- Byte 0 is interpreted as message type (`0`, `1`, `2`, ...)
- Remaining bytes are payload

JSON path:

- `JSON.parse(data)`
- Require 2-element array: `[eventName, payload]`
- Route by `eventName`

## 2. Which WebSocket URL is used

### In browser game client modules

`beginClient(name, serverUrl)` receives the URL from outside and calls:

- `new WebSocket(serverUrl)`

The source of `serverUrl` is not present in these module files in this repository.

### In custom Python client included in this repo

`custom_client/main.py` hardcodes:

- `wss://supertanks-app-production-eu.herokuapp.com/`

This is a concrete endpoint from this workspace, but may be deployment-specific.

## 3. How authentication works

Authentication/session continuity is done via a cookie token sent in the first app-level JSON message.

Client flow on socket open:

1. Read browser cookie string from `document.cookie`
2. Extract cookie value for key `session_token`
3. Send:

```json
["joinGame", { "name": "PlayerName", "sessionCookie": "...or null" }]
```

If cookie is missing, `sessionCookie` is `null`.

## 4. Handshake sequence

There are two layers:

### A) WebSocket transport handshake

- Browser performs HTTP Upgrade (and TLS for `wss://`)
- WebSocket enters OPEN state
- `socket.onopen` callback runs

### B) Application handshake (game protocol)

- Client sends `joinGame`
- Server replies with `JOIN_SUCCESS` (player ID, color, maze layout)
- Client may request `spawnPlayer`
- Server replies `playerSpawned`
- Real-time binary state sync runs continuously

No separate binary handshake packet exists in the observed protocol.

## 5. What is inside the login/session cookie

The client treats `session_token` as opaque.

- No decode function
- No signature verification logic client-side
- No schema in this repo

Therefore the cookie content format is unknown from client code alone.

## 6. How to obtain the cookie

From your own browser session on the game origin:

1. Open the game site.
2. Open DevTools.
3. Go to Application/Storage -> Cookies.
4. Find `session_token`.

Or inspect `document.cookie` in console and extract `session_token=...`.

## 7. Security notes

- Session cookies are credentials.
- Do not share or publish them.
- Use only on accounts/systems you are authorized to test.
- Follow platform Terms of Service and local law.

## 8. Evidence map in this repo

- `mods/vanilla/socketWrapper.js`:
  - Binary vs JSON dispatch logic
  - Binary type byte extraction
  - JSON `[event, data]` parsing
- `mods/vanilla/gameClient.js`:
  - `new WebSocket(serverUrl)`
  - `session_token` cookie extraction
  - `joinGame` send on connect
- `mods/superhax/gameClient.js`:
  - Same join/cookie flow in modded client
- `custom_client/main.py`:
  - Explicit hardcoded WebSocket endpoint

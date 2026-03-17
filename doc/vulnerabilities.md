# SuperTanks — Vulnerability & Weakness Report

This report documents security vulnerabilities, design weaknesses, and cheating vectors discovered through reverse engineering the SuperTanks client code. The analysis covers both server-side (inferred) and client-side issues.

---

## Severity Legend

| Level | Meaning |
| ----- | ------- |
| 🔴 **Critical** | Exploitable remotely with high impact, trivial to execute |
| 🟠 **High** | Easily exploitable, significant gameplay advantage |
| 🟡 **Medium** | Exploitable with moderate effort or moderate impact |
| 🟢 **Low** | Minor issue, limited impact, or difficult to exploit |

---

## 1. 🔴 No Server-Side Input Validation on Movement Angle

**Category:** Insufficient server-side validation

**Description:** The client sends a `targetAngle` (float packed as int16) to the server each tick. The server likely trusts this angle and uses it to compute movement direction. There is no evidence of validation beyond what the physics engine provides.

**Exploit:** A malicious client can:

- Send arbitrary angles to move in any direction regardless of actual mouse position
- Rapidly alternate angles to create erratic movement that's hard to target
- Automate perfect aim by computing the exact angle to an enemy tank

**Impact:** Aimbot — A cheater computes the bearing to the nearest enemy and sends that as `targetAngle` every tick, achieving perfect tracking.

**Mitigation:** Server should rate-limit angular velocity change and compare with `angularSpeed = 0.25` rad/tick. The server should enforce the same rotation speed limit it uses in its physics simulation.

---

## 2. 🔴 Client-Side Bullet Limit Enforcement

**Category:** Client-trusts-client anti-pattern

**Description:** The shoot input is a single bit (`mouseClicked` in flags byte). The client enforces:

- Bullet count limit (`bulletsSpawnedCount < maxBullets`)
- Cooldown between shots (`currentTick - lastShotTick > 2`)

**If the server does not independently enforce these:**

**Exploit:** A modified client can:

- Send `mouseClicked = 1` on every single tick (60 shots/second with no cooldown)
- Fire bullets beyond the `maxBullets` limit

**Likelihood:** The server likely runs the same physics code and should enforce this. However, the `bulletsSpawnedCount` is sent FROM server TO client in `syncBullets`, which suggests the server does track this. The risk depends on whether the server trusts the client's fire rate.

**Impact:** Machine-gun exploit — Fill the maze with bullets at 60× normal rate.

**Mitigation:** Server must independently track `bulletsSpawnedCount`, `lastShotTick`, and enforce the 2-tick cooldown and bullet limit.

---

## 3. 🟠 Tick Number Manipulation

**Category:** Insufficient sequence validation

**Description:** The client sends its own `tickNum` (int32) in each input packet. The server uses this for state reconciliation.

**Exploit:** A malicious client can:

- **Send future tick numbers** to get inputs processed "ahead" of other players
- **Replay old tick numbers** to cause buffer confusion
- **Skip tick numbers** to create gaps in the input buffer
- **Send negative tick numbers** (int32 allows this)

**Impact:** Desynchronization, potential unfair timing advantage, server-side buffer overflow if unbounded tick numbers are used as array indices.

**Mitigation:** The server should:

- Track expected tick number per client (must be sequential)
- Reject or disconnect clients sending out-of-sequence ticks
- Use server-side tick as authoritative, not client-provided ticks

---

## 4. 🟠 WebSocket Protocol Lacks Authentication After Join

**Category:** Weak session management

**Description:** After the initial `joinGame` with `sessionCookie`, no further authentication is present. The WebSocket connection itself is the only identity.

**Exploit:**

- If a valid session token can be stolen (XSS, network sniffing without TLS), an attacker can impersonate any player
- The `session_token` is read from cookies and sent over WebSocket — if the connection is not `wss://` (TLS), the token is exposed in plaintext

**Impact:** Session hijacking, identity theft.

**Mitigation:**

- Enforce WSS (WebSocket over TLS)
- Use HttpOnly + Secure cookie flags for `session_token`
- Implement per-message authentication tokens or signed tick numbers

---

## 5. 🟠 Information Disclosure: Full Maze Sent on Join

**Category:** Information disclosure enabling wallhacks

**Description:** On `JOIN_SUCCESS`, the server sends the **complete maze data** (all walls and corners) to the client. This is by design for rendering, but it means the client has perfect knowledge of the entire map.

**Exploit:** A cheater can:

- Build a minimap showing all walls (wallhack)
- Compute optimal paths to any location
- Pre-compute bullet bounce trajectories for trick shots

**Impact:** Unfair map awareness. In a maze game, not knowing the layout is part of the challenge for new players.

**Mitigation:** This is a fundamental design trade-off. Server-side rendering (not practical for this type of game) or fog-of-war that only sends nearby walls would mitigate this, but at significant complexity cost.

---

## 6. 🟠 All Tank Positions Broadcast to All Clients

**Category:** Information disclosure enabling ESP/radar hacks

**Description:** The `newStateFromServer` message contains positions of **all** tanks, not just nearby ones. The client renders only what's on screen, but a modified client has access to every player's exact coordinates.

**Exploit:**

- **ESP/Radar hack** — Draw all enemy positions on screen, even through walls
- **Auto-aim** — Always know where enemies are to compute optimal aim angles
- **King tracker** — Instant, precise tracking of the king's position (the client already has a king arrow, but a cheat could show exact distance/path)

**Impact:** Complete elimination of fog-of-war and surprise attacks.

**Mitigation:** Implement **area-of-interest filtering** — only send tank positions within a certain range of the player (e.g., 2-3 cells). This would require the off-screen king indicator to be computed server-side.

---

## 7. 🟡 No Rate Limiting on WebSocket Messages

**Category:** Denial of Service

**Description:** The client sends input at 60 Hz (one message per physics tick). There's no evidence of server-side rate limiting.

**Exploit:** A malicious client can:

- Send thousands of input messages per second, overwhelming the server
- Send rapid `"spawnPlayer"` messages to force repeated spawn computation
- Send oversized JSON payloads in `"joinGame"` (long names)

**Impact:** Server CPU/memory exhaustion, degraded experience for all players.

**Mitigation:**

- Rate-limit incoming WebSocket messages per connection (e.g., max 120/sec for binary, max 5/sec for JSON)
- Limit `name` field length
- Enforce cooldown on `"spawnPlayer"` requests

---

## 8. 🟡 Player Name Not Sanitized

**Category:** Injection (XSS potential)

**Description:** The player name is sent from client to server and broadcast to all clients. The client renders it via `ctx.fillText()` (Canvas 2D), which is NOT vulnerable to HTML injection. However:

- The name is also used in the leaderboard (via `setLeaderboard()`, which likely manipulates the DOM)
- If the leaderboard uses `innerHTML` instead of `textContent`, XSS is possible

**Exploit:** A player sends a name like `<img src=x onerror=alert(1)>`. If rendered as HTML in the leaderboard DOM, this executes arbitrary JavaScript in all other players' browsers.

**Impact:** Stored XSS if leaderboard DOM rendering is unsafe. Could steal session cookies, redirect players, etc.

**Mitigation:**

- Server should sanitize/validate names (alphanumeric + spaces only, max length)
- Client leaderboard should use `textContent` not `innerHTML`

---

## 9. 🟡 Predictable Bullet IDs

**Category:** Information leak / state manipulation

**Description:** Client-predicted bullets use negative IDs starting from `-1` and decrementing. Server-authoritative bullets use positive IDs (uint8, 0-255).

**Exploit:** A modified client could:

- Predict when a bullet sync will occur and pre-position bullets
- The uint8 bullet ID limits total bullets to 255 across all players — with enough spawning, IDs could collide

**Impact:** Minor — bullet ID collisions could cause visual glitches or prevent new bullet creation.

**Mitigation:** Server should use unique sequential IDs and handle wraparound. Consider uint16 for bullet IDs if high bullet counts are expected.

---

## 10. 🟡 Tank ID is uint8 — Maximum 255 Players

**Category:** Design limitation

**Description:** Tank IDs are encoded as `uint8` (0-255) in the binary protocol. While room capacity is 10, the server might reuse IDs or run multiple rooms.

**Exploit:** Not directly exploitable, but if IDs are not properly recycled, a long-running server could run out of unique IDs.

**Impact:** ID collision causing state corruption.

**Mitigation:** Ensure ID recycling on player disconnect. If multiple rooms share ID space, consider wider ID fields.

---

## 11. 🟡 Disconnect Detection is Client-Side Only

**Category:** Ghost players

**Description:** Disconnect detection relies on the client monitoring its input buffer length (>1500 = disconnected). The server's disconnect handling behavior is unknown.

**Exploit:** A malicious client can:

- Keep the WebSocket open but stop sending inputs (idle occupying a slot)
- Send inputs but never render (headless bot)

**Impact:** Slot exhaustion — room capacity is only 10.

**Mitigation:** Server should implement:

- Idle timeout (no inputs received for N seconds → kick)
- WebSocket ping/pong heartbeat
- Maximum connection duration

---

## 12. 🟢 Unsanitized JSON Parsing in SocketWrapper

**Category:** Error handling weakness

**Description:** The `SocketWrapper.onmessage` handler wraps JSON parsing in a try/catch that only logs errors:

```javascript
try {
    var parsed = JSON.parse(data);
    if (parsed.length != 2) return;
    // ...
} catch (err) {
    console.log(err);
}
```

**Exploit:** Sending malformed JSON or arrays with unexpected types could trigger edge cases, though the catch block prevents crashes.

**Impact:** Minimal — the catch block handles this gracefully. But `console.log(err)` in production leaks error details.

---

## 13. 🟢 `getCachedGraphic` Bug in baseSkin.js

**Category:** Code defect

**Description:** In `baseSkin.js`, the `getCachedGraphic` method calls `e()` instead of the `generator` parameter:

```javascript
getCachedGraphic: function(key, generator) {
    if (!this.graphicsCache[key]) this.graphicsCache[key] = e();
    return this.graphicsCache[key];
}
```

This is a webpack deobfuscation artifact. The `e` reference is undefined/incorrect.

**Impact:** The `getCachedGraphic` method is broken, but `defaultSkin.js` doesn't appear to use it (it manages its own caching). No gameplay impact observed.

---

## 14. 🟢 `onConnectCallback` Bug in socketWrapper.js

**Category:** Code defect

**Description:** Similar to the above, `socketWrapper.js` calls `e()` instead of `onConnectCallback()` in the `onopen` handler:

```javascript
socket.onopen = function () {
    if (!connected) {
        connected = true;
        if (onConnectCallback !== undefined) e();
    }
};
```

**Impact:** The connection callback never actually fires. In practice this means `onConnected()` in gameClient.js is never called through this path — but the `readyState == 1` check at the bottom of the constructor likely catches already-open connections. The `onopen` event fires for new connections and the broken `e()` call means the `joinGame` message is sent via the `e()` reference if it happens to resolve (possibly as a closure variable in the original webpack bundle).

---

## Cheating Summary

| Cheat Type | Difficulty | Impact | Detectable? |
| ---------- | ---------- | ------ | ----------- |
| **Aimbot** (auto-aim at enemies) | Easy — modify targetAngle calculation | High — perfect accuracy | Hard — indistinguishable from skilled player |
| **ESP/Radar** (show all enemy positions) | Easy — all data already sent | High — no surprise attacks | Undetectable from server side |
| **Speed hack** (faster movement) | Impossible — server authoritative on position | N/A | N/A |
| **Teleport** | Impossible — server authoritative on position | N/A | N/A |
| **Rapid fire** (no shot cooldown) | Medium — depends on server validation | High — bullet spam | Easy to detect via tick analysis |
| **Wallhack** (show maze layout) | Trivial — data already available | Low-Medium — maze knowledge | Undetectable |
| **Auto-dodge** (dodge bullets) | Easy — all bullet data available | Medium | Hard to detect |
| **Minimap** | Trivial — parse tank/maze state | Medium — tactical advantage | Undetectable |
| **Input automation** (bot play) | Easy — script WebSocket messages | Variable | Detectable via pattern analysis |

## Recommendations Summary

### Critical Fixes

1. **Server-side input validation** — Enforce rotation speed limits, shot cooldowns, and bullet limits on the server
2. **Tick number validation** — Server must track expected sequence numbers per client

### High Priority

3. **Area-of-interest filtering** — Only send nearby tank/bullet positions to each client
2. **Enforce TLS** — Use `wss://` to prevent session token interception
3. **Name sanitization** — Whitelist characters, limit length, server-side validation

### Medium Priority

6. **Rate limiting** — Cap incoming message rate per connection
2. **Idle detection** — Server-side timeout for inactive connections
3. **Anti-cheat heuristics** — Detect abnormal input patterns (perfect aim, inhuman reaction times)

### Low Priority

9. **Fix deobfuscation artifacts** — The `e()` calls in `baseSkin.js` and `socketWrapper.js`
2. **Wider ID fields** — Consider uint16 for bullet IDs to prevent collision

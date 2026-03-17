# SuperTanks — Game Overview

## What is SuperTanks?

SuperTanks is a real-time multiplayer **"King of the Hill"** browser game. Players control tanks in a maze arena, shoot bouncing bullets at each other, and compete to stay at the top of the leaderboard for the longest time. The current #1 player is crowned **"King"** and all other players are incentivized to hunt them down.

## Core Gameplay Loop

1. **Connect** — Player enters a name and connects to a WebSocket game server.
2. **Spawn** — Server assigns the player a tank ID, color, and position inside a randomly-generated (or pre-set) maze.
3. **Move** — The tank follows the mouse cursor. If the cursor is more than 60px from the tank, the tank drives toward it. If within 60px, it only rotates to face the cursor.
4. **Shoot** — Click to fire a bullet from the tank barrel. Bullets bounce off walls and world boundaries.
5. **Kill** — When a bullet hits an enemy tank, the server declares the kill. The killed tank plays an explosion + scorch mark animation.
6. **Respawn** — After dying the player sees a death screen and can click to respawn.
7. **King of the Hill** — The player at the top of the leaderboard becomes King, tracked by a crown icon. A timer counts how long they hold the position. All other players see an arrow pointing toward the King.

## Game World

- The world is a **maze** defined by a grid of cells.
- Each cell is 100×100 world units.
- The maze has **vertical walls**, **horizontal walls**, and **wall corners** (10×10 solid corner posts at grid intersections).
- Wall data is stored as flat arrays (1 = wall present, 0 = no wall) indexed by `row * (cellsAcross + 1) + col` for vertical walls and `row * cellsAcross + col` for horizontal walls.
- Bullets bounce off walls and world edges with simple velocity reflection.

## Tank Properties

| Property | Value |
| -------- | ----- |
| Max Speed | 0.15 units/ms |
| Angular Speed | 0.25 rad/frame |
| Bounding Box | OBB: `[-18, -16, 26, -16, 26, 16, -18, 16]` (rotated rectangle) |
| Default Bullet Count | 3 |
| Max Bullet Count | 12 |
| Bullet Speed | 1.2× tank max speed = 0.18 units/ms |
| Bullet TTL | 9000 ms |
| Bullet Radius | 4px visual, 9 units collision |
| Shot Cooldown | 2 ticks between shots |

## Scoring & Progression

- Players earn **7 EXP per kill** (`EXP_PER_KILL = 7`).
- The server can increase a player's bullet limit via the `NEW_BULLET_LIMIT` event (up to `TANK_MAX_BULLET_COUNT = 12`).
- A leaderboard tracks all players' scores and identifies the King.
- The server sends `leaderBoardInfo` containing scores, king ID, and king start timestamp.
- "Longest reigns" data is also sent but not currently displayed on the client.

## Room Capacity

- Each game room supports up to **10 players** (`ROOM_CAPACITY = 10`).

## Visual Style

- Top-down 2D view rendered on an HTML5 Canvas.
- Maze walls are rendered as pre-generated sprite sheets with dirt/earth textures and dark outlines.
- Tanks are detailed sprites with colored bodies, treads, turret barrels, and shading gradients.
- Tank skins: a **DefaultSkin** (the standard colored tank) and a **FlagSkin** (trailing rope/flag effect).
- Explosions are particle-based animations (90 frames) with fire, smoke, and spark particles.
- Scorch marks remain after explosions.
- The King is indicated by a crown emoji (👑) next to their name, and an off-screen arrow indicator for other players.

## Technology Stack

| Component | Technology |
| --------- | ---------- |
| Rendering | HTML5 Canvas 2D |
| Networking | WebSocket (JSON + custom binary protocol) |
| DOM Manipulation | jQuery |
| Module System | Webpack (CommonJS `require`) |
| Transpilation | Babel (ES6 → ES5) |
| Fonts | Fredoka One, Nunito, Anton |

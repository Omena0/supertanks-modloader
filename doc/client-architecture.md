# SuperTanks — Client Architecture

## Module Dependency Graph

```tree
gameClient.js  (entry point — main game loop, rendering, input, networking)
├── constants.js         (shared game constants)
├── collision.js         (math/collision utilities)
├── networkProtocol.js   (binary serialization)
├── physics.js           (tank movement, bullet physics)
│   ├── constants.js
│   └── collision.js
├── socketWrapper.js     (WebSocket abstraction)
├── spriteGenerator.js   (wall, explosion, scorch sprite generation)
│   └── constants.js
├── bullet.js            (Bullet constructor)
│   └── physics.js
├── tank.js              (Tank constructor)
│   ├── constants.js
│   ├── physics.js
│   └── tankModel.js     (visual model factory)
│       ├── spriteGenerator.js
│       ├── defaultSkin.js   (detailed tank skin)
│       │   └── baseSkin.js  (base class)
│       └── flagSkin.js      (trailing flag skin)
│           └── baseSkin.js
├── graphicsObject.js    (base drawable prototype)
├── popUpNotification.js (popup messages)
│   └── graphicsObject.js
└── globalContext.js      (global `this` polyfill)
```

## Module Descriptions

### gameClient.js

The main entry point. An IIFE that receives the global context via `require('./globalContext')`. Contains:

- **Game loop** — `requestAnimationFrame`-based rendering at display refresh rate
- **Physics loop** — `setInterval` at 60 Hz (`PHYSICS_INTERVAL = 1000/60`)
- **Input gathering** — Mouse position/clicks captured, converted to relative-to-tank coordinates
- **Client-side prediction** — Movement and shooting applied immediately, then reconciled on server state updates
- **Network handlers** — Processes all incoming server messages
- **Rendering** — Draws maze, tanks, bullets, king indicator, ammo counter, intro text, popups

### constants.js

Exported constants shared between client and (presumably) server:

- `TANK_COLOURS` — 9 color hex codes for tank skins
- `ROOM_CAPACITY` — 10
- `TANK_DEFAULT_BULLETCOUNT` — 3
- `TANK_MAX_BULLET_COUNT` — 12
- `TANK_BOUNDING_BOX` — `[-18, -16, 26, -16, 26, 16, -18, 16]`
- `TANK_MAX_SPEED` — 0.15
- `PHYSICS_INTERVAL` — 1000/60 (~16.67ms)
- `SEND_STATE_INTERVAL` — 1000/30 (~33.33ms)
- `SEND_BULLETS_STATE_INTERVAL` — 1000/6 (~166.67ms)
- `EXP_PER_KILL` — 7

### collision.js

Pure math/collision functions:

- `angleLerp(from, to, t)` — Shortest-path angle interpolation
- `line_intersect(...)` — Line-line intersection with segment flags
- `doPointsSpanLine(...)` — Tests if two points are on opposite sides of a line
- `checkOBBCircleIntersection(...)` — OBB vs Circle overlap test (used for bullet-tank)
- `checkAndResolveOBBAABB(...)` — Separating Axis Theorem (SAT) collision resolution between rotated tank bounding box and axis-aligned wall corners

### physics.js

Game physics:

- `tankMoveTowards(tank, targetX, targetY, maze, deltaTime)` — Rotates tank toward target, moves at max speed, resolves wall collisions
- `tankLookAtPoint(tank, targetX, targetY, maze)` — Rotates tank toward target without moving
- `canBulletBeSpawned(tank, bulletX, bulletY, maze)` — Checks if bullet spawn point is clear of walls
- `updateBulletsPosition(bullet, maze, deltaTime)` — Moves bullet, bounces off walls and world boundaries

### networkProtocol.js

Binary serialization for WebSocket communication (see [network-protocol.md](network-protocol.md) for details).

### socketWrapper.js

Wraps the native `WebSocket` to provide:

- `on(event, handler)` — Register handler for JSON event name or binary message type
- `send(event, data)` — Send JSON-encoded `[event, data]` pair
- `sendBinary(type, data)` — Send binary message prefixed with 1-byte type ID
- Automatic routing of incoming messages by type (ArrayBuffer → binary handler, string → JSON handler)

### bullet.js

`Bullet(id, x, y, xVel, yVel)` constructor:

- `timeToLive = 9000` ms
- `draw(ctx, camera)` — Black filled circle, radius 4
- `update(maze, deltaTime)` — Delegates to `physics.updateBulletsPosition`

### tank.js

`Tank(x, y)` constructor:

- Position, angle, velocity, bounding box
- `moveTowards(targetX, targetY, maze, deltaTime)` — Physics movement
- `lookAt(targetX, targetY, maze)` — Rotation only
- `setSkin(colorIndex)` — Changes color
- `draw(ctx, camera)` — Manages hit/alive animations, delegates to `model.renderModelOntoCanvas`

### tankModel.js

Factory `function(tankScale, dpr)` returning a `TankModel` constructor that handles:

- Death explosion animation (90 frames, transitions to scorch mark at frame 50)
- Scorch mark display
- Name label and crown icon rendering
- Skin compositing (each skin's `draw` method is called in sequence)

### baseSkin.js

ES5 class (via Babel `_createClass`) providing:

- `setConfig(config)` — Updates skin config and clears graphics cache
- `getCachedGraphic(key, generator)` — Lazy-init sprite cache
- `draw(ctx, state, tank, screen)` — Template method: calls `preDrawInScreenSpace`, `drawSkin`, `postDrawInScreenSpace`

### defaultSkin.js

Extends `BaseSkin`. Draws:

- Tank body (204×318 base) with barrel, turret circle, shading gradients
- Animated tank treads (6 segments, scrolling)
- Uses `adjustColor` helper for highlight/shadow variants of the base color

### flagSkin.js

Extends `BaseSkin`. Draws a trailing 10-point rope simulation in screen space, rendered as a thick red stroke behind the tank.

### spriteGenerator.js

Generates pre-rendered sprites:

- `generateWallSpriteSheet(bgColor, dpr)` — 15 wall tile types (each a canvas) based on 4-bit adjacency weight
- `generateExplosionSpriteSheet(size, frameCount)` — 90-frame explosion using `ExplosionParticle` objects (dark, bright, smoke, spark layers)
- `generateScorchSprite(size)` — Post-explosion ground mark

### graphicsObject.js

Minimal base prototype with an empty `draw(ctx, camera, deltaTime)` method.

### popUpNotification.js

`PopUpNotification(message, timeToLive=2000)`:

- Gold banner with white border, shadow, centered text
- Auto-destroys via `destroyGraphicsObject(this)` when TTL expires

### globalContext.js

Polyfill that exports the global object (`window`, `global`, or `this`).

## Game Loop Architecture

```visual
┌─────────────────────────────────────────────────────────────┐
│                     requestAnimationFrame                   │
│                        gameLoop(timestamp)                  │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  renderFrame(timestamp)                              │   │
│  │  - Update camera position                            │   │
│  │  - Draw maze wall sprites                            │   │
│  │  - Draw bullets                                      │   │
│  │  - Sort and draw tanks                               │   │
│  │  - Draw intro overlay / king indicator               │   │
│  │  - Draw ammo counter                                 │   │
│  │  - Draw popup notifications                          │   │
│  │  - Handle death fade effect                          │   │
│  └──────────────────────────────────────────────────────┘   │
│  Check for disconnect (buffer > 1500 inputs)                │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│              setInterval @ 60 Hz (PHYSICS_INTERVAL)         │
│                        physicsStep()                        │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  gatherAndSendInput()                                │   │
│  │  - Calculate mouse-to-tank offset                    │   │
│  │  - Determine if moving (>60px threshold)             │   │
│  │  - Pack input as binary, send to server              │   │
│  │  - Buffer input locally for prediction               │   │
│  │  - Increment tick number                             │   │
│  └──────────────────────────────────────────────────────┘   │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  Client-side prediction                              │   │
│  │  - applyMovementInputs(dt, [currentInput])           │   │
│  │  - applyShootInputs(dt, [currentInput])              │   │
│  └──────────────────────────────────────────────────────┘   │
│  Reset mouseClicked flag                                    │
└─────────────────────────────────────────────────────────────┘
```

## Client-Side Prediction & Reconciliation

The client uses a **predict-then-reconcile** model:

1. **Every physics tick**: The client captures input, sends it to the server, buffers it locally, and applies it immediately to the local tank (prediction).

2. **On `newStateFromServer`**: The server sends authoritative tank positions. The client:
   - Snaps the local player's position to the server position.
   - Discards input buffer entries older than the server's tick number.
   - Re-applies all remaining buffered inputs on top of the server position.

3. **On `syncBullets`**: Same pattern — server sends authoritative bullet positions, client reconciles and replays buffered shoot inputs.

4. **Remote tanks** use **interpolation**: Each tick, remote tank positions lerp toward `latestX/latestY` with factor 0.4, and angles lerp with factor 0.3. If the position delta exceeds 70 units, the tank snaps instantly (teleport correction).

## Camera System

The camera is simple: it centers on the local player's tank position every frame.

```js
camera.camLeft = tank.x - 0.5 * canvas.clientWidth
camera.camTop  = tank.y - 0.5 * canvas.clientHeight
```

All world objects are drawn at `(worldX - camera.camLeft, worldY - camera.camTop)`.

## DPI / Retina Support

The canvas is scaled by `window.devicePixelRatio` for crisp rendering on high-DPI displays. Sprites are generated at DPR scale, then drawn at `width/dpr` and `height/dpr` CSS dimensions.

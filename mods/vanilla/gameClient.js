(function (exports) {
    var constants = require("./constants"),
        collision = require("./collision"),
        networkProtocol = require("./networkProtocol"),
        physics = require("./physics"),
        SocketWrapper = require("./socketWrapper"),
        spriteGenerator = require("./spriteGenerator");

    var canvas,
        ctx,
        Bullet = require("./bullet"),
        Tank = require("./tank"),
        PopUpNotification =
            (require("./graphicsObject"),
                require("./popUpNotification").PopUpNotification);

    console.log("Running game...");
    console.log("V 2.0");

    var tanks,
        bullets,
        nextBulletId,
        tickNum,
        movementInputBuffer,
        shootInputBuffer,
        socket,
        hasJoined,
        playerName,
        mouseToTankX,
        mouseToTankY,
        isMoving,
        maze = {
            cellsAcross: void 0,
            cellsDown: void 0,
            worldWidth: void 0,
            worldHeight: void 0,
            verticalWalls: [],
            horisontalWalls: [],
            wallCorners: [],
        },
        wallCornerSprites = [],
        graphicsObjects = [],
        camera = {
            camLeft: 0,
            camTop: 0,
            scale: 1,
        },
        mouseX = 0,
        mouseY = 0,
        mouseClicked = false,
        kingID = -1,
        kingStartTime = 0,
        bulletsSpawnedCount = 0,
        maxBullets = constants.TANK_DEFAULT_BULLETCOUNT,
        lastShotTick = 0,
        leaderBoard = [
            { name: "Player 1", score: 10 },
            { name: "Joe", score: 5 },
            { name: "Alex", score: "12" },
        ];

    function drawSplashScreen(splashCtx) {
        var mazeString =
            "16x16\n+---+---+---+---+---+---+---+---+---+---+---+---+---+---+---+---+\n|           |                   |           |               |   |\n+---+---+   +   +---+   +---+   +---+   +   +   +---+   +   +   +\n|   |       |       |   |       |       |       |   |   |       |\n+   +   +   +---+   +   +   +---+   +---+   +---+   +   +---+---+\n|   |   |   |           |   |               |       |           |\n+   +   +   +   +---+---+   +---+---+---+   +   +---+---+       +\n|       |       |                       |   |                   |\n+---+---+---+---+---+   +---+       +---+   +   +---+   +       +\n|           |       |   |   |               |   |   |   |   |   |\n+   +---+   +   +---+   +   +   +---+---+---+   +   +---+---+---+\n|       |       |           |   |       |   |   |               |\n+---+   +---+---+   +---+   +   +   +   +   +   +   +---+---+   +\n|       |           |   |   |   |   |           |           |   |\n+   +---+   +---+---+   +---+   +   +---+       +---+       +   +\n|           |               |       |   |           |       |   |\n+   +---+   +   +---+   +---+---+   +   +           +---+   +   +\n|       |       |   |   |           |   |                   |   |\n+---+---+   +   +   +   +           +   +---+---+---+---+---+   +\n|           |       |   |       |   |           |       |       |\n+---+       +---+   +---+       +   +---+---+   +       +       +\n|           |                   |       |               |       |\n+---+   +---+---+---+   +---+   +   +   +   +---+   +---+       +\n|                       |   |       |   |   |   |               |\n+   +---+   +---+---+---+   +---+   +---+   +   +---+   +---+---+\n|       |                       |           |                   |\n+       +---+---+---+---+       +---+---+---+---+---+---+       +\n|                       |       |   |               |           |\n+       +---+   +   +---+       +   +---+---+---+   +   +---+---+\n|           |   |                   |               |           |\n+---+   +---+   +---+---+       +   +---+   +   +   +   +---+   +\n|           |           |       |           |   |       |       |\n+---+---+---+---+---+---+---+---+---+---+---+---+---+---+---+---+";

        var lines = mazeString.replace(/[\r]+/g, "").split("\n");
        var dimensions = lines[0].split("x");
        var cols = parseInt(dimensions[0]);
        var rows = parseInt(dimensions[1]);

        // Parse horizontal walls
        var horizontalWalls = [];
        for (var row = 0; row < rows + 1; row++) {
            var line = lines[1 + 2 * row];
            for (var col = 2; col < line.length; col += 4)
                horizontalWalls.push(line[col] == "-" ? 1 : 0);
        }

        // Parse vertical walls
        var verticalWalls = [];
        for (row = 0; row < rows; row++) {
            line = lines[2 + 2 * row];
            for (col = 0; col < line.length; col += 4)
                verticalWalls.push(line[col] == "|" ? 1 : 0);
        }

        // Calculate wall corner weights for sprite selection
        var corners = [];
        for (var y = 0; y <= rows; y++) {
            for (var x = 0; x <= cols; x++) {
                var weight = 0;
                if (y > 0)
                    weight += 1 * verticalWalls[(y - 1) * (cols + 1) + x];
                if (y < rows) weight += 4 * verticalWalls[y * (cols + 1) + x];
                if (x > 0) weight += 8 * horizontalWalls[y * cols + (x - 1)];
                if (x < cols) weight += 2 * horizontalWalls[y * cols + x];
                if (weight != 0) corners.push({ x: x, y: y, weight: weight });
            }
        }

        // Draw background
        splashCtx.fillStyle = BACKGROUND_COLOR;
        splashCtx.fillRect(
            0,
            0,
            splashCtx.canvas.width,
            splashCtx.canvas.height,
        );

        // Draw wall tiles
        for (var i = 0; i < corners.length; i++) {
            var sprite = wallSprites[corners[i].weight];
            var drawX = 100 * corners[i].x - 220 - 0.5 * sprite.width;
            var drawY = 100 * corners[i].y - 830 - 0.5 * sprite.height;
            if (
                drawX + sprite.width > 0 &&
                drawX < splashCtx.canvas.width &&
                drawY + sprite.height > 0 &&
                drawY < splashCtx.canvas.height
            )
                splashCtx.drawImage(sprite, drawX, drawY);
        }

        // Draw darkening overlay
        splashCtx.globalAlpha = 0.3;
        splashCtx.fillStyle = "#434647";
        splashCtx.fillRect(
            0,
            0,
            splashCtx.canvas.width,
            splashCtx.canvas.height,
        );
    }

    function resizeCanvas() {
        var panelWidth = $("#dataPanel").width();
        var gameCanvas = document.getElementById("gameCanvas");

        gameCanvas.width =
            (document.body.clientWidth - panelWidth) * window.devicePixelRatio;
        gameCanvas.height =
            document.body.clientHeight * window.devicePixelRatio;
        gameCanvas.style.width = document.body.clientWidth - panelWidth + "px";
        gameCanvas.style.height = document.body.clientHeight + "px";

        gameCanvas
            .getContext("2d")
            .scale(window.devicePixelRatio, window.devicePixelRatio);
    }

    function beginClient(name, serverUrl) {
        playerName = name;
        canvas = document.getElementById("gameCanvas");
        ctx = canvas.getContext("2d");
        canvas.style = "position: fixed; left: 0px; top: 0px; display: inline;";

        resizeCanvas();
        $("#gameScreen").show();
        onmousemove = handleMouseMove;
        canvas.addEventListener("click", handleClick, false);
        window.addEventListener("resize", resizeCanvas);

        tanks = [];
        tanks.push(new Tank(50, 50));
        bullets = [];
        nextBulletId = -1;

        socket = new SocketWrapper(new WebSocket(serverUrl), onConnected);
        hasJoined = false;

        socket.on("JOIN_SUCCESS", onJoinSuccess);
        socket.on(networkProtocol.newStateFromServer, onNewTankState);
        socket.on(networkProtocol.syncBullets, onSyncBullets);
        socket.on("leaderBoardInfo", onLeaderBoardInfo);
        socket.on("updateTankList", onUpdateTankList);
        socket.on("tankKilled", onTankKilled);
        socket.on("playerSpawned", onPlayerSpawned);

        socket.on("NEW_BULLET_LIMIT", function (newLimit) {
            if (newLimit > maxBullets) {
                var gained = newLimit - maxBullets;
                if (gained > 1)
                    graphicsObjects.push(
                        new PopUpNotification(
                            "You gained +" + gained + " balls!",
                        ),
                    );
                else
                    graphicsObjects.push(
                        new PopUpNotification(
                            "You gained +" + gained + " ball!",
                        ),
                    );
            }
            maxBullets = newLimit;
        });

        socket.on("EXP", function (exp) {
            addEXP(exp);
        });

        document.getElementById("startScreen").style.display = "none";

        tickNum = 0;
        movementInputBuffer = [];
        shootInputBuffer = [];
        true;

        requestAnimationFrame(gameLoop);
        setInterval(physicsStep, constants.PHYSICS_INTERVAL);
    }

    function onConnected() {
        var cookieName = "session_token";
        var cookieParts = ("; " + document.cookie).split(
            "; " + cookieName + "=",
        );
        var sessionCookie =
            cookieParts.length == 2
                ? cookieParts.pop().split(";").shift()
                : null;

        socket.send("joinGame", {
            name: playerName,
            sessionCookie: sessionCookie,
        });
        console.log("Connected");
    }

    function onJoinSuccess(data) {
        tanks[0].ID = data.newID;
        tanks[0].name = data.name;
        tanks[0].setSkin(data.colourIndex);
        hasJoined = true;

        maze.cellsAcross = data.cellsAcross;
        maze.cellsDown = data.cellsDown;
        maze.verticalWalls = data.verticalWalls;
        maze.horisontalWalls = data.horisontalWalls;
        maze.wallCorners = data.wallCorners;
        maze.worldWidth = 100 * maze.cellsAcross;
        maze.worldHeight = 100 * maze.cellsDown;

        // Build wall corner sprites for rendering
        for (var row = 0; row <= maze.cellsDown; row++) {
            for (var col = 0; col <= maze.cellsAcross; col++) {
                var weight = 0;
                if (row > 0)
                    weight +=
                        1 *
                        maze.verticalWalls[
                        (row - 1) * (maze.cellsAcross + 1) + col
                        ];
                if (row < maze.cellsDown)
                    weight +=
                        4 *
                        maze.verticalWalls[row * (maze.cellsAcross + 1) + col];
                if (col > 0)
                    weight +=
                        8 *
                        maze.horisontalWalls[
                        row * maze.cellsAcross + (col - 1)
                        ];
                if (col < maze.cellsAcross)
                    weight +=
                        2 * maze.horisontalWalls[row * maze.cellsAcross + col];
                if (weight != 0)
                    wallCornerSprites.push({ x: col, y: row, weight: weight });
            }
        }
    }

    function askToSpawn() {
        console.log("Respawning...");
        socket.send("spawnPlayer");
        $("#gameScreen").show();

        var gameCanvas = document.getElementById("gameCanvas");
        gameCanvas.style.display = "inline";
        ctx.globalAlpha = 1;

        var deathScreen = document.getElementById("deathScreen");
        deathScreen.style.display = "none";
        true;
    }

    function onBulletFired(shotTick) {
        bulletsSpawnedCount++;
        lastShotTick = shotTick;
    }

    function applyMovementInputs(deltaTime, inputs) {
        for (var i = 0; i < inputs.length; i++) {
            var input = inputs[i];

            // Apply local player movement
            if (input.moveForward)
                tanks[0].moveTowards(
                    tanks[0].x + input.targetX,
                    tanks[0].y + input.targetY,
                    maze,
                    deltaTime,
                );
            else
                tanks[0].lookAt(
                    tanks[0].x + input.targetX,
                    tanks[0].y + input.targetY,
                    maze,
                );

            // Interpolate remote tanks
            for (var j = 1; j < tanks.length; j++) {
                if (
                    Math.abs(tanks[j].x - tanks[j].latestX) > 70 ||
                    Math.abs(tanks[j].y - tanks[j].latestY) > 70
                ) {
                    tanks[j].x = tanks[j].latestX;
                    tanks[j].y = tanks[j].latestY;
                    tanks[j].angle = tanks[j].latestAngle;
                } else {
                    tanks[j].x =
                        tanks[j].x + 0.4 * (tanks[j].latestX - tanks[j].x);
                    tanks[j].y =
                        tanks[j].y + 0.4 * (tanks[j].latestY - tanks[j].y);
                    tanks[j].angle = collision.angleLerp(
                        tanks[j].angle,
                        tanks[j].latestAngle,
                        0.3,
                    );
                }
            }
        }
    }

    function applyShootInputs(deltaTime, inputs) {
        for (var i = 0; i < inputs.length; i++) {
            var currentTick;

            if (inputs[i].mouseClicked) {
                currentTick = inputs[i].tickNum;
                if (
                    !tanks[0].beenHit &&
                    bulletsSpawnedCount < maxBullets &&
                    currentTick - lastShotTick > 2
                ) {
                    var spawnX = tanks[0].x + 40 * Math.cos(tanks[0].angle);
                    var spawnY = tanks[0].y + 40 * Math.sin(tanks[0].angle);

                    if (
                        physics.canBulletBeSpawned(
                            tanks[0],
                            spawnX,
                            spawnY,
                            maze,
                        )
                    ) {
                        var dirX = Math.cos(tanks[0].angle);
                        var dirY = Math.sin(tanks[0].angle);
                        var magnitude = Math.sqrt(dirX * dirX + dirY * dirY);
                        var bulletVelX =
                            (dirX / magnitude) * constants.TANK_MAX_SPEED * 1.2;
                        var bulletVelY =
                            (dirY / magnitude) * constants.TANK_MAX_SPEED * 1.2;
                        var newBullet = new Bullet(
                            nextBulletId,
                            spawnX,
                            spawnY,
                            bulletVelX,
                            bulletVelY,
                        );
                        nextBulletId--;
                        bullets.push(newBullet);
                        onBulletFired(inputs[i].tickNum);
                    }
                }
            }

            // Update all bullets
            for (var j = 0; j < bullets.length; j++)
                bullets[j].update(maze, deltaTime);
        }
    }

    function onLeaderBoardInfo(data) {
        leaderBoard = data.leaderBoard;
        data.longestReigns;

        for (var i = 0; i < tanks.length; i++) {
            for (var j = 0; j < data.playerScores.length; j++) {
                if (tanks[i].ID == data.playerScores[j].id) {
                    tanks[i].score = data.playerScores[j].score;
                    tanks[i].leaderBoardPos =
                        data.playerScores[j].leaderBoardPos;
                }
            }
        }

        for (i = 0; i < leaderBoard.length; i++) {
            if (leaderBoard[i].id == tanks[0].ID)
                leaderBoard[i].isplayer = true;
        }

        setLeaderboard(leaderBoard);
        kingID = data.kingID;
        kingStartTime = data.kingStartTime;
    }

    function onSyncBullets(buffer) {
        var state = networkProtocol.binaryToBulletState(buffer);
        var serverBullets = state.bullets;
        var matchFlags = new Array(bullets.length).fill(0);

        // Sync bullet positions with server state
        for (var i = 0; i < serverBullets.length; i++) {
            var found = false;
            for (var j = 0; j < bullets.length; j++) {
                if (bullets[j].id == serverBullets[i].id) {
                    bullets[j].x = serverBullets[i].x;
                    bullets[j].y = serverBullets[i].y;
                    bullets[j].xVel = serverBullets[i].xVel;
                    bullets[j].yVel = serverBullets[i].yVel;
                    found = true;
                    matchFlags[j] = 1;
                    break;
                }
            }
            if (!found) {
                var newBullet = new Bullet(
                    serverBullets[i].id,
                    serverBullets[i].x,
                    serverBullets[i].y,
                    serverBullets[i].xVel,
                    serverBullets[i].yVel,
                );
                bullets.push(newBullet);
            }
        }

        // Remove bullets not present on server
        for (i = matchFlags.length - 1; i >= 0; i--) {
            if (matchFlags[i] == 0) bullets.splice(i, 1);
        }

        bulletsSpawnedCount = state.bulletsSpawnedCount;

        // Replay buffered shoot inputs after the server tick
        for (i = 0; i < shootInputBuffer.length; i++) {
            if (shootInputBuffer[i].tickNum >= state.tickNum) {
                shootInputBuffer.splice(0, i);
                break;
            }
        }
        applyShootInputs(constants.PHYSICS_INTERVAL, shootInputBuffer);
    }

    function onUpdateTankList(serverTankList) {
        var matchFlags = new Array(tanks.length).fill(0);

        for (var i = 0; i < serverTankList.length; i++) {
            var found = false;
            for (var j = 0; j < tanks.length; j++) {
                if (tanks[j].ID == serverTankList[i].id) {
                    found = true;
                    matchFlags[j] = 1;
                    break;
                }
            }
            if (!found) {
                var newTank = new Tank(0, 0);
                newTank.ID = serverTankList[i].id;
                newTank.name = serverTankList[i].name;
                newTank.setSkin(serverTankList[i].colourIndex);
                newTank.beenHit = serverTankList[i].beenHit;
                newTank.justJoined = true;
                tanks.push(newTank);
            }
        }

        // Remove tanks not in server list
        for (i = matchFlags.length - 1; i >= 0; i--) {
            if (matchFlags[i] == 0) tanks.splice(i, 1);
        }
    }

    function onNewTankState(buffer) {
        var state = networkProtocol.binaryToTankState(buffer);

        for (var i = 0; i < tanks.length; i++) {
            for (var j = 0; j < state.tanks.length; j++) {
                if (tanks[i].ID == state.tanks[j].id) {
                    if (i == 0 || tanks[i].justJoined) {
                        // Local player or just-joined: snap to server position
                        tanks[i].x = state.tanks[j].x;
                        tanks[i].y = state.tanks[j].y;
                        tanks[i].angle = state.tanks[j].angle;
                        tanks[i].latestX = tanks[i].x;
                        tanks[i].latestY = tanks[i].y;
                        tanks[i].latestAngle = tanks[i].angle;
                        tanks[i].justJoined = false;
                    } else {
                        // Remote: store target for interpolation
                        tanks[i].latestX = state.tanks[j].x;
                        tanks[i].latestY = state.tanks[j].y;
                        tanks[i].latestAngle = state.tanks[j].angle;
                    }

                    tanks[i].isKing = kingID == tanks[i].ID;
                    break;
                }
            }
        }

        // Replay buffered movement inputs after the server tick
        for (j = 0; j < movementInputBuffer.length; j++) {
            if (movementInputBuffer[j].tickNum >= state.tickNum) {
                movementInputBuffer.splice(0, j);
                break;
            }
        }
        applyMovementInputs(constants.PHYSICS_INTERVAL, movementInputBuffer);
    }

    function handleMouseMove(event) {
        mouseX = event.clientX;
        mouseY = event.clientY;
    }

    function handleClick(event) {
        mouseClicked = true;
    }

    function onPlayerSpawned(data) {
        var tankID = data.tankID;
        var spawnX = data.x;
        var spawnY = data.y;

        for (var i = 0; i < tanks.length; i++) {
            if (tanks[i].ID == tankID) {
                tanks[i].beenHit = false;
                tanks[i].x = tanks[i].latestX = spawnX;
                tanks[i].y = tanks[i].latestY = spawnY;
            }
        }
    }

    function onTankKilled(killedID) {
        for (var i = 0; i < tanks.length; i++) {
            if (tanks[i].ID == killedID) tanks[i].beenHit = true;
        }

        if (killedID == tanks[0].ID) {
            (function showDeathScreen() {
                false;
                console.log("Showing death screen");

                var startScreen = document.getElementById("startScreen");
                startScreen.style.display = "none";

                var deathScreen = document.getElementById("deathScreen");
                deathScreen.style.display = "block";

                setTimeout(function () {
                    $("#gameScreen").fadeOut(1000, function () {
                        fadeFinishedCallback();
                    });
                }, 400);

                triggerDeathTrackingEvent();
                showDeathScreenCallback();
            })();
        }
    }

    var fadeSnapshot,
        fadeAlpha = 1,
        fadeCanvas = false,
        isFading = false;

    exports.destroyGraphicsObject = function (obj) {
        var index = graphicsObjects.indexOf(obj);
        graphicsObjects.splice(index, 1);
    };

    var lastFrameTime,
        BACKGROUND_COLOR = "#f0f0f0",
        isFirstFrame = true,
        introAlpha = 1,
        introTimer = 0;

    function renderFrame(timestamp) {
        if (isFirstFrame) {
            lastFrameTime = timestamp;
            isFirstFrame = false;
        }

        var deltaTime = timestamp - lastFrameTime;
        lastFrameTime = timestamp;

        // Update camera to follow a sensible tank (prefer lowest ID)
        var followTank = null;
        if (tanks && tanks.length) {
            for (var fi = 0; fi < tanks.length; fi++) {
                var tc = tanks[fi];
                if (!tc || tc.ID == null) continue;
                if (!followTank || tc.ID < followTank.ID) followTank = tc;
            }
        }
        if (followTank && typeof followTank.x === 'number' && typeof followTank.y === 'number') {
            camera.camLeft = followTank.x - 0.5 * canvas.clientWidth;
            camera.camTop = followTank.y - 0.5 * canvas.clientHeight;
        }

        // Clear screen
        ctx.fillStyle = BACKGROUND_COLOR;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Draw wall tiles
        for (var i = 0; i < wallCornerSprites.length; i++) {
            var sprite = wallSprites[wallCornerSprites[i].weight];
            var dpr = window.devicePixelRatio || 1;
            var spriteW = sprite.width / dpr;
            var spriteH = sprite.height / dpr;
            var drawX = Math.floor(
                100 * wallCornerSprites[i].x - camera.camLeft - 0.5 * spriteW,
            );
            var drawY = Math.floor(
                100 * wallCornerSprites[i].y - camera.camTop - 0.5 * spriteH,
            );

            if (
                drawX + spriteW > 0 &&
                drawX < canvas.width &&
                drawY + spriteH > 0 &&
                drawY < canvas.height
            )
                ctx.drawImage(sprite, drawX, drawY, spriteW, spriteH);
        }

        // Draw bullets
        for (i = 0; i < bullets.length; i++) bullets[i].draw(ctx, camera);

        // Sort tanks: explosions on top, scorch marks behind
        var sortedTanks = tanks.slice().sort(function (a, b) {
            if (a.model.showingExplosion) return 1;
            if (b.model.showingExplosion || a.model.showingScorch) return -1;
            if (b.model.showingScorch) return 1;
            return 0;
        });

        for (i = 0; i < sortedTanks.length; i++) {
            if (!sortedTanks[i].justJoined) sortedTanks[i].draw(ctx, camera);
        }

        // Draw intro overlay
        if (introAlpha > 0) {
            ctx.globalAlpha = introAlpha;
            ctx.fillStyle = "rgba(240,240,240,0.8)";
            ctx.strokeStyle = "#f0f0f0";
            ctx.fillRect(
                0.5 * (canvas.clientWidth - 700),
                0.5 * canvas.clientHeight - 100 - 120,
                700,
                160,
            );

            ctx.fillStyle = "#fbac00";
            ctx.textAlign = "center";
            ctx.font = "40px Fredoka One";
            ctx.fillText(
                "King of the Hill!",
                0.5 * canvas.clientWidth,
                0.5 * canvas.clientHeight - 40 - 120,
            );

            ctx.font = "900 22px Nunito";
            ctx.fillStyle = "#737373";
            ctx.fillText(
                "Stay at the top of the leaderboard for as long as possible",
                0.5 * canvas.clientWidth,
                0.5 * canvas.clientHeight - 120,
            );
            ctx.fillText(
                "(Click to shoot)",
                0.5 * canvas.clientWidth,
                0.5 * canvas.clientHeight + 30 - 120,
            );

            ctx.textAlign = "start";
            if (introTimer > 4) introAlpha -= deltaTime / 3000;
            introTimer += deltaTime / 1000;
            ctx.globalAlpha = 1;
        }

        // Draw king indicator
        var kingDuration = 0;
        if (kingID != -1) {
            kingDuration = new Date().getTime() - kingStartTime;

            var kingPos = { x: 0, y: 0 };
            for (i = 0; i < tanks.length; i++) {
                if (tanks[i].ID == kingID) {
                    kingPos.x = tanks[i].x;
                    kingPos.y = tanks[i].y;
                    tanks[i].name;
                }
            }

            var diffX = kingPos.x - tanks[0].x;
            var diffY = kingPos.y - tanks[0].y;
            var offScreenX = Math.abs(diffX) > 0.5 * canvas.clientWidth - 20;
            var offScreenY = Math.abs(diffY) > 0.5 * canvas.clientHeight - 20;

            if (tanks[0].isKing || (!offScreenX && !offScreenY)) {
                if (tanks[0].isKing) {
                    // "You are King!" text
                    ctx.textAlign = "center";
                    ctx.font = "28px Fredoka One";
                    ctx.strokeStyle = "white";
                    ctx.lineWidth = 4;
                    ctx.strokeText(
                        "You are King!",
                        0.5 * canvas.clientWidth,
                        0.9 * canvas.clientHeight - 30 + 2,
                    );
                    ctx.strokeText(
                        "You are King!",
                        0.5 * canvas.clientWidth,
                        0.9 * canvas.clientHeight - 30,
                    );
                    ctx.fillStyle = "#e75800";
                    ctx.fillText(
                        "You are King!",
                        0.5 * canvas.clientWidth,
                        0.9 * canvas.clientHeight - 30 + 2,
                    );
                    ctx.fillStyle = "#fbac00";
                    ctx.fillText(
                        "You are King!",
                        0.5 * canvas.clientWidth,
                        0.9 * canvas.clientHeight - 30,
                    );

                    // Timer display
                    ctx.fillStyle = "#324965";
                    ctx.font = "900 22px Nunito";
                    var timerDate = new Date(null);
                    timerDate.setMilliseconds(kingDuration);
                    var timeString = timerDate.toISOString().substr(14, 8);

                    ctx.strokeStyle = "white";
                    ctx.lineWidth = 4;
                    ctx.lineJoin = "round";
                    ctx.strokeText(
                        "Time as King: " + timeString,
                        0.5 * canvas.clientWidth,
                        0.9 * canvas.clientHeight,
                    );
                    ctx.fillText(
                        "Time as King: " + timeString,
                        0.5 * canvas.clientWidth,
                        0.9 * canvas.clientHeight,
                    );
                    ctx.textAlign = "start";
                }
            } else {
                // Draw off-screen king arrow indicator
                var arrowAngle = Math.atan2(diffY, diffX);
                var arrowX = diffX + 0.5 * canvas.clientWidth;
                var arrowY = diffY + 0.5 * canvas.clientHeight;

                if (offScreenX)
                    arrowX =
                        diffX < 0
                            ? 20 - 10 * Math.cos(arrowAngle)
                            : canvas.clientWidth -
                            20 -
                            10 * Math.cos(arrowAngle);
                if (offScreenY)
                    arrowY =
                        diffY < 0
                            ? 20 - 10 * Math.sin(arrowAngle)
                            : canvas.clientHeight -
                            20 -
                            10 * Math.sin(arrowAngle);

                ctx.save();
                ctx.translate(arrowX, arrowY);
                ctx.fillStyle = "#ffbb00";
                ctx.font = "30px Anton";
                ctx.fillText(
                    "\uD83D\uDC51",
                    -20 - 40 * Math.cos(arrowAngle),
                    40 * -Math.sin(arrowAngle),
                );
                ctx.rotate(arrowAngle + 0.5 * Math.PI);
                ctx.beginPath();
                ctx.moveTo(0, -10);
                ctx.lineTo(8, 10);
                ctx.lineTo(-8, 10);
                ctx.closePath();
                ctx.fillStyle = "#ffbb00";
                ctx.strokeStyle = "#733415";
                ctx.lineWidth = 2;
                ctx.lineJoin = "round";
                ctx.shadowBlur = 5;
                ctx.shadowColor = "rgba(0, 0, 0, 0.4)";
                ctx.fill();
                ctx.stroke();
                ctx.shadowBlur = 0;
                ctx.restore();
            }
        }

        // Draw ammo counter behind the tank
        ctx.fillStyle = "rgba(0,0,0,0.8)";
        ctx.font = "900 12px Nunito";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";

        var ammoX = 0.5 * canvas.clientWidth + -32 * Math.cos(tanks[0].angle);
        var ammoY = 0.5 * canvas.clientHeight + -32 * Math.sin(tanks[0].angle);

        ctx.beginPath();
        ctx.arc(ammoX - 7, ammoY, 3, 0, 2 * Math.PI);
        ctx.fill();
        ctx.fillText("" + (maxBullets - bulletsSpawnedCount), ammoX + 7, ammoY);
        ctx.textAlign = "start";
        ctx.textBaseline = "alphabetic";

        // Draw popup notifications
        for (i = 0; i < graphicsObjects.length; i++)
            graphicsObjects[i].draw(ctx, camera, deltaTime);

        // Handle fade effect on death
        if (isFading) {
            (function applyFade(dt) {
                fadeSnapshot.drawImage(canvas, 0, 0);
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                ctx.globalAlpha = fadeAlpha;
                ctx.drawImage(fadeCanvas, 0, 0);
                fadeAlpha -= dt / 1000;
                if (fadeAlpha <= 0) {
                    document.getElementById("gameCanvas").style.display =
                        "none";
                    isFading = false;
                    fadeFinishedCallback();
                }
            })(deltaTime);
        }
    }

    function physicsStep() {
        var dt = constants.PHYSICS_INTERVAL;

        if (hasJoined) {
            // Gather input
            (function gatherAndSendInput() {
                mouseToTankX = mouseX + camera.camLeft - tanks[0].x;
                mouseToTankY = mouseY + camera.camTop - tanks[0].y;
                isMoving = true;
                if (Math.abs(mouseToTankX) < 60 && Math.abs(mouseToTankY) < 60)
                    isMoving = false;

                var networkInput = {
                    targetAngle: Math.atan2(mouseToTankY, mouseToTankX),
                    moveForward: isMoving,
                    mouseClicked: mouseClicked,
                    tickNum: tickNum,
                };

                var movementInput = {
                    targetX: mouseToTankX,
                    targetY: mouseToTankY,
                    moveForward: isMoving,
                    tickNum: tickNum,
                };

                var shootInput = {
                    mouseClicked: mouseClicked,
                    tickNum: tickNum,
                };

                var binaryData =
                    networkProtocol.userInputToBinaryData(networkInput);
                socket.sendBinary(
                    networkProtocol.tankInputToServer,
                    binaryData,
                );
                movementInputBuffer.push(movementInput);
                shootInputBuffer.push(shootInput);
                tickNum++;
            })();

            // Apply immediate prediction
            var shootInput = {
                mouseClicked: mouseClicked,
                tickNum: tickNum - 1,
            };

            applyMovementInputs(dt, [
                {
                    targetX: mouseToTankX,
                    targetY: mouseToTankY,
                    moveForward: isMoving,
                },
            ]);
            applyShootInputs(dt, [shootInput]);
        }

        mouseClicked = false;
    }

    var hasShownDisconnect = false;

    function gameLoop(timestamp) {
        renderFrame(timestamp);

        if (movementInputBuffer.length > 1500 && !hasShownDisconnect) {
            alert(
                "Unable to reconnect to the server, you are being redirected to the homepage.",
            );
            window.location.href = "/";
            hasShownDisconnect = true;
        }

        requestAnimationFrame(gameLoop);
    }

    var wallSprites = spriteGenerator.generateWallSpriteSheet(
        BACKGROUND_COLOR,
        window.devicePixelRatio || 1,
    );

    exports.drawSplashScreen = drawSplashScreen;
    exports.beginClient = beginClient;
    exports.askToSpawn = askToSpawn;
    module.exports.drawSplashScreen = drawSplashScreen;
    module.exports.beginClient = beginClient;
    module.exports.askToSpawn = askToSpawn;
}).call(this, require("./globalContext"));

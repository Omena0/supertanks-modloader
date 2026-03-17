(function (exports) {
    var constants = require("./constants"),
        collision = require("./collision"),
        networkProtocol = require("./networkProtocol"),
        physics = require("./physics"),
        SocketWrapper = require("./socketWrapper"),
        spriteGenerator = require("./spriteGenerator"),
        pathfind = require("./pathfind"),
        modUi = require("./modUi"),
        smartAimMod = require("./smartAim"),
        bulletLinesMod = require("./bulletLines"),
        autoDodgeMod = require("./autoDodge"),
        autoKillMod = require("./autoKill"),
        minimapMod = require("./minimap");

    var canvas,
        ctx,
        Bullet = require("./bullet"),
        Tank = require("./tank"),
        PopUpNotification =
            (require("./graphicsObject"),
                require("./popUpNotification").PopUpNotification);

    console.log("Running game...");
    console.log("V 2.0 [MOD]");
    console.log("Supertanks Mod by Omena0");

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

    // === MOD STATE ===
    var ctrlPressed = false;
    var mouseWorldX = 0;
    var mouseWorldY = 0;
    var currentSmartAimAngle = 0;
    var currentSmartAimPath = null;
    var smartAimValid = false;
    var smartAimEnabled = true;
    var ctrlMoveEnabled = true;
    var trajectoryEnabled = true;
    var minimapEnabled = true;
    var autoDodgeEnabled = true;
    var autoKillEnabled = true;
    var _dodgeActive = false;
    var _dodgeAngle = 0;
    var _dodgePath = []; // [{x, y}] for visualization
    var _cachedBulletPaths = []; // [{path, bulletIndex}] reused by drawing + dodge
    var autoRespawnEnabled = true;
    var pathfindEnabled = true;
    var _pathfindTarget = null;
    var _pathfindPath = [];
    var _pathfindIndex = 0;
    var _pathfindAngle = 0;
    var _pathfindActive = false;
    var _pathfindPauseUntilTick = 0;
    var _pathfindRecalcTick = 0;
    var _bulletThreatGrid = Object.create(null);
    var _bulletThreatCellSize = 44;
    var _bulletCacheWorker = null;
    var _bulletCacheWorkerBusy = false;
    var _bulletCacheWorkerEnabled = false;
    var _bulletCacheRequestId = 0;
    var _bulletCacheAppliedId = 0;
    var _bulletThreatGridDirty = true;

    function initBulletCacheWorker() {
        if (_bulletCacheWorker || typeof Worker === "undefined" || typeof Blob === "undefined" || typeof URL === "undefined") return;
        try {
            var workerSource = "(function(){" +
                "function simulatePath(constants,startX,startY,angle,mazeData,maxSteps){" +
                "var bulletSpeed=constants.TANK_MAX_SPEED*1.2;var dt=constants.PHYSICS_INTERVAL;" +
                "var bx=startX,by=startY;var vx=Math.cos(angle)*bulletSpeed;var vy=Math.sin(angle)*bulletSpeed;var path=[];" +
                "for(var step=0;step<maxSteps;step++){" +
                "bx+=vx*dt;by+=vy*dt;var bounced=false;" +
                "if(bx+9>mazeData.worldWidth){bx=mazeData.worldWidth-9;vx*=-1;bounced=true;}else if(bx-9<0){bx=9;vx*=-1;bounced=true;}" +
                "if(by+9>mazeData.worldHeight){by=mazeData.worldHeight-9;vy*=-1;bounced=true;}else if(by-9<0){by=9;vy*=-1;bounced=true;}" +
                "if(!bounced&&mazeData.cellsAcross){" +
                "var cellX=Math.floor(bx/100);var cellY=Math.floor(by/100);var modX=bx%100,modY=by%100;" +
                "var nearL=modX<9,nearR=modX>91,nearT=modY<9,nearB=modY>91;" +
                "if(nearT&&nearL&&1==mazeData.wallCorners[cellY*(mazeData.cellsAcross+1)+cellX]){" +
                "if(vx*(modY-9)-vy*(modX-9)<0){vy*=-1;by=100*cellY+9;}else{vx*=-1;bx=100*cellX+9;}}" +
                "else if(nearT&&nearR&&1==mazeData.wallCorners[cellY*(mazeData.cellsAcross+1)+(cellX+1)]){" +
                "if(vx*(modY-9)-vy*(modX-91)>0){vy*=-1;by=100*cellY+9;}else{vx*=-1;bx=100*cellX+91;}}" +
                "else if(nearB&&nearL&&1==mazeData.wallCorners[(cellY+1)*(mazeData.cellsAcross+1)+cellX]){" +
                "if(vx*(modY-91)-vy*(modX-9)>0){vy*=-1;by=100*cellY+91;}else{vx*=-1;bx=100*cellX+9;}}" +
                "else if(nearB&&nearR&&1==mazeData.wallCorners[(cellY+1)*(mazeData.cellsAcross+1)+(cellX+1)]){" +
                "if(vx*(modY-91)-vy*(modX-91)<0){vy*=-1;by=100*cellY+91;}else{vx*=-1;bx=100*cellX+91;}}" +
                "else if(nearB&&1==mazeData.horisontalWalls[(cellY+1)*mazeData.cellsAcross+cellX]){vy*=-1;by=100*cellY+91;}" +
                "else if(nearT&&1==mazeData.horisontalWalls[cellY*mazeData.cellsAcross+cellX]){vy*=-1;by=100*cellY+9;}" +
                "else if(nearL&&1==mazeData.verticalWalls[cellY*(mazeData.cellsAcross+1)+cellX]){vx*=-1;bx=100*cellX+9;}" +
                "else if(nearR&&1==mazeData.verticalWalls[cellY*(mazeData.cellsAcross+1)+(cellX+1)]){vx*=-1;bx=100*cellX+91;}" +
                "}" +
                "path.push({x:bx,y:by,vx:vx,vy:vy,step:step});}" +
                "return path;}" +
                "self.onmessage=function(ev){var d=ev.data||{};var bullets=d.bullets||[];var out=[];" +
                "for(var i=0;i<bullets.length;i++){var b=bullets[i];if(!b)continue;" +
                "var path=simulatePath(d.constants,b.x,b.y,Math.atan2(b.yVel,b.xVel),d.mazeData,b.stepsLeft);" +
                "out.push({id:b.id,path:path,ignoreForDodge:b.ignoreForDodge});}" +
                "self.postMessage({requestId:d.requestId,entries:out});};" +
                "})();";
            var blob = new Blob([workerSource], { type: "application/javascript" });
            var url = URL.createObjectURL(blob);
            _bulletCacheWorker = new Worker(url);
            URL.revokeObjectURL(url);

            _bulletCacheWorker.onmessage = function (ev) {
                var data = ev && ev.data ? ev.data : null;
                _bulletCacheWorkerBusy = false;
                if (!data || !data.entries) return;
                if (data.requestId <= _bulletCacheAppliedId) return;
                _bulletCacheAppliedId = data.requestId;

                var idBuckets = Object.create(null);
                for (var bi = 0; bi < bullets.length; bi++) {
                    var b = bullets[bi];
                    var key = String(b.id);
                    if (!idBuckets[key]) idBuckets[key] = [];
                    idBuckets[key].push(b);
                }

                var rebuilt = [];
                for (var i = 0; i < data.entries.length; i++) {
                    var e = data.entries[i];
                    var bucket = idBuckets[String(e.id)];
                    if (!bucket || !bucket.length) continue;
                    var bulletRef = bucket.shift();
                    rebuilt.push({ path: e.path, bullet: bulletRef, ignoreForDodge: !!e.ignoreForDodge });
                }

                _cachedBulletPaths = rebuilt;
                _bulletThreatGridDirty = true;
            };

            _bulletCacheWorker.onerror = function () {
                _bulletCacheWorkerEnabled = false;
                _bulletCacheWorkerBusy = false;
            };

            _bulletCacheWorkerEnabled = true;
        } catch (e) {
            _bulletCacheWorkerEnabled = false;
            _bulletCacheWorkerBusy = false;
        }
    }

    // === BULLET PATH CACHE: computed once per tick, shared across systems ===
    function updateBulletPathCache(mazeData) {
        if (!mazeData.cellsAcross) {
            _cachedBulletPaths = [];
            _bulletThreatGrid = Object.create(null);
            _bulletThreatGridDirty = false;
            return;
        }

        if (_bulletCacheWorkerEnabled && _bulletCacheWorker && !_bulletCacheWorkerBusy) {
            var now = Date.now();
            var bulletPayload = [];
            for (var i = 0; i < bullets.length; i++) {
                var b = bullets[i];
                var remainingTTL = b.timeToLive !== undefined ? b.timeToLive : 9000;
                if (b.fireTime) remainingTTL = 9000 - (now - b.fireTime);
                if (remainingTTL <= 0) continue;
                var stepsLeft = Math.ceil(remainingTTL / constants.PHYSICS_INTERVAL);
                bulletPayload.push({
                    id: b.id,
                    x: b.x,
                    y: b.y,
                    xVel: b.xVel,
                    yVel: b.yVel,
                    stepsLeft: stepsLeft,
                    ignoreForDodge: !!(b.ignoreForDodgeUntil && now < b.ignoreForDodgeUntil),
                });
            }

            _bulletCacheWorkerBusy = true;
            _bulletCacheRequestId++;
            _bulletCacheWorker.postMessage({
                requestId: _bulletCacheRequestId,
                bullets: bulletPayload,
                mazeData: mazeData,
                constants: constants,
            });
        }

        // Fallback path (or initial warm-up before first worker result).
        if (!_bulletCacheWorkerEnabled || _cachedBulletPaths.length === 0) {
            _cachedBulletPaths = bulletLinesMod.updateBulletPathCache(
                bullets,
                mazeData,
                constants,
                smartAimMod.simulateBulletPath
            );
            _bulletThreatGridDirty = true;
        }

        if (_bulletThreatGridDirty) rebuildBulletThreatGrid();
    }

    function rebuildBulletThreatGrid() {
        _bulletThreatGrid = Object.create(null);
        if (!_cachedBulletPaths || !_cachedBulletPaths.length) {
            _bulletThreatGridDirty = false;
            return;
        }
        var cellSize = _bulletThreatCellSize;
        var grid = _bulletThreatGrid;

        for (var i = 0; i < _cachedBulletPaths.length; i++) {
            var entry = _cachedBulletPaths[i];
            if (!entry || entry.ignoreForDodge) continue;
            var path = entry.path;
            var pathLen = path && path.length;
            if (!pathLen || pathLen < 2) continue;

            var maxStep = pathLen < 130 ? pathLen : 130;
            for (var s = 0; s < maxStep; s += 2) {
                var pt = path[s];
                var cx = (pt.x / cellSize) | 0;
                var cy = (pt.y / cellSize) | 0;
                var key = cx + ":" + cy;
                var bucket = grid[key];
                if (!bucket) {
                    bucket = [];
                    grid[key] = bucket;
                }
                bucket.push({ x: pt.x, y: pt.y, s: s });
            }
        }
        _bulletThreatGridDirty = false;
    }

    function clearPathfindTarget() {
        _pathfindTarget = null;
        _pathfindPath = [];
        _pathfindIndex = 0;
        _pathfindActive = false;
        _pathfindPauseUntilTick = 0;
        _pathfindRecalcTick = 0;
    }

    function setPathfindTarget(targetX, targetY) {
        if (!maze.cellsAcross || !tanks || !tanks[0]) return;
        if (_pathfindTarget && _pathfindPath && _pathfindPath.length > 0 && _pathfindIndex < _pathfindPath.length) {
            var dx = targetX - _pathfindTarget.x;
            var dy = targetY - _pathfindTarget.y;
            if (dx * dx + dy * dy <= 20 * 20) return;
        }
        var computed = pathfind.findPath(maze, tanks[0].x, tanks[0].y, targetX, targetY, {
            bulletPaths: _cachedBulletPaths,
        });
        if (!computed || computed.length === 0) {
            clearPathfindTarget();
            return;
        }
        _pathfindTarget = { x: targetX, y: targetY };
        _pathfindPath = computed;
        _pathfindIndex = 0;
    }

    function drawPathfindPath(ctx, cam) {
        if (!_pathfindPath || _pathfindPath.length === 0 || !tanks || !tanks[0]) return;
        ctx.save();
        ctx.strokeStyle = "rgba(255, 235, 59, 0.95)";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(tanks[0].x - cam.camLeft, tanks[0].y - cam.camTop);
        for (var i = _pathfindIndex; i < _pathfindPath.length; i++) {
            ctx.lineTo(_pathfindPath[i].x - cam.camLeft, _pathfindPath[i].y - cam.camTop);
        }
        ctx.stroke();
        ctx.restore();
    }

    function findDodgeAction(tankX, tankY, mazeData) {
        var result = autoDodgeMod.findDodgeAction(tankX, tankY, mazeData, _cachedBulletPaths, constants);
        if (!result) {
            _dodgePath = [];
            return null;
        }
        _dodgePath = result.path || [];
        return { angle: result.angle, shouldMove: !!result.shouldMove };
    }

    function findSmartAimAngle(tankX, tankY, targetX, targetY, mazeData) {
        var result = smartAimMod.findSmartAimAngle({
            tankX: tankX,
            tankY: tankY,
            targetX: targetX,
            targetY: targetY,
            mazeData: mazeData,
            smartAimEnabled: smartAimEnabled,
            constants: constants,
            physics: physics,
            playerTank: tanks[0],
        });
        smartAimValid = result.valid;
        currentSmartAimPath = result.path;
        currentSmartAimAngle = result.angle;
        return result.angle;
    }

    // === BULLET TRAJECTORY PREDICTION (TTL-aware, uses cached paths) ===
    function drawBulletPredictions(ctx, cam, mazeData) {
        bulletLinesMod.drawBulletPredictions(ctx, cam, mazeData, _cachedBulletPaths, tanks[0].x, tanks[0].y);
    }

    // === DODGE PATH VISUALIZATION ===
    function drawDodgePath(ctx, cam) {
        autoDodgeMod.drawDodgePath(ctx, cam, tanks[0].x, tanks[0].y, _dodgePath);
    }

    // === SMART AIM PREVIEW PATH ===
    function drawSmartAimPreview(ctx, cam) {
        smartAimMod.drawSmartAimPreview(ctx, cam, tanks[0].x, tanks[0].y, currentSmartAimAngle, currentSmartAimPath);
    }

    // === MINIMAP ===
    function drawMinimap(ctx, mazeData, allTanks, localTank) { 
        minimapMod.drawMinimap(ctx, mazeData, allTanks);
    }

    // === AUTOKILL SHOT PATH VISUALIZATION ===
    function drawAutoKillRankedPaths(ctx, cam) {
        if (!autoKillEnabled || !autoKillMod.getTopRankedPaths) return;
        var ranked = autoKillMod.getTopRankedPaths();
        if (!ranked || ranked.length === 0) return;

        ctx.save();
        ctx.setLineDash([6, 6]);

        var minVisibleAlpha = 0.065;
        var minVisibleWidth = 0.7;

        var count = Math.min(20, ranked.length);
        for (var i = 0; i < count; i++) {
            var cand = ranked[i];
            if (!cand.path || cand.path.length < 2) continue;

            // Style depends on index only; ranks 10-20 are intentionally faint.
            var baseAlpha;
            var baseWidth;

            if (i === 0) {
                // Explicit highlight for best path.
                baseAlpha = 1;
                baseWidth = 4;
            } else if (i < 10) {
                var tTop = i / 9;
                baseAlpha = 0.46 * Math.pow(1 - tTop, 1.15) + 0.1;
                baseWidth = 3 - 1.4 * tTop;
            } else {
                var tLow = (i - 10) / 9;
                baseAlpha = 0.09 * Math.pow(1 - tLow, 1.45) + 0.02;
                baseWidth = 1.1 - 0.45 * tLow;
            }

            var pathLen = cand.path.length;
            for (var p = 1; p < pathLen; p += 2) {
                var a = cand.path[p - 1];
                var b = cand.path[p];
                var distT = p / Math.max(1, pathLen - 1);
                // Slight fade with travel distance along each path.
                var segFade = (i === 0) ? 1 : (1 - 0.45 * Math.pow(distT, 1.2));
                var alpha = Math.max(minVisibleAlpha, baseAlpha * segFade);

                ctx.beginPath();
                ctx.moveTo(a.x - cam.camLeft, a.y - cam.camTop);
                ctx.lineTo(b.x - cam.camLeft, b.y - cam.camTop);
                var widthScale = (i === 0) ? 1 : (0.9 + 0.1 * segFade);
                ctx.lineWidth = Math.max(minVisibleWidth, baseWidth * widthScale);
                ctx.strokeStyle = "rgba(255, 120, 120, " + alpha + ")";
                ctx.stroke();
            }
        }

        ctx.setLineDash([]);
        ctx.restore();
    }

    function shortestAngleDiff(a, b) {
        var d = a - b;
        while (d <= -Math.PI) d += 2 * Math.PI;
        while (d > Math.PI) d -= 2 * Math.PI;
        return Math.abs(d);
    }

    function isPointUnderBulletThreat(px, py, maxSteps, radius) {
        if (!_bulletThreatGrid) return false;
        var r2 = radius * radius;
        var cell = _bulletThreatCellSize;
        var cx = (px / cell) | 0;
        var cy = (py / cell) | 0;

        for (var ox = -1; ox <= 1; ox++) {
            for (var oy = -1; oy <= 1; oy++) {
                var key = (cx + ox) + ":" + (cy + oy);
                var bucket = _bulletThreatGrid[key];
                if (!bucket) continue;
                for (var i = 0; i < bucket.length; i++) {
                    var h = bucket[i];
                    if (h.s > maxSteps) continue;
                    var dx = h.x - px;
                    var dy = h.y - py;
                    if (dx * dx + dy * dy <= r2) return true;
                }
            }
        }
        return false;
    }

    // === MOD GUI PANEL ===
    function getModDefinitions() {
        return [
            { id: "smartaim", label: "Smart Aim", key: "S", get: function() { return smartAimEnabled; }, set: function(v) { smartAimEnabled = v; } },
            { id: "ctrlmove", label: "Ctrl to Move", key: "C", get: function() { return ctrlMoveEnabled; }, set: function(v) { ctrlMoveEnabled = v; } },
            { id: "trajectory", label: "Trajectories", key: "T", get: function() { return trajectoryEnabled; }, set: function(v) { trajectoryEnabled = v; } },
            { id: "minimap", label: "Minimap", key: "M", get: function() { return minimapEnabled; }, set: function(v) { minimapEnabled = v; } },
            { id: "autododge", label: "Auto Dodge", key: "D", get: function() { return autoDodgeEnabled; }, set: function(v) { autoDodgeEnabled = v; } },
            { id: "autokill", label: "Auto Kill", key: "K", get: function() { return autoKillEnabled; }, set: function(v) { autoKillEnabled = v; } },
            { id: "pathfind", label: "Pathfind", key: "P", get: function() { return pathfindEnabled; }, set: function(v) { pathfindEnabled = v; if (!v) clearPathfindTarget(); } },
            { id: "autorespawn", label: "Auto Respawn", key: "R", get: function() { return autoRespawnEnabled; }, set: function(v) { autoRespawnEnabled = v; } }
        ];
    }

    function createModPanel() {
        modUi.createModPanel(getModDefinitions());
    }

    function updateModSwitch(id, value) {
        modUi.updateModSwitch(id, value);
    }

    // === END MOD HELPERS ===

    function drawSplashScreen(splashCtx) {
        var mazeString = "16x16\n+---+---+---+---+---+---+---+---+---+---+---+---+---+---+---+---+\n|           |                   |           |               |   |\n+---+---+   +   +---+   +---+   +---+   +   +   +---+   +   +   +\n|   |       |       |   |       |       |       |   |   |       |\n+   +   +   +---+   +   +   +---+   +---+   +---+   +   +---+---+\n|   |   |   |           |   |               |       |           |\n+   +   +   +   +---+---+   +---+---+---+   +   +---+---+       +\n|       |       |                       |   |                   |\n+---+---+---+---+---+   +---+       +---+   +   +---+   +       +\n|           |       |   |   |               |   |   |   |   |   |\n+   +---+   +   +---+   +   +   +---+---+---+   +   +---+---+---+\n|       |       |           |   |       |   |   |               |\n+---+   +---+---+   +---+   +   +   +   +   +   +   +---+---+   +\n|       |           |   |   |   |   |           |           |   |\n+   +---+   +---+---+   +---+   +   +---+       +---+       +   +\n|           |               |       |   |           |       |   |\n+   +---+   +   +---+   +---+---+   +   +           +---+   +   +\n|       |       |   |   |           |   |                   |   |\n+---+---+   +   +   +   +           +   +---+---+---+---+---+   +\n|           |       |   |       |   |           |       |       |\n+---+       +---+   +---+       +   +---+---+   +       +       +\n|           |                   |       |               |       |\n+---+   +---+---+---+   +---+   +   +   +   +---+   +---+       +\n|                       |   |       |   |   |   |               |\n+   +---+   +---+---+---+   +---+   +---+   +   +---+   +---+---+\n|       |                       |           |                   |\n+       +---+---+---+---+       +---+---+---+---+---+---+       +\n|                       |       |   |               |           |\n+       +---+   +   +---+       +   +---+---+---+   +   +---+---+\n|           |   |                   |               |           |\n+---+   +---+   +---+---+       +   +---+   +   +   +   +---+   +\n|           |           |       |           |   |       |       |\n+---+---+---+---+---+---+---+---+---+---+---+---+---+---+---+---+";

        var lines = mazeString.replace(/[\r]+/g, "").split("\n");
        var dimensions = lines[0].split("x");
        var cols = parseInt(dimensions[0]);
        var rows = parseInt(dimensions[1]);

        var horizontalWalls = [];
        for (var row = 0; row < rows + 1; row++) {
            var line = lines[1 + 2 * row];
            for (var col = 2; col < line.length; col += 4)
                horizontalWalls.push(line[col] == "-" ? 1 : 0);
        }

        var verticalWalls = [];
        for (row = 0; row < rows; row++) {
            line = lines[2 + 2 * row];
            for (col = 0; col < line.length; col += 4)
                verticalWalls.push(line[col] == "|" ? 1 : 0);
        }

        var corners = [];
        for (var y = 0; y <= rows; y++) {
            for (var x = 0; x <= cols; x++) {
                var weight = 0;
                if (y > 0) weight += 1 * verticalWalls[(y - 1) * (cols + 1) + x];
                if (y < rows) weight += 4 * verticalWalls[y * (cols + 1) + x];
                if (x > 0) weight += 8 * horizontalWalls[y * cols + (x - 1)];
                if (x < cols) weight += 2 * horizontalWalls[y * cols + x];
                if (weight != 0) corners.push({ x: x, y: y, weight: weight });
            }
        }

        splashCtx.fillStyle = BACKGROUND_COLOR;
        splashCtx.fillRect(0, 0, splashCtx.canvas.width, splashCtx.canvas.height);

        for (var i = 0; i < corners.length; i++) {
            var sprite = wallSprites[corners[i].weight];
            var drawX = 100 * corners[i].x - 220 - 0.5 * sprite.width;
            var drawY = 100 * corners[i].y - 830 - 0.5 * sprite.height;
            if (drawX + sprite.width > 0 && drawX < splashCtx.canvas.width &&
                drawY + sprite.height > 0 && drawY < splashCtx.canvas.height)
                splashCtx.drawImage(sprite, drawX, drawY);
        }

        splashCtx.globalAlpha = 0.3;
        splashCtx.fillStyle = "#434647";
        splashCtx.fillRect(0, 0, splashCtx.canvas.width, splashCtx.canvas.height);
    }

    function resizeCanvas() {
        var panelWidth = $("#dataPanel").width();
        var gameCanvas = document.getElementById("gameCanvas");

        gameCanvas.width = (document.body.clientWidth - panelWidth) * window.devicePixelRatio;
        gameCanvas.height = document.body.clientHeight * window.devicePixelRatio;
        gameCanvas.style.width = document.body.clientWidth - panelWidth + "px";
        gameCanvas.style.height = document.body.clientHeight + "px";

        gameCanvas.getContext("2d").scale(window.devicePixelRatio, window.devicePixelRatio);
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
        canvas.addEventListener("mousedown", handleMouseDown, false);
        canvas.addEventListener("auxclick", function (e) {
            if (e.button === 1) e.preventDefault();
        }, false);
        window.addEventListener("resize", resizeCanvas);

        // === MOD: Key listeners for Ctrl + mod hotkeys ===
        window.addEventListener("keydown", function(e) {
            if (e.key === "Control") ctrlPressed = true;
            var k = e.key.toUpperCase();
            if (k === "S") { smartAimEnabled = !smartAimEnabled; updateModSwitch("smartaim", smartAimEnabled); }
            if (k === "C") { ctrlMoveEnabled = !ctrlMoveEnabled; updateModSwitch("ctrlmove", ctrlMoveEnabled); }
            if (k === "T") { trajectoryEnabled = !trajectoryEnabled; updateModSwitch("trajectory", trajectoryEnabled); }
            if (k === "M") { minimapEnabled = !minimapEnabled; updateModSwitch("minimap", minimapEnabled); }
            if (k === "D") { autoDodgeEnabled = !autoDodgeEnabled; updateModSwitch("autododge", autoDodgeEnabled); }
            if (k === "K") { autoKillEnabled = !autoKillEnabled; updateModSwitch("autokill", autoKillEnabled); }
            if (k === "P") {
                pathfindEnabled = !pathfindEnabled;
                if (!pathfindEnabled) clearPathfindTarget();
                updateModSwitch("pathfind", pathfindEnabled);
            }
            if (k === "R") { autoRespawnEnabled = !autoRespawnEnabled; updateModSwitch("autorespawn", autoRespawnEnabled); }
        });
        window.addEventListener("keyup", function(e) {
            if (e.key === "Control") ctrlPressed = false;
        });

        // === MOD: Create mod toggle panel ===
        createModPanel();
        initBulletCacheWorker();

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
                    graphicsObjects.push(new PopUpNotification("You gained +" + gained + " balls!"));
                else
                    graphicsObjects.push(new PopUpNotification("You gained +" + gained + " ball!"));
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
        var cookieParts = ("; " + document.cookie).split("; " + cookieName + "=");
        var sessionCookie = cookieParts.length == 2 ? cookieParts.pop().split(";").shift() : null;

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

        for (var row = 0; row <= maze.cellsDown; row++) {
            for (var col = 0; col <= maze.cellsAcross; col++) {
                var weight = 0;
                if (row > 0) weight += 1 * maze.verticalWalls[(row - 1) * (maze.cellsAcross + 1) + col];
                if (row < maze.cellsDown) weight += 4 * maze.verticalWalls[row * (maze.cellsAcross + 1) + col];
                if (col > 0) weight += 8 * maze.horisontalWalls[row * maze.cellsAcross + (col - 1)];
                if (col < maze.cellsAcross) weight += 2 * maze.horisontalWalls[row * maze.cellsAcross + col];
                if (weight != 0) wallCornerSprites.push({ x: col, y: row, weight: weight });
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

            for (var j = 1; j < tanks.length; j++) {
                if (Math.abs(tanks[j].x - tanks[j].latestX) > 70 || Math.abs(tanks[j].y - tanks[j].latestY) > 70) {
                    tanks[j].x = tanks[j].latestX;
                    tanks[j].y = tanks[j].latestY;
                    tanks[j].angle = tanks[j].latestAngle;
                } else {
                    tanks[j].x = tanks[j].x + 0.4 * (tanks[j].latestX - tanks[j].x);
                    tanks[j].y = tanks[j].y + 0.4 * (tanks[j].latestY - tanks[j].y);
                    tanks[j].angle = collision.angleLerp(tanks[j].angle, tanks[j].latestAngle, 0.3);
                }
            }
        }
    }

    function applyShootInputs(deltaTime, inputs) {
        var localTank = tanks[0];
        var bulletSpeed = constants.TANK_MAX_SPEED * 1.2;
        for (var i = 0; i < inputs.length; i++) {
            var currentTick;

            if (inputs[i].mouseClicked) {
                currentTick = inputs[i].tickNum;
                if (!localTank.beenHit && bulletsSpawnedCount < maxBullets && currentTick - lastShotTick > 2) {
                    var angle = localTank.angle;
                    var cosA = Math.cos(angle);
                    var sinA = Math.sin(angle);
                    var spawnX = localTank.x + 40 * cosA;
                    var spawnY = localTank.y + 40 * sinA;

                    if (physics.canBulletBeSpawned(localTank, spawnX, spawnY, maze)) {
                        var dirX = cosA;
                        var dirY = sinA;
                        var magnitude = Math.sqrt(dirX * dirX + dirY * dirY);
                        var bulletVelX = (dirX / magnitude) * bulletSpeed;
                        var bulletVelY = (dirY / magnitude) * bulletSpeed;
                        var newBullet = new Bullet(nextBulletId, spawnX, spawnY, bulletVelX, bulletVelY);
                        var now = Date.now();
                        newBullet.fireTime = now;
                        newBullet.ignoreForDodgeUntil = now + 450;
                        nextBulletId--;
                        bullets.push(newBullet);
                        onBulletFired(inputs[i].tickNum);
                    }
                }
            }

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
                    tanks[i].leaderBoardPos = data.playerScores[j].leaderBoardPos;
                }
            }
        }

        for (i = 0; i < leaderBoard.length; i++) {
            if (leaderBoard[i].id == tanks[0].ID) leaderBoard[i].isplayer = true;
        }

        setLeaderboard(leaderBoard);
        kingID = data.kingID;
        kingStartTime = data.kingStartTime;
    }

    function onSyncBullets(buffer) {
        var state = networkProtocol.binaryToBulletState(buffer);
        var serverBullets = state.bullets;
        var matchFlags = new Array(bullets.length).fill(0);

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
                    serverBullets[i].id, serverBullets[i].x, serverBullets[i].y,
                    serverBullets[i].xVel, serverBullets[i].yVel
                );
                newBullet.fireTime = Date.now();
                bullets.push(newBullet);
            }
        }

        for (i = matchFlags.length - 1; i >= 0; i--) {
            if (matchFlags[i] == 0) bullets.splice(i, 1);
        }

        bulletsSpawnedCount = state.bulletsSpawnedCount;

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
                        tanks[i].x = state.tanks[j].x;
                        tanks[i].y = state.tanks[j].y;
                        tanks[i].angle = state.tanks[j].angle;
                        tanks[i].latestX = tanks[i].x;
                        tanks[i].latestY = tanks[i].y;
                        tanks[i].latestAngle = tanks[i].angle;
                        tanks[i].justJoined = false;
                    } else {
                        tanks[i].latestX = state.tanks[j].x;
                        tanks[i].latestY = state.tanks[j].y;
                        tanks[i].latestAngle = state.tanks[j].angle;
                    }

                    tanks[i].isKing = kingID == tanks[i].ID;
                    break;
                }
            }
        }

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

    function handleMouseDown(event) {
        if (event.button !== 1) return;
        event.preventDefault();
        if (!hasJoined || !pathfindEnabled || !maze.cellsAcross) return;
        var targetX = event.clientX + camera.camLeft;
        var targetY = event.clientY + camera.camTop;
        setPathfindTarget(targetX, targetY);
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
            if (autoRespawnEnabled) {
                askToSpawn()
                return;
            }

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

        camera.camLeft = tanks[0].x - 0.5 * canvas.clientWidth;
        camera.camTop = tanks[0].y - 0.5 * canvas.clientHeight;

        ctx.fillStyle = BACKGROUND_COLOR;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Draw wall tiles
        var dpr = window.devicePixelRatio || 1;
        var camLeft = camera.camLeft;
        var camTop = camera.camTop;
        var canvasWidth = canvas.width;
        var canvasHeight = canvas.height;
        for (var i = 0; i < wallCornerSprites.length; i++) {
            var sprite = wallSprites[wallCornerSprites[i].weight];
            var spriteW = sprite.width / dpr;
            var spriteH = sprite.height / dpr;
            var drawX = Math.floor(100 * wallCornerSprites[i].x - camLeft - 0.5 * spriteW);
            var drawY = Math.floor(100 * wallCornerSprites[i].y - camTop - 0.5 * spriteH);

            if (drawX + spriteW > 0 && drawX < canvasWidth && drawY + spriteH > 0 && drawY < canvasHeight)
                ctx.drawImage(sprite, drawX, drawY, spriteW, spriteH);
        }

        // === MOD: Draw smart aim preview path ===
        if (smartAimEnabled) drawSmartAimPreview(ctx, camera);

        // === MOD: Draw dodge path ===
        if (autoDodgeEnabled && _dodgeActive) drawDodgePath(ctx, camera);

        // === MOD: Draw pathfinder path ===
        if (pathfindEnabled) drawPathfindPath(ctx, camera);

        // === MOD: Draw bullet trajectory predictions ===
        if (trajectoryEnabled) drawBulletPredictions(ctx, camera, maze);

        // === MOD: Draw top auto-kill candidate paths ===
        if (autoKillEnabled) drawAutoKillRankedPaths(ctx, camera);

        // Draw bullets
        for (i = 0; i < bullets.length; i++) bullets[i].draw(ctx, camera);

        // Sort tanks
        var sortedTanks = tanks.slice().sort(function (a, b) {
            if (a.model.showingExplosion) return 1;
            if (b.model.showingExplosion || a.model.showingScorch) return -1;
            if (b.model.showingScorch) return 1;
            return 0;
        });

        for (i = 0; i < sortedTanks.length; i++) {
            if (!sortedTanks[i].justJoined) sortedTanks[i].draw(ctx, camera);
        }

        // Intro overlay
        if (introAlpha > 0) {
            ctx.globalAlpha = introAlpha;
            ctx.fillStyle = "rgba(240,240,240,0.8)";
            ctx.strokeStyle = "#f0f0f0";
            ctx.fillRect(0.5 * (canvas.clientWidth - 700), 0.5 * canvas.clientHeight - 100 - 120, 700, 160);

            ctx.fillStyle = "#fbac00";
            ctx.textAlign = "center";
            ctx.font = "40px Fredoka One";
            ctx.fillText("King of the Hill!", 0.5 * canvas.clientWidth, 0.5 * canvas.clientHeight - 40 - 120);

            ctx.font = "900 22px Nunito";
            ctx.fillStyle = "#737373";
            ctx.fillText("Stay at the top of the leaderboard for as long as possible", 0.5 * canvas.clientWidth, 0.5 * canvas.clientHeight - 120);
            ctx.fillText("(Click to shoot)", 0.5 * canvas.clientWidth, 0.5 * canvas.clientHeight + 30 - 120);

            ctx.textAlign = "start";
            if (introTimer > 4) introAlpha -= deltaTime / 3000;
            introTimer += deltaTime / 1000;
            ctx.globalAlpha = 1;
        }

        // King indicator
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
                    ctx.textAlign = "center";
                    ctx.font = "28px Fredoka One";
                    ctx.strokeStyle = "white";
                    ctx.lineWidth = 4;
                    ctx.strokeText("You are King!", 0.5 * canvas.clientWidth, 0.9 * canvas.clientHeight - 30 + 2);
                    ctx.strokeText("You are King!", 0.5 * canvas.clientWidth, 0.9 * canvas.clientHeight - 30);
                    ctx.fillStyle = "#e75800";
                    ctx.fillText("You are King!", 0.5 * canvas.clientWidth, 0.9 * canvas.clientHeight - 30 + 2);
                    ctx.fillStyle = "#fbac00";
                    ctx.fillText("You are King!", 0.5 * canvas.clientWidth, 0.9 * canvas.clientHeight - 30);

                    ctx.fillStyle = "#324965";
                    ctx.font = "900 22px Nunito";
                    var timerDate = new Date(null);
                    timerDate.setMilliseconds(kingDuration);
                    var timeString = timerDate.toISOString().substr(14, 8);

                    ctx.strokeStyle = "white";
                    ctx.lineWidth = 4;
                    ctx.lineJoin = "round";
                    ctx.strokeText("Time as King: " + timeString, 0.5 * canvas.clientWidth, 0.9 * canvas.clientHeight);
                    ctx.fillText("Time as King: " + timeString, 0.5 * canvas.clientWidth, 0.9 * canvas.clientHeight);
                    ctx.textAlign = "start";
                }
            } else {
                var arrowAngle = Math.atan2(diffY, diffX);
                var arrowCos = Math.cos(arrowAngle);
                var arrowSin = Math.sin(arrowAngle);
                var arrowX = diffX + 0.5 * canvas.clientWidth;
                var arrowY = diffY + 0.5 * canvas.clientHeight;

                if (offScreenX)
                    arrowX = diffX < 0 ? 20 - 10 * arrowCos : canvas.clientWidth - 20 - 10 * arrowCos;
                if (offScreenY)
                    arrowY = diffY < 0 ? 20 - 10 * arrowSin : canvas.clientHeight - 20 - 10 * arrowSin;

                ctx.save();
                ctx.translate(arrowX, arrowY);
                ctx.fillStyle = "#ffbb00";
                ctx.font = "30px Anton";
                ctx.fillText("\uD83D\uDC51", -20 - 40 * arrowCos, 40 * -arrowSin);
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

        // Ammo counter
        ctx.fillStyle = "rgba(0,0,0,0.8)";
        ctx.font = "900 12px Nunito";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";

        var tankAngle = tanks[0].angle;
        var tankCos = Math.cos(tankAngle);
        var tankSin = Math.sin(tankAngle);
        var ammoX = 0.5 * canvas.clientWidth + -32 * tankCos;
        var ammoY = 0.5 * canvas.clientHeight + -32 * tankSin;

        ctx.beginPath();
        ctx.arc(ammoX - 7, ammoY, 3, 0, 2 * Math.PI);
        ctx.fill();
        ctx.fillText("" + (maxBullets - bulletsSpawnedCount), ammoX + 7, ammoY);
        ctx.textAlign = "start";
        ctx.textBaseline = "alphabetic";

        // Popup notifications
        for (i = 0; i < graphicsObjects.length; i++)
            graphicsObjects[i].draw(ctx, camera, deltaTime);

        // === MOD: Minimap ===
        if (minimapEnabled) drawMinimap(ctx, maze, tanks, tanks[0]);

        // === MOD: "No valid shot" indicator ===
        if (smartAimEnabled && !smartAimValid) {
            ctx.save();
            ctx.font = "bold 14px monospace";
            ctx.fillStyle = "rgba(255, 60, 60, 0.8)";
            ctx.textAlign = "center";
            ctx.fillText("No safe shot", 0.5 * canvas.clientWidth, canvas.clientHeight - 30);
            ctx.restore();
        }

        // Death fade
        if (isFading) {
            (function applyFade(dt) {
                fadeSnapshot.drawImage(canvas, 0, 0);
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                ctx.globalAlpha = fadeAlpha;
                ctx.drawImage(fadeCanvas, 0, 0);
                fadeAlpha -= dt / 1000;
                if (fadeAlpha <= 0) {
                    document.getElementById("gameCanvas").style.display = "none";
                    isFading = false;
                    fadeFinishedCallback();
                }
            })(deltaTime);
        }
    }

    function physicsStep() {
        var dt = constants.PHYSICS_INTERVAL;

        if (hasJoined) {

            // === MOD: Update cached bullet paths for dodge + trajectory drawing ===
            updateBulletPathCache(maze);

            (function gatherAndSendInput() {
                mouseToTankX = mouseX + camera.camLeft - tanks[0].x;
                mouseToTankY = mouseY + camera.camTop - tanks[0].y;

                // === MOD: Mouse world position for smart aim ===
                mouseWorldX = mouseX + camera.camLeft;
                mouseWorldY = mouseY + camera.camTop;

                // === MOD: Only move when Ctrl is pressed (if enabled) ===
                isMoving = ctrlMoveEnabled ? ctrlPressed : !(Math.abs(mouseToTankX) < 60 && Math.abs(mouseToTankY) < 60);

                // === MOD: Auto-dodge has first priority over smart aim ===
                _dodgeActive = false;
                if (autoDodgeEnabled && maze.cellsAcross) {
                    var dodgeResult = findDodgeAction(tanks[0].x, tanks[0].y, maze);
                    if (dodgeResult) {
                        _dodgeActive = true;
                        _dodgeAngle = dodgeResult.angle;
                        isMoving = true;
                        // Bullet threats take priority: cancel current pathfind run.
                        clearPathfindTarget();
                    }
                }

                // === MOD: Pathfind movement (disabled while dodging) ===
                _pathfindActive = false;
                if (!_dodgeActive && pathfindEnabled && _pathfindPath.length > 0 && tickNum >= _pathfindPauseUntilTick) {
                    if (_pathfindTarget && tickNum >= _pathfindRecalcTick) {
                        var checkIdx = _pathfindIndex;
                        if (checkIdx >= _pathfindPath.length) checkIdx = _pathfindPath.length - 1;
                        var checkWp = checkIdx >= 0 ? _pathfindPath[checkIdx] : null;
                        if (checkWp && isPointUnderBulletThreat(checkWp.x, checkWp.y, 90, 38)) {
                            setPathfindTarget(_pathfindTarget.x, _pathfindTarget.y);
                        }
                        _pathfindRecalcTick = tickNum + 4;
                    }

                    while (_pathfindIndex < _pathfindPath.length) {
                        var wp = _pathfindPath[_pathfindIndex];
                        var wdx = wp.x - tanks[0].x;
                        var wdy = wp.y - tanks[0].y;
                        if (wdx * wdx + wdy * wdy <= 24 * 24) {
                            _pathfindIndex++;
                        } else {
                            break;
                        }
                    }

                    if (_pathfindIndex >= _pathfindPath.length) {
                        clearPathfindTarget();
                    } else {
                        var nextWp = _pathfindPath[_pathfindIndex];
                        if (!isPointUnderBulletThreat(nextWp.x, nextWp.y, 70, 36)) {
                            _pathfindAngle = Math.atan2(nextWp.y - tanks[0].y, nextWp.x - tanks[0].x);
                            _pathfindActive = true;
                            isMoving = true;
                        }
                    }
                }

                // === MOD: Smart aim is disabled while actively dodging ===
                var aimAngle;
                if (_dodgeActive) {
                    aimAngle = _dodgeAngle;
                } else if (_pathfindActive) {
                    aimAngle = _pathfindAngle;
                } else if (maze.cellsAcross) {
                    aimAngle = findSmartAimAngle(tanks[0].x, tanks[0].y, mouseWorldX, mouseWorldY, maze);
                } else {
                    aimAngle = Math.atan2(mouseToTankY, mouseToTankX);
                }

                var autoKillShot = null;
                if (autoKillEnabled && !_dodgeActive && maze.cellsAcross) {
                    var preferredTargetIds = null;
                    var avoidTargetIds = null;
                    var allowAutoKill = true;

                    if (allowAutoKill) {
                        autoKillShot = autoKillMod.findAutoKillShot({
                            localTank: tanks[0],
                            tanks: tanks,
                            maze: maze,
                            constants: constants,
                            physics: physics,
                            simulateBulletPath: smartAimMod.simulateBulletPath,
                            activeBulletPaths: _cachedBulletPaths,
                            bulletsSpawnedCount: bulletsSpawnedCount,
                            maxBullets: maxBullets,
                            tickNum: tickNum,
                            lastShotTick: lastShotTick,
                            preferredTargetIds: preferredTargetIds,
                            avoidTargetIds: avoidTargetIds,
                        });
                    }
                    if (autoKillShot) {
                        aimAngle = autoKillShot.angle;
                    }
                }
                var autoKillAiming = !!autoKillShot;

                // === MOD: Block shooting only when smart aim is active and invalid ===
                var effectiveClick = mouseClicked;
                if (!_dodgeActive && !_pathfindActive && smartAimEnabled && !smartAimValid && !autoKillShot) effectiveClick = false;
                if (autoKillShot) {
                    // Only fire once the local barrel is aligned with autokill angle.
                    var aligned = shortestAngleDiff(tanks[0].angle, autoKillShot.angle) < 0.14;
                    effectiveClick = aligned;
                    if (aligned && pathfindEnabled) {
                        // Briefly pause path following after a shot so aim/firing can complete cleanly.
                        _pathfindPauseUntilTick = tickNum + 6;
                        _pathfindActive = false;
                    }
                }

                // === MOD: When moving with ctrl and not shooting, use direct mouse angle ===
                var directAngle = Math.atan2(mouseToTankY, mouseToTankX);
                var sendAngle = _dodgeActive ? _dodgeAngle : (autoKillAiming ? aimAngle : (_pathfindActive ? _pathfindAngle : aimAngle));
                if (!_dodgeActive && !_pathfindActive && isMoving && !effectiveClick && !autoKillAiming) {
                    sendAngle = directAngle;
                }

                var networkInput = {
                    targetAngle: sendAngle,
                    moveForward: isMoving,
                    mouseClicked: effectiveClick,
                    tickNum: tickNum,
                };

                var moveTargetX = Math.cos(sendAngle) * 100;
                var moveTargetY = Math.sin(sendAngle) * 100;

                var movementInput = {
                    targetX: moveTargetX,
                    targetY: moveTargetY,
                    moveForward: (_dodgeActive || _pathfindActive) ? true : isMoving,
                    tickNum: tickNum,
                };

                var shootInput = {
                    mouseClicked: effectiveClick,
                    tickNum: tickNum,
                };

                var binaryData = networkProtocol.userInputToBinaryData(networkInput);
                socket.sendBinary(networkProtocol.tankInputToServer, binaryData);
                movementInputBuffer.push(movementInput);
                shootInputBuffer.push(shootInput);
                tickNum++;
            })();

            var latestMove = movementInputBuffer.length > 0 ? movementInputBuffer[movementInputBuffer.length - 1] : null;

            applyMovementInputs(dt, [{
                targetX: latestMove ? latestMove.targetX : mouseToTankX,
                targetY: latestMove ? latestMove.targetY : mouseToTankY,
                moveForward: latestMove ? latestMove.moveForward : isMoving,
            }]);

            applyShootInputs(dt, [{
                mouseClicked: (shootInputBuffer.length > 0 ? shootInputBuffer[shootInputBuffer.length - 1].mouseClicked : mouseClicked),
                tickNum: tickNum - 1,
            }]);
        }

        mouseClicked = false;
    }

    var hasShownDisconnect = false;

    function gameLoop(timestamp) {
        renderFrame(timestamp);

        if (movementInputBuffer.length > 1500 && !hasShownDisconnect) {
            alert("Unable to reconnect to the server, you are being redirected to the homepage.");
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

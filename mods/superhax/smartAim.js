
module.exports.simulateBulletPath = function (constants, startX, startY, angle, mazeData, maxSteps) {
    var bulletSpeed = constants.TANK_MAX_SPEED * 1.2;
    var dt = constants.PHYSICS_INTERVAL;
    var bx = startX, by = startY;
    var vx = Math.cos(angle) * bulletSpeed;
    var vy = Math.sin(angle) * bulletSpeed;
    var path = [];

    for (var step = 0; step < maxSteps; step++) {
        bx += vx * dt;
        by += vy * dt;

        var bounced = false;
        if (bx + 9 > mazeData.worldWidth) { bx = mazeData.worldWidth - 9; vx *= -1; bounced = true; }
        else if (bx - 9 < 0) { bx = 9; vx *= -1; bounced = true; }
        if (by + 9 > mazeData.worldHeight) { by = mazeData.worldHeight - 9; vy *= -1; bounced = true; }
        else if (by - 9 < 0) { by = 9; vy *= -1; bounced = true; }

        if (!bounced && mazeData.cellsAcross) {
            var cellX = Math.floor(bx / 100);
            var cellY = Math.floor(by / 100);
            var modX = bx % 100, modY = by % 100;
            var nearL = modX < 9, nearR = modX > 91, nearT = modY < 9, nearB = modY > 91;

            if (nearT && nearL && 1 == mazeData.wallCorners[cellY * (mazeData.cellsAcross + 1) + cellX]) {
                if (vx * (modY - 9) - vy * (modX - 9) < 0) { vy *= -1; by = 100 * cellY + 9; }
                else { vx *= -1; bx = 100 * cellX + 9; }
            } else if (nearT && nearR && 1 == mazeData.wallCorners[cellY * (mazeData.cellsAcross + 1) + (cellX + 1)]) {
                if (vx * (modY - 9) - vy * (modX - 91) > 0) { vy *= -1; by = 100 * cellY + 9; }
                else { vx *= -1; bx = 100 * cellX + 91; }
            } else if (nearB && nearL && 1 == mazeData.wallCorners[(cellY + 1) * (mazeData.cellsAcross + 1) + cellX]) {
                if (vx * (modY - 91) - vy * (modX - 9) > 0) { vy *= -1; by = 100 * cellY + 91; }
                else { vx *= -1; bx = 100 * cellX + 9; }
            } else if (nearB && nearR && 1 == mazeData.wallCorners[(cellY + 1) * (mazeData.cellsAcross + 1) + (cellX + 1)]) {
                if (vx * (modY - 91) - vy * (modX - 91) < 0) { vy *= -1; by = 100 * cellY + 91; }
                else { vx *= -1; bx = 100 * cellX + 91; }
            } else if (nearB && 1 == mazeData.horisontalWalls[(cellY + 1) * mazeData.cellsAcross + cellX]) {
                vy *= -1; by = 100 * cellY + 91;
            } else if (nearT && 1 == mazeData.horisontalWalls[cellY * mazeData.cellsAcross + cellX]) {
                vy *= -1; by = 100 * cellY + 9;
            } else if (nearL && 1 == mazeData.verticalWalls[cellY * (mazeData.cellsAcross + 1) + cellX]) {
                vx *= -1; bx = 100 * cellX + 9;
            } else if (nearR && 1 == mazeData.verticalWalls[cellY * (mazeData.cellsAcross + 1) + (cellX + 1)]) {
                vx *= -1; bx = 100 * cellX + 91;
            }
        }

        path.push({ x: bx, y: by, vx: vx, vy: vy, step: step });
    }
    return path;
};

module.exports.findSmartAimAngle = function (args) {
    if (!args.smartAimEnabled) {
        var directAngle = Math.atan2(args.targetY - args.tankY, args.targetX - args.tankX);
        return { angle: directAngle, valid: true, path: null };
    }

    var constants = args.constants;
    var mazeData = args.mazeData;
    var physics = args.physics;
    var playerTank = args.playerTank;

    var TTL_STEPS = Math.ceil(9000 / constants.PHYSICS_INTERVAL);
    var ANGLE_SAMPLES = 360 * 2;
    var MIN_SAFE_DIST_SQ = 40 * 40;
    var SAFE_CHECK_START = 30;
    var TARGET_DIST_SQ = 25 * 25;
    var SAFETY_TAIL = 120;
    var bulletSpeed = constants.TANK_MAX_SPEED * 1.2;
    var dt = constants.PHYSICS_INTERVAL;
    var bestAngle = Math.atan2(args.targetY - args.tankY, args.targetX - args.tankX);
    var bestScore = Infinity;

    var cellsAcross = mazeData.cellsAcross;
    var vertWalls = mazeData.verticalWalls;
    var horzWalls = mazeData.horisontalWalls;
    var corners = mazeData.wallCorners;
    var ww = mazeData.worldWidth;
    var wh = mazeData.worldHeight;
    var cw = cellsAcross ? cellsAcross + 1 : 0;

    for (var i = 0; i < ANGLE_SAMPLES; i++) {
        var angle = (i / ANGLE_SAMPLES) * 2 * Math.PI - Math.PI;
        var cosA = Math.cos(angle), sinA = Math.sin(angle);
        var spawnX = args.tankX + 40 * cosA;
        var spawnY = args.tankY + 40 * sinA;

        if (!physics.canBulletBeSpawned(playerTank, spawnX, spawnY, mazeData)) continue;

        var bx = spawnX, by = spawnY;
        var vx = cosA * bulletSpeed, vy = sinA * bulletSpeed;
        var hitStep = -1;
        var safe = true;
        var maxStep = TTL_STEPS;

        for (var step = 0; step < maxStep; step++) {
            bx += vx * dt;
            by += vy * dt;

            var bounced = false;
            if (bx + 9 > ww) { bx = ww - 9; vx *= -1; bounced = true; }
            else if (bx - 9 < 0) { bx = 9; vx *= -1; bounced = true; }
            if (by + 9 > wh) { by = wh - 9; vy *= -1; bounced = true; }
            else if (by - 9 < 0) { by = 9; vy *= -1; bounced = true; }

            if (!bounced && cellsAcross) {
                var cellX = (bx / 100) | 0;
                var cellY = (by / 100) | 0;
                var modX = bx - 100 * cellX, modY = by - 100 * cellY;
                var nearL = modX < 9, nearR = modX > 91, nearT = modY < 9, nearB = modY > 91;
                var cRow = cellY * cw;
                if (nearT && nearL && 1 == corners[cRow + cellX]) {
                    if (vx * (modY - 9) - vy * (modX - 9) < 0) { vy *= -1; by = 100 * cellY + 9; }
                    else { vx *= -1; bx = 100 * cellX + 9; }
                } else if (nearT && nearR && 1 == corners[cRow + cellX + 1]) {
                    if (vx * (modY - 9) - vy * (modX - 91) > 0) { vy *= -1; by = 100 * cellY + 9; }
                    else { vx *= -1; bx = 100 * cellX + 91; }
                } else if (nearB && nearL && 1 == corners[cRow + cw + cellX]) {
                    if (vx * (modY - 91) - vy * (modX - 9) > 0) { vy *= -1; by = 100 * cellY + 91; }
                    else { vx *= -1; bx = 100 * cellX + 9; }
                } else if (nearB && nearR && 1 == corners[cRow + cw + cellX + 1]) {
                    if (vx * (modY - 91) - vy * (modX - 91) < 0) { vy *= -1; by = 100 * cellY + 91; }
                    else { vx *= -1; bx = 100 * cellX + 91; }
                } else if (nearB && 1 == horzWalls[(cellY + 1) * cellsAcross + cellX]) {
                    vy *= -1; by = 100 * cellY + 91;
                } else if (nearT && 1 == horzWalls[cellY * cellsAcross + cellX]) {
                    vy *= -1; by = 100 * cellY + 9;
                } else if (nearL && 1 == vertWalls[cRow + cellX]) {
                    vx *= -1; bx = 100 * cellX + 9;
                } else if (nearR && 1 == vertWalls[cRow + cellX + 1]) {
                    vx *= -1; bx = 100 * cellX + 91;
                }
            }

            if (cellsAcross) {
                var cx = (bx / 100) | 0, cy = (by / 100) | 0;
                for (var cyi = cy; cyi <= cy + 1; cyi++) {
                    for (var cxi = cx; cxi <= cx + 1; cxi++) {
                        if (cyi >= 0 && cyi <= cellsAcross && cxi >= 0 && cxi <= cellsAcross && 1 == corners[cyi * cw + cxi]) {
                            var cornerX = 100 * cxi, cornerY = 100 * cyi;
                            var cdx = bx - cornerX, cdy = by - cornerY;
                            if (cdx * cdx + cdy * cdy < 100) safe = false;
                        }
                    }
                    if (!safe) break;
                }
            }

            if (step > SAFE_CHECK_START) {
                var pdx = bx - args.tankX, pdy = by - args.tankY;
                if (pdx * pdx + pdy * pdy < MIN_SAFE_DIST_SQ) {
                    safe = false;
                    break;
                }
            }

            if (hitStep < 0) {
                var tdx = bx - args.targetX, tdy = by - args.targetY;
                if (tdx * tdx + tdy * tdy < TARGET_DIST_SQ) {
                    hitStep = step;
                    maxStep = Math.min(TTL_STEPS, step + SAFETY_TAIL);
                } else if (step >= bestScore) break;
            }
        }

        if (!safe || hitStep < 0 || hitStep >= bestScore) continue;
        bestScore = hitStep;
        bestAngle = angle;
    }

    if (bestScore < Infinity) {
        var bestPath = module.exports.simulateBulletPath(
            constants,
            args.tankX + 40 * Math.cos(bestAngle),
            args.tankY + 40 * Math.sin(bestAngle),
            bestAngle,
            mazeData,
            bestScore + 1
        );
        bestAngle = Math.round(bestAngle * 100) / 100;
        return { angle: bestAngle, valid: true, path: bestPath };
    }

    bestAngle = Math.round(bestAngle * 100) / 100;
    return { angle: bestAngle, valid: false, path: null };
};

module.exports.drawSmartAimPreview = function (ctx, cam, tankX, tankY, angle, path) {
    if (!path || !path.length) return;
    ctx.save();
    ctx.lineWidth = 2;
    ctx.setLineDash([6, 4]);
    ctx.beginPath();
    var startX = tankX + 40 * Math.cos(angle);
    var startY = tankY + 40 * Math.sin(angle);
    ctx.moveTo(startX - cam.camLeft, startY - cam.camTop);
    for (var i = 0; i < path.length; i++) {
        ctx.lineTo(path[i].x - cam.camLeft, path[i].y - cam.camTop);
    }
    ctx.strokeStyle = "rgba(0, 200, 255, 0.5)";
    ctx.stroke();
    var last = path[path.length - 1];
    ctx.beginPath();
    ctx.arc(last.x - cam.camLeft, last.y - cam.camTop, 5, 0, 2 * Math.PI);
    ctx.fillStyle = "rgba(0, 200, 255, 0.7)";
    ctx.fill();
    ctx.setLineDash([]);
    ctx.restore();
};

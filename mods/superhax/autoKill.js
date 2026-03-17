
var _laneShotMemory = {};
var _latestRankedPaths = [];

module.exports.findAutoKillShot = function (args) {
    var localTank = args.localTank;
    var tanks = args.tanks;
    var maze = args.maze;
    var constants = args.constants;
    var physics = args.physics;
    var simulateBulletPath = args.simulateBulletPath;
    var activeBulletPaths = args.activeBulletPaths || [];
    var bulletsSpawnedCount = args.bulletsSpawnedCount;
    var maxBullets = args.maxBullets;
    var tickNum = args.tickNum;
    var lastShotTick = args.lastShotTick;
    var preferredTargetIds = args.preferredTargetIds || null;
    var avoidTargetIds = args.avoidTargetIds || null;

    var preferredTargetMap = null;
    var avoidTargetMap = null;
    if (preferredTargetIds && preferredTargetIds.length) {
        preferredTargetMap = Object.create(null);
        for (var pmi = 0; pmi < preferredTargetIds.length; pmi++) {
            preferredTargetMap[preferredTargetIds[pmi]] = true;
        }
    }
    if (avoidTargetIds && avoidTargetIds.length) {
        avoidTargetMap = Object.create(null);
        for (var ami = 0; ami < avoidTargetIds.length; ami++) {
            avoidTargetMap[avoidTargetIds[ami]] = true;
        }
    }

    _latestRankedPaths = [];

    if (!localTank || !tanks || tanks.length < 2 || !maze || !maze.cellsAcross) return null;
    if (bulletsSpawnedCount >= maxBullets) return null;
    if (tickNum - lastShotTick <= 1) return null;

    var dt = constants.PHYSICS_INTERVAL;
    var ttlSteps = Math.ceil(9000 / dt);
    var quant = (2 * Math.PI) / 720;
    var DIR8 = [
        { c: 1, s: 0 },
        { c: 0.7071067811865476, s: 0.7071067811865476 },
        { c: 0, s: 1 },
        { c: -0.7071067811865476, s: 0.7071067811865476 },
        { c: -1, s: 0 },
        { c: -0.7071067811865476, s: -0.7071067811865476 },
        { c: 0, s: -1 },
        { c: 0.7071067811865476, s: -0.7071067811865476 },
    ];

    function normAngle(a) {
        while (a <= -Math.PI) a += 2 * Math.PI;
        while (a > Math.PI) a -= 2 * Math.PI;
        return a;
    }

    function pointBlocked(px, py, radius) {
        if (px - radius < 0 || py - radius < 0 || px + radius > maze.worldWidth || py + radius > maze.worldHeight) return true;

        var cellX = Math.floor(px / 100);
        var cellY = Math.floor(py / 100);
        var modX = px - 100 * cellX;
        var modY = py - 100 * cellY;
        var across = maze.cellsAcross;

        if (modX < radius && 1 == maze.verticalWalls[cellY * (across + 1) + cellX]) return true;
        if (modX > 100 - radius && 1 == maze.verticalWalls[cellY * (across + 1) + (cellX + 1)]) return true;
        if (modY < radius && 1 == maze.horisontalWalls[cellY * across + cellX]) return true;
        if (modY > 100 - radius && 1 == maze.horisontalWalls[(cellY + 1) * across + cellX]) return true;

        if (modX < radius && modY < radius && 1 == maze.wallCorners[cellY * (across + 1) + cellX]) return true;
        if (modX > 100 - radius && modY < radius && 1 == maze.wallCorners[cellY * (across + 1) + (cellX + 1)]) return true;
        if (modX < radius && modY > 100 - radius && 1 == maze.wallCorners[(cellY + 1) * (across + 1) + cellX]) return true;
        if (modX > 100 - radius && modY > 100 - radius && 1 == maze.wallCorners[(cellY + 1) * (across + 1) + (cellX + 1)]) return true;

        return false;
    }

    function hasLineOfSight(ax, ay, bx, by) {
        var dx = bx - ax;
        var dy = by - ay;
        var dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 1) return true;
        var step = 18;
        var steps = Math.ceil(dist / step);
        for (var i = 1; i <= steps; i++) {
            var t = i / steps;
            var px = ax + dx * t;
            var py = ay + dy * t;
            if (pointBlocked(px, py, 7)) return false;
        }
        return true;
    }

    function localOpenAreaScore(px, py) {
        var maxProbe = 260;
        var step = 26;
        var sum = 0;
        var dirs = DIR8.length;
        for (var i = 0; i < dirs; i++) {
            var dc = DIR8[i].c;
            var ds = DIR8[i].s;
            var reached = 0;
            for (var d = step; d <= maxProbe; d += step) {
                var qx = px + dc * d;
                var qy = py + ds * d;
                if (pointBlocked(qx, qy, 22)) break;
                reached = d;
            }
            sum += reached / maxProbe;
        }
        return sum / dirs;
    }

    function sameCorridor(a, b) {
        var ax = Math.floor(a.x / 100);
        var ay = Math.floor(a.y / 100);
        var bx = Math.floor(b.x / 100);
        var by = Math.floor(b.y / 100);
        if (ax === bx || ay === by) {
            return hasLineOfSight(a.x, a.y, b.x, b.y);
        }
        return false;
    }

    function corridorNetworkDepth(px, py) {
        var dirs = DIR8.length;
        var freeDirs = 0;
        for (var i = 0; i < dirs; i++) {
            var qx = px + DIR8[i].c * 90;
            var qy = py + DIR8[i].s * 90;
            if (!pointBlocked(qx, qy, 20)) freeDirs++;
        }
        return freeDirs / dirs;
    }

    function chooseTarget() {
        var best = null;
        var bestScore = -1e12;
        for (var i = 0; i < tanks.length; i++) {
            var enemy = tanks[i];
            if (!enemy || enemy.ID === localTank.ID || enemy.beenHit) continue;

            if (avoidTargetMap && avoidTargetMap[enemy.ID]) continue;

            var dx = enemy.x - localTank.x;
            var dy = enemy.y - localTank.y;
            var d = Math.sqrt(dx * dx + dy * dy);

            var threat = 0;
            if (d < 500) threat += 200;
            if (hasLineOfSight(localTank.x, localTank.y, enemy.x, enemy.y)) threat += 100;
            if (sameCorridor(localTank, enemy)) threat += 60;

            var openArea = localOpenAreaScore(enemy.x, enemy.y);
            var corridorCentrality = openArea;
            var exposure = corridorCentrality * 40 + openArea * 20;

            var bounceOpportunity = corridorNetworkDepth(enemy.x, enemy.y) * 15;
            var distanceScore = 40 / (1 + d * 0.002);

            var score = threat + exposure + bounceOpportunity + distanceScore;
            if (preferredTargetMap && preferredTargetMap[enemy.ID]) score += 800;
            if (score > bestScore) {
                bestScore = score;
                best = enemy;
            }
        }
        return best;
    }

    function quantizeAngle(a) {
        return normAngle(Math.round(a / quant) * quant);
    }

    function generateCandidateAngles(target) {
        var out = [];
        var seen = {};

        function pushAngle(a) {
            a = quantizeAngle(a);
            var key = Math.round((a + Math.PI) * 10000);
            if (!seen[key]) {
                seen[key] = true;
                out.push(a);
            }
        }

        var base = Math.atan2(target.y - localTank.y, target.x - localTank.x);
        pushAngle(base);
        pushAngle(base + 0.35);
        pushAngle(base - 0.35);
        pushAngle(base + 0.7);
        pushAngle(base - 0.7);

        var stride = 6;
        for (var i = 0; i < 720; i += stride) {
            pushAngle((i / 720) * 2 * Math.PI - Math.PI);
        }

        return out;
    }

    function estimateBounceCount(path) {
        var bounces = 0;
        var len = path.length;
        for (var i = 1; i < len; i++) {
            var pv = path[i - 1];
            var cv = path[i];
            if ((pv.vx > 0 && cv.vx < 0) || (pv.vx < 0 && cv.vx > 0)) bounces++;
            if ((pv.vy > 0 && cv.vy < 0) || (pv.vy < 0 && cv.vy > 0)) bounces++;
        }
        return bounces;
    }

    function pathCoverage(path) {
        var seenCells = {};
        var count = 0;
        var len = path.length;
        for (var i = 0; i < len; i += 6) {
            var cx = Math.floor(path[i].x / 100);
            var cy = Math.floor(path[i].y / 100);
            var key = cx + ":" + cy;
            if (!seenCells[key]) {
                seenCells[key] = true;
                count++;
            }
        }
        return count;
    }

    function pathSimilarity(pathA, pathB) {
        var len = Math.min(pathA.length, pathB.length);
        if (len < 20) return 0;
        var close = 0;
        var total = 0;
        for (var i = 0; i < len; i += 8) {
            var dx = pathA[i].x - pathB[i].x;
            var dy = pathA[i].y - pathB[i].y;
            if (dx * dx + dy * dy < 52 * 52) close++;
            total++;
        }
        if (total === 0) return 0;
        return close / total;
    }

    function similarActiveStats(path) {
        var best = 0;
        var count = 0;
        var len = activeBulletPaths.length;
        for (var i = 0; i < len; i++) {
            var other = activeBulletPaths[i] && activeBulletPaths[i].path;
            if (!other || other.length < 5) continue;
            var sim = pathSimilarity(path, other);
            if (sim > best) best = sim;
            if (sim >= 0.82) count++;
        }
        return { best: best, count: count };
    }

    function makeLaneKey(targetId, angle) {
        var bins = 48;
        var idx = Math.round(((normAngle(angle) + Math.PI) / (2 * Math.PI)) * bins);
        return targetId + ":" + idx;
    }

    function recentLaneCount(key, nowTick, windowTicks) {
        var arr = _laneShotMemory[key];
        if (!arr || arr.length === 0) return 0;
        var kept = [];
        var len = arr.length;
        for (var i = 0; i < len; i++) {
            if (nowTick - arr[i] <= windowTicks) kept.push(arr[i]);
        }
        _laneShotMemory[key] = kept;
        return kept.length;
    }

    function rememberLaneShot(key, nowTick) {
        if (!_laneShotMemory[key]) _laneShotMemory[key] = [];
        _laneShotMemory[key].push(nowTick);
    }

    function isSelfUnsafe(path) {
        // Reject paths that can rebound into the shooter's area.
        var nearStart = 16;
        var nearDist2 = 62 * 62;
        var reboundStart = 60;
        var reboundDist2 = 84 * 84;
        var maxCheck = Math.min(path.length, 320);
        for (var i = nearStart; i < maxCheck; i++) {
            var dx = path[i].x - localTank.x;
            var dy = path[i].y - localTank.y;
            var d2 = dx * dx + dy * dy;
            if (d2 < nearDist2) return true;
            if (i >= reboundStart && d2 < reboundDist2) return true;
        }
        return false;
    }

    function getTargetPredictor(target) {
        var dx = localTank.x - target.x;
        var dy = localTank.y - target.y;
        var dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 0.0001) {
            return {
                tx: target.x,
                ty: target.y,
                dist: 0,
                ux: 0,
                uy: 0,
                approachPerStep: constants.TANK_MAX_SPEED * dt,
                fixed: true,
            };
        }
        return {
            tx: target.x,
            ty: target.y,
            dist: dist,
            ux: dx / dist,
            uy: dy / dist,
            approachPerStep: constants.TANK_MAX_SPEED * dt,
            fixed: false,
        };
    }

    function evaluatePath(path, predictor) {
        var hitRadius = 26;
        var hitRadiusSq = hitRadius * hitRadius;
        var nearRadius = 180;
        var nearRadiusSq = nearRadius * nearRadius;
        var score = 0;
        var bestStep = Infinity;
        var pathLen = path.length;

        for (var step = 0; step < pathLen; step += 2) {
            var bx = path[step].x;
            var by = path[step].y;
            var predX = predictor.tx;
            var predY = predictor.ty;
            if (!predictor.fixed) {
                var move = Math.min(predictor.dist, step * predictor.approachPerStep);
                predX += predictor.ux * move;
                predY += predictor.uy * move;
            }
            var dx = bx - predX;
            var dy = by - predY;
            var dist2 = dx * dx + dy * dy;
            var decay = 1 / (1 + step * 0.03);

            if (dist2 < nearRadiusSq) {
                var d = Math.sqrt(dist2);
                // Bounded proximity reward for tactical pressure lanes.
                score += Math.max(0, (nearRadius - d) / nearRadius) * decay * 3.5;
            }

            if (dist2 < hitRadiusSq) {
                // Reward true hit windows, weighted to earlier arrival.
                score += 14 * decay;
                if (step < bestStep) bestStep = step;
            }
        }

        if (score < 0) score = 0;
        return { score: score, earliestHit: bestStep };
    }

    function minPathDistSqToTarget(path, predictor) {
        var best = Infinity;
        var pathLen = path.length;
        for (var i = 0; i < pathLen; i += 3) {
            var predX = predictor.tx;
            var predY = predictor.ty;
            if (!predictor.fixed) {
                var move = Math.min(predictor.dist, i * predictor.approachPerStep);
                predX += predictor.ux * move;
                predY += predictor.uy * move;
            }
            var dx = path[i].x - predX;
            var dy = path[i].y - predY;
            var d2 = dx * dx + dy * dy;
            if (d2 < best) best = d2;
        }
        return best;
    }

    var target = chooseTarget();
    if (!target) return null;

    var targetDx = target.x - localTank.x;
    var targetDy = target.y - localTank.y;
    var targetDist = Math.sqrt(targetDx * targetDx + targetDy * targetDy);
    var nearbyThreat = targetDist < 500;
    var pointBlankThreat = targetDist < 100;
    var availableBalls = Math.max(0, maxBullets - bulletsSpawnedCount);

    // Tactical cadence: adapt with available ammo and urgency.
    var minShotInterval;
    if (pointBlankThreat) {
        minShotInterval = availableBalls >= 5 ? 2 : 3;
    } else if (nearbyThreat) {
        minShotInterval = availableBalls >= 6 ? 7 : (availableBalls >= 3 ? 11 : 14);
    } else {
        minShotInterval = availableBalls >= 6 ? 18 : 26;
    }
    if (tickNum - lastShotTick <= minShotInterval) return null;

    var defensiveBudget = maxBullets <= 3 ? 1 : (maxBullets <= 6 ? 2 : 3);
    var pressureBudget = maxBullets - defensiveBudget;
    var shouldPreferDefensive = nearbyThreat || bulletsSpawnedCount >= pressureBudget;
    if (pointBlankThreat) shouldPreferDefensive = true;

    // Repeated-lane allowance scales with currently available balls.
    var maxSameLaneShots;
    if (pointBlankThreat) {
        maxSameLaneShots = Math.min(4, Math.max(2, Math.ceil(availableBalls * 0.5)));
    } else if (nearbyThreat) {
        maxSameLaneShots = Math.min(3, Math.max(1, Math.ceil(availableBalls * 0.45)));
    } else {
        maxSameLaneShots = 1;
    }

    var angles = generateCandidateAngles(target);
    var targetPredictor = getTargetPredictor(target);
    var best = null;
    var scoredCandidates = [];

    for (var i = 0; i < angles.length; i++) {
        var angle = angles[i];
        var ca = Math.cos(angle);
        var sa = Math.sin(angle);
        var spawnX = localTank.x + 40 * ca;
        var spawnY = localTank.y + 40 * sa;
        if (!physics.canBulletBeSpawned(localTank, spawnX, spawnY, maze)) continue;

        var path = simulateBulletPath(constants, spawnX, spawnY, angle, maze, ttlSteps);
        if (!path || path.length < 30) continue;
        if (isSelfUnsafe(path)) continue;

        var evalHit = evaluatePath(path, targetPredictor);
        var minTargetD2 = minPathDistSqToTarget(path, targetPredictor);
        var minTargetD = Math.sqrt(minTargetD2);
        var pressureNearScore = Math.max(0, 1 - minTargetD / 820);
        if (evalHit.score <= 0 && pressureNearScore < 0.32) continue;

        var bounceCount = estimateBounceCount(path);
        var coverage = pathCoverage(path);
        var simStats = similarActiveStats(path);
        var similarity = simStats.best;
        var similarActiveCount = simStats.count;
        if (!pointBlankThreat) {
            if (similarActiveCount >= 3) continue;
            if (similarity > 0.90 && similarActiveCount >= 1) continue;
        } else {
            // In point-blank fights allow small stacking, but still avoid hard spam.
            if (similarActiveCount >= maxSameLaneShots + 1) continue;
        }

        var score = evalHit.score * 110 + pressureNearScore * 95;
        if (shouldPreferDefensive) {
            if (evalHit.earliestHit < Infinity) score += Math.max(0, 240 - evalHit.earliestHit * 2.2);
            score += Math.max(0, 8 - bounceCount) * 8;
        } else {
            // Tactical pressure: value coverage, staggered timing, and non-trivial ricochets.
            var arrival = evalHit.earliestHit === Infinity ? 160 : evalHit.earliestHit;
            score += coverage * 12;
            score += Math.min(120, bounceCount * 5);
            score += Math.max(0, 140 - Math.abs(95 - arrival));
            if (arrival < 35) score -= 80;
        }

        score += (1 - similarity) * 110;
        score -= similarActiveCount * 125;

        scoredCandidates.push({
            score: score,
            angle: angle,
            path: path,
        });

        if (!best || score > best.score) {
            best = {
                angle: angle,
                score: score,
                targetId: target.ID,
                path: path,
                similarActiveCount: similarActiveCount,
            };
        }
    }

    scoredCandidates.sort(function (a, b) { return b.score - a.score; });
    _latestRankedPaths = scoredCandidates.slice(0, 20);

    // DONT REMOVE
    if (best) console.log(best.score)

    if (!best || best.score < 55) {
        // Fallback direct shot only when threat is nearby.
        if (!nearbyThreat) return null;
        var directAngle = quantizeAngle(Math.atan2(target.y - localTank.y, target.x - localTank.x));
        var sx = localTank.x + 40 * Math.cos(directAngle);
        var sy = localTank.y + 40 * Math.sin(directAngle);
        if (physics.canBulletBeSpawned(localTank, sx, sy, maze) && hasLineOfSight(localTank.x, localTank.y, target.x, target.y)) {
            var directKey = makeLaneKey(target.ID, directAngle);
            var directRecent = recentLaneCount(directKey, tickNum, 160);
            if (directRecent >= maxSameLaneShots && !pointBlankThreat) return null;
            rememberLaneShot(directKey, tickNum);
            return {
                angle: Math.round(directAngle * 1000) / 1000,
                score: 90,
                targetId: target.ID,
                path: null,
            };
        }
        return null;
    }

    var laneKey = makeLaneKey(best.targetId, best.angle);
    var recentSameLane = recentLaneCount(laneKey, tickNum, 160);
    var highConfidence = best.score >= 1200 || (best.score >= 700 && pointBlankThreat);
    if (recentSameLane >= maxSameLaneShots && !highConfidence) return null;
    if (recentSameLane > 0) {
        var repeatCooldown = pointBlankThreat ? (2 + recentSameLane * 2) : ((nearbyThreat ? 10 : 20) + recentSameLane * 10);
        if (tickNum - lastShotTick <= repeatCooldown && !highConfidence) return null;
    }
    rememberLaneShot(laneKey, tickNum);

    return {
        angle: Math.round(best.angle * 1000) / 1000,
        score: best.score,
        targetId: best.targetId,
        path: best.path,
    };
};

module.exports.getTopRankedPaths = function () {
    return _latestRankedPaths;
};

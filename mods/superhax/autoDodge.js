
var _latestRankedDodgePaths = [];

module.exports.findDodgeAction = function (tankX, tankY, mazeData, cachedBulletPaths, constants) {
    var TANK_R = 20;
    var HIT_DIST_SQ = 38 * 38;
    var STEP_DX = constants.TANK_MAX_SPEED * constants.PHYSICS_INTERVAL;
    var HORIZON = 60*2;       // favor longer-term survival (2 seconds)
    var BEAM_WIDTH = 36;      // tuned down for lower CPU cost
    var BRANCH = 10;
    var SEG_LEN = 4;
    var SAMPLE_ANGLES = 72;

    function normAngle(a) {
        while (a <= -Math.PI) a += 2 * Math.PI;
        while (a > Math.PI) a -= 2 * Math.PI;
        return a;
    }

    function angleDiff(a, b) {
        return Math.abs(normAngle(a - b));
    }

    function isTankBlockedAt(px, py) {
        if (!mazeData.cellsAcross) return false;
        var cellX = Math.floor(px / 100);
        var cellY = Math.floor(py / 100);
        var modX = px - 100 * cellX;
        var modY = py - 100 * cellY;
        if (modX < TANK_R && 1 == mazeData.verticalWalls[cellY * (mazeData.cellsAcross + 1) + cellX]) return true;
        if (modX > 100 - TANK_R && 1 == mazeData.verticalWalls[cellY * (mazeData.cellsAcross + 1) + (cellX + 1)]) return true;
        if (modY < TANK_R && 1 == mazeData.horisontalWalls[cellY * mazeData.cellsAcross + cellX]) return true;
        if (modY > 100 - TANK_R && 1 == mazeData.horisontalWalls[(cellY + 1) * mazeData.cellsAcross + cellX]) return true;
        if (modX < TANK_R && modY < TANK_R && 1 == mazeData.wallCorners[cellY * (mazeData.cellsAcross + 1) + cellX]) return true;
        if (modX > 100 - TANK_R && modY < TANK_R && 1 == mazeData.wallCorners[cellY * (mazeData.cellsAcross + 1) + (cellX + 1)]) return true;
        if (modX < TANK_R && modY > 100 - TANK_R && 1 == mazeData.wallCorners[(cellY + 1) * (mazeData.cellsAcross + 1) + cellX]) return true;
        if (modX > 100 - TANK_R && modY > 100 - TANK_R && 1 == mazeData.wallCorners[(cellY + 1) * (mazeData.cellsAcross + 1) + (cellX + 1)]) return true;
        if (px - TANK_R < 0 || py - TANK_R < 0 || px + TANK_R > mazeData.worldWidth || py + TANK_R > mazeData.worldHeight) return true;
        return false;
    }

    function advanceWithCollision(px, py, angle) {
        var subSteps = 4;
        var stepLen = STEP_DX / subSteps;
        var c = Math.cos(angle), s = Math.sin(angle);
        for (var i = 0; i < subSteps; i++) {
            var nx = px + c * stepLen;
            var ny = py + s * stepLen;
            if (isTankBlockedAt(nx, ny)) {
                return { x: px, y: py, blocked: true };
            }
            px = nx;
            py = ny;
        }
        return { x: px, y: py, blocked: false };
    }

    function bulletAtStep(entry, s) {
        var p = entry.path;
        if (p.length === 0) return null;
        if (s < p.length) return p[s];
        return p[p.length - 1];
    }

    function bulletVelAtStep(entry, s) {
        var p = entry.path;
        if (!p || p.length === 0) return { vx: 0, vy: 0 };
        if (s + 1 < p.length) {
            return { vx: p[s + 1].x - p[s].x, vy: p[s + 1].y - p[s].y };
        }
        if (p.length >= 2) {
            return { vx: p[p.length - 1].x - p[p.length - 2].x, vy: p[p.length - 1].y - p[p.length - 2].y };
        }
        return { vx: 0, vy: 0 };
    }

    function isBulletClosing(entry, step, tx, ty) {
        var bp = bulletAtStep(entry, step);
        if (!bp) return false;
        var v = bulletVelAtStep(entry, step);
        var rx = tx - bp.x;
        var ry = ty - bp.y;
        return v.vx * rx + v.vy * ry > 0;
    }

    function isHitAt(tx, ty, step, entries) {
        var list = entries || cachedBulletPaths;
        for (var i = 0; i < list.length; i++) {
            if (list[i].ignoreForDodge) continue;
            var bp = bulletAtStep(list[i], step);
            if (!bp) continue;
            var dx = bp.x - tx, dy = bp.y - ty;
            if (dx * dx + dy * dy < HIT_DIST_SQ) return true;
        }
        return false;
    }

    function firstStillHitStep() {
        for (var s = 0; s < HORIZON; s++) {
            if (isHitAt(tankX, tankY, s)) return s;
        }
        return -1;
    }

    _latestRankedDodgePaths = [];

    // 1) predict bullet positions (already done in cachedBulletPaths)

    // If we're not projected to be hit while standing still, don't dodge.
    var stillHitStep = firstStillHitStep();
    if (stillHitStep < 0) return null;
    var mustMove = stillHitStep <= 30;

    // Increase planning precision when impact is imminent.
    if (stillHitStep <= 16) {
        BEAM_WIDTH = 48;
        BRANCH = 12;
        SEG_LEN = 3;
    } else if (stillHitStep <= 30) {
        BEAM_WIDTH = 42;
        BRANCH = 11;
    }

    // 2) compute forbidden angle intervals (velocity-obstacle style approximation)
    var forbidden = [];
    var repX = 0, repY = 0;
    var threatVx = 0, threatVy = 0;
    var hasThreat = false;
    var activeFlags = {};
    var activeEntries = [];
    for (var bi = 0; bi < cachedBulletPaths.length; bi++) {
        var entry = cachedBulletPaths[bi];
        if (entry.ignoreForDodge) continue;
        var path = entry.path;
        for (var s = 0; s < HORIZON && s < path.length; s += 2) {
            var bp = path[s];
            if (!isBulletClosing(entry, s, tankX, tankY)) continue;
            var dx = bp.x - tankX;
            var dy = bp.y - tankY;
            var d2 = dx * dx + dy * dy;
            var d = Math.sqrt(d2);
            if (d > 260) continue;
            hasThreat = true;
            if (!activeFlags[bi]) {
                activeFlags[bi] = true;
                activeEntries.push(entry);
            }

            // Potential field repulsion vector
            var w = 1 / Math.max(80, d2) * (HORIZON - s + 1);
            repX -= dx * w;
            repY -= dy * w;

            var bv = bulletVelAtStep(entry, s);
            var bvm = Math.sqrt(bv.vx * bv.vx + bv.vy * bv.vy);
            if (bvm > 0.0001) {
                var flowW = 1 / Math.max(120, d2) * (HORIZON - s + 1);
                threatVx += (bv.vx / bvm) * flowW;
                threatVy += (bv.vy / bvm) * flowW;
            }

            if (d < 1) continue;
            var radius = 44;
            var half = Math.asin(Math.min(0.98, radius / d));
            var center = Math.atan2(dy, dx);
            var widen = (HORIZON - s) / HORIZON * 0.22;
            forbidden.push({ a0: normAngle(center - half - widen), a1: normAngle(center + half + widen) });
        }
    }

    if (!hasThreat) {
        // If we already know standing still gets hit, still run search over all bullets.
        hasThreat = true;
    }
    var simEntries = activeEntries.length ? activeEntries : cachedBulletPaths;

    // 3) build safe angle list
    function inForbidden(a) {
        for (var i = 0; i < forbidden.length; i++) {
            var a0 = forbidden[i].a0;
            var a1 = forbidden[i].a1;
            if (a0 <= a1) {
                if (a >= a0 && a <= a1) return true;
            } else {
                if (a >= a0 || a <= a1) return true;
            }
        }
        return false;
    }

    var preferredAngle = Math.atan2(repY, repX);
    var threatMag = Math.sqrt(threatVx * threatVx + threatVy * threatVy);
    if (threatMag > 0.0001) {
        // Favor side-stepping bullet flow (perpendicular movement) over line-running.
        var perpA = Math.atan2(threatVy, threatVx) + Math.PI * 0.5;
        var perpB = perpA + Math.PI;
        var side = angleDiff(perpA, preferredAngle) <= angleDiff(perpB, preferredAngle) ? perpA : perpB;
        var px = repX + Math.cos(side) * threatMag * 0.9;
        var py = repY + Math.sin(side) * threatMag * 0.9;
        if (Math.abs(px) > 0.0001 || Math.abs(py) > 0.0001) {
            preferredAngle = Math.atan2(py, px);
        }
    }
    var allAngles = [];
    var safeAngles = [];
    allAngles.push(null); // explicit no-move candidate
    safeAngles.push(null);
    for (var ai = 0; ai < SAMPLE_ANGLES; ai++) {
        var a = (ai / SAMPLE_ANGLES) * 2 * Math.PI - Math.PI;
        allAngles.push(a);
        var adv0 = advanceWithCollision(tankX, tankY, a);
        if (!inForbidden(a) && !adv0.blocked) safeAngles.push(a);
    }
    if (safeAngles.length === 0) safeAngles = allAngles;

    safeAngles.sort(function (a, b) {
        if (a === null && b === null) return 0;
        if (a === null) return mustMove ? 1 : -1;
        if (b === null) return mustMove ? -1 : 1;
        return angleDiff(a, preferredAngle) - angleDiff(b, preferredAngle);
    });

    function simulateSegment(x, y, angle, fromStep, len) {
        var px = x, py = y;
        var blockedCount = 0;
        var movedDist = 0;
        if (angle === null) {
            for (var z = 0; z < len; z++) {
                var stepStill = fromStep + z;
                if (isHitAt(px, py, stepStill, simEntries)) {
                    return { x: px, y: py, hit: true, hitStep: stepStill, blockedCount: blockedCount, movedDist: movedDist };
                }
            }
            return { x: px, y: py, hit: false, hitStep: -1, blockedCount: blockedCount, movedDist: movedDist };
        }
        for (var i = 0; i < len; i++) {
            var oldX = px;
            var oldY = py;
            var adv = advanceWithCollision(px, py, angle);
            px = adv.x;
            py = adv.y;
            if (adv.blocked) blockedCount++;
            var mdx = px - oldX;
            var mdy = py - oldY;
            movedDist += Math.sqrt(mdx * mdx + mdy * mdy);
            var step = fromStep + i;
            if (isHitAt(px, py, step, simEntries)) {
                return { x: px, y: py, hit: true, hitStep: step, blockedCount: blockedCount, movedDist: movedDist };
            }
        }
        return { x: px, y: py, hit: false, hitStep: -1, blockedCount: blockedCount, movedDist: movedDist };
    }

    function minBulletDistSq(px, py, step) {
        var best = Infinity;
        for (var i = 0; i < simEntries.length; i++) {
            if (simEntries[i].ignoreForDodge) continue;
            var bp = bulletAtStep(simEntries[i], step);
            if (!bp) continue;
            var dx = bp.x - px, dy = bp.y - py;
            var d2 = dx * dx + dy * dy;
            if (d2 < best) best = d2;
        }
        return best;
    }

    var mobilityCache = {};
    function localMobility(px, py) {
        var qx = (px / 12) | 0;
        var qy = (py / 12) | 0;
        var key = qx + ":" + qy;
        if (mobilityCache[key] !== undefined) return mobilityCache[key];

        var free = 0;
        var dirs = 8;
        for (var i = 0; i < dirs; i++) {
            var a = (i / dirs) * 2 * Math.PI - Math.PI;
            var adv = advanceWithCollision(px, py, a);
            if (!adv.blocked) free++;
        }
        var m = free / dirs;
        mobilityCache[key] = m;
        return m;
    }

    function getBranchAngles(safe) {
        var source = safe;
        if (mustMove) {
            source = [];
            for (var si = 0; si < safe.length; si++) {
                if (safe[si] !== null) source.push(safe[si]);
            }
            if (source.length === 0) source = safe;
        }

        if (source.length <= BRANCH) return source.slice();
        var out = [];
        // keep best preferred candidate
        out.push(source[0]);
        // add evenly spaced candidates for diversity to avoid corner-lock behavior
        for (var i = 1; i < BRANCH; i++) {
            var idx = Math.floor((i * (source.length - 1)) / (BRANCH - 1));
            var a = source[idx];
            var duplicate = false;
            for (var j = 0; j < out.length; j++) {
                if (out[j] === a) { duplicate = true; break; }
            }
            if (!duplicate) out.push(a);
        }
        return out;
    }

    function lineFollowingPenalty(angle, px, py, step) {
        if (angle === null) return 0;
        var mvx = Math.cos(angle), mvy = Math.sin(angle);
        var penalty = 0;
        for (var i = 0; i < simEntries.length; i++) {
            var entry = simEntries[i];
            if (entry.ignoreForDodge) continue;
            var bp = bulletAtStep(entry, step);
            if (!bp) continue;
            if (!isBulletClosing(entry, step, px, py)) continue;

            var dx = bp.x - px, dy = bp.y - py;
            var d2 = dx * dx + dy * dy;
            if (d2 > 280 * 280) continue;

            var v = bulletVelAtStep(entry, step);
            var vm = Math.sqrt(v.vx * v.vx + v.vy * v.vy);
            if (vm < 0.0001) continue;
            var bvx = v.vx / vm, bvy = v.vy / vm;

            // Penalize moving along bullet line (both same and opposite directions)
            var parallel = Math.abs(mvx * bvx + mvy * bvy);
            var nearW = 1 / Math.max(120, d2);
            penalty += parallel * nearW * 22000;
        }
        return penalty;
    }

    function firstAngleSafety(angle) {
        if (angle === null) return 0;
        // Strong gate: if first move choice dies quickly, don't pick it.
        var seg = simulateSegment(tankX, tankY, angle, 0, 30);
        var safety = seg.hit ? seg.hitStep : 999;
        var startMobility = localMobility(tankX, tankY);
        var endMobility = localMobility(seg.x, seg.y);
        // Penalize openings that mostly press into walls and fail to create space.
        safety -= seg.blockedCount * (mustMove ? 22 : 4);
        if (seg.movedDist < STEP_DX * 8) safety -= (mustMove ? 36 : 10);
        if (mustMove && endMobility < startMobility - 0.12) safety -= 26;
        if (mustMove && endMobility < 0.26) safety -= 36;
        return safety;
    }

    // 4) simulate candidate trajectories (beam search 20–50 paths)
    var beam = [{ x: tankX, y: tankY, step: 0, score: 0, angles: [], path: [] }];
    var fallback = null;
    var branchAngles = getBranchAngles(safeAngles);

    while (beam.length > 0 && beam[0].step < HORIZON) {
        var next = [];
        for (var bi2 = 0; bi2 < beam.length; bi2++) {
            var node = beam[bi2];
            for (var k = 0; k < branchAngles.length; k++) {
                var a2 = branchAngles[k];
                var seg = simulateSegment(node.x, node.y, a2, node.step, SEG_LEN);
                if (seg.hit) {
                    // Keep best "doomed" option to maximize survival time if no fully safe path exists.
                    var fAngles = node.angles.slice();
                    fAngles.push(a2);
                    var fPath = node.path.slice();
                    fPath.push({ x: seg.x, y: seg.y });
                    var fScore = seg.hitStep * 100 + node.score;
                    if (!fallback || fScore > fallback.score) {
                        fallback = { score: fScore, angles: fAngles, path: fPath };
                    }
                    continue;
                }

                var newStep = node.step + SEG_LEN;
                var stepNow = Math.min(HORIZON - 1, newStep);
                var stepFuture = Math.min(HORIZON - 1, newStep + 12);
                var clearanceNow = minBulletDistSq(seg.x, seg.y, stepNow);
                var clearanceFuture = minBulletDistSq(seg.x, seg.y, stepFuture);
                var wallPenalty = 0;
                if (a2 !== null) {
                    var adv1 = advanceWithCollision(seg.x, seg.y, a2);
                    wallPenalty = adv1.blocked ? 500 : 0;
                }
                var linePenalty = lineFollowingPenalty(a2, seg.x, seg.y, stepNow);
                var mobility = localMobility(seg.x, seg.y);
                var deadEndPenalty = (1 - mobility) * 140;
                var mobilityBonus = mobility * 220;
                var stallPenalty = seg.blockedCount * 65;
                var turnPenalty = 0;
                if (a2 !== null && node.angles.length > 0) {
                    var prevA = node.angles[node.angles.length - 1];
                    if (prevA !== null) {
                        var turn = angleDiff(a2, prevA);
                        turnPenalty += turn * 24;
                        if (turn > 2.35) turnPenalty += 60;
                    }
                }
                if (a2 !== null && seg.movedDist < STEP_DX * (SEG_LEN * 0.45)) stallPenalty += 220;

                var lateralBonus = 0;
                if (a2 !== null && threatMag > 0.0001) {
                    var moveAx = Math.cos(a2), moveAy = Math.sin(a2);
                    var tvx = threatVx / threatMag, tvy = threatVy / threatMag;
                    var parallelFlow = Math.abs(moveAx * tvx + moveAy * tvy);
                    lateralBonus = (1 - parallelFlow) * 140;
                }

                var cornerRamPenalty = 0;
                if (mustMove && a2 !== null) {
                    if (node.step === 0 && seg.movedDist < STEP_DX * (SEG_LEN * 0.35)) cornerRamPenalty += 360;
                    if (seg.blockedCount >= Math.max(1, SEG_LEN - 2)) cornerRamPenalty += 420;
                }

                // If we're getting boxed in near walls while bullets remain close, strongly discourage this branch.
                var trapPenalty = 0;
                if (mobility < 0.42 && clearanceFuture < 220 * 220) {
                    trapPenalty += (0.42 - mobility) * 520;
                    if (seg.blockedCount > 0) trapPenalty += 180;
                }

                var nearDangerPenalty = 0;
                if (clearanceNow < 150 * 150) {
                    nearDangerPenalty += (150 * 150 - clearanceNow) * 0.0045;
                }
                if (clearanceFuture < 190 * 190) {
                    nearDangerPenalty += (190 * 190 - clearanceFuture) * 0.0025;
                }

                // Long-term weighted scoring: future clearance matters more than immediate.
                var longTermScore = Math.min(2400, clearanceFuture * 0.0014);
                var shortTermScore = Math.min(1200, clearanceNow * 0.0007);
                var progressScore = newStep * 2.2;
                var stillBonus = (a2 === null) ? (mustMove ? -180 : 6) : 0;
                var score = node.score + longTermScore + shortTermScore + progressScore + stillBonus + mobilityBonus + lateralBonus - wallPenalty - linePenalty - deadEndPenalty - stallPenalty - trapPenalty - cornerRamPenalty - nearDangerPenalty - turnPenalty;

                var angles2 = node.angles.slice();
                angles2.push(a2);
                var path2 = node.path.slice();
                path2.push({ x: seg.x, y: seg.y });

                next.push({ x: seg.x, y: seg.y, step: newStep, score: score, angles: angles2, path: path2 });
            }
        }

        if (next.length === 0) break;
        next.sort(function (a, b) { return b.score - a.score; });
        beam = next.slice(0, BEAM_WIDTH);
    }

    if (beam.length === 0) {
        if (!fallback || !fallback.angles.length || fallback.angles[0] === null) return null;
        _latestRankedDodgePaths = fallback.path ? [{ score: fallback.score, path: fallback.path }] : [];
        return {
            angle: fallback.angles[0],
            shouldMove: true,
            path: fallback.path,
        };
    }

    // 5) choose best path, but guard against unsafe first-step angle choices
    beam.sort(function (a, b) { return b.score - a.score; });
    _latestRankedDodgePaths = [];
    for (var ri = 0; ri < Math.min(5, beam.length); ri++) {
        if (beam[ri].path && beam[ri].path.length) {
            _latestRankedDodgePaths.push({ score: beam[ri].score, path: beam[ri].path });
        }
    }

    var best = null;
    var bestSafe = -1;
    for (var bi3 = 0; bi3 < beam.length; bi3++) {
        var cand = beam[bi3];
        if (!cand.angles.length) continue;
        var a0 = cand.angles[0];
        if (a0 === null) continue;
        var safety = firstAngleSafety(a0);
        if (safety > bestSafe) {
            bestSafe = safety;
            best = cand;
        }
        // Early accept: sufficiently safe first move plus high score.
        if (safety >= 24) {
            best = cand;
            break;
        }
    }

    if (!best) {
        if (fallback && fallback.angles.length && fallback.angles[0] !== null) {
            return {
                angle: fallback.angles[0],
                shouldMove: true,
                path: fallback.path,
            };
        }
        if (mustMove) {
            // Last-resort: choose first-step angle that survives longest.
            var emergency = null;
            for (var ei = 0; ei < allAngles.length; ei++) {
                var ea = allAngles[ei];
                if (ea === null) continue;
                var es = firstAngleSafety(ea);
                if (!emergency || es > emergency.safety) emergency = { a: ea, safety: es };
            }
            if (emergency) {
                return {
                    angle: emergency.a,
                    shouldMove: true,
                    path: null,
                };
            }
        }
        return null;
    }

    var firstAngle = best.angles[0];
    if (firstAngle === null) {
        if (mustMove) {
            for (var mi = 0; mi < best.angles.length; mi++) {
                if (best.angles[mi] !== null) {
                    firstAngle = best.angles[mi];
                    break;
                }
            }
            if (firstAngle === null) return null;
        } else {
            return null;
        }
    }

    // 6) output first angle
    return {
        angle: firstAngle,
        shouldMove: true,
        path: best.path,
    };
};

module.exports.drawDodgePath = function (ctx, cam, tankX, tankY, dodgePath) {
    var ranked = _latestRankedDodgePaths;
    if ((!ranked || ranked.length === 0) && (!dodgePath || !dodgePath.length)) return;

    var drawList = [];
    if (ranked && ranked.length) {
        for (var di = 0; di < Math.min(5, ranked.length); di++) {
            if (ranked[di].path && ranked[di].path.length) drawList.push(ranked[di].path);
        }
    } else {
        drawList.push(dodgePath);
    }

    ctx.save();
    for (var p = 0; p < drawList.length; p++) {
        var path = drawList[p];
        var prevX = tankX - cam.camLeft;
        var prevY = tankY - cam.camTop;

        var rankT = p / Math.max(1, drawList.length - 1);
        var baseAlpha = p === 0 ? 1 : (0.58 * Math.pow(1 - rankT, 1.25) + 0.12);
        var baseWidth = p === 0 ? 6.5 : (4.8 - 2.1 * rankT);

        for (var i = 0; i < path.length; i++) {
            var t = i / path.length;
            var segAlpha = Math.max(0.08, baseAlpha * (1 - 0.45 * Math.pow(t, 1.1)));
            ctx.beginPath();
            ctx.moveTo(prevX, prevY);
            prevX = path[i].x - cam.camLeft;
            prevY = path[i].y - cam.camTop;
            ctx.lineTo(prevX, prevY);
            ctx.lineWidth = Math.max(1.1, baseWidth * (0.95 - 0.35 * t));
            ctx.strokeStyle = "rgba(50, 255, 50, " + segAlpha + ")";
            ctx.stroke();
        }
    }
    ctx.restore();
};

module.exports.getTopRankedDodgePaths = function () {
    return _latestRankedDodgePaths;
};

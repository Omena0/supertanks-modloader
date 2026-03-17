
module.exports.findPath = function (maze, startX, startY, targetX, targetY, options) {
    if (!maze || !maze.cellsAcross || !maze.cellsDown) return [];

    options = options || {};
    var bulletPaths = options.bulletPaths || [];

    var TANK_R = 20;
    var ANGLES = 45;
    var STEP = 18;
    var GOAL_RADIUS = 24;
    var POS_Q = 14;
    var MAX_ITERS = 12000;
    var HAZARD_CELL = 48;
    var HAZARD_HARD_R2 = 34 * 34;
    var HAZARD_SOFT_R2 = 78 * 78;

    var hazardGrid = Object.create(null);
    var hasHazards = false;

    function addHazardPoint(x, y, timeStep) {
        var cx = (x / HAZARD_CELL) | 0;
        var cy = (y / HAZARD_CELL) | 0;
        var key = cx + ":" + cy;
        if (!hazardGrid[key]) hazardGrid[key] = [];
        hazardGrid[key].push({ x: x, y: y, t: timeStep });
        hasHazards = true;
    }

    for (var bi = 0; bi < bulletPaths.length; bi++) {
        var entry = bulletPaths[bi];
        if (!entry || entry.ignoreForDodge) continue;
        var path = entry.path;
        if (!path || path.length < 2) continue;
        var maxStep = Math.min(path.length, 180);
        for (var ps = 0; ps < maxStep; ps += 4) {
            addHazardPoint(path[ps].x, path[ps].y, ps);
        }
    }

    function dist(ax, ay, bx, by) {
        var dx = ax - bx, dy = ay - by;
        return Math.sqrt(dx * dx + dy * dy);
    }

    function isBlocked(px, py) {
        if (!maze.cellsAcross) return false;
        var cellX = Math.floor(px / 100);
        var cellY = Math.floor(py / 100);
        var modX = px - 100 * cellX;
        var modY = py - 100 * cellY;

        if (modX < TANK_R && 1 == maze.verticalWalls[cellY * (maze.cellsAcross + 1) + cellX]) return true;
        if (modX > 100 - TANK_R && 1 == maze.verticalWalls[cellY * (maze.cellsAcross + 1) + (cellX + 1)]) return true;
        if (modY < TANK_R && 1 == maze.horisontalWalls[cellY * maze.cellsAcross + cellX]) return true;
        if (modY > 100 - TANK_R && 1 == maze.horisontalWalls[(cellY + 1) * maze.cellsAcross + cellX]) return true;
        if (modX < TANK_R && modY < TANK_R && 1 == maze.wallCorners[cellY * (maze.cellsAcross + 1) + cellX]) return true;
        if (modX > 100 - TANK_R && modY < TANK_R && 1 == maze.wallCorners[cellY * (maze.cellsAcross + 1) + (cellX + 1)]) return true;
        if (modX < TANK_R && modY > 100 - TANK_R && 1 == maze.wallCorners[(cellY + 1) * (maze.cellsAcross + 1) + cellX]) return true;
        if (modX > 100 - TANK_R && modY > 100 - TANK_R && 1 == maze.wallCorners[(cellY + 1) * (maze.cellsAcross + 1) + (cellX + 1)]) return true;
        if (px - TANK_R < 0 || py - TANK_R < 0 || px + TANK_R > maze.worldWidth || py + TANK_R > maze.worldHeight) return true;
        return false;
    }

    function segmentClear(x0, y0, x1, y1) {
        var d = dist(x0, y0, x1, y1);
        var steps = Math.max(1, Math.ceil(d / 5));
        for (var i = 1; i <= steps; i++) {
            var t = i / steps;
            var px = x0 + (x1 - x0) * t;
            var py = y0 + (y1 - y0) * t;
            if (isBlocked(px, py)) return false;
        }
        return true;
    }

    function keyFor(x, y) {
        return ((x / POS_Q) | 0) + ":" + ((y / POS_Q) | 0);
    }

    function bulletDangerPenalty(px, py, travelCost) {
        if (!hasHazards) return 0;
        var cx = (px / HAZARD_CELL) | 0;
        var cy = (py / HAZARD_CELL) | 0;
        var arrivalStep = travelCost / STEP;
        var bestD2 = Infinity;
        var bestTemporal = 1e9;

        for (var ox = -1; ox <= 1; ox++) {
            for (var oy = -1; oy <= 1; oy++) {
                var key = (cx + ox) + ":" + (cy + oy);
                var list = hazardGrid[key];
                if (!list) continue;
                for (var i = 0; i < list.length; i++) {
                    var h = list[i];
                    var dx = px - h.x;
                    var dy = py - h.y;
                    var d2 = dx * dx + dy * dy;
                    if (d2 < bestD2) bestD2 = d2;
                    var dt = Math.abs(arrivalStep - h.t * 0.35);
                    if (dt < bestTemporal) bestTemporal = dt;
                    if (d2 <= HAZARD_HARD_R2 && dt <= 14) return 1e9;
                }
            }
        }

        if (bestD2 <= HAZARD_HARD_R2) return 360;
        if (bestD2 <= HAZARD_SOFT_R2) {
            var closeness = 1 - bestD2 / HAZARD_SOFT_R2;
            var temporalFactor = bestTemporal < 24 ? (1 + (24 - bestTemporal) * 0.04) : 1;
            return 120 * closeness * temporalFactor;
        }
        return 0;
    }

    if (dist(startX, startY, targetX, targetY) <= GOAL_RADIUS) {
        return [{ x: targetX, y: targetY }];
    }

    var angleTable = new Array(ANGLES);
    for (var ai = 0; ai < ANGLES; ai++) {
        var a = (ai / ANGLES) * 2 * Math.PI - Math.PI;
        angleTable[ai] = { c: Math.cos(a), s: Math.sin(a) };
    }

    var open = [];
    var bestG = {};

    var h0 = dist(startX, startY, targetX, targetY);
    var startNode = { x: startX, y: startY, g: 0, f: h0, parent: null };
    open.push(startNode);
    bestG[keyFor(startX, startY)] = 0;

    var bestNode = startNode;
    var iters = 0;

    while (open.length > 0 && iters < MAX_ITERS) {
        iters++;

        var bestIdx = 0;
        for (var oi = 1; oi < open.length; oi++) {
            if (open[oi].f < open[bestIdx].f) bestIdx = oi;
        }
        var cur = open[bestIdx];
        open.splice(bestIdx, 1);

        var curDist = dist(cur.x, cur.y, targetX, targetY);
        if (curDist < dist(bestNode.x, bestNode.y, targetX, targetY)) bestNode = cur;
        if (curDist <= GOAL_RADIUS) {
            bestNode = cur;
            break;
        }

        for (var k = 0; k < ANGLES; k++) {
            var nx = cur.x + angleTable[k].c * STEP;
            var ny = cur.y + angleTable[k].s * STEP;

            if (!segmentClear(cur.x, cur.y, nx, ny)) continue;

            var dangerPenalty = hasHazards ? bulletDangerPenalty(nx, ny, cur.g + STEP) : 0;
            if (dangerPenalty >= 1e9) continue;

            var ng = cur.g + STEP + dangerPenalty;
            var nk = keyFor(nx, ny);
            if (bestG[nk] !== undefined && ng >= bestG[nk]) continue;

            bestG[nk] = ng;
            var nh = dist(nx, ny, targetX, targetY);
            open.push({ x: nx, y: ny, g: ng, f: ng + nh, parent: cur });
        }
    }

    var rev = [];
    for (var p = bestNode; p; p = p.parent) rev.push({ x: p.x, y: p.y });
    rev.reverse();

    if (rev.length <= 1) return [{ x: targetX, y: targetY }];

    var out = [];
    for (var r = 1; r < rev.length; r++) out.push(rev[r]);
    out.push({ x: targetX, y: targetY });
    return out;
};

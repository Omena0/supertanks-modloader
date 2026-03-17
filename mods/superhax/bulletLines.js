
module.exports.updateBulletPathCache = function (bullets, mazeData, constants, simulateBulletPath) {
    var cached = [];
    if (!mazeData.cellsAcross) return cached;
    var now = Date.now();
    for (var i = 0; i < bullets.length; i++) {
        var b = bullets[i];
        var remainingTTL = b.timeToLive !== undefined ? b.timeToLive : 9000;
        if (b.fireTime) remainingTTL = 9000 - (now - b.fireTime);
        if (remainingTTL <= 0) continue;
        var stepsLeft = Math.ceil(remainingTTL / constants.PHYSICS_INTERVAL);
        var path = simulateBulletPath(constants, b.x, b.y, Math.atan2(b.yVel, b.xVel), mazeData, stepsLeft);
        cached.push({ path: path, bullet: b, ignoreForDodge: !!(b.ignoreForDodgeUntil && now < b.ignoreForDodgeUntil) });
    }
    return cached;
};

module.exports.drawBulletPredictions = function (ctx, cam, mazeData, cachedBulletPaths, playerX, playerY) {
    if (!mazeData.cellsAcross) return;
    ctx.save();
    var DANGER_DIST = 25;
    var DANGER_DIST_SQ = DANGER_DIST * DANGER_DIST;
    var camLeft = cam.camLeft;
    var camTop = cam.camTop;
    for (var i = 0; i < cachedBulletPaths.length; i++) {
        var entry = cachedBulletPaths[i];
        var b = entry.bullet;
        var path = entry.path;
        var pathLen = path.length;

        var willHitPlayer = false;
        for (var c = 0; c < pathLen; c++) {
            var hdx = path[c].x - playerX;
            var hdy = path[c].y - playerY;
            if (hdx * hdx + hdy * hdy < DANGER_DIST_SQ) {
                willHitPlayer = true;
                break;
            }
        }

        if (willHitPlayer) {
            ctx.beginPath();
            ctx.arc(b.x - camLeft, b.y - camTop, 12, 0, 2 * Math.PI);
            ctx.lineWidth = 2.5;
            ctx.strokeStyle = "rgba(255, 0, 0, 0.8)";
            ctx.stroke();
        }

        var prevX = b.x - camLeft, prevY = b.y - camTop;
        for (var s = 0; s < pathLen; s++) {
            var t = s / pathLen;
            var lw = 4 * (1 - t) + 0.5;
            ctx.beginPath();
            ctx.moveTo(prevX, prevY);
            prevX = path[s].x - camLeft;
            prevY = path[s].y - camTop;
            ctx.lineTo(prevX, prevY);
            ctx.lineWidth = lw;
            ctx.strokeStyle = "rgba(255, 50, 50, " + (0.35 * (1 - t) + 0.05) + ")";
            ctx.stroke();
        }
    }
    ctx.restore();
};

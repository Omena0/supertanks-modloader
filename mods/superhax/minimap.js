
module.exports.drawMinimap = function (ctx, mazeData, allTanks) {
    if (!mazeData.cellsAcross) return;
    var MINIMAP_SIZE = 180;
    var PADDING = 10;
    var mx = PADDING, my = PADDING;
    var scaleX = MINIMAP_SIZE / mazeData.worldWidth;
    var scaleY = MINIMAP_SIZE / mazeData.worldHeight;

    ctx.save();
    ctx.globalAlpha = 0.7;
    ctx.fillStyle = "#1a1a2e";
    ctx.fillRect(mx, my, MINIMAP_SIZE, MINIMAP_SIZE);
    ctx.globalAlpha = 1;

    ctx.strokeStyle = "#4a6fa5";
    ctx.lineWidth = 1;
    for (var row = 0; row <= mazeData.cellsDown; row++) {
        for (var col = 0; col < mazeData.cellsAcross; col++) {
            if (1 == mazeData.horisontalWalls[row * mazeData.cellsAcross + col]) {
                ctx.beginPath();
                ctx.moveTo(mx + col * 100 * scaleX, my + row * 100 * scaleY);
                ctx.lineTo(mx + (col + 1) * 100 * scaleX, my + row * 100 * scaleY);
                ctx.stroke();
            }
        }
    }
    for (row = 0; row < mazeData.cellsDown; row++) {
        for (col = 0; col <= mazeData.cellsAcross; col++) {
            if (1 == mazeData.verticalWalls[row * (mazeData.cellsAcross + 1) + col]) {
                ctx.beginPath();
                ctx.moveTo(mx + col * 100 * scaleX, my + row * 100 * scaleY);
                ctx.lineTo(mx + col * 100 * scaleX, my + (row + 1) * 100 * scaleY);
                ctx.stroke();
            }
        }
    }

    for (var i = 0; i < allTanks.length; i++) {
        var t = allTanks[i];
        if (t.beenHit) continue;
        var tx = mx + t.x * scaleX;
        var ty = my + t.y * scaleY;
        ctx.beginPath();
        ctx.arc(tx, ty, i === 0 ? 4 : 3, 0, 2 * Math.PI);
        if (i === 0) ctx.fillStyle = "#00ff00";
        else if (t.isKing) ctx.fillStyle = "#ffbb00";
        else ctx.fillStyle = "#ff4444";
        ctx.fill();
    }

    ctx.strokeStyle = "#4a6fa5";
    ctx.lineWidth = 2;
    ctx.strokeRect(mx, my, MINIMAP_SIZE, MINIMAP_SIZE);
    ctx.restore();
};

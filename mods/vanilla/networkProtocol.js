module.exports.tankStateToBinary = function (state) {
    var tanks = state.tanks;
    var byteLength = 5 + 7 * tanks.length;
    var buffer = new ArrayBuffer(byteLength);
    var view = new DataView(buffer);

    view.setUint32(0, state.tickNum);
    view.setUint8(4, tanks.length);

    for (var i = 0; i < tanks.length; i++) {
        var anglePacked = Math.round(10000 * tanks[i].angle);
        var offset = 5 + 7 * i;
        view.setUint8(offset, tanks[i].id);
        view.setInt16(offset + 1, tanks[i].x);
        view.setInt16(offset + 3, tanks[i].y);
        view.setInt16(offset + 5, anglePacked);
    }

    return buffer;
};

module.exports.binaryToTankState = function (buffer) {
    var view = new DataView(buffer);
    var tickNum = view.getUint32(0);
    var tankCount = view.getUint8(4);
    var tanks = [];

    for (var i = 0; i < tankCount; i++) {
        var offset = 5 + 7 * i;
        var id = view.getUint8(offset);
        var x = view.getInt16(offset + 1);
        var y = view.getInt16(offset + 3);
        var angle = view.getInt16(offset + 5) / 10000;

        tanks.push({
            id: id,
            x: x,
            y: y,
            angle: angle,
        });
    }

    return {
        tanks: tanks,
        tickNum: tickNum,
    };
};

module.exports.bulletStateToBinary = function (state) {
    var bullets = state.bullets;
    var byteLength = 6 + 9 * bullets.length;
    var buffer = new ArrayBuffer(byteLength);
    var view = new DataView(buffer);

    view.setUint32(0, state.tickNum);
    view.setUint8(4, state.bulletsSpawnedCount);
    view.setUint8(5, bullets.length);

    for (var i = 0; i < bullets.length; i++) {
        var xVelPacked = Math.round(50000 * bullets[i].xVel);
        var yVelPacked = Math.round(50000 * bullets[i].yVel);
        var offset = 6 + 9 * i;
        view.setUint8(offset, bullets[i].id);
        view.setInt16(offset + 1, bullets[i].x);
        view.setInt16(offset + 3, bullets[i].y);
        view.setInt16(offset + 5, xVelPacked);
        view.setInt16(offset + 7, yVelPacked);
    }

    return buffer;
};

module.exports.binaryToBulletState = function (buffer) {
    var view = new DataView(buffer);
    var tickNum = view.getUint32(0);
    var bulletsSpawnedCount = view.getUint8(4);
    var bulletCount = view.getUint8(5);
    var bullets = [];

    for (var i = 0; i < bulletCount; i++) {
        var offset = 6 + 9 * i;
        var id = view.getUint8(offset);
        var x = view.getInt16(offset + 1);
        var y = view.getInt16(offset + 3);
        var xVel = view.getInt16(offset + 5) / 50000;
        var yVel = view.getInt16(offset + 7) / 50000;

        bullets.push({
            id: id,
            x: x,
            y: y,
            xVel: xVel,
            yVel: yVel,
        });
    }

    return {
        bullets: bullets,
        tickNum: tickNum,
        bulletsSpawnedCount: bulletsSpawnedCount,
    };
};

module.exports.userInputToBinaryData = function (input) {
    var buffer = new ArrayBuffer(7);
    var view = new DataView(buffer);
    var anglePacked = Math.round(10000 * input.targetAngle);
    var flags = (input.moveForward << 1) + input.mouseClicked;

    view.setInt16(0, anglePacked);
    view.setInt32(2, input.tickNum);
    view.setUint8(6, flags);

    return buffer;
};

module.exports.binaryDataToUserInput = function (buffer) {
    var view = new DataView(buffer);
    var anglePacked = view.getInt16(0);
    var tickNum = view.getInt32(2);
    var flags = view.getUint8(6);

    return {
        targetAngle: anglePacked / 10000,
        moveForward: !!(flags >> 1),
        mouseClicked: !!(1 & flags),
        tickNum: tickNum,
    };
};

module.exports.newStateFromServer = 0;
module.exports.syncBullets = 1;
module.exports.tankInputToServer = 2;

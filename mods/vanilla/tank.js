var constants = require("./constants");
var physics = require("./physics");
var tankModel = require("./tankModel")(0.18, window.devicePixelRatio || 1);

module.exports = function Tank(x, y) {
    this.x = x;
    this.y = y;
    this.angle = 0;
    this.name = "Name Unset";
    this.isKing = false;
    this.model = new tankModel.TankModel();
    this.xVel = 0;
    this.yVel = 0;
    this.maxSpeed = constants.TANK_MAX_SPEED;
    this.angularSpeed = 0.25;
    this.moving = true;
    this.beenHit = false;
    this.alive = true;
    this.boundingBox = [-18, -16, 26, -16, 26, 16, -18, 16];
    this.player = false;
    this.hitLastTurn = false;

    this.moveTowards = function (targetX, targetY, maze, deltaTime) {
        if (!this.beenHit)
            return physics.tankMoveTowards(
                this,
                targetX,
                targetY,
                maze,
                deltaTime,
            );
    };

    this.lookAt = function (targetX, targetY, maze) {
        if (!this.beenHit)
            physics.tankLookAtPoint(this, targetX, targetY, maze);
    };

    this.setSkin = function (colorIndex) {
        this.model.setSkin(colorIndex);
    };

    this.draw = function (ctx, camera) {
        if (this.beenHit) {
            if (!this.hitLastTurn) {
                this.model.playDeathAnimation();
                this.hitLastTurn = true;
            }
        } else {
            this.model.playMovementAnimation();
            this.hitLastTurn = false;
        }

        this.model.renderModelOntoCanvas(
            ctx,
            camera,
            this.x,
            this.y,
            this.angle,
            this.isKing,
            this.name,
        );
    };
};

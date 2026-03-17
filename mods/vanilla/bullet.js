var physics = require("./physics");

module.exports = function Bullet(id, x, y, xVel, yVel) {
    this.id = id;
    this.x = x;
    this.y = y;
    this.xVel = xVel;
    this.yVel = yVel;
    this.timeToLive = 9000;

    this.draw = function (ctx, camera) {
        ctx.fillStyle = "#101010";
        ctx.beginPath();
        ctx.arc(
            this.x - camera.camLeft,
            this.y - camera.camTop,
            4,
            0,
            2 * Math.PI,
        );
        ctx.fill();
    };

    this.update = function (maze, deltaTime) {
        physics.updateBulletsPosition(this, maze, deltaTime);
    };
};

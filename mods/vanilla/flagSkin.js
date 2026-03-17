var BaseSkin = require("./baseSkin");
require("./spriteGenerator");

module.exports = (function (_BaseSkin) {
    _inherits(FlagSkin, _BaseSkin);

    function FlagSkin(config) {
        _classCallCheck(this, FlagSkin);
        _get(
            Object.getPrototypeOf(FlagSkin.prototype),
            "constructor",
            this,
        ).call(this, config);

        this.points = [];
        for (var i = 0; i < 10; i++) this.points.push({ x: 0, y: 0 });
    }

    _createClass(FlagSkin, [
        {
            key: "preDrawInScreenSpace",
            value: function preDrawInScreenSpace(ctx, state) {
                var cosAngle = Math.cos(this.angle);
                var sinAngle = Math.sin(this.angle);

                // Position flag attachment point behind the tank
                this.points[0].x = this.x + (-16 * cosAngle - 0 * sinAngle);
                this.points[0].y = this.y + (0 * cosAngle + -16 * sinAngle);
                this.points[1].x = this.points[0].x + -2 * cosAngle;
                this.points[1].y = this.points[0].y + -2 * sinAngle;

                // Simulate trailing rope physics
                for (var i = 0; i < this.points.length - 1; i++) {
                    var curX = this.points[i].x;
                    var curY = this.points[i].y;
                    var nextX = this.points[i + 1].x;
                    var nextY = this.points[i + 1].y;
                    var angle = Math.atan2(nextY - curY, nextX - curX);
                    var segmentLength = 3;
                    this.points[i + 1].x =
                        curX + segmentLength * Math.cos(angle);
                    this.points[i + 1].y =
                        curY + segmentLength * Math.sin(angle);
                }

                // Draw the flag trail
                ctx.beginPath();
                ctx.moveTo(this.points[0].x, this.points[0].y);
                for (i = 1; i < this.points.length; i++) {
                    ctx.lineTo(this.points[i].x, this.points[i].y);
                }
                ctx.strokeStyle = "#ce0804";
                ctx.lineWidth = 34;
                ctx.lineJoin = "round";
                ctx.lineCap = "square";
                ctx.stroke();
            },
        },
        {
            key: "drawSkin",
            value: function drawSkin(ctx, dpr, state) {
                this.tankScale;
            },
        },
    ]);

    return FlagSkin;
})(BaseSkin);

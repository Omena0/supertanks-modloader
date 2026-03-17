var GraphicsObject = require("./graphicsObject");

function PopUpNotification(message) {
    var timeToLive =
        arguments.length <= 1 || arguments[1] === undefined
            ? 2000
            : arguments[1];

    this.timeToLive = timeToLive;
    this.message = message;
    this.width = 13 * message.length + 40;
    this.height = 60;

    this.draw = function (ctx, camera, deltaTime) {
        if (this.timeToLive <= 0) destroyGraphicsObject(this);

        this.timeToLive -= deltaTime;

        var x = 0.5 * (ctx.canvas.clientWidth - this.width);
        var y = 0.5 * ctx.canvas.clientHeight - this.height - 70;

        // Draw shadow
        ctx.globalAlpha = 0.3;
        ctx.shadowOffsetY = 6;
        ctx.shadowBlur = 5;
        ctx.shadowColor = "black";
        ctx.fillRect(x, y, this.width, this.height);

        // Draw background
        ctx.globalAlpha = 0.95;
        ctx.shadowOffsetY = 0;
        ctx.shadowBlur = 0;
        ctx.fillStyle = "#febd09";
        ctx.fillRect(x, y, this.width, this.height);

        // Draw border
        ctx.strokeStyle = "#ffffff";
        ctx.lineWidth = 4;
        ctx.strokeRect(x, y, this.width, this.height);

        // Draw text
        ctx.globalAlpha = 1;
        ctx.fillStyle = "#ffffff";
        ctx.font = "26px Fredoka One";
        ctx.textAlign = "center";
        ctx.shadowColor = "#e55b0e";
        ctx.shadowOffsetY = 4;
        ctx.fillText(
            this.message,
            x + 0.5 * this.width,
            y + 0.5 * this.height + 5,
        );
        ctx.shadowOffsetY = 0;
        ctx.textAlign = "start";
    };
}

PopUpNotification.prototype = new GraphicsObject();

module.exports.PopUpNotification = PopUpNotification;

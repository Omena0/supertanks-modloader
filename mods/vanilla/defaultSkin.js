var BaseSkin = require("./baseSkin");
require("./spriteGenerator");

function adjustColor(hex, percent) {
    hex = String(hex).replace(/[^0-9a-f]/gi, "");
    if (hex.length < 6)
        hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
    percent = percent || 0;

    var result = "#";
    var channel;
    for (var i = 0; i < 3; i++) {
        channel = parseInt(hex.substr(2 * i, 2), 16);
        channel = Math.round(
            Math.min(Math.max(0, channel + channel * percent), 255),
        ).toString(16);
        result += ("00" + channel).substr(channel.length);
    }
    return result;
}

module.exports = (function (_BaseSkin) {
    _inherits(DefaultSkin, _BaseSkin);

    function DefaultSkin() {
        _classCallCheck(this, DefaultSkin);
        _get(
            Object.getPrototypeOf(DefaultSkin.prototype),
            "constructor",
            this,
        ).apply(this, arguments);
    }

    _createClass(DefaultSkin, [
        {
            key: "drawTank",
            value: function drawTank(scale, dpr, color) {
                var pixelScale = scale * dpr;
                var canvas = document.createElement("canvas");
                var ctx = canvas.getContext("2d");

                var shade1 = adjustColor(color, -0.106);
                var shade2 = adjustColor(color, -0.16);
                var shade3 = adjustColor(color, -0.17);
                var shade4 = adjustColor(color, -0.234);
                var shade5 = adjustColor(color, -0.458);
                var shade6 = adjustColor(color, -0.56);
                var shade7 = adjustColor(color, -0.631);
                var shade8 = adjustColor(color, -0.705);
                var outlineColor = adjustColor(color, -0.5);

                // Tank body outline points
                var bodyPoints = [];
                bodyPoints.push({ x: 0, y: 80 });
                bodyPoints.push({ x: 22, y: 80 });
                bodyPoints.push({ x: 22, y: 65 });
                bodyPoints.push({ x: 70, y: 65 });
                bodyPoints.push({ x: 102, y: 95 });
                bodyPoints.push({ x: 102, y: 265 });
                bodyPoints.push({ x: 90, y: 272 });
                bodyPoints.push({ x: 22, y: 272 });
                bodyPoints.push({ x: 22, y: 255 });
                bodyPoints.push({ x: 0, y: 255 });

                ctx.canvas.width = 204 * pixelScale;
                ctx.canvas.height = 318 * pixelScale;
                ctx.scale(pixelScale, pixelScale);

                // Draw rear exhaust
                ctx.save();
                ctx.translate(102, 40);
                var gradient = ctx.createLinearGradient(0, 255, 0, 274);
                gradient.addColorStop(0, shade4);
                gradient.addColorStop(1, shade6);
                ctx.fillStyle = gradient;
                ctx.fillRect(-28, 255, 56, 19);

                gradient = ctx.createLinearGradient(0, 274, 0, 278);
                gradient.addColorStop(0, shade7);
                gradient.addColorStop(1, shade8);
                ctx.fillStyle = gradient;
                ctx.fillRect(-28, 274, 56, 4);
                ctx.restore();

                // Draw tank body
                ctx.save();
                ctx.translate(102, 40);
                ctx.beginPath();
                ctx.moveTo(bodyPoints[0].x, bodyPoints[0].y);
                for (var i = 1; i < bodyPoints.length; i++)
                    ctx.lineTo(bodyPoints[i].x, bodyPoints[i].y);
                for (i = bodyPoints.length - 2; i >= 0; i--)
                    ctx.lineTo(-bodyPoints[i].x, bodyPoints[i].y);
                ctx.closePath();
                ctx.fillStyle = color;
                ctx.fill();
                ctx.clip();

                // Top shading
                gradient = ctx.createLinearGradient(0, 0, 0, 92);
                gradient.addColorStop(0, shade5);
                gradient.addColorStop(1, shade3);
                ctx.fillStyle = gradient;
                ctx.fillRect(-200, 0, 400, 92);

                gradient = ctx.createLinearGradient(0, 92, 0, 102);
                gradient.addColorStop(0, shade3);
                gradient.addColorStop(1, color);
                ctx.fillStyle = gradient;
                ctx.fillRect(-200, 92, 400, 173);

                // Bottom edge shading
                gradient = ctx.createLinearGradient(0, 265, 0, 272);
                gradient.addColorStop(0, shade1);
                gradient.addColorStop(1, shade2);
                ctx.fillStyle = gradient;
                ctx.fillRect(-200, 265, 400, 8);

                // Barrel shadow
                ctx.shadowBlur = 15 * dpr;
                ctx.shadowColor = "rgba(0, 0, 0, 0.6)";
                ctx.fillRect(-17, 0, 34, 106);
                ctx.shadowBlur = 0;
                ctx.restore();

                // Draw barrel
                ctx.save();
                ctx.fillStyle = color;
                ctx.translate(102, 40);
                ctx.beginPath();
                ctx.rect(-17, -40, 34, 146);
                ctx.closePath();
                ctx.fill();

                gradient = ctx.createLinearGradient(-17, 0, -5, 0);
                gradient.addColorStop(0, shade5);
                gradient.addColorStop(1, shade4);
                ctx.fillStyle = gradient;
                ctx.fillRect(-17, -40, 17, 146);

                gradient = ctx.createLinearGradient(5, 0, 17, 0);
                gradient.addColorStop(0, shade4);
                gradient.addColorStop(1, shade5);
                ctx.fillStyle = gradient;
                ctx.fillRect(0, -40, 17, 146);
                ctx.restore();

                // Draw barrel base
                ctx.save();
                ctx.fillStyle = color;
                ctx.translate(102, 40);
                ctx.beginPath();
                ctx.rect(-29, 106, 58, 26);
                ctx.closePath();
                ctx.shadowBlur = 10 * dpr;
                ctx.shadowColor = "rgba(0, 0, 0, 0.6)";
                ctx.fill();
                ctx.shadowBlur = 0;
                ctx.clip();

                gradient = ctx.createLinearGradient(-29, 0, -5, 0);
                gradient.addColorStop(0, shade5);
                gradient.addColorStop(1, shade4);
                ctx.fillStyle = gradient;
                ctx.fillRect(-29, 106, 29, 26);

                gradient = ctx.createLinearGradient(5, 0, 29, 0);
                gradient.addColorStop(0, shade4);
                gradient.addColorStop(1, shade5);
                ctx.fillStyle = gradient;
                ctx.fillRect(0, 106, 29, 26);
                ctx.restore();

                // Draw turret dome
                ctx.save();
                ctx.fillStyle = shade4;
                ctx.translate(102, 40);
                ctx.shadowBlur = 10 * dpr;
                ctx.shadowColor = "black";
                ctx.beginPath();
                ctx.arc(0, 185, 60, 0, 2 * Math.PI);
                ctx.closePath();
                ctx.fill();
                ctx.shadowBlur = 0;

                ctx.strokeStyle = outlineColor;
                ctx.lineWidth = 5;
                ctx.beginPath();
                ctx.arc(0, 185, 50, 0, 2 * Math.PI);
                ctx.closePath();
                ctx.stroke();
                ctx.restore();

                return canvas;
            },
        },
        {
            key: "drawTankTrack",
            value: function drawTankTrack(pixelScale) {
                var canvas = document.createElement("canvas");
                var ctx = canvas.getContext("2d");

                var trackCircumference = 0 + 120 * Math.PI;
                var treadGap = trackCircumference / 5 - 36;

                ctx.canvas.width = 65 * pixelScale;
                ctx.canvas.height = 240 * pixelScale;
                ctx.scale(pixelScale, pixelScale);

                // Draw track base
                ctx.fillStyle = "#292929";
                ctx.fillRect(0, 0, 65, 240);

                // Top/bottom gradient overlays
                ctx.globalAlpha = 0.9;
                var topGradient = ctx.createLinearGradient(0, 0, 0, 36);
                topGradient.addColorStop(0, "#101010");
                topGradient.addColorStop(1, "transparent");
                ctx.fillStyle = topGradient;
                ctx.fillRect(0, 0, 65, 36);

                var bottomGradient = ctx.createLinearGradient(0, 240, 0, 204);
                bottomGradient.addColorStop(0, "#101010");
                bottomGradient.addColorStop(1, "transparent");
                ctx.fillStyle = bottomGradient;
                ctx.fillRect(0, 204, 65, 36);
                ctx.globalAlpha = 1;

                // Calculate tread positions along the track
                var halfCircumference = 0.5 * Math.PI * 120;
                var straightLength = halfCircumference + 0;
                var treads = [];

                for (var i = 0; i <= 5; i++) {
                    var pos = (i * (36 + treadGap) + 36) % trackCircumference;
                    var yPos;
                    var tiltAngle = 0;

                    if (pos < halfCircumference) {
                        tiltAngle = (halfCircumference - pos) / 120;
                        yPos = 120 - 120 * Math.sin(tiltAngle);
                    } else if (pos > straightLength) {
                        tiltAngle = (pos - straightLength) / 120;
                        yPos = 120 + 120 * Math.sin(tiltAngle);
                    } else {
                        yPos = pos - halfCircumference + 120;
                    }

                    treads.push({
                        x: 0,
                        y: yPos,
                        angle: tiltAngle,
                        treadHeight: 36,
                        treadWidth: 65,
                        treadDepth: 40,
                        trackHeight: 240,
                    });
                }

                var drawTread = function drawTread(ctx, tread) {
                    var x = tread.x;
                    var y = tread.y;
                    var angle = tread.angle;
                    var treadHeight = tread.treadHeight;
                    var treadWidth = tread.treadWidth;
                    var treadDepth = tread.treadDepth;
                    var trackHeight = tread.trackHeight;

                    var cosAngle = Math.cos(angle);
                    var visibleHeight = treadHeight * cosAngle;
                    var depthOffset = treadDepth * (1 - cosAngle);

                    // Draw tread face
                    ctx.fillStyle = "#616161";
                    ctx.fillRect(
                        x,
                        y - visibleHeight / 2,
                        treadWidth,
                        visibleHeight,
                    );

                    // Draw tread side
                    ctx.fillStyle = "#404040";
                    var isBottomHalf = y > trackHeight / 2 ? 1 : 0;
                    if (isBottomHalf)
                        ctx.fillRect(
                            x,
                            y - visibleHeight / 2 - depthOffset,
                            treadWidth,
                            depthOffset,
                        );
                    else
                        ctx.fillRect(
                            x,
                            y + visibleHeight / 2,
                            treadWidth,
                            depthOffset,
                        );

                    // Draw tread shadows
                    var gradient;
                    gradient = ctx.createLinearGradient(
                        x,
                        y - visibleHeight / 2,
                        0,
                        y - visibleHeight / 2 - (visibleHeight / 10) * 5,
                    );
                    gradient.addColorStop(0, "#101010");
                    gradient.addColorStop(1, "transparent");
                    ctx.fillStyle = gradient;
                    if (isBottomHalf)
                        ctx.fillRect(
                            x,
                            y -
                                visibleHeight / 2 -
                                (visibleHeight / 10) * 5 -
                                depthOffset,
                            treadWidth,
                            (visibleHeight / 10) * 5,
                        );
                    else
                        ctx.fillRect(
                            x,
                            y - visibleHeight / 2 - (visibleHeight / 10) * 5,
                            treadWidth,
                            (visibleHeight / 10) * 5,
                        );

                    gradient = ctx.createLinearGradient(
                        x,
                        y + visibleHeight / 2,
                        0,
                        y + visibleHeight / 2 + (visibleHeight / 10) * 5,
                    );
                    gradient.addColorStop(0, "#101010");
                    gradient.addColorStop(1, "transparent");
                    ctx.fillStyle = gradient;
                    if (isBottomHalf)
                        ctx.fillRect(
                            x,
                            y + visibleHeight / 2,
                            treadWidth,
                            (visibleHeight / 10) * 5,
                        );
                    else
                        ctx.fillRect(
                            x,
                            y + visibleHeight / 2 + depthOffset,
                            treadWidth,
                            (visibleHeight / 10) * 5,
                        );
                };

                // Sort by angle (draw most tilted first)
                var sortedTreads = treads.sort(function (a, b) {
                    return b.angle - a.angle;
                });

                for (i = 0; i < sortedTreads.length; i++)
                    drawTread(ctx, sortedTreads[i]);

                // Additional shading overlays
                ctx.globalAlpha = 0.4;
                var topShade = ctx.createLinearGradient(0, 0, 0, 96);
                topShade.addColorStop(0, "#101010");
                topShade.addColorStop(1, "transparent");
                ctx.fillStyle = topShade;

                var bottomShade = ctx.createLinearGradient(0, 240, 0, 204);
                bottomShade.addColorStop(0, "#101010");
                bottomShade.addColorStop(1, "transparent");
                ctx.fillStyle = bottomShade;

                return canvas;
            },
        },
        {
            key: "drawSkin",
            value: function drawSkin(ctx, dpr, state) {
                var _this = this;
                var scale = this.tankScale;

                var tankSprite = this.getCachedGraphic(
                    "tankSprite",
                    function () {
                        return _this.drawTank(scale, dpr, _this.config.colour);
                    },
                );

                var trackSprite = this.getCachedGraphic(
                    "trackSprite",
                    function () {
                        return _this.drawTankTrack(scale * dpr);
                    },
                );

                var tankWidth = tankSprite.width / dpr;
                var tankHeight = tankSprite.height / dpr;
                var trackWidth = trackSprite.width / dpr;
                var trackHeight = trackSprite.height / dpr;

                ctx.translate(0.5 * -tankWidth, (225 / 318) * -tankHeight);
                ctx.drawImage(
                    trackSprite,
                    9 * scale,
                    80 * scale,
                    trackWidth,
                    trackHeight,
                );
                ctx.drawImage(
                    trackSprite,
                    130 * scale,
                    80 * scale,
                    trackWidth,
                    trackHeight,
                );
                ctx.drawImage(tankSprite, 0, 0, tankWidth, tankHeight);
            },
        },
    ]);

    return DefaultSkin;
})(BaseSkin);

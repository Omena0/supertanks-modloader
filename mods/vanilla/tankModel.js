var spriteGenerator = require("./spriteGenerator");
var defaultSkin = require("./defaultSkin");
require("./flagSkin");

module.exports = function (tankScale, dpr) {
    var explosionFrames = spriteGenerator.generateExplosionSpriteSheet(
        200 * dpr,
        90,
    );
    var scorchSprite = spriteGenerator.generateScorchSprite(100 * dpr);

    return {
        TankModel: function TankModel() {
            this.drawColourIndex = 0;
            this.showingScorch = false;
            this.showingExplosion = false;
            this.explodeAnimIndex = 0;
            this.skins = [
                new defaultSkin({
                    colour: spriteGenerator.skins[this.drawColourIndex],
                }),
            ];

            this.setSkin = function (colorIndex) {
                this.drawColourIndex = colorIndex;
                this.skins[0].setConfig({
                    colour: spriteGenerator.skins[this.drawColourIndex],
                });
            };

            this.playMovementAnimation = function () {
                this.showingExplosion = false;
                this.showingScorch = false;
            };

            this.playDeathAnimation = function () {
                this.explodeAnimIndex = 0;
                this.showingExplosion = true;
            };

            this.renderModelOntoCanvas = function (
                ctx,
                camera,
                x,
                y,
                angle,
                isKing,
                name,
            ) {
                if (this.showingScorch) {
                    var scorchWidth = scorchSprite.width / dpr;
                    var scorchHeight = scorchSprite.height / dpr;
                    var scorchX = x - camera.camLeft - 0.5 * scorchWidth;
                    var scorchY = y - camera.camTop - 0.5 * scorchHeight;
                    ctx.drawImage(
                        scorchSprite,
                        scorchX,
                        scorchY,
                        scorchWidth,
                        scorchHeight,
                    );
                } else {
                    ctx.save();
                    ctx.translate(x - camera.camLeft, y - camera.camTop);

                    // Draw name
                    ctx.font = "14px Fredoka One";
                    ctx.fillStyle = "#000000";
                    ctx.fillText(name, 3 * -name.length, -40);

                    // Draw crown if king
                    if (isKing) {
                        ctx.font = "14px Anton";
                        ctx.fillStyle = "#000000";
                        ctx.fillText(
                            "\uD83D\uDC51",
                            3 * -name.length - 20,
                            -40,
                        );
                    }

                    // Draw all skins
                    this.skins.forEach(function (skin) {
                        skin.draw(
                            ctx,
                            0,
                            {
                                angle: angle,
                                x: x,
                                y: y,
                            },
                            {
                                tankScale: tankScale,
                                camLeft: camera.camLeft,
                                camTop: camera.camTop,
                                dpr: dpr,
                            },
                        );
                    });

                    ctx.restore();
                }

                // Draw explosion animation
                if (this.showingExplosion) {
                    if (this.explodeAnimIndex < explosionFrames.length - 1) {
                        this.explodeAnimIndex += 1;
                        if (this.explodeAnimIndex > 50) {
                            this.showingScorch = true;
                            this.showingExplosion = false;
                        } else {
                            this.showingScorch = false;
                        }
                    }

                    var frameWidth =
                        explosionFrames[this.explodeAnimIndex].width / dpr;
                    var frameHeight =
                        explosionFrames[this.explodeAnimIndex].height / dpr;
                    var frameX = x - camera.camLeft - 0.5 * frameWidth;
                    var frameY = y - camera.camTop - 0.5 * frameHeight;
                    ctx.drawImage(
                        explosionFrames[this.explodeAnimIndex],
                        frameX,
                        frameY,
                        frameWidth,
                        frameHeight,
                    );
                }
            };
        },

        skins: spriteGenerator.skins,
    };
};

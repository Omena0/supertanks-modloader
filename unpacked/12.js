var n = require("./1"),
  l = require("./13");
require("./14");
module.exports = function (module, exports) {
  var require = n.generateExplosionSpriteSheet(200 * exports, 90),
    o = n.generateScorchSprite(100 * exports);
  return {
    TankModel: function TankModel() {
      ((this.drawColourIndex = 0),
        (this.showingScorch = !1),
        (this.showingExplosion = !1),
        (this.explodeAnimIndex = 0),
        (this.skins = [
          new l({ colour: n.skins[this.drawColourIndex] }),
        ]),
        (this.setSkin = function (module) {
          ((this.drawColourIndex = module),
            this.skins[0].setConfig({
              colour: n.skins[this.drawColourIndex],
            }));
        }),
        (this.playMovementAnimation = function () {
          ((this.showingExplosion = !1), (this.showingScorch = !1));
        }),
        (this.playDeathAnimation = function () {
          ((this.explodeAnimIndex = 0), (this.showingExplosion = !0));
        }),
        (this.renderModelOntoCanvas = function (n, l, i, s, r, h, c) {
          if (this.showingScorch) {
            var _t2 = o.width / exports,
              _a2 = o.height / exports;
            var _r = i - l.camLeft - 0.5 * _t2,
              _h = s - l.camTop - 0.5 * _a2;
            n.drawImage(o, _r, _h, _t2, _a2);
          } else
            (n.save(),
              n.translate(i - l.camLeft, s - l.camTop),
              (n.font = "14px Fredoka One"),
              (n.fillStyle = "#000000"),
              n.fillText(c, 3 * -c.length, -40),
              h &&
              ((n.font = "14px Anton"),
                (n.fillStyle = "#000000"),
                n.fillText(
                  "\uD83D\uDC51",
                  3 * -c.length - 20,
                  -40,
                )),
              this.skins.forEach(function (require) {
                require.draw(
                  n,
                  0,
                  {
                    angle: r,
                    x: i,
                    y: s,
                  },
                  {
                    tankScale: module,
                    camLeft: l.camLeft,
                    camTop: l.camTop,
                    dpr: exports,
                  },
                );
              }),
              n.restore());
          if (this.showingExplosion) {
            this.explodeAnimIndex < require.length - 1 &&
              ((this.explodeAnimIndex += 1),
                this.explodeAnimIndex > 50
                  ? ((this.showingScorch = !0),
                    (this.showingExplosion = !1))
                  : (this.showingScorch = !1));
            var _t3 =
              require[this.explodeAnimIndex].width / exports,
              _o =
                require[this.explodeAnimIndex].height / exports;
            var _r2 = i - l.camLeft - 0.5 * _t3,
              _h2 = s - l.camTop - 0.5 * _o;
            n.drawImage(
              require[this.explodeAnimIndex],
              _r2,
              _h2,
              _t3,
              _o,
            );
          }
        }));
    },
    skins: n.skins,
  };
};

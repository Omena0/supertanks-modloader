var n = require("./0"),
  l = require("./2"),
  o = require("./12")(0.18, window.devicePixelRatio || 1);
module.exports = function (module, exports) {
  ((this.x = module),
    (this.y = exports),
    (this.angle = 0),
    (this.name = "Name Unset"),
    (this.isKing = !1),
    (this.model = new o.TankModel()),
    (this.xVel = 0),
    (this.yVel = 0),
    (this.maxSpeed = n.TANK_MAX_SPEED),
    (this.angularSpeed = 0.25),
    (this.moving = !0),
    (this.beenHit = !1),
    (this.alive = !0),
    (this.boundingBox = [-18, -16, 26, -16, 26, 16, -18, 16]),
    (this.player = !1),
    (this.hitLastTurn = !1),
    (this.moveTowards = function (module, exports, require, n) {
      if (!this.beenHit)
        return l.tankMoveTowards(this, module, exports, require, n);
    }),
    (this.lookAt = function (module, exports, require) {
      this.beenHit || l.tankLookAtPoint(this, module, exports, require);
    }),
    (this.setSkin = function (module) {
      this.model.setSkin(module);
    }),
    (this.draw = function (module, exports) {
      (this.beenHit
        ? this.hitLastTurn ||
        (this.model.playDeathAnimation(), (this.hitLastTurn = !0))
        : (this.model.playMovementAnimation(), (this.hitLastTurn = !1)),
        this.model.renderModelOntoCanvas(
          module,
          exports,
          this.x,
          this.y,
          this.angle,
          this.isKing,
          this.name,
        ));
    }));
};

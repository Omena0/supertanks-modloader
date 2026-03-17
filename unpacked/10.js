var n = require("./2");
module.exports = function (module, exports, require, l, o) {
  ((this.id = module),
    (this.x = exports),
    (this.y = require),
    (this.xVel = l),
    (this.yVel = o),
    (this.timeToLive = 9000),
    (this.draw = function (module, exports) {
      ((module.fillStyle = "#101010"),
        module.beginPath(),
        module.arc(
          this.x - exports.camLeft,
          this.y - exports.camTop,
          4,
          0,
          2 * Math.PI,
        ),
        module.fill());
    }),
    (this.update = function (module, exports) {
      n.updateBulletsPosition(this, module, exports);
    }));
};

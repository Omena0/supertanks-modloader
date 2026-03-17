var n = require("./5");
function l(module) {
  var exports =
    arguments.length <= 1 || arguments[1] === undefined
      ? 2000
      : arguments[1];
  ((this.timeToLive = exports),
    (this.message = module),
    (this.width = 13 * module.length + 40),
    (this.height = 60),
    (this.draw = function (module, exports, require) {
      (this.timeToLive <= 0 && destroyGraphicsObject(this),
        (this.timeToLive -= require));
      var n = 0.5 * (module.canvas.clientWidth - this.width),
        l = 0.5 * module.canvas.clientHeight - this.height - 70;
      ((module.globalAlpha = 0.3),
        (module.shadowOffsetY = 6),
        (module.shadowBlur = 5),
        (module.shadowColor = "black"),
        module.fillRect(n, l, this.width, this.height),
        (module.globalAlpha = 0.95),
        (module.shadowOffsetY = 0),
        (module.shadowBlur = 0),
        (module.fillStyle = "#febd09"),
        module.fillRect(n, l, this.width, this.height),
        (module.strokeStyle = "#ffffff"),
        (module.lineWidth = 4),
        module.strokeRect(n, l, this.width, this.height),
        (module.globalAlpha = 1),
        (module.fillStyle = "#ffffff"),
        (module.font = "26px Fredoka One"),
        (module.textAlign = "center"),
        (module.shadowColor = "#e55b0e"),
        (module.shadowOffsetY = 4),
        module.fillText(
          this.message,
          n + 0.5 * this.width,
          l + 0.5 * this.height + 5,
        ),
        (module.shadowOffsetY = 0),
        (module.textAlign = "start"));
    }));
}
((l.prototype = new n()), (module.exports.PopUpNotification = l));

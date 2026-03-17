var n = require("./4");
require("./1");
function l(module, exports) {
  ((module = String(module).replace(/[^0-9a-f]/gi, "")).length < 6 &&
    (module =
      module[0] +
      module[0] +
      module[1] +
      module[1] +
      module[2] +
      module[2]),
    (exports = exports || 0));
  var require,
    n,
    l = "#";
  for (n = 0; n < 3; n++)
    ((require = parseInt(module.substr(2 * n, 2), 16)),
      (l += (
        "00" +
        (require = Math.round(
          Math.min(Math.max(0, require + require * exports), 255),
        ).toString(16))
      ).substr(require.length)));
  return l;
}
module.exports = (function (_n) {
  _inherits(_class2, _n);
  function _class2() {
    _classCallCheck(this, _class2);
    _get(
      Object.getPrototypeOf(_class2.prototype),
      "constructor",
      this,
    ).apply(this, arguments);
  }
  _createClass(_class2, [
    {
      key: "drawTank",
      value: function drawTank(module, exports, require) {
        var n = module * exports,
          o = document.createElement("canvas"),
          i = o.getContext("2d");
        var s = l(require, -0.106),
          r = l(require, -0.16),
          h = l(require, -0.17),
          c = l(require, -0.234),
          d = l(require, -0.458),
          f = l(require, -0.56),
          p = l(require, -0.631),
          g = l(require, -0.705),
          u = l(require, -0.5),
          x = [];
        (x.push({
          x: 0,
          y: 80,
        }),
          x.push({
            x: 22,
            y: 80,
          }),
          x.push({
            x: 22,
            y: 65,
          }),
          x.push({
            x: 70,
            y: 65,
          }),
          x.push({
            x: 102,
            y: 95,
          }),
          x.push({
            x: 102,
            y: 265,
          }),
          x.push({
            x: 90,
            y: 272,
          }),
          x.push({
            x: 22,
            y: 272,
          }),
          x.push({
            x: 22,
            y: 255,
          }),
          x.push({
            x: 0,
            y: 255,
          }));
        ((i.canvas.width = 204 * n),
          (i.canvas.height = 318 * n),
          i.scale(n, n),
          i.save(),
          i.translate(102, 40));
        var y = i.createLinearGradient(0, 255, 0, 274);
        (y.addColorStop(0, c),
          y.addColorStop(1, f),
          (i.fillStyle = y),
          i.fillRect(-28, 255, 56, 19),
          (y = i.createLinearGradient(0, 274, 0, 278)).addColorStop(
            0,
            p,
          ),
          y.addColorStop(1, g),
          (i.fillStyle = y),
          i.fillRect(-28, 274, 56, 4),
          i.restore(),
          i.save(),
          i.translate(102, 40),
          i.beginPath(),
          i.moveTo(x[0].x, x[0].y));
        for (var v = 1; v < x.length; v++) i.lineTo(x[v].x, x[v].y);
        for (v = x.length - 2; v >= 0; v--) i.lineTo(-x[v].x, x[v].y);
        return (
          i.closePath(),
          (i.fillStyle = require),
          i.fill(),
          i.clip(),
          (y = i.createLinearGradient(0, 0, 0, 92)).addColorStop(
            0,
            d,
          ),
          y.addColorStop(1, h),
          (i.fillStyle = y),
          i.fillRect(-200, 0, 400, 92),
          (y = i.createLinearGradient(0, 92, 0, 102)).addColorStop(
            0,
            h,
          ),
          y.addColorStop(1, require),
          (i.fillStyle = y),
          i.fillRect(-200, 92, 400, 173),
          (y = i.createLinearGradient(0, 265, 0, 272)).addColorStop(
            0,
            s,
          ),
          y.addColorStop(1, r),
          (i.fillStyle = y),
          i.fillRect(-200, 265, 400, 8),
          (i.shadowBlur = 15 * exports),
          (i.shadowColor = "rgba(0, 0, 0, 0.6)"),
          i.fillRect(-17, 0, 34, 106),
          (i.shadowBlur = 0),
          i.restore(),
          i.save(),
          (i.fillStyle = require),
          i.translate(102, 40),
          i.beginPath(),
          i.rect(-17, -40, 34, 146),
          i.closePath(),
          i.fill(),
          (y = i.createLinearGradient(-17, 0, -5, 0)).addColorStop(
            0,
            d,
          ),
          y.addColorStop(1, c),
          (i.fillStyle = y),
          i.fillRect(-17, -40, 17, 146),
          (y = i.createLinearGradient(5, 0, 17, 0)).addColorStop(
            0,
            c,
          ),
          y.addColorStop(1, d),
          (i.fillStyle = y),
          i.fillRect(0, -40, 17, 146),
          i.restore(),
          i.save(),
          (i.fillStyle = require),
          i.translate(102, 40),
          i.beginPath(),
          i.rect(-29, 106, 58, 26),
          i.closePath(),
          (i.shadowBlur = 10 * exports),
          (i.shadowColor = "rgba(0, 0, 0, 0.6)"),
          i.fill(),
          (i.shadowBlur = 0),
          i.clip(),
          (y = i.createLinearGradient(-29, 0, -5, 0)).addColorStop(
            0,
            d,
          ),
          y.addColorStop(1, c),
          (i.fillStyle = y),
          i.fillRect(-29, 106, 29, 26),
          (y = i.createLinearGradient(5, 0, 29, 0)).addColorStop(
            0,
            c,
          ),
          y.addColorStop(1, d),
          (i.fillStyle = y),
          i.fillRect(0, 106, 29, 26),
          i.restore(),
          i.save(),
          (i.fillStyle = c),
          i.translate(102, 40),
          (i.shadowBlur = 10 * exports),
          (i.shadowColor = "black"),
          i.beginPath(),
          i.arc(0, 185, 60, 0, 2 * Math.PI),
          i.closePath(),
          i.fill(),
          (i.shadowBlur = 0),
          (i.strokeStyle = u),
          (i.lineWidth = 5),
          i.beginPath(),
          i.arc(0, 185, 50, 0, 2 * Math.PI),
          i.closePath(),
          i.stroke(),
          i.restore(),
          o
        );
      },
    },
    {
      key: "drawTankTrack",
      value: function drawTankTrack(module) {
        var exports = document.createElement("canvas"),
          require = exports.getContext("2d"),
          n = 0 + 120 * Math.PI,
          l = n / 5 - 36;
        ((require.canvas.width = 65 * module),
          (require.canvas.height = 240 * module),
          require.scale(module, module),
          (require.fillStyle = "#292929"),
          require.fillRect(0, 0, 65, 240),
          (require.globalAlpha = 0.9));
        var o = require.createLinearGradient(0, 0, 0, 36);
        (o.addColorStop(0, "#101010"),
          o.addColorStop(1, "transparent"),
          (require.fillStyle = o),
          require.fillRect(0, 0, 65, 36));
        var i = require.createLinearGradient(0, 240, 0, 204);
        (i.addColorStop(0, "#101010"),
          i.addColorStop(1, "transparent"),
          (require.fillStyle = i),
          require.fillRect(0, 204, 65, 36),
          (require.globalAlpha = 1));
        var s = 0.5 * Math.PI * 120,
          r = s + 0,
          h = [];
        for (var c = 0; c <= 5; c++) {
          var _t4 = (c * (36 + l) + 36) % n;
          var _e3 = undefined,
            _a3 = 0;
          (_t4 < s
            ? ((_a3 = (s - _t4) / 120),
              (_e3 = 120 - 120 * Math.sin(_a3)))
            : _t4 > r
              ? ((_a3 = (_t4 - r) / 120),
                (_e3 = 120 + 120 * Math.sin(_a3)))
              : (_e3 = _t4 - s + 120),
            h.push({
              x: 0,
              y: _e3,
              angle: _a3,
              treadHeight: 36,
              treadWidth: 65,
              treadDepth: 40,
              trackHeight: 240,
            }));
        }
        var d = function d(module, _ref) {
          var exports = _ref.x;
          var require = _ref.y;
          var n = _ref.angle;
          var l = _ref.treadHeight;
          var o = _ref.treadWidth;
          var i = _ref.treadDepth;
          var s = _ref.trackHeight;
          var r = Math.cos(n),
            h = l * r,
            c = i * (1 - r);
          ((module.fillStyle = "#616161"),
            module.fillRect(exports, require - h / 2, o, h),
            (module.fillStyle = "#404040"));
          var d,
            f = require > s / 2 ? 1 : 0;
          (f
            ? module.fillRect(exports, require - h / 2 - c, o, c)
            : module.fillRect(exports, require + h / 2, o, c),
            (d = module.createLinearGradient(
              exports,
              require - h / 2,
              0,
              require - h / 2 - (h / 10) * 5,
            )).addColorStop(0, "#101010"),
            d.addColorStop(1, "transparent"),
            (module.fillStyle = d),
            f
              ? module.fillRect(
                exports,
                require - h / 2 - (h / 10) * 5 - c,
                o,
                (h / 10) * 5,
              )
              : module.fillRect(
                exports,
                require - h / 2 - (h / 10) * 5,
                o,
                (h / 10) * 5,
              ),
            (d = module.createLinearGradient(
              exports,
              require + h / 2,
              0,
              require + h / 2 + (h / 10) * 5,
            )).addColorStop(0, "#101010"),
            d.addColorStop(1, "transparent"),
            (module.fillStyle = d),
            f
              ? module.fillRect(
                exports,
                require + h / 2,
                o,
                (h / 10) * 5,
              )
              : module.fillRect(
                exports,
                require + h / 2 + c,
                o,
                (h / 10) * 5,
              ));
        };
        var f = h.sort(function (module, exports) {
          return exports.angle - module.angle;
        });
        for (c = 0; c < f.length; c++) d(require, f[c]);
        require.globalAlpha = 0.4;
        var p = require.createLinearGradient(0, 0, 0, 96);
        (p.addColorStop(0, "#101010"),
          p.addColorStop(1, "transparent"),
          (require.fillStyle = p));
        var g = require.createLinearGradient(0, 240, 0, 204);
        return (
          g.addColorStop(0, "#101010"),
          g.addColorStop(1, "transparent"),
          (require.fillStyle = g),
          exports
        );
      },
    },
    {
      key: "drawSkin",
      value: function drawSkin(module, exports, require) {
        var _this = this;
        var n = this.tankScale,
          l = this.getCachedGraphic("tankSprite", function () {
            return _this.drawTank(n, exports, _this.config.colour);
          }),
          o = this.getCachedGraphic("trackSprite", function () {
            return _this.drawTankTrack(n * exports);
          }),
          i = l.width / exports,
          s = l.height / exports,
          r = o.width / exports,
          h = o.height / exports;
        (module.translate(0.5 * -i, (225 / 318) * -s),
          module.drawImage(o, 9 * n, 80 * n, r, h),
          module.drawImage(o, 130 * n, 80 * n, r, h),
          module.drawImage(l, 0, 0, i, s));
      },
    },
  ]);
  return _class2;
})(n);

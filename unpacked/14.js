var n = require("./4");
require("./1");
module.exports = (function (_n2) {
  _inherits(_class3, _n2);
  function _class3(module) {
    _classCallCheck(this, _class3);
    (_get(
      Object.getPrototypeOf(_class3.prototype),
      "constructor",
      this,
    ).call(this, module),
      (this.points = []));
    for (var exports = 0; exports < 10; exports++)
      this.points.push({
        x: 0,
        y: 0,
      });
  }
  _createClass(_class3, [
    {
      key: "preDrawInScreenSpace",
      value: function preDrawInScreenSpace(module, exports) {
        var require = Math.cos(this.angle),
          n = Math.sin(this.angle);
        ((this.points[0].x = this.x + (-16 * require - 0 * n)),
          (this.points[0].y = this.y + (0 * require + -16 * n)),
          (this.points[1].x = this.points[0].x + -2 * require),
          (this.points[1].y = this.points[0].y + -2 * n));
        for (var l = 0; l < this.points.length - 1; l++) {
          var _points$l = this.points[l];
          var _t5 = _points$l.x;
          var _e4 = _points$l.y;
          var _points = this.points[l + 1];
          var _a4 = _points.x;
          var _n4 = _points.y;
          var o = Math.atan2(_n4 - _e4, _a4 - _t5);
          var i = 3;
          ((this.points[l + 1].x = _t5 + i * Math.cos(o)),
            (this.points[l + 1].y = _e4 + i * Math.sin(o)));
        }
        (module.beginPath(),
          module.moveTo(this.points[0].x, this.points[0].y));
        for (l = 1; l < this.points.length; l++) {
          var _points$l2 = this.points[l];
          var _e5 = _points$l2.x;
          var _a5 = _points$l2.y;
          module.lineTo(_e5, _a5);
        }
        ((module.strokeStyle = "#ce0804"),
          (module.lineWidth = 34),
          (module.lineJoin = "round"),
          (module.lineCap = "square"),
          module.stroke());
      },
    },
    {
      key: "drawSkin",
      value: function drawSkin(module, exports, require) {
        this.tankScale;
      },
    },
  ]);
  return _class3;
})(n);

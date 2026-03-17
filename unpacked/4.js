module.exports = (function () {
  function _class(module) {
    _classCallCheck(this, _class);
    ((this.config = module), (this.graphicsCache = {}));
  }
  _createClass(_class, [
    {
      key: "setConfig",
      value: function setConfig(module) {
        ((this.config = module), (this.graphicsCache = {}));
      },
    },
    {
      key: "getCachedGraphic",
      value: function getCachedGraphic(module, exports) {
        return (
          this.graphicsCache[module] ||
          (this.graphicsCache[module] = e()),
          this.graphicsCache[module]
        );
      },
    },
    {
      key: "processTankProperties",
      value: function processTankProperties(module) {
        ((this.angle = module.angle),
          (this.x = module.x),
          (this.y = module.y));
      },
    },
    {
      key: "processScreenProperties",
      value: function processScreenProperties(module) {
        (this.tankScale != module.tankScale &&
          (this.graphicsCache = {}),
          (this.tankScale = module.tankScale));
      },
    },
    {
      key: "draw",
      value: function draw(module, exports, a, n) {
        (this.processTankProperties(a),
          this.processScreenProperties(n),
          module.save(),
          module.translate(-this.x, -this.y),
          module.scale(this.tankScale / 0.18, this.tankScale / 0.18),
          this.preDrawInScreenSpace(module, exports),
          module.restore(),
          module.save(),
          module.rotate(this.angle + 0.5 * Math.PI),
          this.drawSkin(module, n.dpr, exports),
          module.restore(),
          module.save(),
          module.translate(-this.x, -this.y),
          module.scale(this.tankScale / 0.18, this.tankScale / 0.18),
          this.postDrawInScreenSpace(module, exports),
          module.restore());
      },
    },
    {
      key: "preDrawInScreenSpace",
      value: function preDrawInScreenSpace(module, exports) { },
    },
    {
      key: "drawSkin",
      value: function drawSkin(module, exports, a) { },
    },
    {
      key: "postDrawInScreenSpace",
      value: function postDrawInScreenSpace(module, exports) { },
    },
    {
      key: "getIcon",
      value: function getIcon(module) { },
    },
  ]);
  return _class;
})();

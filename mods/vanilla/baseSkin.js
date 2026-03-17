module.exports = (function () {
    function BaseSkin(config) {
        _classCallCheck(this, BaseSkin);
        this.config = config;
        this.graphicsCache = {};
    }

    _createClass(BaseSkin, [
        {
            key: "setConfig",
            value: function setConfig(config) {
                this.config = config;
                this.graphicsCache = {};
            },
        },
        {
            key: "getCachedGraphic",
            value: function getCachedGraphic(key, generator) {
                if (!this.graphicsCache[key]) this.graphicsCache[key] = generator();
                return this.graphicsCache[key];
            },
        },
        {
            key: "processTankProperties",
            value: function processTankProperties(tank) {
                this.angle = tank.angle;
                this.x = tank.x;
                this.y = tank.y;
            },
        },
        {
            key: "processScreenProperties",
            value: function processScreenProperties(screen) {
                if (this.tankScale != screen.tankScale) this.graphicsCache = {};
                this.tankScale = screen.tankScale;
            },
        },
        {
            key: "draw",
            value: function draw(ctx, state, tank, screen) {
                this.processTankProperties(tank);
                this.processScreenProperties(screen);

                ctx.save();
                ctx.translate(-this.x, -this.y);
                ctx.scale(this.tankScale / 0.18, this.tankScale / 0.18);
                this.preDrawInScreenSpace(ctx, state);
                ctx.restore();

                ctx.save();
                ctx.rotate(this.angle + 0.5 * Math.PI);
                this.drawSkin(ctx, screen.dpr, state);
                ctx.restore();

                ctx.save();
                ctx.translate(-this.x, -this.y);
                ctx.scale(this.tankScale / 0.18, this.tankScale / 0.18);
                this.postDrawInScreenSpace(ctx, state);
                ctx.restore();
            },
        },
        {
            key: "preDrawInScreenSpace",
            value: function preDrawInScreenSpace(ctx, state) {},
        },
        {
            key: "drawSkin",
            value: function drawSkin(ctx, dpr, state) {},
        },
        {
            key: "postDrawInScreenSpace",
            value: function postDrawInScreenSpace(ctx, state) {},
        },
        {
            key: "getIcon",
            value: function getIcon(size) {},
        },
    ]);

    return BaseSkin;
})();

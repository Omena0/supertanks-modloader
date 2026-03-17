var n = require("./0");
function l(module, exports, require, n, l, o) {
  var i =
    arguments.length <= 6 || arguments[6] === undefined
      ? 0.2
      : arguments[6];
  ((this.canvas = document.createElement("canvas")),
    (this.canvas.width = require),
    (this.canvas.height = require),
    (function (module, exports, require, n) {
      var l = exports,
        o = exports,
        i = 0.6 * exports * 0.5,
        s = 0,
        r = (2 * Math.PI) / 15,
        h = ((2 * Math.PI * i) / 15) * 0.5 * 1.1;
      ((module.fillStyle = require),
        (module.shadowBlur = exports * n),
        (module.shadowColor = "#c14210"),
        module.beginPath(),
        module.arc(0.5 * l, 0.5 * o, i, 0, 2 * Math.PI),
        module.fill());
      for (var c = 0; c < 15; c++) {
        var d = 0.5 * l + Math.cos(s + 0.3 * Math.random()) * i,
          f = 0.5 * o + Math.sin(s) * i,
          p = h * (1 + 0.4 * Math.random());
        (module.beginPath(),
          module.arc(d, f, p, 0, 2 * Math.PI),
          module.fill(),
          (s += r));
      }
    })(this.canvas.getContext("2d"), require, o, i),
    (this.x = module),
    (this.y = exports),
    (this.size = require),
    (this.scale = n),
    (this.alpha = l),
    (this.moveAwayFrom = function (module, exports, require) {
      var n = this.x - module,
        l = this.y - exports;
      ((this.x += n * require), (this.y += l * require));
    }),
    (this.draw = function (module) {
      (module.save(),
        (module.globalAlpha = this.alpha),
        module.translate(this.x, this.y),
        module.scale(this.scale, this.scale),
        module.drawImage(
          this.canvas,
          0.5 * -this.size,
          0.5 * -this.size,
        ),
        module.restore());
    }));
}
function o(module, exports, require) {
  var n = 6 * exports,
    l = 100 * exports,
    o = 100 * exports,
    s = document.createElement("canvas"),
    r = s.getContext("2d");
  ((r.canvas.width = l),
    (r.canvas.height = o),
    (r.fillStyle = require),
    r.fillRect(0, 0, l, o));
  var h = [];
  switch (module) {
    case 1:
      h.push(
        i(0, 0, l, o, 0.5, n, {
          x: 0,
          y: 1,
        }),
      );
      break;
    case 2:
      h.push(
        i(0.5 * l, 0, l, o, 0.5, n, {
          x: 1,
          y: 0,
        }),
      );
      break;
    case 3:
      (h.push(
        i(0, 0, l, o, 0.5, n, {
          x: 0,
          y: 1,
        }),
      ),
        h.push(
          i(0.5 * l, 0, l, o, 0.5, n, {
            x: 1,
            y: 0,
          }),
        ));
      break;
    case 4:
      h.push(
        i(0, 0.5 * o, l, o, 0.5, n, {
          x: 0,
          y: 1,
        }),
      );
      break;
    case 5:
      h.push(
        i(0, 0, l, o, 1, n, {
          x: 0,
          y: 1,
        }),
      );
      break;
    case 6:
      (h.push(
        i(0, 0.5 * o, l, o, 0.5, n, {
          x: 0,
          y: 1,
        }),
      ),
        h.push(
          i(0.5 * l, 0, l, o, 0.5, n, {
            x: 1,
            y: 0,
          }),
        ));
      break;
    case 7:
      (h.push(
        i(0, 0, l, o, 1, n, {
          x: 0,
          y: 1,
        }),
      ),
        h.push(
          i(0.5 * l, 0, l, o, 0.5, n, {
            x: 1,
            y: 0,
          }),
        ));
      break;
    case 8:
      h.push(
        i(0, 0, l, o, 0.5, n, {
          x: 1,
          y: 0,
        }),
      );
      break;
    case 9:
      (h.push(
        i(0, 0, l, o, 0.5, n, {
          x: 0,
          y: 1,
        }),
      ),
        h.push(
          i(0, 0, l, o, 0.5, n, {
            x: 1,
            y: 0,
          }),
        ));
      break;
    case 10:
      h.push(
        i(0, 0, l, o, 1, n, {
          x: 1,
          y: 0,
        }),
      );
      break;
    case 11:
      (h.push(
        i(0, 0, l, o, 1, n, {
          x: 1,
          y: 0,
        }),
      ),
        h.push(
          i(0, 0, l, o, 0.5, n, {
            x: 0,
            y: 1,
          }),
        ));
      break;
    case 12:
      (h.push(
        i(0, 0, l, o, 0.5, n, {
          x: 1,
          y: 0,
        }),
      ),
        h.push(
          i(0, 0.5 * o, l, o, 0.5, n, {
            x: 0,
            y: 1,
          }),
        ));
      break;
    case 13:
      (h.push(
        i(0, 0, l, o, 1, n, {
          x: 0,
          y: 1,
        }),
      ),
        h.push(
          i(0, 0, l, o, 0.5, n, {
            x: 1,
            y: 0,
          }),
        ));
      break;
    case 14:
      (h.push(
        i(0, 0, l, o, 1, n, {
          x: 1,
          y: 0,
        }),
      ),
        h.push(
          i(0, 0.5 * o, l, o, 0.5, n, {
            x: 0,
            y: 1,
          }),
        ));
      break;
    case 15:
      (h.push(
        i(0, 0, l, o, 1, n, {
          x: 1,
          y: 0,
        }),
      ),
        h.push(
          i(0, 0, l, o, 1, n, {
            x: 0,
            y: 1,
          }),
        ));
  }
  r.globalAlpha = 0.6;
  for (var c = 0; c < h.length; c++) r.drawImage(h[c].underLayer, 0, 0);
  r.globalAlpha = 1;
  for (c = 0; c < h.length; c++) r.drawImage(h[c].outlineLayer, 0, 0);
  for (c = 0; c < h.length; c++) r.drawImage(h[c].wallLayer, 0, 0);
  return s;
}
function i(module, exports, require, n, l, o, i) {
  var s = module + i.y * require * 0.5,
    r = exports + i.x * n * 0.5,
    h = (i.x, i.y, document.createElement("canvas")),
    c = h.getContext("2d");
  ((c.canvas.width = require), (c.canvas.height = n));
  var d = document.createElement("canvas"),
    f = d.getContext("2d");
  ((f.canvas.width = require), (f.canvas.height = n));
  var p = document.createElement("canvas"),
    g = p.getContext("2d");
  ((g.canvas.width = require),
    (g.canvas.height = n),
    (g.globalAlpha = 0.5),
    (g.fillStyle = "#8f5c2c"));
  for (var u = 0; u < 300 * l; u++) {
    var x = 1;
    Math.random() < 0.6 && (x = 0.5);
    var y =
      i.x * require * l * Math.random() +
      i.y * o * (Math.random() - 0.5) * x * 7,
      v =
        i.y * n * l * Math.random() +
        i.x * o * (Math.random() - 0.5) * x * 7,
      w = (1 * Math.random() + 1) * (require / 100);
    (g.beginPath(),
      g.arc(s + y, r + v, w, 0, 2 * Math.PI),
      g.closePath(),
      g.fill());
  }
  ((g.globalAlpha = 0.9), (g.fillStyle = "#dc9e31"));
  for (u = 0; u < 100 * l; u++) {
    ((y =
      i.x * require * l * Math.random() +
      i.y * o * (Math.random() - 0.5) * 4),
      (v =
        i.y * n * l * Math.random() +
        i.x * o * (Math.random() - 0.5) * 4),
      (w = (1 * Math.random() + 1) * (require / 100)));
    (g.beginPath(),
      g.arc(s + y, r + v, w, 0, 2 * Math.PI),
      g.closePath(),
      g.fill());
  }
  ((g.globalAlpha = 1), (g.globalAlpha = 0.2), (g.fillStyle = "#8a9d36"));
  for (u = 0; u < 500 * l; u++) {
    x = 1;
    Math.random() < 0.7 ? (x = 0.4) : Math.random() < 0.5 && (x = 0.7);
    ((y =
      i.x * require * l * Math.random() +
      i.y * o * (Math.random() - 0.5) * x * 7),
      (v =
        i.y * n * l * Math.random() +
        i.x * o * (Math.random() - 0.5) * x * 7),
      (w = (3 * Math.random() + 1) * (require / 100)));
    (g.beginPath(),
      g.arc(s + y, r + v, w, 0, 2 * Math.PI),
      g.closePath(),
      g.fill());
  }
  var m = s - 0.5 * o,
    S = r - 0.5 * o,
    b = i.x * (require * l + o) + i.y * o,
    M = i.y * (n * l + o) + i.x * o;
  return (
    (f.globalAlpha = 1),
    (f.lineWidth = (require / 100) * 6),
    (f.strokeStyle = "#31363d"),
    (f.lineJoin = "round"),
    (f.shadowBlur = (require / 100) * 20),
    (f.shadowColor = "rgba(0, 0, 0, 0.4)"),
    f.beginPath(),
    f.moveTo(m, S),
    f.lineTo(m + b, S),
    f.lineTo(m + b, S + M),
    f.lineTo(m, S + M),
    f.closePath(),
    f.stroke(),
    f.fill(),
    (c.globalAlpha = 1),
    (c.fillStyle = "#324965"),
    c.fillRect(m, S, b, M),
    {
      wallLayer: h,
      outlineLayer: d,
      underLayer: p,
    }
  );
}
((module.exports.generateWallSpriteSheet = function (module, exports) {
  for (var require = [0], n = exports, l = 1; l <= 15; l++)
    require.push(o(l, n, module));
  return require;
}),
  (module.exports.generateExplosionSpriteSheet = function (module, exports) {
    for (
      var require = [],
      n = 0,
      o = 0.5 * module,
      i = [],
      s = [],
      r = [],
      h = [],
      c = 0,
      d = 6,
      f = 0.03 * module,
      p = 0,
      g = (2 * Math.PI) / d,
      u = 0;
      u < d;
      u++
    ) {
      var x = p + 0.6 * (Math.random() - 0.5),
        y = o + Math.cos(x) * f,
        v = o + Math.sin(x) * f;
      (i.push(
        new l(
          y,
          v,
          (200 + 100 * Math.random()) * (module / 200),
          0.05,
          0.4,
          "#6c3340",
        ),
      ),
        (p += g));
    }
    for (
      d = 8, f = 0.03 * module, p = 0, g = (2 * Math.PI) / d, u = 0;
      u < d;
      u++
    ) {
      ((x = p + 0.6 * (Math.random() - 0.5)),
        (y = o + Math.cos(x) * f),
        (v = o + Math.sin(x) * f));
      var w = "#f1953d";
      (Math.random() < 0.5 && (w = "#f4bd75"),
        s.push(
          new l(
            y,
            v,
            (200 + 100 * Math.random()) * (module / 200),
            0.05,
            0.4,
            w,
            0,
          ),
        ),
        (p += g));
    }
    for (
      d = 6, f = 0.02 * module, p = 0, g = (2 * Math.PI) / d, u = 0;
      u < d;
      u++
    ) {
      ((x = p + 0.7 * (Math.random() - 0.5)),
        (y = o + Math.cos(x) * f),
        (v = o + Math.sin(x) * f));
      (r.push(
        new l(
          y,
          v,
          (150 + 150 * Math.random()) * (module / 200),
          0.05,
          0.1,
          "#4b3243",
        ),
      ),
        (p += g));
    }
    for (
      d = 3, f = 0.02 * module, p = 0, g = (2 * Math.PI) / d, u = 0;
      u < d;
      u++
    ) {
      ((x = p + 0.7 * (Math.random() - 0.5)),
        (y = o + Math.cos(x) * f),
        (v = o + Math.sin(x) * f),
        (w = "#e09689"));
      (Math.random() < 0.5 && (w = "#e8c39c"),
        h.push(
          new l(
            y,
            v,
            (150 + 150 * Math.random()) * (module / 200),
            0.05,
            0.08,
            w,
          ),
        ),
        (p += g));
    }
    function m(exports) {
      for (var require = 0; require < i.length; require++)
        (i[require].moveAwayFrom(o, o, 0.02),
          (i[require].alpha -= 0.005),
          n < 2
            ? (i[require].scale += 0.08)
            : n < 4
              ? (i[require].scale += 0.06)
              : n < 7
                ? (i[require].scale += 0.04)
                : n < 12
                  ? (i[require].scale += 0.02)
                  : n < 20
                    ? (i[require].scale += 0.005)
                    : n < 40 && (i[require].alpha -= 0.005),
          i[require].alpha < 0 && (i[require].alpha = 0));
      for (require = 0; require < s.length; require++)
        (s[require].moveAwayFrom(o, o, 0.02),
          n < 4
            ? ((s[require].scale += 0.08),
              (s[require].alpha += 0.02))
            : n < 8
              ? ((s[require].scale += 0.03),
                (s[require].alpha += 0.01))
              : n < 20
                ? (s[require].scale -= 0.001)
                : n < 40
                  ? (s[require].alpha -= 0.02)
                  : n > 65 && (s[require].alpha -= 0.005),
          s[require].alpha < 0 && (s[require].alpha = 0));
      for (require = 0; require < r.length; require++)
        (r[require].moveAwayFrom(o, o, 0.01),
          n < 2
            ? (r[require].scale += 0.04)
            : n < 6
              ? (r[require].scale += 0.035)
              : n < 10
                ? (r[require].scale += 0.025)
                : n < 50
                  ? (r[require].scale += 0.005)
                  : ((r[require].scale += 0.005),
                    (r[require].alpha -= 0.005)),
          r[require].alpha < 0 && (r[require].alpha = 0));
      for (require = 0; require < h.length; require++)
        (h[require].moveAwayFrom(o, o, 0.02),
          n < 2
            ? ((h[require].scale += 0.04),
              (h[require].alpha += 0.05))
            : n < 6
              ? (h[require].scale += 0.035)
              : (h[require].alpha -= 0.005),
          h[require].alpha < 0 && (h[require].alpha = 0));
      (n < 20 ? (c += 0.05) : n > 30 && (c -= 0.02), c < 0 && (c = 0));
      for (require = 0; require < i.length; require++)
        i[require].draw(exports);
      for (require = 0; require < s.length; require++)
        s[require].draw(exports);
      for (require = 0; require < r.length; require++)
        r[require].draw(exports);
      for (require = 0; require < h.length; require++)
        h[require].draw(exports);
      var l = exports.createRadialGradient(
        o,
        o,
        0.5 * module,
        0.5 * module,
        0.5 * module,
        0,
      );
      (l.addColorStop(0, "transparent"),
        l.addColorStop(1, "#ff7f1d"),
        (exports.fillStyle = l),
        (exports.globalAlpha = c),
        (exports.globalCompositeOperation = "lighter"),
        exports.fillRect(0, 0, module, module),
        (exports.globalCompositeOperation = "normal"),
        (exports.globalAlpha = 1),
        n++);
    }
    return (
      (function (module, exports) {
        for (var n = 0; n < exports; n++) {
          var l = document.createElement("canvas");
          ((l.width = module),
            (l.height = module),
            m(l.getContext("2d")),
            require.push(l));
        }
      })(module, exports),
      require
    );
  }),
  (module.exports.generateScorchSprite = function (module) {
    var exports = 0.5 * module;
    Math.PI;
    var require = document.createElement("canvas"),
      n = require.getContext("2d");
    return (
      (n.canvas.width = 2 * exports),
      (n.canvas.height = 2 * exports),
      (n.globalAlpha = 0.6),
      (function (module, exports) {
        var require = 0.1 * exports,
          n = 0.5 * exports,
          l = 0,
          o = ((2 * Math.PI) / 21) * 0.5,
          i = n;
        (module.beginPath(),
          module.moveTo(i + Math.cos(l) * n, i + Math.sin(l) * n));
        for (var s = 0; s < 21; s++) {
          l += o;
          var r = Math.random();
          (module.lineTo(
            i + Math.cos(l) * require * r,
            i + Math.sin(l) * require * r,
          ),
            (l += o),
            (r = Math.random()),
            module.lineTo(
              i + Math.cos(l) * n * r,
              i + Math.sin(l) * n * r,
            ));
        }
        module.closePath();
        var h = module.createRadialGradient(i, i, require, i, i, 1 * n);
        (h.addColorStop(0, "#3b3b3b"),
          h.addColorStop(1, "transparent"),
          (module.fillStyle = h),
          (module.shadowBlur = 0.05 * exports),
          (module.shadowColor = "black"),
          module.fill());
      })(n, module),
      require
    );
  }),
  (module.exports.skins = n.TANK_COLOURS));

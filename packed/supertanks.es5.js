"use strict";

var _get = function get(_x3, _x4, _x5) {
  var _again = true;
  _function: while (_again) {
    var object = _x3,
      property = _x4,
      receiver = _x5;
    _again = false;
    if (object === null) object = Function.prototype;
    var desc = Object.getOwnPropertyDescriptor(object, property);
    if (desc === undefined) {
      var parent = Object.getPrototypeOf(object);
      if (parent === null) {
        return undefined;
      } else {
        _x3 = parent;
        _x4 = property;
        _x5 = receiver;
        _again = true;
        desc = parent = undefined;
        continue _function;
      }
    } else if ("value" in desc) {
      return desc.value;
    } else {
      var getter = desc.get;
      if (getter === undefined) {
        return undefined;
      }
      return getter.call(receiver);
    }
  }
};

var _createClass = (function () {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }
  return function (Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);
    if (staticProps) defineProperties(Constructor, staticProps);
    return Constructor;
  };
})();

function _toConsumableArray(arr) {
  if (Array.isArray(arr)) {
    for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++)
      arr2[i] = arr[i];
    return arr2;
  } else {
    return Array.from(arr);
  }
}

function _inherits(subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError(
      "Super expression must either be null or a function, not " +
      typeof superClass,
    );
  }
  subClass.prototype = Object.create(superClass && superClass.prototype, {
    constructor: {
      value: subClass,
      enumerable: false,
      writable: true,
      configurable: true,
    },
  });
  if (superClass)
    Object.setPrototypeOf
      ? Object.setPrototypeOf(subClass, superClass)
      : (subClass.__proto__ = superClass);
}

function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

var EntryPoint = (function (t) {
  var e = {};
  function a(n) {
    if (e[n]) return e[n].exports;
    var l = (e[n] = { i: n, l: !1, exports: {} });
    return (t[n].call(l.exports, l, l.exports, a), (l.l = !0), l.exports);
  }
  return (
    (a.m = t),
    (a.c = e),
    (a.d = function (t, e, n) {
      a.o(t, e) ||
        Object.defineProperty(t, e, { enumerable: !0, get: n });
    }),
    (a.r = function (t) {
      ("undefined" != typeof Symbol &&
        Symbol.toStringTag &&
        Object.defineProperty(t, Symbol.toStringTag, {
          value: "Module",
        }),
        Object.defineProperty(t, "__esModule", { value: !0 }));
    }),
    (a.t = function (t, e) {
      if ((1 & e && (t = a(t)), 8 & e)) return t;
      if (4 & e && "object" == typeof t && t && t.__esModule) return t;
      var n = Object.create(null);
      if (
        (a.r(n),
          Object.defineProperty(n, "default", {
            enumerable: !0,
            value: t,
          }),
          2 & e && "string" != typeof t)
      )
        for (var l in t)
          a.d(
            n,
            l,
            function (e) {
              return t[e];
            }.bind(null, l),
          );
      return n;
    }),
    (a.n = function (t) {
      var e =
        t && t.__esModule
          ? function () {
            return t["default"];
          }
          : function () {
            return t;
          };
      return (a.d(e, "a", e), e);
    }),
    (a.o = function (t, e) {
      return Object.prototype.hasOwnProperty.call(t, e);
    }),
    (a.p = ""),
    a((a.s = 6))
  );
})([
  function (t, e) {
    ((t.exports.TANK_COLOURS = [
      "#002BFF",
      "#F51200",
      "#00cdcd",
      "#ffb90f",
      "#9a32cd",
      "#ff1493",
      "#73FF00",
      "#05A800",
      "#FF5F00",
    ]),
      (t.exports.ROOM_CAPACITY = 10),
      (t.exports.TANK_DEFAULT_BULLETCOUNT = 3),
      (t.exports.TANK_MAX_BULLET_COUNT = 12),
      (t.exports.TANK_BOUNDING_BOX = [
        -18, -16, 26, -16, 26, 16, -18, 16,
      ]),
      (t.exports.TANK_MAX_SPEED = 0.15),
      (t.exports.PHYSICS_INTERVAL = 1e3 / 60),
      (t.exports.SEND_STATE_INTERVAL = 1e3 / 30),
      (t.exports.SEND_BULLETS_STATE_INTERVAL = 1e3 / 6),
      (t.exports.EXP_PER_KILL = 7));
  },
  function (t, e, a) {
    var n = a(0);
    function l(t, e, a, n, l, o) {
      var i =
        arguments.length <= 6 || arguments[6] === undefined
          ? 0.2
          : arguments[6];
      ((this.canvas = document.createElement("canvas")),
        (this.canvas.width = a),
        (this.canvas.height = a),
        (function (t, e, a, n) {
          var l = e,
            o = e,
            i = 0.6 * e * 0.5,
            s = 0,
            r = (2 * Math.PI) / 15,
            h = ((2 * Math.PI * i) / 15) * 0.5 * 1.1;
          ((t.fillStyle = a),
            (t.shadowBlur = e * n),
            (t.shadowColor = "#c14210"),
            t.beginPath(),
            t.arc(0.5 * l, 0.5 * o, i, 0, 2 * Math.PI),
            t.fill());
          for (var c = 0; c < 15; c++) {
            var d = 0.5 * l + Math.cos(s + 0.3 * Math.random()) * i,
              f = 0.5 * o + Math.sin(s) * i,
              p = h * (1 + 0.4 * Math.random());
            (t.beginPath(),
              t.arc(d, f, p, 0, 2 * Math.PI),
              t.fill(),
              (s += r));
          }
        })(this.canvas.getContext("2d"), a, o, i),
        (this.x = t),
        (this.y = e),
        (this.size = a),
        (this.scale = n),
        (this.alpha = l),
        (this.moveAwayFrom = function (t, e, a) {
          var n = this.x - t,
            l = this.y - e;
          ((this.x += n * a), (this.y += l * a));
        }),
        (this.draw = function (t) {
          (t.save(),
            (t.globalAlpha = this.alpha),
            t.translate(this.x, this.y),
            t.scale(this.scale, this.scale),
            t.drawImage(
              this.canvas,
              0.5 * -this.size,
              0.5 * -this.size,
            ),
            t.restore());
        }));
    }
    function o(t, e, a) {
      var n = 6 * e,
        l = 100 * e,
        o = 100 * e,
        s = document.createElement("canvas"),
        r = s.getContext("2d");
      ((r.canvas.width = l),
        (r.canvas.height = o),
        (r.fillStyle = a),
        r.fillRect(0, 0, l, o));
      var h = [];
      switch (t) {
        case 1:
          h.push(i(0, 0, l, o, 0.5, n, { x: 0, y: 1 }));
          break;
        case 2:
          h.push(i(0.5 * l, 0, l, o, 0.5, n, { x: 1, y: 0 }));
          break;
        case 3:
          (h.push(i(0, 0, l, o, 0.5, n, { x: 0, y: 1 })),
            h.push(i(0.5 * l, 0, l, o, 0.5, n, { x: 1, y: 0 })));
          break;
        case 4:
          h.push(i(0, 0.5 * o, l, o, 0.5, n, { x: 0, y: 1 }));
          break;
        case 5:
          h.push(i(0, 0, l, o, 1, n, { x: 0, y: 1 }));
          break;
        case 6:
          (h.push(i(0, 0.5 * o, l, o, 0.5, n, { x: 0, y: 1 })),
            h.push(i(0.5 * l, 0, l, o, 0.5, n, { x: 1, y: 0 })));
          break;
        case 7:
          (h.push(i(0, 0, l, o, 1, n, { x: 0, y: 1 })),
            h.push(i(0.5 * l, 0, l, o, 0.5, n, { x: 1, y: 0 })));
          break;
        case 8:
          h.push(i(0, 0, l, o, 0.5, n, { x: 1, y: 0 }));
          break;
        case 9:
          (h.push(i(0, 0, l, o, 0.5, n, { x: 0, y: 1 })),
            h.push(i(0, 0, l, o, 0.5, n, { x: 1, y: 0 })));
          break;
        case 10:
          h.push(i(0, 0, l, o, 1, n, { x: 1, y: 0 }));
          break;
        case 11:
          (h.push(i(0, 0, l, o, 1, n, { x: 1, y: 0 })),
            h.push(i(0, 0, l, o, 0.5, n, { x: 0, y: 1 })));
          break;
        case 12:
          (h.push(i(0, 0, l, o, 0.5, n, { x: 1, y: 0 })),
            h.push(i(0, 0.5 * o, l, o, 0.5, n, { x: 0, y: 1 })));
          break;
        case 13:
          (h.push(i(0, 0, l, o, 1, n, { x: 0, y: 1 })),
            h.push(i(0, 0, l, o, 0.5, n, { x: 1, y: 0 })));
          break;
        case 14:
          (h.push(i(0, 0, l, o, 1, n, { x: 1, y: 0 })),
            h.push(i(0, 0.5 * o, l, o, 0.5, n, { x: 0, y: 1 })));
          break;
        case 15:
          (h.push(i(0, 0, l, o, 1, n, { x: 1, y: 0 })),
            h.push(i(0, 0, l, o, 1, n, { x: 0, y: 1 })));
      }
      r.globalAlpha = 0.6;
      for (var c = 0; c < h.length; c++)
        r.drawImage(h[c].underLayer, 0, 0);
      r.globalAlpha = 1;
      for (c = 0; c < h.length; c++) r.drawImage(h[c].outlineLayer, 0, 0);
      for (c = 0; c < h.length; c++) r.drawImage(h[c].wallLayer, 0, 0);
      return s;
    }
    function i(t, e, a, n, l, o, i) {
      var s = t + i.y * a * 0.5,
        r = e + i.x * n * 0.5,
        h = (i.x, i.y, document.createElement("canvas")),
        c = h.getContext("2d");
      ((c.canvas.width = a), (c.canvas.height = n));
      var d = document.createElement("canvas"),
        f = d.getContext("2d");
      ((f.canvas.width = a), (f.canvas.height = n));
      var p = document.createElement("canvas"),
        g = p.getContext("2d");
      ((g.canvas.width = a),
        (g.canvas.height = n),
        (g.globalAlpha = 0.5),
        (g.fillStyle = "#8f5c2c"));
      for (var u = 0; u < 300 * l; u++) {
        var x = 1;
        Math.random() < 0.6 && (x = 0.5);
        var y =
          i.x * a * l * Math.random() +
          i.y * o * (Math.random() - 0.5) * x * 7,
          v =
            i.y * n * l * Math.random() +
            i.x * o * (Math.random() - 0.5) * x * 7,
          w = (1 * Math.random() + 1) * (a / 100);
        (g.beginPath(),
          g.arc(s + y, r + v, w, 0, 2 * Math.PI),
          g.closePath(),
          g.fill());
      }
      ((g.globalAlpha = 0.9), (g.fillStyle = "#dc9e31"));
      for (u = 0; u < 100 * l; u++) {
        ((y =
          i.x * a * l * Math.random() +
          i.y * o * (Math.random() - 0.5) * 4),
          (v =
            i.y * n * l * Math.random() +
            i.x * o * (Math.random() - 0.5) * 4),
          (w = (1 * Math.random() + 1) * (a / 100)));
        (g.beginPath(),
          g.arc(s + y, r + v, w, 0, 2 * Math.PI),
          g.closePath(),
          g.fill());
      }
      ((g.globalAlpha = 1),
        (g.globalAlpha = 0.2),
        (g.fillStyle = "#8a9d36"));
      for (u = 0; u < 500 * l; u++) {
        x = 1;
        Math.random() < 0.7
          ? (x = 0.4)
          : Math.random() < 0.5 && (x = 0.7);
        ((y =
          i.x * a * l * Math.random() +
          i.y * o * (Math.random() - 0.5) * x * 7),
          (v =
            i.y * n * l * Math.random() +
            i.x * o * (Math.random() - 0.5) * x * 7),
          (w = (3 * Math.random() + 1) * (a / 100)));
        (g.beginPath(),
          g.arc(s + y, r + v, w, 0, 2 * Math.PI),
          g.closePath(),
          g.fill());
      }
      var m = s - 0.5 * o,
        S = r - 0.5 * o,
        b = i.x * (a * l + o) + i.y * o,
        M = i.y * (n * l + o) + i.x * o;
      return (
        (f.globalAlpha = 1),
        (f.lineWidth = (a / 100) * 6),
        (f.strokeStyle = "#31363d"),
        (f.lineJoin = "round"),
        (f.shadowBlur = (a / 100) * 20),
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
        { wallLayer: h, outlineLayer: d, underLayer: p }
      );
    }
    ((t.exports.generateWallSpriteSheet = function (t, e) {
      for (var a = [0], n = e, l = 1; l <= 15; l++) a.push(o(l, n, t));
      return a;
    }),
      (t.exports.generateExplosionSpriteSheet = function (t, e) {
        for (
          var a = [],
          n = 0,
          o = 0.5 * t,
          i = [],
          s = [],
          r = [],
          h = [],
          c = 0,
          d = 6,
          f = 0.03 * t,
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
              (200 + 100 * Math.random()) * (t / 200),
              0.05,
              0.4,
              "#6c3340",
            ),
          ),
            (p += g));
        }
        for (
          d = 8, f = 0.03 * t, p = 0, g = (2 * Math.PI) / d, u = 0;
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
                (200 + 100 * Math.random()) * (t / 200),
                0.05,
                0.4,
                w,
                0,
              ),
            ),
            (p += g));
        }
        for (
          d = 6, f = 0.02 * t, p = 0, g = (2 * Math.PI) / d, u = 0;
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
              (150 + 150 * Math.random()) * (t / 200),
              0.05,
              0.1,
              "#4b3243",
            ),
          ),
            (p += g));
        }
        for (
          d = 3, f = 0.02 * t, p = 0, g = (2 * Math.PI) / d, u = 0;
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
                (150 + 150 * Math.random()) * (t / 200),
                0.05,
                0.08,
                w,
              ),
            ),
            (p += g));
        }
        function m(e) {
          for (var a = 0; a < i.length; a++)
            (i[a].moveAwayFrom(o, o, 0.02),
              (i[a].alpha -= 0.005),
              n < 2
                ? (i[a].scale += 0.08)
                : n < 4
                  ? (i[a].scale += 0.06)
                  : n < 7
                    ? (i[a].scale += 0.04)
                    : n < 12
                      ? (i[a].scale += 0.02)
                      : n < 20
                        ? (i[a].scale += 0.005)
                        : n < 40 && (i[a].alpha -= 0.005),
              i[a].alpha < 0 && (i[a].alpha = 0));
          for (a = 0; a < s.length; a++)
            (s[a].moveAwayFrom(o, o, 0.02),
              n < 4
                ? ((s[a].scale += 0.08), (s[a].alpha += 0.02))
                : n < 8
                  ? ((s[a].scale += 0.03), (s[a].alpha += 0.01))
                  : n < 20
                    ? (s[a].scale -= 0.001)
                    : n < 40
                      ? (s[a].alpha -= 0.02)
                      : n > 65 && (s[a].alpha -= 0.005),
              s[a].alpha < 0 && (s[a].alpha = 0));
          for (a = 0; a < r.length; a++)
            (r[a].moveAwayFrom(o, o, 0.01),
              n < 2
                ? (r[a].scale += 0.04)
                : n < 6
                  ? (r[a].scale += 0.035)
                  : n < 10
                    ? (r[a].scale += 0.025)
                    : n < 50
                      ? (r[a].scale += 0.005)
                      : ((r[a].scale += 0.005),
                        (r[a].alpha -= 0.005)),
              r[a].alpha < 0 && (r[a].alpha = 0));
          for (a = 0; a < h.length; a++)
            (h[a].moveAwayFrom(o, o, 0.02),
              n < 2
                ? ((h[a].scale += 0.04), (h[a].alpha += 0.05))
                : n < 6
                  ? (h[a].scale += 0.035)
                  : (h[a].alpha -= 0.005),
              h[a].alpha < 0 && (h[a].alpha = 0));
          (n < 20 ? (c += 0.05) : n > 30 && (c -= 0.02),
            c < 0 && (c = 0));
          for (a = 0; a < i.length; a++) i[a].draw(e);
          for (a = 0; a < s.length; a++) s[a].draw(e);
          for (a = 0; a < r.length; a++) r[a].draw(e);
          for (a = 0; a < h.length; a++) h[a].draw(e);
          var l = e.createRadialGradient(
            o,
            o,
            0.5 * t,
            0.5 * t,
            0.5 * t,
            0,
          );
          (l.addColorStop(0, "transparent"),
            l.addColorStop(1, "#ff7f1d"),
            (e.fillStyle = l),
            (e.globalAlpha = c),
            (e.globalCompositeOperation = "lighter"),
            e.fillRect(0, 0, t, t),
            (e.globalCompositeOperation = "normal"),
            (e.globalAlpha = 1),
            n++);
        }
        return (
          (function (t, e) {
            for (var n = 0; n < e; n++) {
              var l = document.createElement("canvas");
              ((l.width = t),
                (l.height = t),
                m(l.getContext("2d")),
                a.push(l));
            }
          })(t, e),
          a
        );
      }),
      (t.exports.generateScorchSprite = function (t) {
        var e = 0.5 * t;
        Math.PI;
        var a = document.createElement("canvas"),
          n = a.getContext("2d");
        return (
          (n.canvas.width = 2 * e),
          (n.canvas.height = 2 * e),
          (n.globalAlpha = 0.6),
          (function (t, e) {
            var a = 0.1 * e,
              n = 0.5 * e,
              l = 0,
              o = ((2 * Math.PI) / 21) * 0.5,
              i = n;
            (t.beginPath(),
              t.moveTo(i + Math.cos(l) * n, i + Math.sin(l) * n));
            for (var s = 0; s < 21; s++) {
              l += o;
              var r = Math.random();
              (t.lineTo(
                i + Math.cos(l) * a * r,
                i + Math.sin(l) * a * r,
              ),
                (l += o),
                (r = Math.random()),
                t.lineTo(
                  i + Math.cos(l) * n * r,
                  i + Math.sin(l) * n * r,
                ));
            }
            t.closePath();
            var h = t.createRadialGradient(i, i, a, i, i, 1 * n);
            (h.addColorStop(0, "#3b3b3b"),
              h.addColorStop(1, "transparent"),
              (t.fillStyle = h),
              (t.shadowBlur = 0.05 * e),
              (t.shadowColor = "black"),
              t.fill());
          })(n, t),
          a
        );
      }),
      (t.exports.skins = n.TANK_COLOURS));
  },
  function (t, e, a) {
    var n = a(0),
      l = a(3);
    function o(t, e, a) {
      var n = Math.atan2(a - t.y, e - t.x);
      if (
        Math.min(
          Math.abs(n - t.angle),
          Math.abs(n - (t.angle + 2 * Math.PI)),
          Math.abs(n - (t.angle - 2 * Math.PI)),
        ) <= t.angularSpeed
      )
        return void (t.angle = n);
      var l = 1;
      (Math.abs(n - t.angle) > Math.PI && (l = -1),
        (t.angle < n && 1 == l) || (t.angle > n && -1 == l)
          ? (t.angle += t.angularSpeed)
          : (t.angle -= t.angularSpeed));
      var o = 2 * Math.PI;
      ((t.angle %= o),
        (t.angle = (t.angle + o) % o),
        t.angle > Math.PI && (t.angle -= o));
    }
    function i(t, e) {
      for (var a = 0; a < 8; a += 2)
        ((t.boundingBox[a] =
          t.x +
          n.TANK_BOUNDING_BOX[a] * Math.cos(t.angle) -
          n.TANK_BOUNDING_BOX[a + 1] * Math.sin(t.angle)),
          (t.boundingBox[a + 1] =
            t.y +
            n.TANK_BOUNDING_BOX[a] * Math.sin(t.angle) +
            n.TANK_BOUNDING_BOX[a + 1] * Math.cos(t.angle)));
      var o = Math.floor(t.x / 100),
        i = Math.floor(t.y / 100),
        s = !1;
      for (a = 0; a < 4; a++) {
        var r = t.boundingBox[2 * a],
          h = t.boundingBox[2 * a + 1],
          c = r - t.x,
          d = h - t.y;
        (c < 0
          ? r < 100 * o + 5 &&
          1 == e.verticalWalls[i * (e.cellsAcross + 1) + o] &&
          ((t.x += 100 * o + 5 - r), (s = !0))
          : c > 0 &&
          r > 100 * o + 95 &&
          1 == e.verticalWalls[i * (e.cellsAcross + 1) + (o + 1)] &&
          ((t.x += 100 * o + 95 - r), (s = !0)),
          d < 0
            ? h < 100 * i + 5 &&
            1 == e.horisontalWalls[i * e.cellsAcross + o] &&
            ((t.y += 100 * i + 5 - h), (s = !0))
            : d > 0 &&
            h > 100 * i + 95 &&
            1 == e.horisontalWalls[(i + 1) * e.cellsAcross + o] &&
            ((t.y += 100 * i + 95 - h), (s = !0)));
      }
      s ||
        (t.y - 100 * i < 50
          ? t.x - 100 * o < 50
            ? 1 == e.wallCorners[i * (e.cellsAcross + 1) + o] &&
            l.checkAndResolveOBBAABB(
              t,
              t.boundingBox,
              100 * o - 5,
              100 * o + 5,
              100 * i - 5,
              100 * i + 5,
            )
            : 1 ==
            e.wallCorners[
            i * (e.cellsAcross + 1) + (o + 1)
            ] &&
            l.checkAndResolveOBBAABB(
              t,
              t.boundingBox,
              100 * o + 95,
              100 * o + 105,
              100 * i - 5,
              100 * i + 5,
            )
          : t.x - 100 * o < 50
            ? 1 == e.wallCorners[(i + 1) * (e.cellsAcross + 1) + o] &&
            l.checkAndResolveOBBAABB(
              t,
              t.boundingBox,
              100 * o - 5,
              100 * o + 5,
              100 * i + 95,
              100 * i + 105,
            )
            : 1 ==
            e.wallCorners[
            (i + 1) * (e.cellsAcross + 1) + (o + 1)
            ] &&
            l.checkAndResolveOBBAABB(
              t,
              t.boundingBox,
              100 * o + 95,
              100 * o + 105,
              100 * i + 95,
              100 * i + 105,
            ));
    }
    ((t.exports.tankMoveTowards = function (t, e, a, n, l) {
      return (
        o(t, e, a),
        Math.abs(e - t.x) < 10 && Math.abs(a - t.y) < 10
          ? ((t.xVel = 0), (t.yVel = 0), !0)
          : ((t.xVel = Math.cos(t.angle) * t.maxSpeed),
            (t.yVel = Math.sin(t.angle) * t.maxSpeed),
            (t.x += t.xVel * l),
            (t.y += t.yVel * l),
            i(t, n),
            !1)
      );
    }),
      (t.exports.tankLookAtPoint = function (t, e, a, n) {
        (o(t, e, a), i(t, n));
      }),
      (t.exports.canBulletBeSpawned = function (t, e, a, n) {
        var l = Math.floor(t.x / 100),
          o = Math.floor(t.y / 100),
          i = !1,
          s = !1,
          r = !1,
          h = !1;
        return (
          !(
            a < 100 * o + 5 &&
            ((i = !0),
              1 == n.horisontalWalls[o * n.cellsAcross + l])
          ) &&
          !(
            a > 100 * o + 95 &&
            ((s = !0),
              1 == n.horisontalWalls[(o + 1) * n.cellsAcross + l])
          ) &&
          !(
            e < 100 * l + 5 &&
            ((r = !0),
              1 == n.verticalWalls[o * (n.cellsAcross + 1) + l])
          ) &&
          !(
            e > 100 * l + 95 &&
            ((h = !0),
              1 == n.verticalWalls[o * (n.cellsAcross + 1) + (l + 1)])
          ) &&
          (!i ||
            !r ||
            1 != n.wallCorners[o * (n.cellsAcross + 1) + l]) &&
          (!i ||
            !h ||
            1 !=
            n.wallCorners[o * (n.cellsAcross + 1) + (l + 1)]) &&
          (!s ||
            !r ||
            1 !=
            n.wallCorners[(o + 1) * (n.cellsAcross + 1) + l]) &&
          (!s ||
            !h ||
            1 !=
            n.wallCorners[
            (o + 1) * (n.cellsAcross + 1) + (l + 1)
            ])
        );
      }),
      (t.exports.updateBulletsPosition = function (t, e, a) {
        ((t.x += t.xVel * a), (t.y += t.yVel * a));
        var n = !0;
        if (
          (t.x + 9 > e.worldWidth
            ? ((t.x = e.worldWidth - 9), (t.xVel *= -1), (n = !1))
            : t.x - 9 < 0 && ((t.x = 9), (t.xVel *= -1), (n = !1)),
            t.y + 9 > e.worldHeight
              ? ((t.y = e.worldHeight - 9), (t.yVel *= -1), (n = !1))
              : t.y - 9 < 0 && ((t.y = 9), (t.yVel *= -1), (n = !1)),
            n)
        ) {
          var l = Math.floor(t.x / 100),
            o = Math.floor(t.y / 100),
            i = !1,
            s = !1,
            r = !1,
            h = !1;
          if (
            (t.x % 100 < 9 ? (i = !0) : t.x % 100 > 91 && (s = !0),
              t.y % 100 < 9 ? (r = !0) : t.y % 100 > 91 && (h = !0),
              r && i)
          ) {
            if (1 == e.wallCorners[o * (e.cellsAcross + 1) + l])
              (t.xVel - 0) * ((t.y % 100) - 9) -
                (t.yVel - 0) * ((t.x % 100) - 9) <
                0
                ? ((t.yVel *= -1), (t.y = 100 * o + 9))
                : ((t.xVel *= -1), (t.x = 100 * l + 9));
          } else if (r && s) {
            if (
              1 ==
              e.wallCorners[o * (e.cellsAcross + 1) + (l + 1)]
            )
              (t.xVel - 0) * ((t.y % 100) - 9) -
                (t.yVel - 0) * ((t.x % 100) - 91) >
                0
                ? ((t.yVel *= -1), (t.y = 100 * o + 9))
                : ((t.xVel *= -1), (t.x = 100 * l + 91));
          } else if (h && i) {
            if (
              1 ==
              e.wallCorners[(o + 1) * (e.cellsAcross + 1) + l]
            )
              (t.xVel - 0) * ((t.y % 100) - 91) -
                (t.yVel - 0) * ((t.x % 100) - 9) >
                0
                ? ((t.yVel *= -1), (t.y = 100 * o + 91))
                : ((t.xVel *= -1), (t.x = 100 * l + 9));
          } else if (h && s) {
            if (
              1 ==
              e.wallCorners[
              (o + 1) * (e.cellsAcross + 1) + (l + 1)
              ]
            )
              (t.xVel - 0) * ((t.y % 100) - 91) -
                (t.yVel - 0) * ((t.x % 100) - 91) <
                0
                ? ((t.yVel *= -1), (t.y = 100 * o + 91))
                : ((t.xVel *= -1), (t.x = 100 * l + 91));
          } else
            h
              ? 1 ==
              e.horisontalWalls[
              (o + 1) * e.cellsAcross + l
              ] && ((t.yVel *= -1), (t.y = 100 * o + 91))
              : r
                ? 1 == e.horisontalWalls[o * e.cellsAcross + l] &&
                ((t.yVel *= -1), (t.y = 100 * o + 9))
                : i
                  ? 1 ==
                  e.verticalWalls[
                  o * (e.cellsAcross + 1) + l
                  ] && ((t.xVel *= -1), (t.x = 100 * l + 9))
                  : s &&
                  1 ==
                  e.verticalWalls[
                  o * (e.cellsAcross + 1) + (l + 1)
                  ] &&
                  ((t.xVel *= -1), (t.x = 100 * l + 91));
        }
      }));
  },
  function (t, e) {
    function a(t, e, a) {
      return (e.x - t.x) * (a.y - t.y) - (a.x - t.x) * (e.y - t.y) <= 0
        ? -1
        : 1;
    }
    ((t.exports.angleLerp = function (t, e, a) {
      return (
        t +
        (function (t, e) {
          var a = 2 * Math.PI,
            n = (e - t) % a;
          return ((2 * n) % a) - n;
        })(t, e) *
        a
      );
    }),
      (t.exports.line_intersect = function (t, e, a, n, l, o, i, s) {
        var r,
          h,
          c = (s - o) * (a - t) - (i - l) * (n - e);
        return 0 == c
          ? null
          : {
            x:
              t +
              (r =
                ((i - l) * (e - o) - (s - o) * (t - l)) / c) *
              (a - t),
            y: e + r * (n - e),
            seg1: r >= 0 && r <= 1,
            seg2:
              (h =
                ((a - t) * (e - o) - (n - e) * (t - l)) /
                c) >= 0 && h <= 1,
          };
      }),
      (t.exports.doPointsSpanLine = function (t, e, n, l) {
        return a(n, l, t) != a(n, l, e);
      }),
      (t.exports.checkOBBCircleIntersection = function (
        t,
        e,
        a,
        n,
        l,
        o,
        i,
      ) {
        var s = !1,
          r = -a,
          h = (l - t) * Math.cos(r) - (o - e) * Math.sin(r),
          c = (l - t) * Math.sin(r) + (o - e) * Math.cos(r);
        return (
          h + i > n[0] &&
          h - i < n[2] &&
          c + i > n[1] &&
          c - i < n[5] &&
          (s = !0),
          s
        );
      }),
      (t.exports.checkAndResolveOBBAABB = function (t, e, a, n, l, o) {
        var i = !0,
          s = [],
          r = {
            axisX: 1,
            axisY: 0,
            points1: [e[0], e[2], e[4], e[6]],
            points2: [a, n],
          };
        s.push(r);
        var h,
          c = {
            axisX: 0,
            axisY: 1,
            points1: [e[1], e[3], e[5], e[7]],
            points2: [l, o],
          };
        s.push(c);
        for (var d = 0; d < 2; d++) {
          var f = [
            e[2 + 2 * d] - e[0 + 2 * d],
            e[3 + 2 * d] - e[1 + 2 * d],
          ],
            p = Math.sqrt(f[0] * f[0] + f[1] * f[1]);
          (0 == p && (p = 1e-5), (f[0] /= p), (f[1] /= p));
          for (var g = [], u = 0; u < 8; u += 2)
            g.push(e[u] * f[0] + e[u + 1] * f[1]);
          var x = [];
          (x.push(a * f[0] + l * f[1]),
            x.push(n * f[0] + l * f[1]),
            x.push(a * f[0] + o * f[1]),
            x.push(n * f[0] + o * f[1]));
          var y = {
            axisX: f[0],
            axisY: f[1],
            points1: g,
            points2: x,
          };
          s.push(y);
        }
        var v = 0,
          w = 1;
        for (d = 0; d < s.length; d++) {
          var m,
            S,
            b = 1;
          if (
            (Math.min.apply(
              Math,
              _toConsumableArray(s[d].points1),
            ) <
              Math.min.apply(Math, _toConsumableArray(s[d].points2))
              ? ((m = Math.max.apply(
                Math,
                _toConsumableArray(s[d].points1),
              )),
                (S = Math.min.apply(
                  Math,
                  _toConsumableArray(s[d].points2),
                )),
                (b = -1))
              : ((m = Math.max.apply(
                Math,
                _toConsumableArray(s[d].points2),
              )),
                (S = Math.min.apply(
                  Math,
                  _toConsumableArray(s[d].points1),
                ))),
              S >= m)
          ) {
            i = !1;
            break;
          }
          0 == d
            ? ((h = m - S), (w = b))
            : m - S < h && ((h = m - S), (w = b), (v = d));
        }
        i && ((t.x += s[v].axisX * h * w), (t.y += s[v].axisY * h * w));
      }));
  },
  function (t, e) {
    t.exports = (function () {
      function _class(t) {
        _classCallCheck(this, _class);

        ((this.config = t), (this.graphicsCache = {}));
      }

      _createClass(_class, [
        {
          key: "setConfig",
          value: function setConfig(t) {
            ((this.config = t), (this.graphicsCache = {}));
          },
        },
        {
          key: "getCachedGraphic",
          value: function getCachedGraphic(t, e) {
            return (
              this.graphicsCache[t] ||
              (this.graphicsCache[t] = e()),
              this.graphicsCache[t]
            );
          },
        },
        {
          key: "processTankProperties",
          value: function processTankProperties(t) {
            ((this.angle = t.angle),
              (this.x = t.x),
              (this.y = t.y));
          },
        },
        {
          key: "processScreenProperties",
          value: function processScreenProperties(t) {
            (this.tankScale != t.tankScale &&
              (this.graphicsCache = {}),
              (this.tankScale = t.tankScale));
          },
        },
        {
          key: "draw",
          value: function draw(t, e, a, n) {
            (this.processTankProperties(a),
              this.processScreenProperties(n),
              t.save(),
              t.translate(-this.x, -this.y),
              t.scale(
                this.tankScale / 0.18,
                this.tankScale / 0.18,
              ),
              this.preDrawInScreenSpace(t, e),
              t.restore(),
              t.save(),
              t.rotate(this.angle + 0.5 * Math.PI),
              this.drawSkin(t, n.dpr, e),
              t.restore(),
              t.save(),
              t.translate(-this.x, -this.y),
              t.scale(
                this.tankScale / 0.18,
                this.tankScale / 0.18,
              ),
              this.postDrawInScreenSpace(t, e),
              t.restore());
          },
        },
        {
          key: "preDrawInScreenSpace",
          value: function preDrawInScreenSpace(t, e) { },
        },
        {
          key: "drawSkin",
          value: function drawSkin(t, e, a) { },
        },
        {
          key: "postDrawInScreenSpace",
          value: function postDrawInScreenSpace(t, e) { },
        },
        {
          key: "getIcon",
          value: function getIcon(t) { },
        },
      ]);

      return _class;
    })();
  },
  function (t, e) {
    var a = function a() { };
    ((a.prototype = { draw: function draw(t, e, a) { } }), (t.exports = a));
  },
  function (t, e, a) {
    (function (e) {
      var n = a(0),
        l = a(3),
        o = a(8),
        i = a(2),
        s = a(9),
        r = a(1);
      var h,
        c,
        d = a(10),
        f = a(11),
        p = (a(5), a(15).PopUpNotification);
      (console.log("Running game..."), console.log("V 2.0"));
      var g,
        u,
        x,
        y,
        v,
        w,
        m,
        S,
        b,
        M,
        A,
        k,
        I = {
          cellsAcross: void 0,
          cellsDown: void 0,
          worldWidth: void 0,
          worldHeight: void 0,
          verticalWalls: [],
          horisontalWalls: [],
          wallCorners: [],
        },
        C = [],
        T = [],
        P = { camLeft: 0, camTop: 0, scale: 1 },
        B = 0,
        L = 0,
        E = !1,
        N = -1,
        V = 0,
        R = 0,
        W = n.TANK_DEFAULT_BULLETCOUNT,
        D = 0,
        O = [
          { name: "Player 1", score: 10 },
          { name: "Joe", score: 5 },
          { name: "Alex", score: "12" },
        ];
      function _(t) {
        var e =
          "16x16\n+---+---+---+---+---+---+---+---+---+---+---+---+---+---+---+---+\n|           |                   |           |               |   |\n+---+---+   +   +---+   +---+   +---+   +   +   +---+   +   +   +\n|   |       |       |   |       |       |       |   |   |       |\n+   +   +   +---+   +   +   +---+   +---+   +---+   +   +---+---+\n|   |   |   |           |   |               |       |           |\n+   +   +   +   +---+---+   +---+---+---+   +   +---+---+       +\n|       |       |                       |   |                   |\n+---+---+---+---+---+   +---+       +---+   +   +---+   +       +\n|           |       |   |   |               |   |   |   |   |   |\n+   +---+   +   +---+   +   +   +---+---+---+   +   +---+---+---+\n|       |       |           |   |       |   |   |               |\n+---+   +---+---+   +---+   +   +   +   +   +   +   +---+---+   +\n|       |           |   |   |   |   |           |           |   |\n+   +---+   +---+---+   +---+   +   +---+       +---+       +   +\n|           |               |       |   |           |       |   |\n+   +---+   +   +---+   +---+---+   +   +           +---+   +   +\n|       |       |   |   |           |   |                   |   |\n+---+---+   +   +   +   +           +   +---+---+---+---+---+   +\n|           |       |   |       |   |           |       |       |\n+---+       +---+   +---+       +   +---+---+   +       +       +\n|           |                   |       |               |       |\n+---+   +---+---+---+   +---+   +   +   +   +---+   +---+       +\n|                       |   |       |   |   |   |               |\n+   +---+   +---+---+---+   +---+   +---+   +   +---+   +---+---+\n|       |                       |           |                   |\n+       +---+---+---+---+       +---+---+---+---+---+---+       +\n|                       |       |   |               |           |\n+       +---+   +   +---+       +   +---+---+---+   +   +---+---+\n|           |   |                   |               |           |\n+---+   +---+   +---+---+       +   +---+   +   +   +   +---+   +\n|           |           |       |           |   |       |       |\n+---+---+---+---+---+---+---+---+---+---+---+---+---+---+---+---+"
            .replace(/[\r]+/g, "")
            .split("\n"),
          a = e[0].split("x"),
          n = parseInt(a[0]),
          l = parseInt(a[1]),
          o = [];
        for (var i = 0; i < l + 1; i++)
          for (var s = e[1 + 2 * i], r = 2; r < s.length; r += 4)
            "-" == s[r] ? o.push(1) : o.push(0);
        var h = [];
        for (i = 0; i < l; i++)
          for (s = e[2 + 2 * i], r = 0; r < s.length; r += 4)
            "|" == s[r] ? h.push(1) : h.push(0);
        var c = [];
        for (var d = 0; d <= l; d++)
          for (var f = 0; f <= n; f++) {
            var p = 0;
            (d > 0 && (p += 1 * h[(d - 1) * (n + 1) + f]),
              d < l && (p += 4 * h[d * (n + 1) + f]),
              f > 0 && (p += 8 * o[d * n + (f - 1)]),
              f < n && (p += 2 * o[d * n + f]),
              0 != p && c.push({ x: f, y: d, weight: p }));
          }
        ((t.fillStyle = rt),
          t.fillRect(0, 0, t.canvas.width, t.canvas.height));
        for (i = 0; i < c.length; i++) {
          var _e = xt[c[i].weight],
            _a = 100 * c[i].x - 220 - 0.5 * _e.width,
            _n3 = 100 * c[i].y - 830 - 0.5 * _e.height;
          _a + _e.width > 0 &&
            _a < t.canvas.width &&
            _n3 + _e.height > 0 &&
            _n3 < t.canvas.height &&
            t.drawImage(_e, _a, _n3);
        }
        ((t.globalAlpha = 0.3),
          (t.fillStyle = "#434647"),
          t.fillRect(0, 0, t.canvas.width, t.canvas.height));
      }
      function U() {
        var t = $("#dataPanel").width(),
          e = document.getElementById("gameCanvas");
        ((e.width =
          (document.body.clientWidth - t) * window.devicePixelRatio),
          (e.height =
            document.body.clientHeight * window.devicePixelRatio),
          (e.style.width = document.body.clientWidth - t + "px"),
          (e.style.height = document.body.clientHeight + "px"));
        e.getContext("2d").scale(
          window.devicePixelRatio,
          window.devicePixelRatio,
        );
      }
      function H(t, e) {
        ((b = t),
          (h = document.getElementById("gameCanvas")),
          (c = h.getContext("2d")),
          (h.style =
            "position: fixed; left: 0px; top: 0px; display: inline;"),
          U(),
          $("#gameScreen").show(),
          (onmousemove = Z),
          h.addEventListener("click", tt, !1),
          window.addEventListener("resize", U),
          (g = []).push(new f(50, 50)),
          (u = []),
          (x = -1),
          (m = new s(new WebSocket(e), F)),
          (S = !1),
          m.on("JOIN_SUCCESS", Y),
          m.on(o.newStateFromServer, Q),
          m.on(o.syncBullets, q),
          m.on("leaderBoardInfo", J),
          m.on("updateTankList", z),
          m.on("tankKilled", at),
          m.on("playerSpawned", et),
          m.on("NEW_BULLET_LIMIT", function (t) {
            if (t > W) {
              var e = t - W;
              e > 1
                ? T.push(new p("You gained +" + e + " balls!"))
                : T.push(new p("You gained +" + e + " ball!"));
            }
            W = t;
          }),
          m.on("EXP", function (t) {
            addEXP(t);
          }),
          (document.getElementById("startScreen").style.display =
            "none"),
          (y = 0),
          (v = []),
          (w = []),
          !0,
          requestAnimationFrame(ut),
          setInterval(pt, n.PHYSICS_INTERVAL));
      }
      function F() {
        var t, e;
        (m.send("joinGame", {
          name: b,
          sessionCookie:
            ((t = "session_token"),
              (e = ("; " + document.cookie).split("; " + t + "=")),
              2 == e.length ? e.pop().split(";").shift() : null),
        }),
          console.log("Connected"));
      }
      function Y(t) {
        ((g[0].ID = t.newID),
          (g[0].name = t.name),
          g[0].setSkin(t.colourIndex),
          (S = !0),
          (I.cellsAcross = t.cellsAcross),
          (I.cellsDown = t.cellsDown),
          (I.verticalWalls = t.verticalWalls),
          (I.horisontalWalls = t.horisontalWalls),
          (I.wallCorners = t.wallCorners),
          (I.worldWidth = 100 * I.cellsAcross),
          (I.worldHeight = 100 * I.cellsDown));
        for (var e = 0; e <= I.cellsDown; e++)
          for (var a = 0; a <= I.cellsAcross; a++) {
            var n = 0;
            (e > 0 &&
              (n +=
                1 *
                I.verticalWalls[
                (e - 1) * (I.cellsAcross + 1) + a
                ]),
              e < I.cellsDown &&
              (n +=
                4 *
                I.verticalWalls[
                e * (I.cellsAcross + 1) + a
                ]),
              a > 0 &&
              (n +=
                8 *
                I.horisontalWalls[
                e * I.cellsAcross + (a - 1)
                ]),
              a < I.cellsAcross &&
              (n +=
                2 *
                I.horisontalWalls[e * I.cellsAcross + a]),
              0 != n && C.push({ x: a, y: e, weight: n }));
          }
      }
      function K() {
        (console.log("Respawning..."),
          m.send("spawnPlayer"),
          $("#gameScreen").show());
        var t = document.getElementById("gameCanvas");
        ((t.style.display = "inline"),
          (c.globalAlpha = 1),
          ((t =
            document.getElementById("deathScreen")).style.display =
            "none"),
          !0);
      }
      function G(t) {
        (R++, (D = t));
      }
      function X(t, e) {
        for (var a = 0; a < e.length; a++) {
          var n = e[a];
          n.moveForward
            ? g[0].moveTowards(
              g[0].x + n.targetX,
              g[0].y + n.targetY,
              I,
              t,
            )
            : g[0].lookAt(
              g[0].x + n.targetX,
              g[0].y + n.targetY,
              I,
            );
          for (var o = 1; o < g.length; o++)
            Math.abs(g[o].x - g[o].latestX) > 70 ||
              Math.abs(g[o].y - g[o].latestY) > 70
              ? ((g[o].x = g[o].latestX),
                (g[o].y = g[o].latestY),
                (g[o].angle = g[o].latestAngle))
              : ((g[o].x =
                g[o].x + 0.4 * (g[o].latestX - g[o].x)),
                (g[o].y = g[o].y + 0.4 * (g[o].latestY - g[o].y)),
                (g[o].angle = l.angleLerp(
                  g[o].angle,
                  g[o].latestAngle,
                  0.3,
                )));
        }
      }
      function j(t, e) {
        for (var a = 0; a < e.length; a++) {
          if (
            e[a].mouseClicked &&
            ((v = e[a].tickNum),
              !g[0].beenHit && R < W && v - D > 2)
          ) {
            var l = g[0].x + 40 * Math.cos(g[0].angle),
              o = g[0].y + 40 * Math.sin(g[0].angle);
            if (i.canBulletBeSpawned(g[0], l, o, I)) {
              var s = Math.cos(g[0].angle),
                r = Math.sin(g[0].angle),
                h = Math.sqrt(s * s + r * r),
                c = (s / h) * n.TANK_MAX_SPEED * 1.2,
                f = (r / h) * n.TANK_MAX_SPEED * 1.2,
                p = new d(x, l, o, c, f);
              (x--, u.push(p), G(e[a].tickNum));
            }
          }
          for (var y = 0; y < u.length; y++) u[y].update(I, t);
        }
        var v;
      }
      function J(t) {
        ((O = t.leaderBoard), t.longestReigns);
        for (var e = 0; e < g.length; e++)
          for (var a = 0; a < t.playerScores.length; a++)
            g[e].ID == t.playerScores[a].id &&
              ((g[e].score = t.playerScores[a].score),
                (g[e].leaderBoardPos =
                  t.playerScores[a].leaderBoardPos));
        for (e = 0; e < O.length; e++)
          O[e].id == g[0].ID && (O[e].isplayer = !0);
        (setLeaderboard(O), (N = t.kingID), (V = t.kingStartTime));
      }
      function q(t) {
        for (
          var e = o.binaryToBulletState(t),
          a = e.bullets,
          l = new Array(u.length).fill(0),
          i = 0;
          i < a.length;
          i++
        ) {
          for (var s = !1, r = 0; r < u.length; r++)
            if (u[r].id == a[i].id) {
              ((u[r].x = a[i].x),
                (u[r].y = a[i].y),
                (u[r].xVel = a[i].xVel),
                (u[r].yVel = a[i].yVel),
                (s = !0),
                (l[r] = 1));
              break;
            }
          if (!s) {
            var h = new d(
              a[i].id,
              a[i].x,
              a[i].y,
              a[i].xVel,
              a[i].yVel,
            );
            u.push(h);
          }
        }
        for (i = l.length - 1; i >= 0; i--) 0 == l[i] && u.splice(i, 1);
        R = e.bulletsSpawnedCount;
        for (i = 0; i < w.length; i++)
          if (w[i].tickNum >= e.tickNum) {
            w.splice(0, i);
            break;
          }
        j(n.PHYSICS_INTERVAL, w);
      }
      function z(t) {
        for (
          var e = new Array(g.length).fill(0), a = 0;
          a < t.length;
          a++
        ) {
          for (var n = !1, l = 0; l < g.length; l++)
            if (g[l].ID == t[a].id) {
              ((n = !0), (e[l] = 1));
              break;
            }
          if (!n) {
            var o = new f(0, 0);
            ((o.ID = t[a].id),
              (o.name = t[a].name),
              o.setSkin(t[a].colourIndex),
              (o.beenHit = t[a].beenHit),
              (o.justJoined = !0),
              g.push(o));
          }
        }
        for (a = e.length - 1; a >= 0; a--) 0 == e[a] && g.splice(a, 1);
      }
      function Q(t) {
        for (var e = o.binaryToTankState(t), a = 0; a < g.length; a++)
          for (var l = 0; l < e.tanks.length; l++)
            if (g[a].ID == e.tanks[l].id) {
              (0 == a || g[a].justJoined
                ? ((g[a].x = e.tanks[l].x),
                  (g[a].y = e.tanks[l].y),
                  (g[a].angle = e.tanks[l].angle),
                  (g[a].latestX = g[a].x),
                  (g[a].latestY = g[a].y),
                  (g[a].latestAngle = g[a].angle),
                  (g[a].justJoined = !1))
                : ((g[a].latestX = e.tanks[l].x),
                  (g[a].latestY = e.tanks[l].y),
                  (g[a].latestAngle = e.tanks[l].angle)),
                N == g[a].ID
                  ? (g[a].isKing = !0)
                  : (g[a].isKing = !1));
              break;
            }
        for (l = 0; l < v.length; l++)
          if (v[l].tickNum >= e.tickNum) {
            v.splice(0, l);
            break;
          }
        X(n.PHYSICS_INTERVAL, v);
      }
      function Z(t) {
        ((B = t.clientX), (L = t.clientY));
      }
      function tt(t) {
        E = !0;
      }
      function et(t) {
        for (
          var e = t.tankID, a = t.x, n = t.y, l = 0;
          l < g.length;
          l++
        )
          g[l].ID == e &&
            ((g[l].beenHit = !1),
              (g[l].x = g[l].latestX = a),
              (g[l].y = g[l].latestY = n));
      }
      function at(t) {
        for (var e = 0; e < g.length; e++)
          g[e].ID == t && (g[e].beenHit = !0);
        t == g[0].ID &&
          (function () {
            (!1, console.log("Showing death screen"));
            var t = document.getElementById("startScreen");
            ((t.style.display = "none"),
              ((t =
                document.getElementById(
                  "deathScreen",
                )).style.display = "block"),
              setTimeout(function () {
                $("#gameScreen").fadeOut(1e3, function () {
                  fadeFinishedCallback();
                });
              }, 400),
              triggerDeathTrackingEvent(),
              showDeathScreenCallback());
          })();
      }
      var nt,
        lt = 1,
        ot = !1,
        it = !1;
      e.destroyGraphicsObject = function (t) {
        var e = T.indexOf(t);
        T.splice(e, 1);
      };
      var st,
        rt = "#f0f0f0",
        ht = !0,
        ct = 1,
        dt = 0;
      function ft(t) {
        ht && ((st = t), (ht = !1));
        var e = t - st;
        ((st = t),
          (P.camLeft = g[0].x - 0.5 * h.clientWidth),
          (P.camTop = g[0].y - 0.5 * h.clientHeight),
          (c.fillStyle = rt),
          c.fillRect(0, 0, h.width, h.height));
        for (var a = 0; a < C.length; a++) {
          var n = xt[C[a].weight];
          var _t = window.devicePixelRatio || 1,
            _e2 = n.width / _t,
            _i = n.height / _t;
          var l = Math.floor(100 * C[a].x - P.camLeft - 0.5 * _e2),
            o = Math.floor(100 * C[a].y - P.camTop - 0.5 * _i);
          l + _e2 > 0 &&
            l < h.width &&
            o + _i > 0 &&
            o < h.height &&
            c.drawImage(n, l, o, _e2, _i);
        }
        for (a = 0; a < u.length; a++) u[a].draw(c, P);
        var i = g.slice().sort(function (t, e) {
          return t.model.showingExplosion
            ? 1
            : e.model.showingExplosion || t.model.showingScorch
              ? -1
              : e.model.showingScorch
                ? 1
                : 0;
        });
        for (a = 0; a < i.length; a++)
          i[a].justJoined || i[a].draw(c, P);
        ct > 0 &&
          ((c.globalAlpha = ct),
            (c.fillStyle = "rgba(240,240,240,0.8)"),
            (c.strokeStyle = "#f0f0f0"),
            c.fillRect(
              0.5 * (h.clientWidth - 700),
              0.5 * h.clientHeight - 100 - 120,
              700,
              160,
            ),
            (c.fillStyle = "#fbac00"),
            (c.textAlign = "center"),
            (c.font = "40px Fredoka One"),
            c.fillText(
              "King of the Hill!",
              0.5 * h.clientWidth,
              0.5 * h.clientHeight - 40 - 120,
            ),
            (c.font = "900 22px Nunito"),
            (c.fillStyle = "#737373"),
            c.fillText(
              "Stay at the top of the leaderboard for as long as possible",
              0.5 * h.clientWidth,
              0.5 * h.clientHeight - 120,
            ),
            c.fillText(
              "(Click to shoot)",
              0.5 * h.clientWidth,
              0.5 * h.clientHeight + 30 - 120,
            ),
            (c.textAlign = "start"),
            dt > 4 && (ct -= e / 3e3),
            (dt += e / 1e3),
            (c.globalAlpha = 1));
        var s = 0;
        if (-1 != N) {
          s = new Date().getTime() - V;
          for (var r = { x: 0, y: 0 }, a = 0; a < g.length; a++)
            g[a].ID == N &&
              ((r.x = g[a].x), (r.y = g[a].y), g[a].name);
          var d = r.x - g[0].x,
            f = r.y - g[0].y,
            p = Math.abs(d) > 0.5 * h.clientWidth - 20,
            x = Math.abs(f) > 0.5 * h.clientHeight - 20;
          if (g[0].isKing || (!p && !x)) {
            if (g[0].isKing) {
              var y;
              ((c.textAlign = "center"),
                (c.font = "28px Fredoka One"),
                (c.strokeStyle = "white"),
                (c.lineWidth = 4),
                c.strokeText(
                  "You are King!",
                  0.5 * h.clientWidth,
                  0.9 * h.clientHeight - 30 + 2,
                ),
                c.strokeText(
                  "You are King!",
                  0.5 * h.clientWidth,
                  0.9 * h.clientHeight - 30,
                ),
                (c.fillStyle = "#e75800"),
                c.fillText(
                  "You are King!",
                  0.5 * h.clientWidth,
                  0.9 * h.clientHeight - 30 + 2,
                ),
                (c.fillStyle = "#fbac00"),
                c.fillText(
                  "You are King!",
                  0.5 * h.clientWidth,
                  0.9 * h.clientHeight - 30,
                ),
                (c.fillStyle = "#324965"),
                (c.font = "900 22px Nunito"),
                (y = new Date(null)).setMilliseconds(s));
              var v = y.toISOString().substr(14, 8);
              ((c.strokeStyle = "white"),
                (c.lineWidth = 4),
                (c.lineJoin = "round"),
                c.strokeText(
                  "Time as King: " + v,
                  0.5 * h.clientWidth,
                  0.9 * h.clientHeight,
                ),
                c.fillText(
                  "Time as King: " + v,
                  0.5 * h.clientWidth,
                  0.9 * h.clientHeight,
                ),
                (c.textAlign = "start"));
            }
          } else {
            var w = Math.atan2(f, d),
              m = d + 0.5 * h.clientWidth,
              S = f + 0.5 * h.clientHeight;
            (p &&
              (m =
                d < 0
                  ? 20 - 10 * Math.cos(w)
                  : h.clientWidth - 20 - 10 * Math.cos(w)),
              x &&
              (S =
                f < 0
                  ? 20 - 10 * Math.sin(w)
                  : h.clientHeight -
                  20 -
                  10 * Math.sin(w)),
              c.save(),
              c.translate(m, S),
              (c.fillStyle = "#ffbb00"),
              (c.font = "30px Anton"),
              c.fillText(
                "👑",
                -20 - 40 * Math.cos(w),
                40 * -Math.sin(w),
              ),
              c.rotate(w + 0.5 * Math.PI),
              c.beginPath(),
              c.moveTo(0, -10),
              c.lineTo(8, 10),
              c.lineTo(-8, 10),
              c.closePath(),
              (c.fillStyle = "#ffbb00"),
              (c.strokeStyle = "#733415"),
              (c.lineWidth = 2),
              (c.lineJoin = "round"),
              (c.shadowBlur = 5),
              (c.shadowColor = "rgba(0, 0, 0, 0.4)"),
              c.fill(),
              c.stroke(),
              (c.shadowBlur = 0),
              c.restore());
          }
        }
        ((c.fillStyle = "rgba(0,0,0,0.8)"),
          (c.font = "900 12px Nunito"),
          (c.textAlign = "center"),
          (c.textBaseline = "middle"));
        var b = 0.5 * h.clientWidth + -32 * Math.cos(g[0].angle),
          M = 0.5 * h.clientHeight + -32 * Math.sin(g[0].angle);
        (c.beginPath(),
          c.arc(b - 7, M, 3, 0, 2 * Math.PI),
          c.fill(),
          c.fillText("" + (W - R), b + 7, M),
          (c.textAlign = "start"),
          (c.textBaseline = "alphabetic"));
        for (a = 0; a < T.length; a++) T[a].draw(c, P, e);
        it &&
          (function (t) {
            (nt.drawImage(h, 0, 0),
              c.clearRect(0, 0, h.width, h.height),
              (c.globalAlpha = lt),
              c.drawImage(ot, 0, 0),
              (lt -= t / 1e3) <= 0 &&
              ((document.getElementById(
                "gameCanvas",
              ).style.display = "none"),
                (it = !1),
                fadeFinishedCallback()));
          })(e);
      }
      function pt() {
        var t = n.PHYSICS_INTERVAL;
        if (S) {
          !(function () {
            ((M = B + P.camLeft - g[0].x),
              (A = L + P.camTop - g[0].y),
              (k = !0),
              Math.abs(M) < 60 && Math.abs(A) < 60 && (k = !1));
            var t = {
              targetAngle: Math.atan2(A, M),
              moveForward: k,
              mouseClicked: E,
              tickNum: y,
            },
              e = {
                targetX: M,
                targetY: A,
                moveForward: k,
                tickNum: y,
              },
              a = { mouseClicked: E, tickNum: y },
              n = o.userInputToBinaryData(t);
            (m.sendBinary(o.tankInputToServer, n),
              v.push(e),
              w.push(a),
              y++);
          })();
          var e = { mouseClicked: E, tickNum: y - 1 };
          (X(t, [{ targetX: M, targetY: A, moveForward: k }]),
            j(t, [e]));
        }
        E = !1;
      }
      var gt = !1;
      function ut(t) {
        (ft(t),
          v.length > 1500 &&
          !gt &&
          (alert(
            "Unable to reconnect to the server, you are being redirected to the homepage.",
          ),
            (window.location.href = "/"),
            (gt = !0)),
          requestAnimationFrame(ut));
      }
      var xt = r.generateWallSpriteSheet(
        rt,
        window.devicePixelRatio || 1,
      );
      ((e.drawSplashScreen = _),
        (e.beginClient = H),
        (e.askToSpawn = K),
        (t.exports.drawSplashScreen = _),
        (t.exports.beginClient = H),
        (t.exports.askToSpawn = K));
    }).call(this, a(7));
  },
  function (t, e) {
    var a;
    a = (function () {
      return this;
    })();
    try {
      a = a || new Function("return this")();
    } catch (t) {
      "object" == typeof window && (a = window);
    }
    t.exports = a;
  },
  function (t, e) {
    ((t.exports.tankStateToBinary = function (t) {
      var e = t.tanks,
        a = 5 + 7 * e.length,
        n = new ArrayBuffer(a),
        l = new DataView(n);
      (l.setUint32(0, t.tickNum), l.setUint8(4, e.length));
      for (var o = 0; o < e.length; o++) {
        var i = Math.round(1e4 * e[o].angle),
          s = 5 + 7 * o;
        (l.setUint8(s, e[o].id),
          l.setInt16(s + 1, e[o].x),
          l.setInt16(s + 3, e[o].y),
          l.setInt16(s + 5, i));
      }
      return n;
    }),
      (t.exports.binaryToTankState = function (t) {
        for (
          var e = new DataView(t),
          a = e.getUint32(0),
          n = e.getUint8(4),
          l = [],
          o = 0;
          o < n;
          o++
        ) {
          var i = 5 + 7 * o,
            s = e.getUint8(i),
            r = e.getInt16(i + 1),
            h = e.getInt16(i + 3),
            c = e.getInt16(i + 5) / 1e4;
          l.push({ id: s, x: r, y: h, angle: c });
        }
        return { tanks: l, tickNum: a };
      }),
      (t.exports.bulletStateToBinary = function (t) {
        var e = t.bullets,
          a = 6 + 9 * e.length,
          n = new ArrayBuffer(a),
          l = new DataView(n);
        (l.setUint32(0, t.tickNum),
          l.setUint8(4, t.bulletsSpawnedCount),
          l.setUint8(5, e.length));
        for (var o = 0; o < e.length; o++) {
          var i = Math.round(5e4 * e[o].xVel),
            s = Math.round(5e4 * e[o].yVel),
            r = 6 + 9 * o;
          (l.setUint8(r, e[o].id),
            l.setInt16(r + 1, e[o].x),
            l.setInt16(r + 3, e[o].y),
            l.setInt16(r + 5, i),
            l.setInt16(r + 7, s));
        }
        return n;
      }),
      (t.exports.binaryToBulletState = function (t) {
        for (
          var e = new DataView(t),
          a = e.getUint32(0),
          n = e.getUint8(4),
          l = e.getUint8(5),
          o = [],
          i = 0;
          i < l;
          i++
        ) {
          var s = 6 + 9 * i,
            r = e.getUint8(s),
            h = e.getInt16(s + 1),
            c = e.getInt16(s + 3),
            d = e.getInt16(s + 5) / 5e4,
            f = e.getInt16(s + 7) / 5e4;
          o.push({ id: r, x: h, y: c, xVel: d, yVel: f });
        }
        return { bullets: o, tickNum: a, bulletsSpawnedCount: n };
      }),
      (t.exports.userInputToBinaryData = function (t) {
        var e = new ArrayBuffer(7),
          a = new DataView(e),
          n = Math.round(1e4 * t.targetAngle),
          l = (t.moveForward << 1) + t.mouseClicked;
        return (
          a.setInt16(0, n),
          a.setInt32(2, t.tickNum),
          a.setUint8(6, l),
          e
        );
      }),
      (t.exports.binaryDataToUserInput = function (t) {
        var e = new DataView(t),
          a = e.getInt16(0),
          n = e.getInt32(2),
          l = e.getUint8(6);
        return {
          targetAngle: a / 1e4,
          moveForward: !!(l >> 1),
          mouseClicked: !!(1 & l),
          tickNum: n,
        };
      }),
      (t.exports.newStateFromServer = 0),
      (t.exports.syncBullets = 1),
      (t.exports.tankInputToServer = 2));
  },
  function (t, e) {
    t.exports = function (t, e, a) {
      var n = {},
        l = !1;
      ((t.binaryType = "arraybuffer"),
        (this.on = function (t, e) {
          n[t] = e;
        }),
        (this.send = function (e, a) {
          t.send(JSON.stringify([e, a]));
        }),
        (this.sendBinary = function (e, a) {
          var n = new Uint8Array(1 + a.byteLength);
          n[0] = e;
          var l = new Uint8Array(a);
          (n.set(l, 1), t.send(n.buffer));
        }),
        (this.onDisconnect = function (e) {
          t.onclose = e;
        }),
        (t.onmessage = function (t) {
          if ("data" in t)
            if ((t = t.data) instanceof ArrayBuffer) {
              var e = new Uint8Array(t)[0],
                a = t.slice(1, t.byteLength);
              e in n && n[e](a);
            } else
              try {
                if (2 != (t = JSON.parse(t)).length) return;
                var l = t[0];
                l in n && n[l](t[1]);
              } catch (t) {
                console.log(t);
              }
        }),
        (t.onopen = function () {
          l || ((l = !0), void 0 !== e && e());
        }),
        void 0 !== a && (t.onclose = a),
        1 == t.readyState && ((l = !0), void 0 !== e && e()));
    };
  },
  function (t, e, a) {
    var n = a(2);
    t.exports = function (t, e, a, l, o) {
      ((this.id = t),
        (this.x = e),
        (this.y = a),
        (this.xVel = l),
        (this.yVel = o),
        (this.timeToLive = 9e3),
        (this.draw = function (t, e) {
          ((t.fillStyle = "#101010"),
            t.beginPath(),
            t.arc(
              this.x - e.camLeft,
              this.y - e.camTop,
              4,
              0,
              2 * Math.PI,
            ),
            t.fill());
        }),
        (this.update = function (t, e) {
          n.updateBulletsPosition(this, t, e);
        }));
    };
  },
  function (t, e, a) {
    var n = a(0),
      l = a(2),
      o = a(12)(0.18, window.devicePixelRatio || 1);
    t.exports = function (t, e) {
      ((this.x = t),
        (this.y = e),
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
        (this.moveTowards = function (t, e, a, n) {
          if (!this.beenHit)
            return l.tankMoveTowards(this, t, e, a, n);
        }),
        (this.lookAt = function (t, e, a) {
          this.beenHit || l.tankLookAtPoint(this, t, e, a);
        }),
        (this.setSkin = function (t) {
          this.model.setSkin(t);
        }),
        (this.draw = function (t, e) {
          (this.beenHit
            ? this.hitLastTurn ||
            (this.model.playDeathAnimation(),
              (this.hitLastTurn = !0))
            : (this.model.playMovementAnimation(),
              (this.hitLastTurn = !1)),
            this.model.renderModelOntoCanvas(
              t,
              e,
              this.x,
              this.y,
              this.angle,
              this.isKing,
              this.name,
            ));
        }));
    };
  },
  function (t, e, a) {
    var n = a(1),
      l = a(13);
    a(14);
    t.exports = function (t, e) {
      var a = n.generateExplosionSpriteSheet(200 * e, 90),
        o = n.generateScorchSprite(100 * e);
      return {
        TankModel: function TankModel() {
          ((this.drawColourIndex = 0),
            (this.showingScorch = !1),
            (this.showingExplosion = !1),
            (this.explodeAnimIndex = 0),
            (this.skins = [
              new l({ colour: n.skins[this.drawColourIndex] }),
            ]),
            (this.setSkin = function (t) {
              ((this.drawColourIndex = t),
                this.skins[0].setConfig({
                  colour: n.skins[this.drawColourIndex],
                }));
            }),
            (this.playMovementAnimation = function () {
              ((this.showingExplosion = !1),
                (this.showingScorch = !1));
            }),
            (this.playDeathAnimation = function () {
              ((this.explodeAnimIndex = 0),
                (this.showingExplosion = !0));
            }),
            (this.renderModelOntoCanvas = function (
              n,
              l,
              i,
              s,
              r,
              h,
              c,
            ) {
              if (this.showingScorch) {
                var _t2 = o.width / e,
                  _a2 = o.height / e;
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
                      "👑",
                      3 * -c.length - 20,
                      -40,
                    )),
                  this.skins.forEach(function (a) {
                    a.draw(
                      n,
                      0,
                      { angle: r, x: i, y: s },
                      {
                        tankScale: t,
                        camLeft: l.camLeft,
                        camTop: l.camTop,
                        dpr: e,
                      },
                    );
                  }),
                  n.restore());
              if (this.showingExplosion) {
                this.explodeAnimIndex < a.length - 1 &&
                  ((this.explodeAnimIndex += 1),
                    this.explodeAnimIndex > 50
                      ? ((this.showingScorch = !0),
                        (this.showingExplosion = !1))
                      : (this.showingScorch = !1));
                var _t3 = a[this.explodeAnimIndex].width / e,
                  _o = a[this.explodeAnimIndex].height / e;
                var _r2 = i - l.camLeft - 0.5 * _t3,
                  _h2 = s - l.camTop - 0.5 * _o;
                n.drawImage(
                  a[this.explodeAnimIndex],
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
  },
  function (t, e, a) {
    var n = a(4);
    a(1);
    function l(t, e) {
      ((t = String(t).replace(/[^0-9a-f]/gi, "")).length < 6 &&
        (t = t[0] + t[0] + t[1] + t[1] + t[2] + t[2]),
        (e = e || 0));
      var a,
        n,
        l = "#";
      for (n = 0; n < 3; n++)
        ((a = parseInt(t.substr(2 * n, 2), 16)),
          (l += (
            "00" +
            (a = Math.round(
              Math.min(Math.max(0, a + a * e), 255),
            ).toString(16))
          ).substr(a.length)));
      return l;
    }
    t.exports = (function (_n) {
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
          value: function drawTank(t, e, a) {
            var n = t * e,
              o = document.createElement("canvas"),
              i = o.getContext("2d");
            var s = l(a, -0.106),
              r = l(a, -0.16),
              h = l(a, -0.17),
              c = l(a, -0.234),
              d = l(a, -0.458),
              f = l(a, -0.56),
              p = l(a, -0.631),
              g = l(a, -0.705),
              u = l(a, -0.5),
              x = [];
            (x.push({ x: 0, y: 80 }),
              x.push({ x: 22, y: 80 }),
              x.push({ x: 22, y: 65 }),
              x.push({ x: 70, y: 65 }),
              x.push({ x: 102, y: 95 }),
              x.push({ x: 102, y: 265 }),
              x.push({ x: 90, y: 272 }),
              x.push({ x: 22, y: 272 }),
              x.push({ x: 22, y: 255 }),
              x.push({ x: 0, y: 255 }));
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
              (y = i.createLinearGradient(
                0,
                274,
                0,
                278,
              )).addColorStop(0, p),
              y.addColorStop(1, g),
              (i.fillStyle = y),
              i.fillRect(-28, 274, 56, 4),
              i.restore(),
              i.save(),
              i.translate(102, 40),
              i.beginPath(),
              i.moveTo(x[0].x, x[0].y));
            for (var v = 1; v < x.length; v++)
              i.lineTo(x[v].x, x[v].y);
            for (v = x.length - 2; v >= 0; v--)
              i.lineTo(-x[v].x, x[v].y);
            return (
              i.closePath(),
              (i.fillStyle = a),
              i.fill(),
              i.clip(),
              (y = i.createLinearGradient(
                0,
                0,
                0,
                92,
              )).addColorStop(0, d),
              y.addColorStop(1, h),
              (i.fillStyle = y),
              i.fillRect(-200, 0, 400, 92),
              (y = i.createLinearGradient(
                0,
                92,
                0,
                102,
              )).addColorStop(0, h),
              y.addColorStop(1, a),
              (i.fillStyle = y),
              i.fillRect(-200, 92, 400, 173),
              (y = i.createLinearGradient(
                0,
                265,
                0,
                272,
              )).addColorStop(0, s),
              y.addColorStop(1, r),
              (i.fillStyle = y),
              i.fillRect(-200, 265, 400, 8),
              (i.shadowBlur = 15 * e),
              (i.shadowColor = "rgba(0, 0, 0, 0.6)"),
              i.fillRect(-17, 0, 34, 106),
              (i.shadowBlur = 0),
              i.restore(),
              i.save(),
              (i.fillStyle = a),
              i.translate(102, 40),
              i.beginPath(),
              i.rect(-17, -40, 34, 146),
              i.closePath(),
              i.fill(),
              (y = i.createLinearGradient(
                -17,
                0,
                -5,
                0,
              )).addColorStop(0, d),
              y.addColorStop(1, c),
              (i.fillStyle = y),
              i.fillRect(-17, -40, 17, 146),
              (y = i.createLinearGradient(
                5,
                0,
                17,
                0,
              )).addColorStop(0, c),
              y.addColorStop(1, d),
              (i.fillStyle = y),
              i.fillRect(0, -40, 17, 146),
              i.restore(),
              i.save(),
              (i.fillStyle = a),
              i.translate(102, 40),
              i.beginPath(),
              i.rect(-29, 106, 58, 26),
              i.closePath(),
              (i.shadowBlur = 10 * e),
              (i.shadowColor = "rgba(0, 0, 0, 0.6)"),
              i.fill(),
              (i.shadowBlur = 0),
              i.clip(),
              (y = i.createLinearGradient(
                -29,
                0,
                -5,
                0,
              )).addColorStop(0, d),
              y.addColorStop(1, c),
              (i.fillStyle = y),
              i.fillRect(-29, 106, 29, 26),
              (y = i.createLinearGradient(
                5,
                0,
                29,
                0,
              )).addColorStop(0, c),
              y.addColorStop(1, d),
              (i.fillStyle = y),
              i.fillRect(0, 106, 29, 26),
              i.restore(),
              i.save(),
              (i.fillStyle = c),
              i.translate(102, 40),
              (i.shadowBlur = 10 * e),
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
          value: function drawTankTrack(t) {
            var e = document.createElement("canvas"),
              a = e.getContext("2d"),
              n = 0 + 120 * Math.PI,
              l = n / 5 - 36;
            ((a.canvas.width = 65 * t),
              (a.canvas.height = 240 * t),
              a.scale(t, t),
              (a.fillStyle = "#292929"),
              a.fillRect(0, 0, 65, 240),
              (a.globalAlpha = 0.9));
            var o = a.createLinearGradient(0, 0, 0, 36);
            (o.addColorStop(0, "#101010"),
              o.addColorStop(1, "transparent"),
              (a.fillStyle = o),
              a.fillRect(0, 0, 65, 36));
            var i = a.createLinearGradient(0, 240, 0, 204);
            (i.addColorStop(0, "#101010"),
              i.addColorStop(1, "transparent"),
              (a.fillStyle = i),
              a.fillRect(0, 204, 65, 36),
              (a.globalAlpha = 1));
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
            var d = function d(t, _ref) {
              var e = _ref.x;
              var a = _ref.y;
              var n = _ref.angle;
              var l = _ref.treadHeight;
              var o = _ref.treadWidth;
              var i = _ref.treadDepth;
              var s = _ref.trackHeight;
              var r = Math.cos(n),
                h = l * r,
                c = i * (1 - r);
              ((t.fillStyle = "#616161"),
                t.fillRect(e, a - h / 2, o, h),
                (t.fillStyle = "#404040"));
              var d,
                f = a > s / 2 ? 1 : 0;
              (f
                ? t.fillRect(e, a - h / 2 - c, o, c)
                : t.fillRect(e, a + h / 2, o, c),
                (d = t.createLinearGradient(
                  e,
                  a - h / 2,
                  0,
                  a - h / 2 - (h / 10) * 5,
                )).addColorStop(0, "#101010"),
                d.addColorStop(1, "transparent"),
                (t.fillStyle = d),
                f
                  ? t.fillRect(
                    e,
                    a - h / 2 - (h / 10) * 5 - c,
                    o,
                    (h / 10) * 5,
                  )
                  : t.fillRect(
                    e,
                    a - h / 2 - (h / 10) * 5,
                    o,
                    (h / 10) * 5,
                  ),
                (d = t.createLinearGradient(
                  e,
                  a + h / 2,
                  0,
                  a + h / 2 + (h / 10) * 5,
                )).addColorStop(0, "#101010"),
                d.addColorStop(1, "transparent"),
                (t.fillStyle = d),
                f
                  ? t.fillRect(e, a + h / 2, o, (h / 10) * 5)
                  : t.fillRect(
                    e,
                    a + h / 2 + c,
                    o,
                    (h / 10) * 5,
                  ));
            };
            var f = h.sort(function (t, e) {
              return e.angle - t.angle;
            });
            for (c = 0; c < f.length; c++) d(a, f[c]);
            a.globalAlpha = 0.4;
            var p = a.createLinearGradient(0, 0, 0, 96);
            (p.addColorStop(0, "#101010"),
              p.addColorStop(1, "transparent"),
              (a.fillStyle = p));
            var g = a.createLinearGradient(0, 240, 0, 204);
            return (
              g.addColorStop(0, "#101010"),
              g.addColorStop(1, "transparent"),
              (a.fillStyle = g),
              e
            );
          },
        },
        {
          key: "drawSkin",
          value: function drawSkin(t, e, a) {
            var _this = this;

            var n = this.tankScale,
              l = this.getCachedGraphic(
                "tankSprite",
                function () {
                  return _this.drawTank(
                    n,
                    e,
                    _this.config.colour,
                  );
                },
              ),
              o = this.getCachedGraphic(
                "trackSprite",
                function () {
                  return _this.drawTankTrack(n * e);
                },
              ),
              i = l.width / e,
              s = l.height / e,
              r = o.width / e,
              h = o.height / e;
            (t.translate(0.5 * -i, (225 / 318) * -s),
              t.drawImage(o, 9 * n, 80 * n, r, h),
              t.drawImage(o, 130 * n, 80 * n, r, h),
              t.drawImage(l, 0, 0, i, s));
          },
        },
      ]);

      return _class2;
    })(n);
  },
  function (t, e, a) {
    var n = a(4);
    a(1);
    t.exports = (function (_n2) {
      _inherits(_class3, _n2);

      function _class3(t) {
        _classCallCheck(this, _class3);

        (_get(
          Object.getPrototypeOf(_class3.prototype),
          "constructor",
          this,
        ).call(this, t),
          (this.points = []));
        for (var e = 0; e < 10; e++) this.points.push({ x: 0, y: 0 });
      }

      _createClass(_class3, [
        {
          key: "preDrawInScreenSpace",
          value: function preDrawInScreenSpace(t, e) {
            var a = Math.cos(this.angle),
              n = Math.sin(this.angle);
            ((this.points[0].x = this.x + (-16 * a - 0 * n)),
              (this.points[0].y = this.y + (0 * a + -16 * n)),
              (this.points[1].x = this.points[0].x + -2 * a),
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
            (t.beginPath(),
              t.moveTo(this.points[0].x, this.points[0].y));
            for (l = 1; l < this.points.length; l++) {
              var _points$l2 = this.points[l];
              var _e5 = _points$l2.x;
              var _a5 = _points$l2.y;
              t.lineTo(_e5, _a5);
            }
            ((t.strokeStyle = "#ce0804"),
              (t.lineWidth = 34),
              (t.lineJoin = "round"),
              (t.lineCap = "square"),
              t.stroke());
          },
        },
        {
          key: "drawSkin",
          value: function drawSkin(t, e, a) {
            this.tankScale;
          },
        },
      ]);

      return _class3;
    })(n);
  },
  function (t, e, a) {
    var n = a(5);
    function l(t) {
      var e =
        arguments.length <= 1 || arguments[1] === undefined
          ? 2e3
          : arguments[1];
      ((this.timeToLive = e),
        (this.message = t),
        (this.width = 13 * t.length + 40),
        (this.height = 60),
        (this.draw = function (t, e, a) {
          (this.timeToLive <= 0 && destroyGraphicsObject(this),
            (this.timeToLive -= a));
          var n = 0.5 * (t.canvas.clientWidth - this.width),
            l = 0.5 * t.canvas.clientHeight - this.height - 70;
          ((t.globalAlpha = 0.3),
            (t.shadowOffsetY = 6),
            (t.shadowBlur = 5),
            (t.shadowColor = "black"),
            t.fillRect(n, l, this.width, this.height),
            (t.globalAlpha = 0.95),
            (t.shadowOffsetY = 0),
            (t.shadowBlur = 0),
            (t.fillStyle = "#febd09"),
            t.fillRect(n, l, this.width, this.height),
            (t.strokeStyle = "#ffffff"),
            (t.lineWidth = 4),
            t.strokeRect(n, l, this.width, this.height),
            (t.globalAlpha = 1),
            (t.fillStyle = "#ffffff"),
            (t.font = "26px Fredoka One"),
            (t.textAlign = "center"),
            (t.shadowColor = "#e55b0e"),
            (t.shadowOffsetY = 4),
            t.fillText(
              this.message,
              n + 0.5 * this.width,
              l + 0.5 * this.height + 5,
            ),
            (t.shadowOffsetY = 0),
            (t.textAlign = "start"));
        }));
    }
    ((l.prototype = new n()), (t.exports.PopUpNotification = l));
  },
]);

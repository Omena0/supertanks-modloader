function a(module, exports, a) {
  return (exports.x - module.x) * (a.y - module.y) -
    (a.x - module.x) * (exports.y - module.y) <=
    0
    ? -1
    : 1;
}
((module.exports.angleLerp = function (module, exports, a) {
  return (
    module +
    (function (module, exports) {
      var a = 2 * Math.PI,
        n = (exports - module) % a;
      return ((2 * n) % a) - n;
    })(module, exports) *
    a
  );
}),
  (module.exports.line_intersect = function (
    module,
    exports,
    a,
    n,
    l,
    o,
    i,
    s,
  ) {
    var r,
      h,
      c = (s - o) * (a - module) - (i - l) * (n - exports);
    return 0 == c
      ? null
      : {
        x:
          module +
          (r =
            ((i - l) * (exports - o) - (s - o) * (module - l)) /
            c) *
          (a - module),
        y: exports + r * (n - exports),
        seg1: r >= 0 && r <= 1,
        seg2:
          (h =
            ((a - module) * (exports - o) -
              (n - exports) * (module - l)) /
            c) >= 0 && h <= 1,
      };
  }),
  (module.exports.doPointsSpanLine = function (module, exports, n, l) {
    return a(n, l, module) != a(n, l, exports);
  }),
  (module.exports.checkOBBCircleIntersection = function (
    module,
    exports,
    a,
    n,
    l,
    o,
    i,
  ) {
    var s = !1,
      r = -a,
      h = (l - module) * Math.cos(r) - (o - exports) * Math.sin(r),
      c = (l - module) * Math.sin(r) + (o - exports) * Math.cos(r);
    return (
      h + i > n[0] &&
      h - i < n[2] &&
      c + i > n[1] &&
      c - i < n[5] &&
      (s = !0),
      s
    );
  }),
  (module.exports.checkAndResolveOBBAABB = function (
    module,
    exports,
    a,
    n,
    l,
    o,
  ) {
    var i = !0,
      s = [],
      r = {
        axisX: 1,
        axisY: 0,
        points1: [exports[0], exports[2], exports[4], exports[6]],
        points2: [a, n],
      };
    s.push(r);
    var h,
      c = {
        axisX: 0,
        axisY: 1,
        points1: [exports[1], exports[3], exports[5], exports[7]],
        points2: [l, o],
      };
    s.push(c);
    for (var d = 0; d < 2; d++) {
      var f = [
        exports[2 + 2 * d] - exports[0 + 2 * d],
        exports[3 + 2 * d] - exports[1 + 2 * d],
      ],
        p = Math.sqrt(f[0] * f[0] + f[1] * f[1]);
      (0 == p && (p = 0.00001), (f[0] /= p), (f[1] /= p));
      for (var g = [], u = 0; u < 8; u += 2)
        g.push(exports[u] * f[0] + exports[u + 1] * f[1]);
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
        (Math.min.apply(Math, _toConsumableArray(s[d].points1)) <
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
    i &&
      ((module.x += s[v].axisX * h * w),
        (module.y += s[v].axisY * h * w));
  }));

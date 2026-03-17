((module.exports.tankStateToBinary = function (module) {
  var exports = module.tanks,
    a = 5 + 7 * exports.length,
    n = new ArrayBuffer(a),
    l = new DataView(n);
  (l.setUint32(0, module.tickNum), l.setUint8(4, exports.length));
  for (var o = 0; o < exports.length; o++) {
    var i = Math.round(10000 * exports[o].angle),
      s = 5 + 7 * o;
    (l.setUint8(s, exports[o].id),
      l.setInt16(s + 1, exports[o].x),
      l.setInt16(s + 3, exports[o].y),
      l.setInt16(s + 5, i));
  }
  return n;
}),
  (module.exports.binaryToTankState = function (module) {
    for (
      var exports = new DataView(module),
      a = exports.getUint32(0),
      n = exports.getUint8(4),
      l = [],
      o = 0;
      o < n;
      o++
    ) {
      var i = 5 + 7 * o,
        s = exports.getUint8(i),
        r = exports.getInt16(i + 1),
        h = exports.getInt16(i + 3),
        c = exports.getInt16(i + 5) / 10000;
      l.push({
        id: s,
        x: r,
        y: h,
        angle: c,
      });
    }
    return {
      tanks: l,
      tickNum: a,
    };
  }),
  (module.exports.bulletStateToBinary = function (module) {
    var exports = module.bullets,
      a = 6 + 9 * exports.length,
      n = new ArrayBuffer(a),
      l = new DataView(n);
    (l.setUint32(0, module.tickNum),
      l.setUint8(4, module.bulletsSpawnedCount),
      l.setUint8(5, exports.length));
    for (var o = 0; o < exports.length; o++) {
      var i = Math.round(50000 * exports[o].xVel),
        s = Math.round(50000 * exports[o].yVel),
        r = 6 + 9 * o;
      (l.setUint8(r, exports[o].id),
        l.setInt16(r + 1, exports[o].x),
        l.setInt16(r + 3, exports[o].y),
        l.setInt16(r + 5, i),
        l.setInt16(r + 7, s));
    }
    return n;
  }),
  (module.exports.binaryToBulletState = function (module) {
    for (
      var exports = new DataView(module),
      a = exports.getUint32(0),
      n = exports.getUint8(4),
      l = exports.getUint8(5),
      o = [],
      i = 0;
      i < l;
      i++
    ) {
      var s = 6 + 9 * i,
        r = exports.getUint8(s),
        h = exports.getInt16(s + 1),
        c = exports.getInt16(s + 3),
        d = exports.getInt16(s + 5) / 50000,
        f = exports.getInt16(s + 7) / 50000;
      o.push({
        id: r,
        x: h,
        y: c,
        xVel: d,
        yVel: f,
      });
    }
    return {
      bullets: o,
      tickNum: a,
      bulletsSpawnedCount: n,
    };
  }),
  (module.exports.userInputToBinaryData = function (module) {
    var exports = new ArrayBuffer(7),
      a = new DataView(exports),
      n = Math.round(10000 * module.targetAngle),
      l = (module.moveForward << 1) + module.mouseClicked;
    return (
      a.setInt16(0, n),
      a.setInt32(2, module.tickNum),
      a.setUint8(6, l),
      exports
    );
  }),
  (module.exports.binaryDataToUserInput = function (module) {
    var exports = new DataView(module),
      a = exports.getInt16(0),
      n = exports.getInt32(2),
      l = exports.getUint8(6);
    return {
      targetAngle: a / 10000,
      moveForward: !!(l >> 1),
      mouseClicked: !!(1 & l),
      tickNum: n,
    };
  }),
  (module.exports.newStateFromServer = 0),
  (module.exports.syncBullets = 1),
  (module.exports.tankInputToServer = 2));

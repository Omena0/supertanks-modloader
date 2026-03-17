module.exports = function (module, exports, a) {
  var n = {},
    l = !1;
  ((module.binaryType = "arraybuffer"),
    (this.on = function (module, exports) {
      n[module] = exports;
    }),
    (this.send = function (exports, a) {
      module.send(JSON.stringify([exports, a]));
    }),
    (this.sendBinary = function (exports, a) {
      var n = new Uint8Array(1 + a.byteLength);
      n[0] = exports;
      var l = new Uint8Array(a);
      (n.set(l, 1), module.send(n.buffer));
    }),
    (this.onDisconnect = function (exports) {
      module.onclose = exports;
    }),
    (module.onmessage = function (module) {
      if ("data" in module)
        if ((module = module.data) instanceof ArrayBuffer) {
          var exports = new Uint8Array(module)[0],
            a = module.slice(1, module.byteLength);
          exports in n && n[exports](a);
        } else
          try {
            if (2 != (module = JSON.parse(module)).length) return;
            var l = module[0];
            l in n && n[l](module[1]);
          } catch (module) {
            console.log(module);
          }
    }),
    (module.onopen = function () {
      l || ((l = !0), void 0 !== exports && e());
    }),
    void 0 !== a && (module.onclose = a),
    1 == module.readyState && ((l = !0), void 0 !== exports && e()));
};

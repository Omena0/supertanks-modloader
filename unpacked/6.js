(function (exports) {
  var n = require("./0"),
    l = require("./3"),
    o = require("./8"),
    i = require("./2"),
    s = require("./9"),
    r = require("./1");
  var h,
    c,
    d = require("./10"),
    f = require("./11"),
    p = (require("./5"), require("./15").PopUpNotification);
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
    P = {
      camLeft: 0,
      camTop: 0,
      scale: 1,
    },
    B = 0,
    L = 0,
    E = !1,
    N = -1,
    V = 0,
    R = 0,
    W = n.TANK_DEFAULT_BULLETCOUNT,
    D = 0,
    O = [
      {
        name: "Player 1",
        score: 10,
      },
      {
        name: "Joe",
        score: 5,
      },
      {
        name: "Alex",
        score: "12",
      },
    ];
  function _(module) {
    var exports =
      "16x16\n+---+---+---+---+---+---+---+---+---+---+---+---+---+---+---+---+\n|           |                   |           |               |   |\n+---+---+   +   +---+   +---+   +---+   +   +   +---+   +   +   +\n|   |       |       |   |       |       |       |   |   |       |\n+   +   +   +---+   +   +   +---+   +---+   +---+   +   +---+---+\n|   |   |   |           |   |               |       |           |\n+   +   +   +   +---+---+   +---+---+---+   +   +---+---+       +\n|       |       |                       |   |                   |\n+---+---+---+---+---+   +---+       +---+   +   +---+   +       +\n|           |       |   |   |               |   |   |   |   |   |\n+   +---+   +   +---+   +   +   +---+---+---+   +   +---+---+---+\n|       |       |           |   |       |   |   |               |\n+---+   +---+---+   +---+   +   +   +   +   +   +   +---+---+   +\n|       |           |   |   |   |   |           |           |   |\n+   +---+   +---+---+   +---+   +   +---+       +---+       +   +\n|           |               |       |   |           |       |   |\n+   +---+   +   +---+   +---+---+   +   +           +---+   +   +\n|       |       |   |   |           |   |                   |   |\n+---+---+   +   +   +   +           +   +---+---+---+---+---+   +\n|           |       |   |       |   |           |       |       |\n+---+       +---+   +---+       +   +---+---+   +       +       +\n|           |                   |       |               |       |\n+---+   +---+---+---+   +---+   +   +   +   +---+   +---+       +\n|                       |   |       |   |   |   |               |\n+   +---+   +---+---+---+   +---+   +---+   +   +---+   +---+---+\n|       |                       |           |                   |\n+       +---+---+---+---+       +---+---+---+---+---+---+       +\n|                       |       |   |               |           |\n+       +---+   +   +---+       +   +---+---+---+   +   +---+---+\n|           |   |                   |               |           |\n+---+   +---+   +---+---+       +   +---+   +   +   +   +---+   +\n|           |           |       |           |   |       |       |\n+---+---+---+---+---+---+---+---+---+---+---+---+---+---+---+---+"
        .replace(/[\r]+/g, "")
        .split("\n"),
      require = exports[0].split("x"),
      n = parseInt(require[0]),
      l = parseInt(require[1]),
      o = [];
    for (var i = 0; i < l + 1; i++)
      for (var s = exports[1 + 2 * i], r = 2; r < s.length; r += 4)
        "-" == s[r] ? o.push(1) : o.push(0);
    var h = [];
    for (i = 0; i < l; i++)
      for (s = exports[2 + 2 * i], r = 0; r < s.length; r += 4)
        "|" == s[r] ? h.push(1) : h.push(0);
    var c = [];
    for (var d = 0; d <= l; d++)
      for (var f = 0; f <= n; f++) {
        var p = 0;
        (d > 0 && (p += 1 * h[(d - 1) * (n + 1) + f]),
          d < l && (p += 4 * h[d * (n + 1) + f]),
          f > 0 && (p += 8 * o[d * n + (f - 1)]),
          f < n && (p += 2 * o[d * n + f]),
          0 != p &&
          c.push({
            x: f,
            y: d,
            weight: p,
          }));
      }
    ((module.fillStyle = rt),
      module.fillRect(0, 0, module.canvas.width, module.canvas.height));
    for (i = 0; i < c.length; i++) {
      var _e = xt[c[i].weight],
        _a = 100 * c[i].x - 220 - 0.5 * _e.width,
        _n3 = 100 * c[i].y - 830 - 0.5 * _e.height;
      _a + _e.width > 0 &&
        _a < module.canvas.width &&
        _n3 + _e.height > 0 &&
        _n3 < module.canvas.height &&
        module.drawImage(_e, _a, _n3);
    }
    ((module.globalAlpha = 0.3),
      (module.fillStyle = "#434647"),
      module.fillRect(0, 0, module.canvas.width, module.canvas.height));
  }
  function U() {
    var module = $("#dataPanel").width(),
      exports = document.getElementById("gameCanvas");
    ((exports.width =
      (document.body.clientWidth - module) * window.devicePixelRatio),
      (exports.height =
        document.body.clientHeight * window.devicePixelRatio),
      (exports.style.width = document.body.clientWidth - module + "px"),
      (exports.style.height = document.body.clientHeight + "px"));
    exports
      .getContext("2d")
      .scale(window.devicePixelRatio, window.devicePixelRatio);
  }
  function H(module, exports) {
    ((b = module),
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
      (m = new s(new WebSocket(exports), F)),
      (S = !1),
      m.on("JOIN_SUCCESS", Y),
      m.on(o.newStateFromServer, Q),
      m.on(o.syncBullets, q),
      m.on("leaderBoardInfo", J),
      m.on("updateTankList", z),
      m.on("tankKilled", at),
      m.on("playerSpawned", et),
      m.on("NEW_BULLET_LIMIT", function (module) {
        if (module > W) {
          var exports = module - W;
          exports > 1
            ? T.push(new p("You gained +" + exports + " balls!"))
            : T.push(new p("You gained +" + exports + " ball!"));
        }
        W = module;
      }),
      m.on("EXP", function (module) {
        addEXP(module);
      }),
      (document.getElementById("startScreen").style.display = "none"),
      (y = 0),
      (v = []),
      (w = []),
      !0,
      requestAnimationFrame(ut),
      setInterval(pt, n.PHYSICS_INTERVAL));
  }
  function F() {
    var module, exports;
    (m.send("joinGame", {
      name: b,
      sessionCookie:
        ((module = "session_token"),
          (exports = ("; " + document.cookie).split("; " + module + "=")),
          2 == exports.length ? exports.pop().split(";").shift() : null),
    }),
      console.log("Connected"));
  }
  function Y(module) {
    ((g[0].ID = module.newID),
      (g[0].name = module.name),
      g[0].setSkin(module.colourIndex),
      (S = !0),
      (I.cellsAcross = module.cellsAcross),
      (I.cellsDown = module.cellsDown),
      (I.verticalWalls = module.verticalWalls),
      (I.horisontalWalls = module.horisontalWalls),
      (I.wallCorners = module.wallCorners),
      (I.worldWidth = 100 * I.cellsAcross),
      (I.worldHeight = 100 * I.cellsDown));
    for (var exports = 0; exports <= I.cellsDown; exports++)
      for (var require = 0; require <= I.cellsAcross; require++) {
        var n = 0;
        (exports > 0 &&
          (n +=
            1 *
            I.verticalWalls[
            (exports - 1) * (I.cellsAcross + 1) + require
            ]),
          exports < I.cellsDown &&
          (n +=
            4 *
            I.verticalWalls[
            exports * (I.cellsAcross + 1) + require
            ]),
          require > 0 &&
          (n +=
            8 *
            I.horisontalWalls[
            exports * I.cellsAcross + (require - 1)
            ]),
          require < I.cellsAcross &&
          (n +=
            2 *
            I.horisontalWalls[
            exports * I.cellsAcross + require
            ]),
          0 != n &&
          C.push({
            x: require,
            y: exports,
            weight: n,
          }));
      }
  }
  function K() {
    (console.log("Respawning..."),
      m.send("spawnPlayer"),
      $("#gameScreen").show());
    var module = document.getElementById("gameCanvas");
    ((module.style.display = "inline"),
      (c.globalAlpha = 1),
      ((module = document.getElementById("deathScreen")).style.display =
        "none"),
      !0);
  }
  function G(module) {
    (R++, (D = module));
  }
  function X(module, exports) {
    for (var require = 0; require < exports.length; require++) {
      var n = exports[require];
      n.moveForward
        ? g[0].moveTowards(
          g[0].x + n.targetX,
          g[0].y + n.targetY,
          I,
          module,
        )
        : g[0].lookAt(g[0].x + n.targetX, g[0].y + n.targetY, I);
      for (var o = 1; o < g.length; o++)
        Math.abs(g[o].x - g[o].latestX) > 70 ||
          Math.abs(g[o].y - g[o].latestY) > 70
          ? ((g[o].x = g[o].latestX),
            (g[o].y = g[o].latestY),
            (g[o].angle = g[o].latestAngle))
          : ((g[o].x = g[o].x + 0.4 * (g[o].latestX - g[o].x)),
            (g[o].y = g[o].y + 0.4 * (g[o].latestY - g[o].y)),
            (g[o].angle = l.angleLerp(
              g[o].angle,
              g[o].latestAngle,
              0.3,
            )));
    }
  }
  function j(module, exports) {
    for (var require = 0; require < exports.length; require++) {
      if (
        exports[require].mouseClicked &&
        ((v = exports[require].tickNum),
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
          (x--, u.push(p), G(exports[require].tickNum));
        }
      }
      for (var y = 0; y < u.length; y++) u[y].update(I, module);
    }
    var v;
  }
  function J(module) {
    ((O = module.leaderBoard), module.longestReigns);
    for (var exports = 0; exports < g.length; exports++)
      for (
        var require = 0;
        require < module.playerScores.length;
        require++
      )
        g[exports].ID == module.playerScores[require].id &&
          ((g[exports].score = module.playerScores[require].score),
            (g[exports].leaderBoardPos =
              module.playerScores[require].leaderBoardPos));
    for (exports = 0; exports < O.length; exports++)
      O[exports].id == g[0].ID && (O[exports].isplayer = !0);
    (setLeaderboard(O), (N = module.kingID), (V = module.kingStartTime));
  }
  function q(module) {
    for (
      var exports = o.binaryToBulletState(module),
      require = exports.bullets,
      l = new Array(u.length).fill(0),
      i = 0;
      i < require.length;
      i++
    ) {
      for (var s = !1, r = 0; r < u.length; r++)
        if (u[r].id == require[i].id) {
          ((u[r].x = require[i].x),
            (u[r].y = require[i].y),
            (u[r].xVel = require[i].xVel),
            (u[r].yVel = require[i].yVel),
            (s = !0),
            (l[r] = 1));
          break;
        }
      if (!s) {
        var h = new d(
          require[i].id,
          require[i].x,
          require[i].y,
          require[i].xVel,
          require[i].yVel,
        );
        u.push(h);
      }
    }
    for (i = l.length - 1; i >= 0; i--) 0 == l[i] && u.splice(i, 1);
    R = exports.bulletsSpawnedCount;
    for (i = 0; i < w.length; i++)
      if (w[i].tickNum >= exports.tickNum) {
        w.splice(0, i);
        break;
      }
    j(n.PHYSICS_INTERVAL, w);
  }
  function z(module) {
    for (
      var exports = new Array(g.length).fill(0), require = 0;
      require < module.length;
      require++
    ) {
      for (var n = !1, l = 0; l < g.length; l++)
        if (g[l].ID == module[require].id) {
          ((n = !0), (exports[l] = 1));
          break;
        }
      if (!n) {
        var o = new f(0, 0);
        ((o.ID = module[require].id),
          (o.name = module[require].name),
          o.setSkin(module[require].colourIndex),
          (o.beenHit = module[require].beenHit),
          (o.justJoined = !0),
          g.push(o));
      }
    }
    for (require = exports.length - 1; require >= 0; require--)
      0 == exports[require] && g.splice(require, 1);
  }
  function Q(module) {
    for (
      var exports = o.binaryToTankState(module), require = 0;
      require < g.length;
      require++
    )
      for (var l = 0; l < exports.tanks.length; l++)
        if (g[require].ID == exports.tanks[l].id) {
          (0 == require || g[require].justJoined
            ? ((g[require].x = exports.tanks[l].x),
              (g[require].y = exports.tanks[l].y),
              (g[require].angle = exports.tanks[l].angle),
              (g[require].latestX = g[require].x),
              (g[require].latestY = g[require].y),
              (g[require].latestAngle = g[require].angle),
              (g[require].justJoined = !1))
            : ((g[require].latestX = exports.tanks[l].x),
              (g[require].latestY = exports.tanks[l].y),
              (g[require].latestAngle = exports.tanks[l].angle)),
            N == g[require].ID
              ? (g[require].isKing = !0)
              : (g[require].isKing = !1));
          break;
        }
    for (l = 0; l < v.length; l++)
      if (v[l].tickNum >= exports.tickNum) {
        v.splice(0, l);
        break;
      }
    X(n.PHYSICS_INTERVAL, v);
  }
  function Z(module) {
    ((B = module.clientX), (L = module.clientY));
  }
  function tt(module) {
    E = !0;
  }
  function et(module) {
    for (
      var exports = module.tankID,
      require = module.x,
      n = module.y,
      l = 0;
      l < g.length;
      l++
    )
      g[l].ID == exports &&
        ((g[l].beenHit = !1),
          (g[l].x = g[l].latestX = require),
          (g[l].y = g[l].latestY = n));
  }
  function at(module) {
    for (var exports = 0; exports < g.length; exports++)
      g[exports].ID == module && (g[exports].beenHit = !0);
    module == g[0].ID &&
      (function () {
        (!1, console.log("Showing death screen"));
        var module = document.getElementById("startScreen");
        ((module.style.display = "none"),
          ((module =
            document.getElementById("deathScreen")).style.display =
            "block"),
          setTimeout(function () {
            $("#gameScreen").fadeOut(1000, function () {
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
  exports.destroyGraphicsObject = function (module) {
    var exports = T.indexOf(module);
    T.splice(exports, 1);
  };
  var st,
    rt = "#f0f0f0",
    ht = !0,
    ct = 1,
    dt = 0;
  function ft(module) {
    ht && ((st = module), (ht = !1));
    var exports = module - st;
    ((st = module),
      (P.camLeft = g[0].x - 0.5 * h.clientWidth),
      (P.camTop = g[0].y - 0.5 * h.clientHeight),
      (c.fillStyle = rt),
      c.fillRect(0, 0, h.width, h.height));
    for (var require = 0; require < C.length; require++) {
      var n = xt[C[require].weight];
      var _t = window.devicePixelRatio || 1,
        _e2 = n.width / _t,
        _i = n.height / _t;
      var l = Math.floor(100 * C[require].x - P.camLeft - 0.5 * _e2),
        o = Math.floor(100 * C[require].y - P.camTop - 0.5 * _i);
      l + _e2 > 0 &&
        l < h.width &&
        o + _i > 0 &&
        o < h.height &&
        c.drawImage(n, l, o, _e2, _i);
    }
    for (require = 0; require < u.length; require++) u[require].draw(c, P);
    var i = g.slice().sort(function (module, exports) {
      return module.model.showingExplosion
        ? 1
        : exports.model.showingExplosion || module.model.showingScorch
          ? -1
          : exports.model.showingScorch
            ? 1
            : 0;
    });
    for (require = 0; require < i.length; require++)
      i[require].justJoined || i[require].draw(c, P);
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
        dt > 4 && (ct -= exports / 3000),
        (dt += exports / 1000),
        (c.globalAlpha = 1));
    var s = 0;
    if (-1 != N) {
      s = new Date().getTime() - V;
      for (
        var r = {
          x: 0,
          y: 0,
        },
        require = 0;
        require < g.length;
        require++
      )
        g[require].ID == N &&
          ((r.x = g[require].x),
            (r.y = g[require].y),
            g[require].name);
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
              : h.clientHeight - 20 - 10 * Math.sin(w)),
          c.save(),
          c.translate(m, S),
          (c.fillStyle = "#ffbb00"),
          (c.font = "30px Anton"),
          c.fillText(
            "\uD83D\uDC51",
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
    for (require = 0; require < T.length; require++)
      T[require].draw(c, P, exports);
    it &&
      (function (module) {
        (nt.drawImage(h, 0, 0),
          c.clearRect(0, 0, h.width, h.height),
          (c.globalAlpha = lt),
          c.drawImage(ot, 0, 0),
          (lt -= module / 1000) <= 0 &&
          ((document.getElementById("gameCanvas").style.display =
            "none"),
            (it = !1),
            fadeFinishedCallback()));
      })(exports);
  }
  function pt() {
    var module = n.PHYSICS_INTERVAL;
    if (S) {
      !(function () {
        ((M = B + P.camLeft - g[0].x),
          (A = L + P.camTop - g[0].y),
          (k = !0),
          Math.abs(M) < 60 && Math.abs(A) < 60 && (k = !1));
        var module = {
          targetAngle: Math.atan2(A, M),
          moveForward: k,
          mouseClicked: E,
          tickNum: y,
        },
          exports = {
            targetX: M,
            targetY: A,
            moveForward: k,
            tickNum: y,
          },
          require = {
            mouseClicked: E,
            tickNum: y,
          },
          n = o.userInputToBinaryData(module);
        (m.sendBinary(o.tankInputToServer, n),
          v.push(exports),
          w.push(require),
          y++);
      })();
      var exports = {
        mouseClicked: E,
        tickNum: y - 1,
      };
      (X(module, [
        {
          targetX: M,
          targetY: A,
          moveForward: k,
        },
      ]),
        j(module, [exports]));
    }
    E = !1;
  }
  var gt = !1;
  function ut(module) {
    (ft(module),
      v.length > 1500 &&
      !gt &&
      (alert(
        "Unable to reconnect to the server, you are being redirected to the homepage.",
      ),
        (window.location.href = "/"),
        (gt = !0)),
      requestAnimationFrame(ut));
  }
  var xt = r.generateWallSpriteSheet(rt, window.devicePixelRatio || 1);
  ((exports.drawSplashScreen = _),
    (exports.beginClient = H),
    (exports.askToSpawn = K),
    (module.exports.drawSplashScreen = _),
    (module.exports.beginClient = H),
    (module.exports.askToSpawn = K));
}).call(this, require("./7"));

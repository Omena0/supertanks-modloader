(function(){try{if(!globalThis.mod_config)globalThis.mod_config={};Object.assign(globalThis.mod_config,{});}catch(e){console.warn("Failed to set globalThis.mod_config",e);}})();
function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) throw new TypeError("Cannot call a class as a function");
}
function _defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || false;
        descriptor.configurable = true;
        if ("value" in descriptor) descriptor.writable = true;
        Object.defineProperty(target, descriptor.key, descriptor);
    }
}
function _createClass(Constructor, protoProps, staticProps) {
    if (protoProps) _defineProperties(Constructor.prototype, protoProps);
    if (staticProps) _defineProperties(Constructor, staticProps);
    return Constructor;
}
function _inherits(subClass, superClass) {
    if (typeof superClass !== "function" && superClass !== null)
        throw new TypeError("Super expression must either be null or a function");
    subClass.prototype = Object.create(superClass && superClass.prototype, {
        constructor: { value: subClass, writable: true, configurable: true }
    });
    if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
}
function _get(object, property, receiver) {
    if (object === null) object = Function.prototype;
    var desc = Object.getOwnPropertyDescriptor(object, property);
    if (desc === undefined) {
        var parent = Object.getPrototypeOf(object);
        return parent === null ? undefined : _get(parent, property, receiver);
    }
    if ("value" in desc) return desc.value;
    var getter = desc.get;
    return getter === undefined ? undefined : getter.call(receiver);
}
function _toConsumableArray(arr) {
    return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread();
}
function _arrayWithoutHoles(arr) {
    if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) arr2[i] = arr[i]; return arr2; }
}
function _iterableToArray(iter) {
    if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter);
}
function _nonIterableSpread() {
    throw new TypeError("Invalid attempt to spread non-iterable instance");
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
                        return t.default;
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
        a((a.s = 22))
    );
})([
function(t, e, a) {
t.exports.TANK_COLOURS = [
  '#002BFF',
  '#F51200',
  '#00cdcd',
  '#ffb90f',
  '#9a32cd',
  '#ff1493',
  '#73FF00',
  '#05A800',
  '#FF5F00'
];

t.exports.ROOM_CAPACITY = 10;
t.exports.TANK_DEFAULT_BULLETCOUNT = 3;
t.exports.TANK_MAX_BULLET_COUNT = 12;

t.exports.TANK_BOUNDING_BOX = [
  -18, -16,
   26, -16,
   26,  16,
  -18,  16
];

t.exports.TANK_MAX_SPEED = 0.15;
t.exports.PHYSICS_INTERVAL = 1000 / 60;
t.exports.SEND_STATE_INTERVAL = 1000 / 30;
t.exports.SEND_BULLETS_STATE_INTERVAL = 1000 / 6;
t.exports.EXP_PER_KILL = 7;

},
function(t, e, a) {
function sideOfLine(p1, p2, p3) {
    return (p2.x - p1.x) * (p3.y - p1.y) - (p3.x - p1.x) * (p2.y - p1.y) <= 0
        ? -1
        : 1;
}

t.exports.angleLerp = function (from, to, t) {
    return (
        from +
        (function shortAngleDist(from, to) {
            var fullCircle = 2 * Math.PI;
            var delta = (to - from) % fullCircle;
            return ((2 * delta) % fullCircle) - delta;
        })(from, to) *
            t
    );
};

t.exports.line_intersect = function (x1, y1, x2, y2, x3, y3, x4, y4) {
    var t, u;
    var denominator = (y4 - y3) * (x2 - x1) - (x4 - x3) * (y2 - y1);

    if (denominator == 0) return null;

    t = ((x4 - x3) * (y1 - y3) - (y4 - y3) * (x1 - x3)) / denominator;
    u = ((x2 - x1) * (y1 - y3) - (y2 - y1) * (x1 - x3)) / denominator;

    return {
        x: x1 + t * (x2 - x1),
        y: y1 + t * (y2 - y1),
        seg1: t >= 0 && t <= 1,
        seg2: u >= 0 && u <= 1,
    };
};

t.exports.doPointsSpanLine = function (
    pointA,
    pointB,
    lineStart,
    lineEnd,
) {
    return (
        sideOfLine(lineStart, lineEnd, pointA) !=
        sideOfLine(lineStart, lineEnd, pointB)
    );
};

t.exports.checkOBBCircleIntersection = function (
    obbX,
    obbY,
    obbAngle,
    obbExtents,
    circleX,
    circleY,
    circleRadius,
) {
    var intersects = false;
    var negAngle = -obbAngle;
    var localX =
        (circleX - obbX) * Math.cos(negAngle) -
        (circleY - obbY) * Math.sin(negAngle);
    var localY =
        (circleX - obbX) * Math.sin(negAngle) +
        (circleY - obbY) * Math.cos(negAngle);

    if (
        localX + circleRadius > obbExtents[0] &&
        localX - circleRadius < obbExtents[2] &&
        localY + circleRadius > obbExtents[1] &&
        localY - circleRadius < obbExtents[5]
    ) {
        intersects = true;
    }

    return intersects;
};

t.exports.checkAndResolveOBBAABB = function (
    entity,
    boundingBox,
    aabbLeft,
    aabbRight,
    aabbTop,
    aabbBottom,
) {
    var colliding = true;
    var axes = [];

    // X axis
    var xAxis = {
        axisX: 1,
        axisY: 0,
        points1: [
            boundingBox[0],
            boundingBox[2],
            boundingBox[4],
            boundingBox[6],
        ],
        points2: [aabbLeft, aabbRight],
    };
    axes.push(xAxis);

    // Y axis
    var minOverlap;
    var yAxis = {
        axisX: 0,
        axisY: 1,
        points1: [
            boundingBox[1],
            boundingBox[3],
            boundingBox[5],
            boundingBox[7],
        ],
        points2: [aabbTop, aabbBottom],
    };
    axes.push(yAxis);

    // OBB edge axes
    for (var i = 0; i < 2; i++) {
        var edge = [
            boundingBox[2 + 2 * i] - boundingBox[0 + 2 * i],
            boundingBox[3 + 2 * i] - boundingBox[1 + 2 * i],
        ];
        var length = Math.sqrt(edge[0] * edge[0] + edge[1] * edge[1]);
        if (length == 0) length = 0.00001;
        edge[0] /= length;
        edge[1] /= length;

        var projectedOBB = [];
        for (var j = 0; j < 8; j += 2)
            projectedOBB.push(
                boundingBox[j] * edge[0] + boundingBox[j + 1] * edge[1],
            );

        var projectedAABB = [];
        projectedAABB.push(aabbLeft * edge[0] + aabbTop * edge[1]);
        projectedAABB.push(aabbRight * edge[0] + aabbTop * edge[1]);
        projectedAABB.push(aabbLeft * edge[0] + aabbBottom * edge[1]);
        projectedAABB.push(aabbRight * edge[0] + aabbBottom * edge[1]);

        var axis = {
            axisX: edge[0],
            axisY: edge[1],
            points1: projectedOBB,
            points2: projectedAABB,
        };
        axes.push(axis);
    }

    var minIndex = 0;
    var resolveDirection = 1;

    for (i = 0; i < axes.length; i++) {
        var maxVal, minVal;
        var direction = 1;

        if (
            Math.min.apply(Math, _toConsumableArray(axes[i].points1)) <
            Math.min.apply(Math, _toConsumableArray(axes[i].points2))
        ) {
            maxVal = Math.max.apply(Math, _toConsumableArray(axes[i].points1));
            minVal = Math.min.apply(Math, _toConsumableArray(axes[i].points2));
            direction = -1;
        } else {
            maxVal = Math.max.apply(Math, _toConsumableArray(axes[i].points2));
            minVal = Math.min.apply(Math, _toConsumableArray(axes[i].points1));
        }

        if (minVal >= maxVal) {
            colliding = false;
            break;
        }

        if (i == 0) {
            minOverlap = maxVal - minVal;
            resolveDirection = direction;
        } else if (maxVal - minVal < minOverlap) {
            minOverlap = maxVal - minVal;
            resolveDirection = direction;
            minIndex = i;
        }
    }

    if (colliding) {
        entity.x += axes[minIndex].axisX * minOverlap * resolveDirection;
        entity.y += axes[minIndex].axisY * minOverlap * resolveDirection;
    }
};

},
function(t, e, a) {
t.exports.tankStateToBinary = function (state) {
    var tanks = state.tanks;
    var byteLength = 5 + 7 * tanks.length;
    var buffer = new ArrayBuffer(byteLength);
    var view = new DataView(buffer);

    view.setUint32(0, state.tickNum);
    view.setUint8(4, tanks.length);

    for (var i = 0; i < tanks.length; i++) {
        var anglePacked = Math.round(10000 * tanks[i].angle);
        var offset = 5 + 7 * i;
        view.setUint8(offset, tanks[i].id);
        view.setInt16(offset + 1, tanks[i].x);
        view.setInt16(offset + 3, tanks[i].y);
        view.setInt16(offset + 5, anglePacked);
    }

    return buffer;
};

t.exports.binaryToTankState = function (buffer) {
    var view = new DataView(buffer);
    var tickNum = view.getUint32(0);
    var tankCount = view.getUint8(4);
    var tanks = [];

    for (var i = 0; i < tankCount; i++) {
        var offset = 5 + 7 * i;
        var id = view.getUint8(offset);
        var x = view.getInt16(offset + 1);
        var y = view.getInt16(offset + 3);
        var angle = view.getInt16(offset + 5) / 10000;

        tanks.push({
            id: id,
            x: x,
            y: y,
            angle: angle,
        });
    }

    return {
        tanks: tanks,
        tickNum: tickNum,
    };
};

t.exports.bulletStateToBinary = function (state) {
    var bullets = state.bullets;
    var byteLength = 6 + 9 * bullets.length;
    var buffer = new ArrayBuffer(byteLength);
    var view = new DataView(buffer);

    view.setUint32(0, state.tickNum);
    view.setUint8(4, state.bulletsSpawnedCount);
    view.setUint8(5, bullets.length);

    for (var i = 0; i < bullets.length; i++) {
        var xVelPacked = Math.round(50000 * bullets[i].xVel);
        var yVelPacked = Math.round(50000 * bullets[i].yVel);
        var offset = 6 + 9 * i;
        view.setUint8(offset, bullets[i].id);
        view.setInt16(offset + 1, bullets[i].x);
        view.setInt16(offset + 3, bullets[i].y);
        view.setInt16(offset + 5, xVelPacked);
        view.setInt16(offset + 7, yVelPacked);
    }

    return buffer;
};

t.exports.binaryToBulletState = function (buffer) {
    var view = new DataView(buffer);
    var tickNum = view.getUint32(0);
    var bulletsSpawnedCount = view.getUint8(4);
    var bulletCount = view.getUint8(5);
    var bullets = [];

    for (var i = 0; i < bulletCount; i++) {
        var offset = 6 + 9 * i;
        var id = view.getUint8(offset);
        var x = view.getInt16(offset + 1);
        var y = view.getInt16(offset + 3);
        var xVel = view.getInt16(offset + 5) / 50000;
        var yVel = view.getInt16(offset + 7) / 50000;

        bullets.push({
            id: id,
            x: x,
            y: y,
            xVel: xVel,
            yVel: yVel,
        });
    }

    return {
        bullets: bullets,
        tickNum: tickNum,
        bulletsSpawnedCount: bulletsSpawnedCount,
    };
};

t.exports.userInputToBinaryData = function (input) {
    var buffer = new ArrayBuffer(7);
    var view = new DataView(buffer);
    var anglePacked = Math.round(10000 * input.targetAngle);
    var flags = (input.moveForward << 1) + input.mouseClicked;

    view.setInt16(0, anglePacked);
    view.setInt32(2, input.tickNum);
    view.setUint8(6, flags);

    return buffer;
};

t.exports.binaryDataToUserInput = function (buffer) {
    var view = new DataView(buffer);
    var anglePacked = view.getInt16(0);
    var tickNum = view.getInt32(2);
    var flags = view.getUint8(6);

    return {
        targetAngle: anglePacked / 10000,
        moveForward: !!(flags >> 1),
        mouseClicked: !!(1 & flags),
        tickNum: tickNum,
    };
};

t.exports.newStateFromServer = 0;
t.exports.syncBullets = 1;
t.exports.tankInputToServer = 2;

},
function(t, e, a) {
var constants = a(0);
var collision = a(1);

function rotateTankTowards(tank, targetX, targetY) {
    var targetAngle = Math.atan2(targetY - tank.y, targetX - tank.x);

    if (
        Math.min(
            Math.abs(targetAngle - tank.angle),
            Math.abs(targetAngle - (tank.angle + 2 * Math.PI)),
            Math.abs(targetAngle - (tank.angle - 2 * Math.PI)),
        ) <= tank.angularSpeed
    ) {
        tank.angle = targetAngle;
        return;
    }

    var direction = 1;
    Math.abs(targetAngle - tank.angle) > Math.PI && (direction = -1);

    if (
        (tank.angle < targetAngle && direction == 1) ||
        (tank.angle > targetAngle && direction == -1)
    )
        tank.angle += tank.angularSpeed;
    else tank.angle -= tank.angularSpeed;

    var fullCircle = 2 * Math.PI;
    tank.angle %= fullCircle;
    tank.angle = (tank.angle + fullCircle) % fullCircle;
    if (tank.angle > Math.PI) tank.angle -= fullCircle;
}

function resolveTankWallCollisions(tank, maze) {
    // Update bounding box based on current position and angle
    for (var i = 0; i < 8; i += 2) {
        tank.boundingBox[i] =
            tank.x +
            constants.TANK_BOUNDING_BOX[i] * Math.cos(tank.angle) -
            constants.TANK_BOUNDING_BOX[i + 1] * Math.sin(tank.angle);
        tank.boundingBox[i + 1] =
            tank.y +
            constants.TANK_BOUNDING_BOX[i] * Math.sin(tank.angle) +
            constants.TANK_BOUNDING_BOX[i + 1] * Math.cos(tank.angle);
    }

    var cellX = Math.floor(tank.x / 100);
    var cellY = Math.floor(tank.y / 100);
    var resolvedByEdge = false;

    for (i = 0; i < 4; i++) {
        var cornerX = tank.boundingBox[2 * i];
        var cornerY = tank.boundingBox[2 * i + 1];
        var relX = cornerX - tank.x;
        var relY = cornerY - tank.y;

        if (relX < 0) {
            if (
                cornerX < 100 * cellX + 5 &&
                1 == maze.verticalWalls[cellY * (maze.cellsAcross + 1) + cellX]
            ) {
                tank.x += 100 * cellX + 5 - cornerX;
                resolvedByEdge = true;
            }
        } else if (relX > 0) {
            if (
                cornerX > 100 * cellX + 95 &&
                1 ==
                    maze.verticalWalls[
                        cellY * (maze.cellsAcross + 1) + (cellX + 1)
                    ]
            ) {
                tank.x += 100 * cellX + 95 - cornerX;
                resolvedByEdge = true;
            }
        }

        if (relY < 0) {
            if (
                cornerY < 100 * cellY + 5 &&
                1 == maze.horisontalWalls[cellY * maze.cellsAcross + cellX]
            ) {
                tank.y += 100 * cellY + 5 - cornerY;
                resolvedByEdge = true;
            }
        } else if (relY > 0) {
            if (
                cornerY > 100 * cellY + 95 &&
                1 ==
                    maze.horisontalWalls[(cellY + 1) * maze.cellsAcross + cellX]
            ) {
                tank.y += 100 * cellY + 95 - cornerY;
                resolvedByEdge = true;
            }
        }
    }

    // Check corner collisions if no edge collision was resolved
    if (!resolvedByEdge) {
        if (tank.y - 100 * cellY < 50) {
            if (tank.x - 100 * cellX < 50) {
                if (
                    1 ==
                    maze.wallCorners[cellY * (maze.cellsAcross + 1) + cellX]
                )
                    collision.checkAndResolveOBBAABB(
                        tank,
                        tank.boundingBox,
                        100 * cellX - 5,
                        100 * cellX + 5,
                        100 * cellY - 5,
                        100 * cellY + 5,
                    );
            } else {
                if (
                    1 ==
                    maze.wallCorners[
                        cellY * (maze.cellsAcross + 1) + (cellX + 1)
                    ]
                )
                    collision.checkAndResolveOBBAABB(
                        tank,
                        tank.boundingBox,
                        100 * cellX + 95,
                        100 * cellX + 105,
                        100 * cellY - 5,
                        100 * cellY + 5,
                    );
            }
        } else {
            if (tank.x - 100 * cellX < 50) {
                if (
                    1 ==
                    maze.wallCorners[
                        (cellY + 1) * (maze.cellsAcross + 1) + cellX
                    ]
                )
                    collision.checkAndResolveOBBAABB(
                        tank,
                        tank.boundingBox,
                        100 * cellX - 5,
                        100 * cellX + 5,
                        100 * cellY + 95,
                        100 * cellY + 105,
                    );
            } else {
                if (
                    1 ==
                    maze.wallCorners[
                        (cellY + 1) * (maze.cellsAcross + 1) + (cellX + 1)
                    ]
                )
                    collision.checkAndResolveOBBAABB(
                        tank,
                        tank.boundingBox,
                        100 * cellX + 95,
                        100 * cellX + 105,
                        100 * cellY + 95,
                        100 * cellY + 105,
                    );
            }
        }
    }
}

t.exports.tankMoveTowards = function (
    tank,
    targetX,
    targetY,
    maze,
    deltaTime,
) {
    rotateTankTowards(tank, targetX, targetY);

    if (Math.abs(targetX - tank.x) < 10 && Math.abs(targetY - tank.y) < 10) {
        tank.xVel = 0;
        tank.yVel = 0;
        return true;
    }

    var speed = tank.maxSpeed;
    tank.xVel = Math.cos(tank.angle) * speed;
    tank.yVel = Math.sin(tank.angle) * speed;
    tank.x += tank.xVel * deltaTime;
    tank.y += tank.yVel * deltaTime;
    resolveTankWallCollisions(tank, maze);
    return false;
};

t.exports.tankLookAtPoint = function (tank, targetX, targetY, maze) {
    rotateTankTowards(tank, targetX, targetY);
    resolveTankWallCollisions(tank, maze);
};

t.exports.canBulletBeSpawned = function (tank, bulletX, bulletY, maze) {
    var cellX = Math.floor(tank.x / 100);
    var cellY = Math.floor(tank.y / 100);
    var hitTop = false,
        hitBottom = false,
        hitLeft = false,
        hitRight = false;

    if (
        bulletY < 100 * cellY + 5 &&
        ((hitTop = true),
        1 == maze.horisontalWalls[cellY * maze.cellsAcross + cellX])
    )
        return false;
    if (
        bulletY > 100 * cellY + 95 &&
        ((hitBottom = true),
        1 == maze.horisontalWalls[(cellY + 1) * maze.cellsAcross + cellX])
    )
        return false;
    if (
        bulletX < 100 * cellX + 5 &&
        ((hitLeft = true),
        1 == maze.verticalWalls[cellY * (maze.cellsAcross + 1) + cellX])
    )
        return false;
    if (
        bulletX > 100 * cellX + 95 &&
        ((hitRight = true),
        1 == maze.verticalWalls[cellY * (maze.cellsAcross + 1) + (cellX + 1)])
    )
        return false;

    // Check corner collisions
    if (
        hitTop &&
        hitLeft &&
        1 == maze.wallCorners[cellY * (maze.cellsAcross + 1) + cellX]
    )
        return false;
    if (
        hitTop &&
        hitRight &&
        1 == maze.wallCorners[cellY * (maze.cellsAcross + 1) + (cellX + 1)]
    )
        return false;
    if (
        hitBottom &&
        hitLeft &&
        1 == maze.wallCorners[(cellY + 1) * (maze.cellsAcross + 1) + cellX]
    )
        return false;
    if (
        hitBottom &&
        hitRight &&
        1 ==
            maze.wallCorners[(cellY + 1) * (maze.cellsAcross + 1) + (cellX + 1)]
    )
        return false;

    return true;
};

t.exports.updateBulletsPosition = function (bullet, maze, deltaTime) {
    bullet.x += bullet.xVel * deltaTime;
    bullet.y += bullet.yVel * deltaTime;

    var needsCellCheck = true;

    // Bounce off world boundaries
    if (bullet.x + 9 > maze.worldWidth) {
        bullet.x = maze.worldWidth - 9;
        bullet.xVel *= -1;
        needsCellCheck = false;
    } else if (bullet.x - 9 < 0) {
        bullet.x = 9;
        bullet.xVel *= -1;
        needsCellCheck = false;
    }

    if (bullet.y + 9 > maze.worldHeight) {
        bullet.y = maze.worldHeight - 9;
        bullet.yVel *= -1;
        needsCellCheck = false;
    } else if (bullet.y - 9 < 0) {
        bullet.y = 9;
        bullet.yVel *= -1;
        needsCellCheck = false;
    }

    if (needsCellCheck) {
        var cellX = Math.floor(bullet.x / 100);
        var cellY = Math.floor(bullet.y / 100);
        var nearLeft = false,
            nearRight = false,
            nearTop = false,
            nearBottom = false;

        if (bullet.x % 100 < 9) nearLeft = true;
        else if (bullet.x % 100 > 91) nearRight = true;

        if (bullet.y % 100 < 9) nearTop = true;
        else if (bullet.y % 100 > 91) nearBottom = true;

        if (nearTop && nearLeft) {
            if (1 == maze.wallCorners[cellY * (maze.cellsAcross + 1) + cellX]) {
                // Cross product to determine which wall to bounce off
                if (
                    (bullet.xVel - 0) * ((bullet.y % 100) - 9) -
                        (bullet.yVel - 0) * ((bullet.x % 100) - 9) <
                    0
                ) {
                    bullet.yVel *= -1;
                    bullet.y = 100 * cellY + 9;
                } else {
                    bullet.xVel *= -1;
                    bullet.x = 100 * cellX + 9;
                }
            }
        } else if (nearTop && nearRight) {
            if (
                1 ==
                maze.wallCorners[cellY * (maze.cellsAcross + 1) + (cellX + 1)]
            ) {
                if (
                    (bullet.xVel - 0) * ((bullet.y % 100) - 9) -
                        (bullet.yVel - 0) * ((bullet.x % 100) - 91) >
                    0
                ) {
                    bullet.yVel *= -1;
                    bullet.y = 100 * cellY + 9;
                } else {
                    bullet.xVel *= -1;
                    bullet.x = 100 * cellX + 91;
                }
            }
        } else if (nearBottom && nearLeft) {
            if (
                1 ==
                maze.wallCorners[(cellY + 1) * (maze.cellsAcross + 1) + cellX]
            ) {
                if (
                    (bullet.xVel - 0) * ((bullet.y % 100) - 91) -
                        (bullet.yVel - 0) * ((bullet.x % 100) - 9) >
                    0
                ) {
                    bullet.yVel *= -1;
                    bullet.y = 100 * cellY + 91;
                } else {
                    bullet.xVel *= -1;
                    bullet.x = 100 * cellX + 9;
                }
            }
        } else if (nearBottom && nearRight) {
            if (
                1 ==
                maze.wallCorners[
                    (cellY + 1) * (maze.cellsAcross + 1) + (cellX + 1)
                ]
            ) {
                if (
                    (bullet.xVel - 0) * ((bullet.y % 100) - 91) -
                        (bullet.yVel - 0) * ((bullet.x % 100) - 91) <
                    0
                ) {
                    bullet.yVel *= -1;
                    bullet.y = 100 * cellY + 91;
                } else {
                    bullet.xVel *= -1;
                    bullet.x = 100 * cellX + 91;
                }
            }
        } else if (nearBottom) {
            if (
                1 ==
                maze.horisontalWalls[(cellY + 1) * maze.cellsAcross + cellX]
            ) {
                bullet.yVel *= -1;
                bullet.y = 100 * cellY + 91;
            }
        } else if (nearTop) {
            if (1 == maze.horisontalWalls[cellY * maze.cellsAcross + cellX]) {
                bullet.yVel *= -1;
                bullet.y = 100 * cellY + 9;
            }
        } else if (nearLeft) {
            if (
                1 == maze.verticalWalls[cellY * (maze.cellsAcross + 1) + cellX]
            ) {
                bullet.xVel *= -1;
                bullet.x = 100 * cellX + 9;
            }
        } else if (nearRight) {
            if (
                1 ==
                maze.verticalWalls[cellY * (maze.cellsAcross + 1) + (cellX + 1)]
            ) {
                bullet.xVel *= -1;
                bullet.x = 100 * cellX + 91;
            }
        }
    }
};

},
function(t, e, a) {
t.exports = function SocketWrapper(
    socket,
    onConnectCallback,
    onDisconnectCallback,
) {
    var handlers = {};
    var connected = false;

    socket.binaryType = "arraybuffer";

    this.on = function (event, handler) {
        handlers[event] = handler;
    };

    this.send = function (event, data) {
        socket.send(JSON.stringify([event, data]));
    };

    this.sendBinary = function (messageType, data) {
        var packet = new Uint8Array(1 + data.byteLength);
        packet[0] = messageType;
        var dataBytes = new Uint8Array(data);
        packet.set(dataBytes, 1);
        socket.send(packet.buffer);
    };

    this.onDisconnect = function (callback) {
        socket.onclose = callback;
    };

    socket.onmessage = function (event) {
        if (!("data" in event)) return;

        var data = event.data;

        if (data instanceof ArrayBuffer) {
            var messageType = new Uint8Array(data)[0];
            var payload = data.slice(1, data.byteLength);
            if (messageType in handlers) handlers[messageType](payload);
        } else {
            try {
                var parsed = JSON.parse(data);
                if (parsed.length != 2) return;
                var eventName = parsed[0];
                if (eventName in handlers) handlers[eventName](parsed[1]);
            } catch (err) {
                console.log(err);
            }
        }
    };

    socket.onopen = function () {
        if (!connected) {
            connected = true;
            if (onConnectCallback !== undefined) onConnectCallback();
        }
    };

    if (onDisconnectCallback !== undefined)
        socket.onclose = onDisconnectCallback;

    if (socket.readyState == 1) {
        connected = true;
        if (onConnectCallback !== undefined) onConnectCallback();
    }
};

},
function(t, e, a) {
var constants = a(0);

function ExplosionParticle(x, y, size, scale, alpha, color) {
  var blur = arguments.length <= 6 || arguments[6] === undefined ? 0.2 : arguments[6];

  this.canvas = document.createElement('canvas');
  this.canvas.width = size;
  this.canvas.height = size;

  (function drawParticleTexture(ctx, size, color, blur) {
    var centerX = size;
    var centerY = size;
    var radius = 0.6 * size * 0.5;
    var angle = 0;
    var angleStep = 2 * Math.PI / 15;
    var blobRadius = 2 * Math.PI * radius / 15 * 0.5 * 1.1;

    ctx.fillStyle = color;
    ctx.shadowBlur = size * blur;
    ctx.shadowColor = '#c14210';
    ctx.beginPath();
    ctx.arc(0.5 * centerX, 0.5 * centerY, radius, 0, 2 * Math.PI);
    ctx.fill();

    for (var i = 0; i < 15; i++) {
      var blobX = 0.5 * centerX + Math.cos(angle + 0.3 * Math.random()) * radius;
      var blobY = 0.5 * centerY + Math.sin(angle) * radius;
      var randomSize = blobRadius * (1 + 0.4 * Math.random());
      ctx.beginPath();
      ctx.arc(blobX, blobY, randomSize, 0, 2 * Math.PI);
      ctx.fill();
      angle += angleStep;
    }
  })(this.canvas.getContext('2d'), size, color, blur);

  this.x = x;
  this.y = y;
  this.size = size;
  this.scale = scale;
  this.alpha = alpha;

  this.moveAwayFrom = function (fromX, fromY, speed) {
    var dx = this.x - fromX;
    var dy = this.y - fromY;
    this.x += dx * speed;
    this.y += dy * speed;
  };

  this.draw = function (ctx) {
    ctx.save();
    ctx.globalAlpha = this.alpha;
    ctx.translate(this.x, this.y);
    ctx.scale(this.scale, this.scale);
    ctx.drawImage(this.canvas, 0.5 * -this.size, 0.5 * -this.size);
    ctx.restore();
  };
}

function generateWallTile(wallType, scale, bgColor) {
  var thickness = 6 * scale;
  var tileWidth = 100 * scale;
  var tileHeight = 100 * scale;
  var canvas = document.createElement('canvas');
  var ctx = canvas.getContext('2d');

  ctx.canvas.width = tileWidth;
  ctx.canvas.height = tileHeight;
  ctx.fillStyle = bgColor;
  ctx.fillRect(0, 0, tileWidth, tileHeight);

  var layers = [];

  switch (wallType) {
    case 1:
      layers.push(generateWallEdge(0, 0, tileWidth, tileHeight, 0.5, thickness, { x: 0, y: 1 }));
      break;
    case 2:
      layers.push(generateWallEdge(0.5 * tileWidth, 0, tileWidth, tileHeight, 0.5, thickness, { x: 1, y: 0 }));
      break;
    case 3:
      layers.push(generateWallEdge(0, 0, tileWidth, tileHeight, 0.5, thickness, { x: 0, y: 1 }));
      layers.push(generateWallEdge(0.5 * tileWidth, 0, tileWidth, tileHeight, 0.5, thickness, { x: 1, y: 0 }));
      break;
    case 4:
      layers.push(generateWallEdge(0, 0.5 * tileHeight, tileWidth, tileHeight, 0.5, thickness, { x: 0, y: 1 }));
      break;
    case 5:
      layers.push(generateWallEdge(0, 0, tileWidth, tileHeight, 1, thickness, { x: 0, y: 1 }));
      break;
    case 6:
      layers.push(generateWallEdge(0, 0.5 * tileHeight, tileWidth, tileHeight, 0.5, thickness, { x: 0, y: 1 }));
      layers.push(generateWallEdge(0.5 * tileWidth, 0, tileWidth, tileHeight, 0.5, thickness, { x: 1, y: 0 }));
      break;
    case 7:
      layers.push(generateWallEdge(0, 0, tileWidth, tileHeight, 1, thickness, { x: 0, y: 1 }));
      layers.push(generateWallEdge(0.5 * tileWidth, 0, tileWidth, tileHeight, 0.5, thickness, { x: 1, y: 0 }));
      break;
    case 8:
      layers.push(generateWallEdge(0, 0, tileWidth, tileHeight, 0.5, thickness, { x: 1, y: 0 }));
      break;
    case 9:
      layers.push(generateWallEdge(0, 0, tileWidth, tileHeight, 0.5, thickness, { x: 0, y: 1 }));
      layers.push(generateWallEdge(0, 0, tileWidth, tileHeight, 0.5, thickness, { x: 1, y: 0 }));
      break;
    case 10:
      layers.push(generateWallEdge(0, 0, tileWidth, tileHeight, 1, thickness, { x: 1, y: 0 }));
      break;
    case 11:
      layers.push(generateWallEdge(0, 0, tileWidth, tileHeight, 1, thickness, { x: 1, y: 0 }));
      layers.push(generateWallEdge(0, 0, tileWidth, tileHeight, 0.5, thickness, { x: 0, y: 1 }));
      break;
    case 12:
      layers.push(generateWallEdge(0, 0, tileWidth, tileHeight, 0.5, thickness, { x: 1, y: 0 }));
      layers.push(generateWallEdge(0, 0.5 * tileHeight, tileWidth, tileHeight, 0.5, thickness, { x: 0, y: 1 }));
      break;
    case 13:
      layers.push(generateWallEdge(0, 0, tileWidth, tileHeight, 1, thickness, { x: 0, y: 1 }));
      layers.push(generateWallEdge(0, 0, tileWidth, tileHeight, 0.5, thickness, { x: 1, y: 0 }));
      break;
    case 14:
      layers.push(generateWallEdge(0, 0, tileWidth, tileHeight, 1, thickness, { x: 1, y: 0 }));
      layers.push(generateWallEdge(0, 0.5 * tileHeight, tileWidth, tileHeight, 0.5, thickness, { x: 0, y: 1 }));
      break;
    case 15:
      layers.push(generateWallEdge(0, 0, tileWidth, tileHeight, 1, thickness, { x: 1, y: 0 }));
      layers.push(generateWallEdge(0, 0, tileWidth, tileHeight, 1, thickness, { x: 0, y: 1 }));
  }

  ctx.globalAlpha = 0.6;
  for (var i = 0; i < layers.length; i++)
    ctx.drawImage(layers[i].underLayer, 0, 0);

  ctx.globalAlpha = 1;
  for (i = 0; i < layers.length; i++)
    ctx.drawImage(layers[i].outlineLayer, 0, 0);

  for (i = 0; i < layers.length; i++)
    ctx.drawImage(layers[i].wallLayer, 0, 0);

  return canvas;
}

function generateWallEdge(startX, startY, width, height, lengthFraction, thickness, direction) {
  var centerX = startX + direction.y * width * 0.5;
  var centerY = startY + direction.x * height * 0.5;

  direction.x;
  direction.y;

  var wallCanvas = document.createElement('canvas');
  var wallCtx = wallCanvas.getContext('2d');
  wallCtx.canvas.width = width;
  wallCtx.canvas.height = height;

  var outlineCanvas = document.createElement('canvas');
  var outlineCtx = outlineCanvas.getContext('2d');
  outlineCtx.canvas.width = width;
  outlineCtx.canvas.height = height;

  var underCanvas = document.createElement('canvas');
  var underCtx = underCanvas.getContext('2d');
  underCtx.canvas.width = width;
  underCtx.canvas.height = height;

  // Draw dirt/ground texture dots
  underCtx.globalAlpha = 0.5;
  underCtx.fillStyle = '#8f5c2c';
  for (var i = 0; i < 300 * lengthFraction; i++) {
    var spread = 1;
    Math.random() < 0.6 && (spread = 0.5);
    var offsetX = direction.x * width * lengthFraction * Math.random() + direction.y * thickness * (Math.random() - 0.5) * spread * 7;
    var offsetY = direction.y * height * lengthFraction * Math.random() + direction.x * thickness * (Math.random() - 0.5) * spread * 7;
    var dotRadius = (1 * Math.random() + 1) * (width / 100);
    underCtx.beginPath();
    underCtx.arc(centerX + offsetX, centerY + offsetY, dotRadius, 0, 2 * Math.PI);
    underCtx.closePath();
    underCtx.fill();
  }

  underCtx.globalAlpha = 0.9;
  underCtx.fillStyle = '#dc9e31';
  for (i = 0; i < 100 * lengthFraction; i++) {
    offsetX = direction.x * width * lengthFraction * Math.random() + direction.y * thickness * (Math.random() - 0.5) * 4;
    offsetY = direction.y * height * lengthFraction * Math.random() + direction.x * thickness * (Math.random() - 0.5) * 4;
    dotRadius = (1 * Math.random() + 1) * (width / 100);
    underCtx.beginPath();
    underCtx.arc(centerX + offsetX, centerY + offsetY, dotRadius, 0, 2 * Math.PI);
    underCtx.closePath();
    underCtx.fill();
  }

  underCtx.globalAlpha = 1;
  underCtx.globalAlpha = 0.2;
  underCtx.fillStyle = '#8a9d36';
  for (i = 0; i < 500 * lengthFraction; i++) {
    spread = 1;
    Math.random() < 0.7 ? spread = 0.4 : Math.random() < 0.5 && (spread = 0.7);
    offsetX = direction.x * width * lengthFraction * Math.random() + direction.y * thickness * (Math.random() - 0.5) * spread * 7;
    offsetY = direction.y * height * lengthFraction * Math.random() + direction.x * thickness * (Math.random() - 0.5) * spread * 7;
    dotRadius = (3 * Math.random() + 1) * (width / 100);
    underCtx.beginPath();
    underCtx.arc(centerX + offsetX, centerY + offsetY, dotRadius, 0, 2 * Math.PI);
    underCtx.closePath();
    underCtx.fill();
  }

  // Draw wall outline and fill
  var rectX = centerX - 0.5 * thickness;
  var rectY = centerY - 0.5 * thickness;
  var rectW = direction.x * (width * lengthFraction + thickness) + direction.y * thickness;
  var rectH = direction.y * (height * lengthFraction + thickness) + direction.x * thickness;

  outlineCtx.globalAlpha = 1;
  outlineCtx.lineWidth = width / 100 * 6;
  outlineCtx.strokeStyle = '#31363d';
  outlineCtx.lineJoin = 'round';
  outlineCtx.shadowBlur = width / 100 * 20;
  outlineCtx.shadowColor = 'rgba(0, 0, 0, 0.4)';
  outlineCtx.beginPath();
  outlineCtx.moveTo(rectX, rectY);
  outlineCtx.lineTo(rectX + rectW, rectY);
  outlineCtx.lineTo(rectX + rectW, rectY + rectH);
  outlineCtx.lineTo(rectX, rectY + rectH);
  outlineCtx.closePath();
  outlineCtx.stroke();
  outlineCtx.fill();

  wallCtx.globalAlpha = 1;
  wallCtx.fillStyle = '#324965';
  wallCtx.fillRect(rectX, rectY, rectW, rectH);

  return {
    wallLayer: wallCanvas,
    outlineLayer: outlineCanvas,
    underLayer: underCanvas
  };
}

t.exports.skins = constants.TANK_COLOURS;

t.exports.generateWallSpriteSheet = function (bgColor, dpr) {
  var sprites = [0];
  var scale = dpr;
  for (var type = 1; type <= 15; type++)
    sprites.push(generateWallTile(type, scale, bgColor));
  return sprites;
};

t.exports.generateExplosionSpriteSheet = function (spriteSize, frameCount) {
  var frames = [];
  var frameNum = 0;
  var center = 0.5 * spriteSize;
  var darkParticles = [];
  var brightParticles = [];
  var smokeParticles = [];
  var sparkParticles = [];
  var glowAlpha = 0;

  // Create dark base particles
  var numParticles = 6;
  var spawnRadius = 0.03 * spriteSize;
  var startAngle = 0;
  var angleStep = 2 * Math.PI / numParticles;
  for (var i = 0; i < numParticles; i++) {
    var angle = startAngle + 0.6 * (Math.random() - 0.5);
    var px = center + Math.cos(angle) * spawnRadius;
    var py = center + Math.sin(angle) * spawnRadius;
    darkParticles.push(new ExplosionParticle(px, py, (200 + 100 * Math.random()) * (spriteSize / 200), 0.05, 0.4, '#6c3340'));
    startAngle += angleStep;
  }

  // Create bright fire particles
  numParticles = 8;
  spawnRadius = 0.03 * spriteSize;
  startAngle = 0;
  angleStep = 2 * Math.PI / numParticles;
  for (i = 0; i < numParticles; i++) {
    angle = startAngle + 0.6 * (Math.random() - 0.5);
    px = center + Math.cos(angle) * spawnRadius;
    py = center + Math.sin(angle) * spawnRadius;
    var particleColor = '#f1953d';
    Math.random() < 0.5 && (particleColor = '#f4bd75');
    brightParticles.push(new ExplosionParticle(px, py, (200 + 100 * Math.random()) * (spriteSize / 200), 0.05, 0.4, particleColor, 0));
    startAngle += angleStep;
  }

  // Create smoke particles
  numParticles = 6;
  spawnRadius = 0.02 * spriteSize;
  startAngle = 0;
  angleStep = 2 * Math.PI / numParticles;
  for (i = 0; i < numParticles; i++) {
    angle = startAngle + 0.7 * (Math.random() - 0.5);
    px = center + Math.cos(angle) * spawnRadius;
    py = center + Math.sin(angle) * spawnRadius;
    smokeParticles.push(new ExplosionParticle(px, py, (150 + 150 * Math.random()) * (spriteSize / 200), 0.05, 0.1, '#4b3243'));
    startAngle += angleStep;
  }

  // Create spark particles
  numParticles = 3;
  spawnRadius = 0.02 * spriteSize;
  startAngle = 0;
  angleStep = 2 * Math.PI / numParticles;
  for (i = 0; i < numParticles; i++) {
    angle = startAngle + 0.7 * (Math.random() - 0.5);
    px = center + Math.cos(angle) * spawnRadius;
    py = center + Math.sin(angle) * spawnRadius;
    particleColor = '#e09689';
    Math.random() < 0.5 && (particleColor = '#e8c39c');
    sparkParticles.push(new ExplosionParticle(px, py, (150 + 150 * Math.random()) * (spriteSize / 200), 0.05, 0.08, particleColor));
    startAngle += angleStep;
  }

  function renderFrame(ctx) {
    // Animate dark particles
    for (var j = 0; j < darkParticles.length; j++) {
      darkParticles[j].moveAwayFrom(center, center, 0.02);
      darkParticles[j].alpha -= 0.005;
      if (frameNum < 2) darkParticles[j].scale += 0.08;
      else if (frameNum < 4) darkParticles[j].scale += 0.06;
      else if (frameNum < 7) darkParticles[j].scale += 0.04;
      else if (frameNum < 12) darkParticles[j].scale += 0.02;
      else if (frameNum < 20) darkParticles[j].scale += 0.005;
      else if (frameNum < 40) darkParticles[j].alpha -= 0.005;
      if (darkParticles[j].alpha < 0) darkParticles[j].alpha = 0;
    }

    // Animate bright particles
    for (j = 0; j < brightParticles.length; j++) {
      brightParticles[j].moveAwayFrom(center, center, 0.02);
      if (frameNum < 4) { brightParticles[j].scale += 0.08; brightParticles[j].alpha += 0.02; }
      else if (frameNum < 8) { brightParticles[j].scale += 0.03; brightParticles[j].alpha += 0.01; }
      else if (frameNum < 20) brightParticles[j].scale -= 0.001;
      else if (frameNum < 40) brightParticles[j].alpha -= 0.02;
      else if (frameNum > 65) brightParticles[j].alpha -= 0.005;
      if (brightParticles[j].alpha < 0) brightParticles[j].alpha = 0;
    }

    // Animate smoke particles
    for (j = 0; j < smokeParticles.length; j++) {
      smokeParticles[j].moveAwayFrom(center, center, 0.01);
      if (frameNum < 2) smokeParticles[j].scale += 0.04;
      else if (frameNum < 6) smokeParticles[j].scale += 0.035;
      else if (frameNum < 10) smokeParticles[j].scale += 0.025;
      else if (frameNum < 50) smokeParticles[j].scale += 0.005;
      else { smokeParticles[j].scale += 0.005; smokeParticles[j].alpha -= 0.005; }
      if (smokeParticles[j].alpha < 0) smokeParticles[j].alpha = 0;
    }

    // Animate spark particles
    for (j = 0; j < sparkParticles.length; j++) {
      sparkParticles[j].moveAwayFrom(center, center, 0.02);
      if (frameNum < 2) { sparkParticles[j].scale += 0.04; sparkParticles[j].alpha += 0.05; }
      else if (frameNum < 6) sparkParticles[j].scale += 0.035;
      else sparkParticles[j].alpha -= 0.005;
      if (sparkParticles[j].alpha < 0) sparkParticles[j].alpha = 0;
    }

    // Update glow
    if (frameNum < 20) glowAlpha += 0.05;
    else if (frameNum > 30) glowAlpha -= 0.02;
    if (glowAlpha < 0) glowAlpha = 0;

    // Draw all particles
    for (j = 0; j < darkParticles.length; j++)
      darkParticles[j].draw(ctx);
    for (j = 0; j < brightParticles.length; j++)
      brightParticles[j].draw(ctx);
    for (j = 0; j < smokeParticles.length; j++)
      smokeParticles[j].draw(ctx);
    for (j = 0; j < sparkParticles.length; j++)
      sparkParticles[j].draw(ctx);

    // Draw glow overlay
    var gradient = ctx.createRadialGradient(center, center, 0.5 * spriteSize, 0.5 * spriteSize, 0.5 * spriteSize, 0);
    gradient.addColorStop(0, 'transparent');
    gradient.addColorStop(1, '#ff7f1d');
    ctx.fillStyle = gradient;
    ctx.globalAlpha = glowAlpha;
    ctx.globalCompositeOperation = 'lighter';
    ctx.fillRect(0, 0, spriteSize, spriteSize);
    ctx.globalCompositeOperation = 'normal';
    ctx.globalAlpha = 1;
    frameNum++;
  }

  // Generate all frames
  (function (size, count) {
    for (var i = 0; i < count; i++) {
      var frameCanvas = document.createElement('canvas');
      frameCanvas.width = size;
      frameCanvas.height = size;
      renderFrame(frameCanvas.getContext('2d'));
      frames.push(frameCanvas);
    }
  })(spriteSize, frameCount);

  return frames;
};

t.exports.generateScorchSprite = function (size) {
  var halfSize = 0.5 * size;
  Math.PI;
  var canvas = document.createElement('canvas');
  var ctx = canvas.getContext('2d');

  ctx.canvas.width = 2 * halfSize;
  ctx.canvas.height = 2 * halfSize;
  ctx.globalAlpha = 0.6;

  (function drawScorch(ctx, size) {
    var innerRadius = 0.1 * size;
    var outerRadius = 0.5 * size;
    var angle = 0;
    var angleStep = 2 * Math.PI / 21 * 0.5;
    var center = outerRadius;

    ctx.beginPath();
    ctx.moveTo(center + Math.cos(angle) * outerRadius, center + Math.sin(angle) * outerRadius);

    for (var i = 0; i < 21; i++) {
      angle += angleStep;
      var rand = Math.random();
      ctx.lineTo(center + Math.cos(angle) * innerRadius * rand, center + Math.sin(angle) * innerRadius * rand);
      angle += angleStep;
      rand = Math.random();
      ctx.lineTo(center + Math.cos(angle) * outerRadius * rand, center + Math.sin(angle) * outerRadius * rand);
    }

    ctx.closePath();

    var gradient = ctx.createRadialGradient(center, center, innerRadius, center, center, 1 * outerRadius);
    gradient.addColorStop(0, '#3b3b3b');
    gradient.addColorStop(1, 'transparent');
    ctx.fillStyle = gradient;
    ctx.shadowBlur = 0.05 * size;
    ctx.shadowColor = 'black';
    ctx.fill();
  })(ctx, size);

  return canvas;
};

},
function(t, e, a) {

t.exports.findPath = function (maze, startX, startY, targetX, targetY, options) {
    if (!maze || !maze.cellsAcross || !maze.cellsDown) return [];

    options = options || {};
    var bulletPaths = options.bulletPaths || [];

    var TANK_R = 20;
    var ANGLES = 45;
    var STEP = 18;
    var GOAL_RADIUS = 24;
    var POS_Q = 14;
    var MAX_ITERS = 12000;
    var HAZARD_CELL = 48;
    var HAZARD_HARD_R2 = 34 * 34;
    var HAZARD_SOFT_R2 = 78 * 78;

    var hazardGrid = Object.create(null);
    var hasHazards = false;

    function addHazardPoint(x, y, timeStep) {
        var cx = (x / HAZARD_CELL) | 0;
        var cy = (y / HAZARD_CELL) | 0;
        var key = cx + ":" + cy;
        if (!hazardGrid[key]) hazardGrid[key] = [];
        hazardGrid[key].push({ x: x, y: y, t: timeStep });
        hasHazards = true;
    }

    for (var bi = 0; bi < bulletPaths.length; bi++) {
        var entry = bulletPaths[bi];
        if (!entry || entry.ignoreForDodge) continue;
        var path = entry.path;
        if (!path || path.length < 2) continue;
        var maxStep = Math.min(path.length, 180);
        for (var ps = 0; ps < maxStep; ps += 4) {
            addHazardPoint(path[ps].x, path[ps].y, ps);
        }
    }

    function dist(ax, ay, bx, by) {
        var dx = ax - bx, dy = ay - by;
        return Math.sqrt(dx * dx + dy * dy);
    }

    function isBlocked(px, py) {
        if (!maze.cellsAcross) return false;
        var cellX = Math.floor(px / 100);
        var cellY = Math.floor(py / 100);
        var modX = px - 100 * cellX;
        var modY = py - 100 * cellY;

        if (modX < TANK_R && 1 == maze.verticalWalls[cellY * (maze.cellsAcross + 1) + cellX]) return true;
        if (modX > 100 - TANK_R && 1 == maze.verticalWalls[cellY * (maze.cellsAcross + 1) + (cellX + 1)]) return true;
        if (modY < TANK_R && 1 == maze.horisontalWalls[cellY * maze.cellsAcross + cellX]) return true;
        if (modY > 100 - TANK_R && 1 == maze.horisontalWalls[(cellY + 1) * maze.cellsAcross + cellX]) return true;
        if (modX < TANK_R && modY < TANK_R && 1 == maze.wallCorners[cellY * (maze.cellsAcross + 1) + cellX]) return true;
        if (modX > 100 - TANK_R && modY < TANK_R && 1 == maze.wallCorners[cellY * (maze.cellsAcross + 1) + (cellX + 1)]) return true;
        if (modX < TANK_R && modY > 100 - TANK_R && 1 == maze.wallCorners[(cellY + 1) * (maze.cellsAcross + 1) + cellX]) return true;
        if (modX > 100 - TANK_R && modY > 100 - TANK_R && 1 == maze.wallCorners[(cellY + 1) * (maze.cellsAcross + 1) + (cellX + 1)]) return true;
        if (px - TANK_R < 0 || py - TANK_R < 0 || px + TANK_R > maze.worldWidth || py + TANK_R > maze.worldHeight) return true;
        return false;
    }

    function segmentClear(x0, y0, x1, y1) {
        var d = dist(x0, y0, x1, y1);
        var steps = Math.max(1, Math.ceil(d / 5));
        for (var i = 1; i <= steps; i++) {
            var t = i / steps;
            var px = x0 + (x1 - x0) * t;
            var py = y0 + (y1 - y0) * t;
            if (isBlocked(px, py)) return false;
        }
        return true;
    }

    function keyFor(x, y) {
        return ((x / POS_Q) | 0) + ":" + ((y / POS_Q) | 0);
    }

    function bulletDangerPenalty(px, py, travelCost) {
        if (!hasHazards) return 0;
        var cx = (px / HAZARD_CELL) | 0;
        var cy = (py / HAZARD_CELL) | 0;
        var arrivalStep = travelCost / STEP;
        var bestD2 = Infinity;
        var bestTemporal = 1e9;

        for (var ox = -1; ox <= 1; ox++) {
            for (var oy = -1; oy <= 1; oy++) {
                var key = (cx + ox) + ":" + (cy + oy);
                var list = hazardGrid[key];
                if (!list) continue;
                for (var i = 0; i < list.length; i++) {
                    var h = list[i];
                    var dx = px - h.x;
                    var dy = py - h.y;
                    var d2 = dx * dx + dy * dy;
                    if (d2 < bestD2) bestD2 = d2;
                    var dt = Math.abs(arrivalStep - h.t * 0.35);
                    if (dt < bestTemporal) bestTemporal = dt;
                    if (d2 <= HAZARD_HARD_R2 && dt <= 14) return 1e9;
                }
            }
        }

        if (bestD2 <= HAZARD_HARD_R2) return 360;
        if (bestD2 <= HAZARD_SOFT_R2) {
            var closeness = 1 - bestD2 / HAZARD_SOFT_R2;
            var temporalFactor = bestTemporal < 24 ? (1 + (24 - bestTemporal) * 0.04) : 1;
            return 120 * closeness * temporalFactor;
        }
        return 0;
    }

    if (dist(startX, startY, targetX, targetY) <= GOAL_RADIUS) {
        return [{ x: targetX, y: targetY }];
    }

    var angleTable = new Array(ANGLES);
    for (var ai = 0; ai < ANGLES; ai++) {
        var a = (ai / ANGLES) * 2 * Math.PI - Math.PI;
        angleTable[ai] = { c: Math.cos(a), s: Math.sin(a) };
    }

    var open = [];
    var bestG = {};

    var h0 = dist(startX, startY, targetX, targetY);
    var startNode = { x: startX, y: startY, g: 0, f: h0, parent: null };
    open.push(startNode);
    bestG[keyFor(startX, startY)] = 0;

    var bestNode = startNode;
    var iters = 0;

    while (open.length > 0 && iters < MAX_ITERS) {
        iters++;

        var bestIdx = 0;
        for (var oi = 1; oi < open.length; oi++) {
            if (open[oi].f < open[bestIdx].f) bestIdx = oi;
        }
        var cur = open[bestIdx];
        open.splice(bestIdx, 1);

        var curDist = dist(cur.x, cur.y, targetX, targetY);
        if (curDist < dist(bestNode.x, bestNode.y, targetX, targetY)) bestNode = cur;
        if (curDist <= GOAL_RADIUS) {
            bestNode = cur;
            break;
        }

        for (var k = 0; k < ANGLES; k++) {
            var nx = cur.x + angleTable[k].c * STEP;
            var ny = cur.y + angleTable[k].s * STEP;

            if (!segmentClear(cur.x, cur.y, nx, ny)) continue;

            var dangerPenalty = hasHazards ? bulletDangerPenalty(nx, ny, cur.g + STEP) : 0;
            if (dangerPenalty >= 1e9) continue;

            var ng = cur.g + STEP + dangerPenalty;
            var nk = keyFor(nx, ny);
            if (bestG[nk] !== undefined && ng >= bestG[nk]) continue;

            bestG[nk] = ng;
            var nh = dist(nx, ny, targetX, targetY);
            open.push({ x: nx, y: ny, g: ng, f: ng + nh, parent: cur });
        }
    }

    var rev = [];
    for (var p = bestNode; p; p = p.parent) rev.push({ x: p.x, y: p.y });
    rev.reverse();

    if (rev.length <= 1) return [{ x: targetX, y: targetY }];

    var out = [];
    for (var r = 1; r < rev.length; r++) out.push(rev[r]);
    out.push({ x: targetX, y: targetY });
    return out;
};

},
function(t, e, a) {
t.exports.createModPanel = function (mods) {
    var existing = document.getElementById("modPanel");
    if (existing) existing.remove();

    var panel = document.createElement("div");
    panel.id = "modPanel";
    panel.style.cssText = "position:fixed;top:200px;left:10px;z-index:10000;background:rgba(20,20,35,0.9);border:1px solid #4a6fa5;border-radius:8px;padding:10px 14px;font-family:monospace;font-size:12px;color:#ccc;min-width:160px;user-select:none;";

    var title = document.createElement("div");
    title.textContent = "MOD MENU";
    title.style.cssText = "font-weight:bold;font-size:13px;color:#4a9fff;margin-bottom:8px;text-align:center;border-bottom:1px solid #4a6fa5;padding-bottom:6px;";
    panel.appendChild(title);

    for (var i = 0; i < mods.length; i++) {
        (function (mod) {
            var row = document.createElement("div");
            row.style.cssText = "display:flex;align-items:center;justify-content:space-between;margin:4px 0;";

            var label = document.createElement("span");
            label.textContent = mod.label + (mod.key ? " [" + mod.key + "]" : "");
            label.style.cssText = "flex:1;";

            var sw = document.createElement("div");
            sw.id = "mod-sw-" + mod.id;
            sw.style.cssText = "width:36px;height:18px;border-radius:9px;cursor:pointer;position:relative;transition:background 0.2s;" + (mod.get() ? "background:#4a9fff;" : "background:#555;");

            var knob = document.createElement("div");
            knob.style.cssText = "width:14px;height:14px;border-radius:7px;background:#fff;position:absolute;top:2px;transition:left 0.2s;" + (mod.get() ? "left:20px;" : "left:2px;");
            sw.appendChild(knob);

            sw.addEventListener("click", function () {
                var newVal = !mod.get();
                mod.set(newVal);
                sw.style.background = newVal ? "#4a9fff" : "#555";
                knob.style.left = newVal ? "20px" : "2px";
            });

            row.appendChild(label);
            row.appendChild(sw);
            panel.appendChild(row);
        })(mods[i]);
    }

    document.body.appendChild(panel);
};

t.exports.updateModSwitch = function (id, value) {
    var sw = document.getElementById("mod-sw-" + id);
    if (!sw) return;
    sw.style.background = value ? "#4a9fff" : "#555";
    sw.children[0].style.left = value ? "20px" : "2px";
};

},
function(t, e, a) {

t.exports.simulateBulletPath = function (constants, startX, startY, angle, mazeData, maxSteps) {
    var bulletSpeed = constants.TANK_MAX_SPEED * 1.2;
    var dt = constants.PHYSICS_INTERVAL;
    var bx = startX, by = startY;
    var vx = Math.cos(angle) * bulletSpeed;
    var vy = Math.sin(angle) * bulletSpeed;
    var path = [];

    for (var step = 0; step < maxSteps; step++) {
        bx += vx * dt;
        by += vy * dt;

        var bounced = false;
        if (bx + 9 > mazeData.worldWidth) { bx = mazeData.worldWidth - 9; vx *= -1; bounced = true; }
        else if (bx - 9 < 0) { bx = 9; vx *= -1; bounced = true; }
        if (by + 9 > mazeData.worldHeight) { by = mazeData.worldHeight - 9; vy *= -1; bounced = true; }
        else if (by - 9 < 0) { by = 9; vy *= -1; bounced = true; }

        if (!bounced && mazeData.cellsAcross) {
            var cellX = Math.floor(bx / 100);
            var cellY = Math.floor(by / 100);
            var modX = bx % 100, modY = by % 100;
            var nearL = modX < 9, nearR = modX > 91, nearT = modY < 9, nearB = modY > 91;

            if (nearT && nearL && 1 == mazeData.wallCorners[cellY * (mazeData.cellsAcross + 1) + cellX]) {
                if (vx * (modY - 9) - vy * (modX - 9) < 0) { vy *= -1; by = 100 * cellY + 9; }
                else { vx *= -1; bx = 100 * cellX + 9; }
            } else if (nearT && nearR && 1 == mazeData.wallCorners[cellY * (mazeData.cellsAcross + 1) + (cellX + 1)]) {
                if (vx * (modY - 9) - vy * (modX - 91) > 0) { vy *= -1; by = 100 * cellY + 9; }
                else { vx *= -1; bx = 100 * cellX + 91; }
            } else if (nearB && nearL && 1 == mazeData.wallCorners[(cellY + 1) * (mazeData.cellsAcross + 1) + cellX]) {
                if (vx * (modY - 91) - vy * (modX - 9) > 0) { vy *= -1; by = 100 * cellY + 91; }
                else { vx *= -1; bx = 100 * cellX + 9; }
            } else if (nearB && nearR && 1 == mazeData.wallCorners[(cellY + 1) * (mazeData.cellsAcross + 1) + (cellX + 1)]) {
                if (vx * (modY - 91) - vy * (modX - 91) < 0) { vy *= -1; by = 100 * cellY + 91; }
                else { vx *= -1; bx = 100 * cellX + 91; }
            } else if (nearB && 1 == mazeData.horisontalWalls[(cellY + 1) * mazeData.cellsAcross + cellX]) {
                vy *= -1; by = 100 * cellY + 91;
            } else if (nearT && 1 == mazeData.horisontalWalls[cellY * mazeData.cellsAcross + cellX]) {
                vy *= -1; by = 100 * cellY + 9;
            } else if (nearL && 1 == mazeData.verticalWalls[cellY * (mazeData.cellsAcross + 1) + cellX]) {
                vx *= -1; bx = 100 * cellX + 9;
            } else if (nearR && 1 == mazeData.verticalWalls[cellY * (mazeData.cellsAcross + 1) + (cellX + 1)]) {
                vx *= -1; bx = 100 * cellX + 91;
            }
        }

        path.push({ x: bx, y: by, vx: vx, vy: vy, step: step });
    }
    return path;
};

t.exports.findSmartAimAngle = function (args) {
    if (!args.smartAimEnabled) {
        var directAngle = Math.atan2(args.targetY - args.tankY, args.targetX - args.tankX);
        return { angle: directAngle, valid: true, path: null };
    }

    var constants = args.constants;
    var mazeData = args.mazeData;
    var physics = args.physics;
    var playerTank = args.playerTank;

    var TTL_STEPS = Math.ceil(9000 / constants.PHYSICS_INTERVAL);
    var ANGLE_SAMPLES = 360 * 2;
    var MIN_SAFE_DIST_SQ = 40 * 40;
    var SAFE_CHECK_START = 30;
    var TARGET_DIST_SQ = 25 * 25;
    var SAFETY_TAIL = 120;
    var bulletSpeed = constants.TANK_MAX_SPEED * 1.2;
    var dt = constants.PHYSICS_INTERVAL;
    var bestAngle = Math.atan2(args.targetY - args.tankY, args.targetX - args.tankX);
    var bestScore = Infinity;

    var cellsAcross = mazeData.cellsAcross;
    var vertWalls = mazeData.verticalWalls;
    var horzWalls = mazeData.horisontalWalls;
    var corners = mazeData.wallCorners;
    var ww = mazeData.worldWidth;
    var wh = mazeData.worldHeight;
    var cw = cellsAcross ? cellsAcross + 1 : 0;

    for (var i = 0; i < ANGLE_SAMPLES; i++) {
        var angle = (i / ANGLE_SAMPLES) * 2 * Math.PI - Math.PI;
        var cosA = Math.cos(angle), sinA = Math.sin(angle);
        var spawnX = args.tankX + 40 * cosA;
        var spawnY = args.tankY + 40 * sinA;

        if (!physics.canBulletBeSpawned(playerTank, spawnX, spawnY, mazeData)) continue;

        var bx = spawnX, by = spawnY;
        var vx = cosA * bulletSpeed, vy = sinA * bulletSpeed;
        var hitStep = -1;
        var safe = true;
        var maxStep = TTL_STEPS;

        for (var step = 0; step < maxStep; step++) {
            bx += vx * dt;
            by += vy * dt;

            var bounced = false;
            if (bx + 9 > ww) { bx = ww - 9; vx *= -1; bounced = true; }
            else if (bx - 9 < 0) { bx = 9; vx *= -1; bounced = true; }
            if (by + 9 > wh) { by = wh - 9; vy *= -1; bounced = true; }
            else if (by - 9 < 0) { by = 9; vy *= -1; bounced = true; }

            if (!bounced && cellsAcross) {
                var cellX = (bx / 100) | 0;
                var cellY = (by / 100) | 0;
                var modX = bx - 100 * cellX, modY = by - 100 * cellY;
                var nearL = modX < 9, nearR = modX > 91, nearT = modY < 9, nearB = modY > 91;
                var cRow = cellY * cw;
                if (nearT && nearL && 1 == corners[cRow + cellX]) {
                    if (vx * (modY - 9) - vy * (modX - 9) < 0) { vy *= -1; by = 100 * cellY + 9; }
                    else { vx *= -1; bx = 100 * cellX + 9; }
                } else if (nearT && nearR && 1 == corners[cRow + cellX + 1]) {
                    if (vx * (modY - 9) - vy * (modX - 91) > 0) { vy *= -1; by = 100 * cellY + 9; }
                    else { vx *= -1; bx = 100 * cellX + 91; }
                } else if (nearB && nearL && 1 == corners[cRow + cw + cellX]) {
                    if (vx * (modY - 91) - vy * (modX - 9) > 0) { vy *= -1; by = 100 * cellY + 91; }
                    else { vx *= -1; bx = 100 * cellX + 9; }
                } else if (nearB && nearR && 1 == corners[cRow + cw + cellX + 1]) {
                    if (vx * (modY - 91) - vy * (modX - 91) < 0) { vy *= -1; by = 100 * cellY + 91; }
                    else { vx *= -1; bx = 100 * cellX + 91; }
                } else if (nearB && 1 == horzWalls[(cellY + 1) * cellsAcross + cellX]) {
                    vy *= -1; by = 100 * cellY + 91;
                } else if (nearT && 1 == horzWalls[cellY * cellsAcross + cellX]) {
                    vy *= -1; by = 100 * cellY + 9;
                } else if (nearL && 1 == vertWalls[cRow + cellX]) {
                    vx *= -1; bx = 100 * cellX + 9;
                } else if (nearR && 1 == vertWalls[cRow + cellX + 1]) {
                    vx *= -1; bx = 100 * cellX + 91;
                }
            }

            if (cellsAcross) {
                var cx = (bx / 100) | 0, cy = (by / 100) | 0;
                for (var cyi = cy; cyi <= cy + 1; cyi++) {
                    for (var cxi = cx; cxi <= cx + 1; cxi++) {
                        if (cyi >= 0 && cyi <= cellsAcross && cxi >= 0 && cxi <= cellsAcross && 1 == corners[cyi * cw + cxi]) {
                            var cornerX = 100 * cxi, cornerY = 100 * cyi;
                            var cdx = bx - cornerX, cdy = by - cornerY;
                            if (cdx * cdx + cdy * cdy < 100) safe = false;
                        }
                    }
                    if (!safe) break;
                }
            }

            if (step > SAFE_CHECK_START) {
                var pdx = bx - args.tankX, pdy = by - args.tankY;
                if (pdx * pdx + pdy * pdy < MIN_SAFE_DIST_SQ) {
                    safe = false;
                    break;
                }
            }

            if (hitStep < 0) {
                var tdx = bx - args.targetX, tdy = by - args.targetY;
                if (tdx * tdx + tdy * tdy < TARGET_DIST_SQ) {
                    hitStep = step;
                    maxStep = Math.min(TTL_STEPS, step + SAFETY_TAIL);
                } else if (step >= bestScore) break;
            }
        }

        if (!safe || hitStep < 0 || hitStep >= bestScore) continue;
        bestScore = hitStep;
        bestAngle = angle;
    }

    if (bestScore < Infinity) {
        var bestPath = t.exports.simulateBulletPath(
            constants,
            args.tankX + 40 * Math.cos(bestAngle),
            args.tankY + 40 * Math.sin(bestAngle),
            bestAngle,
            mazeData,
            bestScore + 1
        );
        bestAngle = Math.round(bestAngle * 100) / 100;
        return { angle: bestAngle, valid: true, path: bestPath };
    }

    bestAngle = Math.round(bestAngle * 100) / 100;
    return { angle: bestAngle, valid: false, path: null };
};

t.exports.drawSmartAimPreview = function (ctx, cam, tankX, tankY, angle, path) {
    if (!path || !path.length) return;
    ctx.save();
    ctx.lineWidth = 2;
    ctx.setLineDash([6, 4]);
    ctx.beginPath();
    var startX = tankX + 40 * Math.cos(angle);
    var startY = tankY + 40 * Math.sin(angle);
    ctx.moveTo(startX - cam.camLeft, startY - cam.camTop);
    for (var i = 0; i < path.length; i++) {
        ctx.lineTo(path[i].x - cam.camLeft, path[i].y - cam.camTop);
    }
    ctx.strokeStyle = "rgba(0, 200, 255, 0.5)";
    ctx.stroke();
    var last = path[path.length - 1];
    ctx.beginPath();
    ctx.arc(last.x - cam.camLeft, last.y - cam.camTop, 5, 0, 2 * Math.PI);
    ctx.fillStyle = "rgba(0, 200, 255, 0.7)";
    ctx.fill();
    ctx.setLineDash([]);
    ctx.restore();
};

},
function(t, e, a) {

t.exports.updateBulletPathCache = function (bullets, mazeData, constants, simulateBulletPath) {
    var cached = [];
    if (!mazeData.cellsAcross) return cached;
    var now = Date.now();
    for (var i = 0; i < bullets.length; i++) {
        var b = bullets[i];
        var remainingTTL = b.timeToLive !== undefined ? b.timeToLive : 9000;
        if (b.fireTime) remainingTTL = 9000 - (now - b.fireTime);
        if (remainingTTL <= 0) continue;
        var stepsLeft = Math.ceil(remainingTTL / constants.PHYSICS_INTERVAL);
        var path = simulateBulletPath(constants, b.x, b.y, Math.atan2(b.yVel, b.xVel), mazeData, stepsLeft);
        cached.push({ path: path, bullet: b, ignoreForDodge: !!(b.ignoreForDodgeUntil && now < b.ignoreForDodgeUntil) });
    }
    return cached;
};

t.exports.drawBulletPredictions = function (ctx, cam, mazeData, cachedBulletPaths, playerX, playerY) {
    if (!mazeData.cellsAcross) return;
    ctx.save();
    var DANGER_DIST = 25;
    var DANGER_DIST_SQ = DANGER_DIST * DANGER_DIST;
    var camLeft = cam.camLeft;
    var camTop = cam.camTop;
    for (var i = 0; i < cachedBulletPaths.length; i++) {
        var entry = cachedBulletPaths[i];
        var b = entry.bullet;
        var path = entry.path;
        var pathLen = path.length;

        var willHitPlayer = false;
        for (var c = 0; c < pathLen; c++) {
            var hdx = path[c].x - playerX;
            var hdy = path[c].y - playerY;
            if (hdx * hdx + hdy * hdy < DANGER_DIST_SQ) {
                willHitPlayer = true;
                break;
            }
        }

        if (willHitPlayer) {
            ctx.beginPath();
            ctx.arc(b.x - camLeft, b.y - camTop, 12, 0, 2 * Math.PI);
            ctx.lineWidth = 2.5;
            ctx.strokeStyle = "rgba(255, 0, 0, 0.8)";
            ctx.stroke();
        }

        var prevX = b.x - camLeft, prevY = b.y - camTop;
        for (var s = 0; s < pathLen; s++) {
            var t = s / pathLen;
            var lw = 4 * (1 - t) + 0.5;
            ctx.beginPath();
            ctx.moveTo(prevX, prevY);
            prevX = path[s].x - camLeft;
            prevY = path[s].y - camTop;
            ctx.lineTo(prevX, prevY);
            ctx.lineWidth = lw;
            ctx.strokeStyle = "rgba(255, 50, 50, " + (0.35 * (1 - t) + 0.05) + ")";
            ctx.stroke();
        }
    }
    ctx.restore();
};

},
function(t, e, a) {

var _latestRankedDodgePaths = [];

t.exports.findDodgeAction = function (tankX, tankY, mazeData, cachedBulletPaths, constants) {
    var TANK_R = 20;
    var HIT_DIST_SQ = 38 * 38;
    var STEP_DX = constants.TANK_MAX_SPEED * constants.PHYSICS_INTERVAL;
    var HORIZON = 60*2;       // favor longer-term survival (2 seconds)
    var BEAM_WIDTH = 36;      // tuned down for lower CPU cost
    var BRANCH = 10;
    var SEG_LEN = 4;
    var SAMPLE_ANGLES = 72;
    var MAX_THREAT_DIST_SQ = 260 * 260;
    var MAX_LINE_PENALTY_DIST_SQ = 280 * 280;

    function normAngle(a) {
        while (a <= -Math.PI) a += 2 * Math.PI;
        while (a > Math.PI) a -= 2 * Math.PI;
        return a;
    }

    function angleDiff(a, b) {
        return Math.abs(normAngle(a - b));
    }

    function isTankBlockedAt(px, py) {
        if (!mazeData.cellsAcross) return false;
        var cellX = Math.floor(px / 100);
        var cellY = Math.floor(py / 100);
        var modX = px - 100 * cellX;
        var modY = py - 100 * cellY;
        if (modX < TANK_R && 1 == mazeData.verticalWalls[cellY * (mazeData.cellsAcross + 1) + cellX]) return true;
        if (modX > 100 - TANK_R && 1 == mazeData.verticalWalls[cellY * (mazeData.cellsAcross + 1) + (cellX + 1)]) return true;
        if (modY < TANK_R && 1 == mazeData.horisontalWalls[cellY * mazeData.cellsAcross + cellX]) return true;
        if (modY > 100 - TANK_R && 1 == mazeData.horisontalWalls[(cellY + 1) * mazeData.cellsAcross + cellX]) return true;
        if (modX < TANK_R && modY < TANK_R && 1 == mazeData.wallCorners[cellY * (mazeData.cellsAcross + 1) + cellX]) return true;
        if (modX > 100 - TANK_R && modY < TANK_R && 1 == mazeData.wallCorners[cellY * (mazeData.cellsAcross + 1) + (cellX + 1)]) return true;
        if (modX < TANK_R && modY > 100 - TANK_R && 1 == mazeData.wallCorners[(cellY + 1) * (mazeData.cellsAcross + 1) + cellX]) return true;
        if (modX > 100 - TANK_R && modY > 100 - TANK_R && 1 == mazeData.wallCorners[(cellY + 1) * (mazeData.cellsAcross + 1) + (cellX + 1)]) return true;
        if (px - TANK_R < 0 || py - TANK_R < 0 || px + TANK_R > mazeData.worldWidth || py + TANK_R > mazeData.worldHeight) return true;
        return false;
    }

    function advanceWithCollision(px, py, angle) {
        var subSteps = 4;
        var stepLen = STEP_DX / subSteps;
        var c = Math.cos(angle), s = Math.sin(angle);
        for (var i = 0; i < subSteps; i++) {
            var nx = px + c * stepLen;
            var ny = py + s * stepLen;
            if (isTankBlockedAt(nx, ny)) {
                return { x: px, y: py, blocked: true };
            }
            px = nx;
            py = ny;
        }
        return { x: px, y: py, blocked: false };
    }

    function bulletAtStep(entry, s) {
        var p = entry.path;
        if (p.length === 0) return null;
        if (s < p.length) return p[s];
        return p[p.length - 1];
    }

    function bulletVelAtStep(entry, s) {
        var p = entry.path;
        if (!p || p.length === 0) return { vx: 0, vy: 0 };
        if (s + 1 < p.length) {
            return { vx: p[s + 1].x - p[s].x, vy: p[s + 1].y - p[s].y };
        }
        if (p.length >= 2) {
            return { vx: p[p.length - 1].x - p[p.length - 2].x, vy: p[p.length - 1].y - p[p.length - 2].y };
        }
        return { vx: 0, vy: 0 };
    }

    function isBulletClosing(entry, step, tx, ty) {
        var bp = bulletAtStep(entry, step);
        if (!bp) return false;
        var v = bulletVelAtStep(entry, step);
        var rx = tx - bp.x;
        var ry = ty - bp.y;
        return v.vx * rx + v.vy * ry > 0;
    }

    function isHitAt(tx, ty, step, entries) {
        var list = entries || cachedBulletPaths;
        var len = list.length;
        for (var i = 0; i < len; i++) {
            if (list[i].ignoreForDodge) continue;
            var bp = bulletAtStep(list[i], step);
            if (!bp) continue;
            var dx = bp.x - tx, dy = bp.y - ty;
            if (dx * dx + dy * dy < HIT_DIST_SQ) return true;
        }
        return false;
    }

    function firstStillHitStep() {
        for (var s = 0; s < HORIZON; s++) {
            if (isHitAt(tankX, tankY, s)) return s;
        }
        return -1;
    }

    _latestRankedDodgePaths = [];

    // 1) predict bullet positions (already done in cachedBulletPaths)

    // If we're not projected to be hit while standing still, don't dodge.
    var stillHitStep = firstStillHitStep();
    if (stillHitStep < 0) return null;
    var mustMove = stillHitStep <= 30;

    // Increase planning precision when impact is imminent.
    if (stillHitStep <= 16) {
        BEAM_WIDTH = 48;
        BRANCH = 12;
        SEG_LEN = 3;
    } else if (stillHitStep <= 30) {
        BEAM_WIDTH = 42;
        BRANCH = 11;
    }

    // 2) compute forbidden angle intervals (velocity-obstacle style approximation)
    var forbidden = [];
    var repX = 0, repY = 0;
    var threatVx = 0, threatVy = 0;
    var hasThreat = false;
    var activeFlags = {};
    var activeEntries = [];
    for (var bi = 0; bi < cachedBulletPaths.length; bi++) {
        var entry = cachedBulletPaths[bi];
        if (entry.ignoreForDodge) continue;
        var path = entry.path;
        var pathLen = path.length;
        var maxS = HORIZON < pathLen ? HORIZON : pathLen;
        for (var s = 0; s < maxS; s += 2) {
            var bp = path[s];
            if (!isBulletClosing(entry, s, tankX, tankY)) continue;
            var dx = bp.x - tankX;
            var dy = bp.y - tankY;
            var d2 = dx * dx + dy * dy;
            var d = Math.sqrt(d2);
            if (d2 > MAX_THREAT_DIST_SQ) continue;
            hasThreat = true;
            if (!activeFlags[bi]) {
                activeFlags[bi] = true;
                activeEntries.push(entry);
            }

            // Potential field repulsion vector
            var w = 1 / Math.max(80, d2) * (HORIZON - s + 1);
            repX -= dx * w;
            repY -= dy * w;

            var bv = bulletVelAtStep(entry, s);
            var bvm = Math.sqrt(bv.vx * bv.vx + bv.vy * bv.vy);
            if (bvm > 0.0001) {
                var flowW = 1 / Math.max(120, d2) * (HORIZON - s + 1);
                threatVx += (bv.vx / bvm) * flowW;
                threatVy += (bv.vy / bvm) * flowW;
            }

            if (d < 1) continue;
            var radius = 44;
            var half = Math.asin(Math.min(0.98, radius / d));
            var center = Math.atan2(dy, dx);
            var widen = (HORIZON - s) / HORIZON * 0.22;
            forbidden.push({ a0: normAngle(center - half - widen), a1: normAngle(center + half + widen) });
        }
    }

    if (!hasThreat) {
        // If we already know standing still gets hit, still run search over all bullets.
        hasThreat = true;
    }
    var simEntries = activeEntries.length ? activeEntries : cachedBulletPaths;

    // 3) build safe angle list
    function inForbidden(a) {
        for (var i = 0; i < forbidden.length; i++) {
            var a0 = forbidden[i].a0;
            var a1 = forbidden[i].a1;
            if (a0 <= a1) {
                if (a >= a0 && a <= a1) return true;
            } else {
                if (a >= a0 || a <= a1) return true;
            }
        }
        return false;
    }

    var preferredAngle = Math.atan2(repY, repX);
    var threatMag = Math.sqrt(threatVx * threatVx + threatVy * threatVy);
    if (threatMag > 0.0001) {
        // Favor side-stepping bullet flow (perpendicular movement) over line-running.
        var perpA = Math.atan2(threatVy, threatVx) + Math.PI * 0.5;
        var perpB = perpA + Math.PI;
        var side = angleDiff(perpA, preferredAngle) <= angleDiff(perpB, preferredAngle) ? perpA : perpB;
        var px = repX + Math.cos(side) * threatMag * 0.9;
        var py = repY + Math.sin(side) * threatMag * 0.9;
        if (Math.abs(px) > 0.0001 || Math.abs(py) > 0.0001) {
            preferredAngle = Math.atan2(py, px);
        }
    }
    var allAngles = [];
    var safeAngles = [];
    allAngles.push(null); // explicit no-move candidate
    safeAngles.push(null);
    for (var ai = 0; ai < SAMPLE_ANGLES; ai++) {
        var a = (ai / SAMPLE_ANGLES) * 2 * Math.PI - Math.PI;
        allAngles.push(a);
        var adv0 = advanceWithCollision(tankX, tankY, a);
        if (!inForbidden(a) && !adv0.blocked) safeAngles.push(a);
    }
    if (safeAngles.length === 0) safeAngles = allAngles;

    safeAngles.sort(function (a, b) {
        if (a === null && b === null) return 0;
        if (a === null) return mustMove ? 1 : -1;
        if (b === null) return mustMove ? -1 : 1;
        return angleDiff(a, preferredAngle) - angleDiff(b, preferredAngle);
    });

    function simulateSegment(x, y, angle, fromStep, len) {
        var px = x, py = y;
        var blockedCount = 0;
        var movedDist = 0;
        if (angle === null) {
            for (var z = 0; z < len; z++) {
                var stepStill = fromStep + z;
                if (isHitAt(px, py, stepStill, simEntries)) {
                    return { x: px, y: py, hit: true, hitStep: stepStill, blockedCount: blockedCount, movedDist: movedDist };
                }
            }
            return { x: px, y: py, hit: false, hitStep: -1, blockedCount: blockedCount, movedDist: movedDist };
        }
        for (var i = 0; i < len; i++) {
            var oldX = px;
            var oldY = py;
            var adv = advanceWithCollision(px, py, angle);
            px = adv.x;
            py = adv.y;
            if (adv.blocked) blockedCount++;
            var mdx = px - oldX;
            var mdy = py - oldY;
            movedDist += Math.sqrt(mdx * mdx + mdy * mdy);
            var step = fromStep + i;
            if (isHitAt(px, py, step, simEntries)) {
                return { x: px, y: py, hit: true, hitStep: step, blockedCount: blockedCount, movedDist: movedDist };
            }
        }
        return { x: px, y: py, hit: false, hitStep: -1, blockedCount: blockedCount, movedDist: movedDist };
    }

    function minBulletDistSq(px, py, step) {
        var best = Infinity;
        var len = simEntries.length;
        for (var i = 0; i < len; i++) {
            if (simEntries[i].ignoreForDodge) continue;
            var bp = bulletAtStep(simEntries[i], step);
            if (!bp) continue;
            var dx = bp.x - px, dy = bp.y - py;
            var d2 = dx * dx + dy * dy;
            if (d2 < best) best = d2;
        }
        return best;
    }

    var mobilityCache = {};
    function localMobility(px, py) {
        var qx = (px / 12) | 0;
        var qy = (py / 12) | 0;
        var key = qx + ":" + qy;
        if (mobilityCache[key] !== undefined) return mobilityCache[key];

        var free = 0;
        var dirs = 8;
        for (var i = 0; i < dirs; i++) {
            var a = (i / dirs) * 2 * Math.PI - Math.PI;
            var adv = advanceWithCollision(px, py, a);
            if (!adv.blocked) free++;
        }
        var m = free / dirs;
        mobilityCache[key] = m;
        return m;
    }

    function getBranchAngles(safe) {
        var source = safe;
        if (mustMove) {
            source = [];
            for (var si = 0; si < safe.length; si++) {
                if (safe[si] !== null) source.push(safe[si]);
            }
            if (source.length === 0) source = safe;
        }

        if (source.length <= BRANCH) return source.slice();
        var out = [];
        // keep best preferred candidate
        out.push(source[0]);
        // add evenly spaced candidates for diversity to avoid corner-lock behavior
        for (var i = 1; i < BRANCH; i++) {
            var idx = Math.floor((i * (source.length - 1)) / (BRANCH - 1));
            var a = source[idx];
            var duplicate = false;
            for (var j = 0; j < out.length; j++) {
                if (out[j] === a) { duplicate = true; break; }
            }
            if (!duplicate) out.push(a);
        }
        return out;
    }

    function lineFollowingPenalty(angle, px, py, step) {
        if (angle === null) return 0;
        var mvx = Math.cos(angle), mvy = Math.sin(angle);
        var penalty = 0;
        var len = simEntries.length;
        for (var i = 0; i < len; i++) {
            var entry = simEntries[i];
            if (entry.ignoreForDodge) continue;
            var bp = bulletAtStep(entry, step);
            if (!bp) continue;
            if (!isBulletClosing(entry, step, px, py)) continue;

            var dx = bp.x - px, dy = bp.y - py;
            var d2 = dx * dx + dy * dy;
            if (d2 > MAX_LINE_PENALTY_DIST_SQ) continue;

            var v = bulletVelAtStep(entry, step);
            var vm = Math.sqrt(v.vx * v.vx + v.vy * v.vy);
            if (vm < 0.0001) continue;
            var bvx = v.vx / vm, bvy = v.vy / vm;

            // Penalize moving along bullet line (both same and opposite directions)
            var parallel = Math.abs(mvx * bvx + mvy * bvy);
            var nearW = 1 / Math.max(120, d2);
            penalty += parallel * nearW * 22000;
        }
        return penalty;
    }

    function firstAngleSafety(angle) {
        if (angle === null) return 0;
        // Strong gate: if first move choice dies quickly, don't pick it.
        var seg = simulateSegment(tankX, tankY, angle, 0, 30);
        var safety = seg.hit ? seg.hitStep : 999;
        var startMobility = localMobility(tankX, tankY);
        var endMobility = localMobility(seg.x, seg.y);
        // Penalize openings that mostly press into walls and fail to create space.
        safety -= seg.blockedCount * (mustMove ? 22 : 4);
        if (seg.movedDist < STEP_DX * 8) safety -= (mustMove ? 36 : 10);
        if (mustMove && endMobility < startMobility - 0.12) safety -= 26;
        if (mustMove && endMobility < 0.26) safety -= 36;
        return safety;
    }

    // 4) simulate candidate trajectories (beam search 20–50 paths)
    var beam = [{ x: tankX, y: tankY, step: 0, score: 0, angles: [], path: [] }];
    var fallback = null;
    var branchAngles = getBranchAngles(safeAngles);

    while (beam.length > 0 && beam[0].step < HORIZON) {
        var next = [];
        for (var bi2 = 0; bi2 < beam.length; bi2++) {
            var node = beam[bi2];
            for (var k = 0; k < branchAngles.length; k++) {
                var a2 = branchAngles[k];
                var seg = simulateSegment(node.x, node.y, a2, node.step, SEG_LEN);
                if (seg.hit) {
                    // Keep best "doomed" option to maximize survival time if no fully safe path exists.
                    var fAngles = node.angles.slice();
                    fAngles.push(a2);
                    var fPath = node.path.slice();
                    fPath.push({ x: seg.x, y: seg.y });
                    var fScore = seg.hitStep * 100 + node.score;
                    if (!fallback || fScore > fallback.score) {
                        fallback = { score: fScore, angles: fAngles, path: fPath };
                    }
                    continue;
                }

                var newStep = node.step + SEG_LEN;
                var stepNow = Math.min(HORIZON - 1, newStep);
                var stepFuture = Math.min(HORIZON - 1, newStep + 12);
                var clearanceNow = minBulletDistSq(seg.x, seg.y, stepNow);
                var clearanceFuture = minBulletDistSq(seg.x, seg.y, stepFuture);
                var wallPenalty = 0;
                if (a2 !== null) {
                    var adv1 = advanceWithCollision(seg.x, seg.y, a2);
                    wallPenalty = adv1.blocked ? 500 : 0;
                }
                var linePenalty = lineFollowingPenalty(a2, seg.x, seg.y, stepNow);
                var mobility = localMobility(seg.x, seg.y);
                var deadEndPenalty = (1 - mobility) * 140;
                var mobilityBonus = mobility * 220;
                var stallPenalty = seg.blockedCount * 65;
                var turnPenalty = 0;
                if (a2 !== null && node.angles.length > 0) {
                    var prevA = node.angles[node.angles.length - 1];
                    if (prevA !== null) {
                        var turn = angleDiff(a2, prevA);
                        turnPenalty += turn * 24;
                        if (turn > 2.35) turnPenalty += 60;
                    }
                }
                if (a2 !== null && seg.movedDist < STEP_DX * (SEG_LEN * 0.45)) stallPenalty += 220;

                var lateralBonus = 0;
                if (a2 !== null && threatMag > 0.0001) {
                    var moveAx = Math.cos(a2), moveAy = Math.sin(a2);
                    var tvx = threatVx / threatMag, tvy = threatVy / threatMag;
                    var parallelFlow = Math.abs(moveAx * tvx + moveAy * tvy);
                    lateralBonus = (1 - parallelFlow) * 140;
                }

                var cornerRamPenalty = 0;
                if (mustMove && a2 !== null) {
                    if (node.step === 0 && seg.movedDist < STEP_DX * (SEG_LEN * 0.35)) cornerRamPenalty += 360;
                    if (seg.blockedCount >= Math.max(1, SEG_LEN - 2)) cornerRamPenalty += 420;
                }

                // If we're getting boxed in near walls while bullets remain close, strongly discourage this branch.
                var trapPenalty = 0;
                if (mobility < 0.42 && clearanceFuture < 220 * 220) {
                    trapPenalty += (0.42 - mobility) * 520;
                    if (seg.blockedCount > 0) trapPenalty += 180;
                }

                var nearDangerPenalty = 0;
                if (clearanceNow < 150 * 150) {
                    nearDangerPenalty += (150 * 150 - clearanceNow) * 0.0045;
                }
                if (clearanceFuture < 190 * 190) {
                    nearDangerPenalty += (190 * 190 - clearanceFuture) * 0.0025;
                }

                // Long-term weighted scoring: future clearance matters more than immediate.
                var longTermScore = Math.min(2400, clearanceFuture * 0.0014);
                var shortTermScore = Math.min(1200, clearanceNow * 0.0007);
                var progressScore = newStep * 2.2;
                var stillBonus = (a2 === null) ? (mustMove ? -180 : 6) : 0;
                var score = node.score + longTermScore + shortTermScore + progressScore + stillBonus + mobilityBonus + lateralBonus - wallPenalty - linePenalty - deadEndPenalty - stallPenalty - trapPenalty - cornerRamPenalty - nearDangerPenalty - turnPenalty;

                var angles2 = node.angles.slice();
                angles2.push(a2);
                var path2 = node.path.slice();
                path2.push({ x: seg.x, y: seg.y });

                next.push({ x: seg.x, y: seg.y, step: newStep, score: score, angles: angles2, path: path2 });
            }
        }

        if (next.length === 0) break;
        next.sort(function (a, b) { return b.score - a.score; });
        beam = next.slice(0, BEAM_WIDTH);
    }

    if (beam.length === 0) {
        if (!fallback || !fallback.angles.length || fallback.angles[0] === null) return null;
        _latestRankedDodgePaths = fallback.path ? [{ score: fallback.score, path: fallback.path }] : [];
        return {
            angle: fallback.angles[0],
            shouldMove: true,
            path: fallback.path,
        };
    }

    // 5) choose best path, but guard against unsafe first-step angle choices
    beam.sort(function (a, b) { return b.score - a.score; });
    _latestRankedDodgePaths = [];
    for (var ri = 0; ri < Math.min(5, beam.length); ri++) {
        if (beam[ri].path && beam[ri].path.length) {
            _latestRankedDodgePaths.push({ score: beam[ri].score, path: beam[ri].path });
        }
    }

    var best = null;
    var bestSafe = -1;
    for (var bi3 = 0; bi3 < beam.length; bi3++) {
        var cand = beam[bi3];
        if (!cand.angles.length) continue;
        var a0 = cand.angles[0];
        if (a0 === null) continue;
        var safety = firstAngleSafety(a0);
        if (safety > bestSafe) {
            bestSafe = safety;
            best = cand;
        }
        // Early accept: sufficiently safe first move plus high score.
        if (safety >= 24) {
            best = cand;
            break;
        }
    }

    if (!best) {
        if (fallback && fallback.angles.length && fallback.angles[0] !== null) {
            return {
                angle: fallback.angles[0],
                shouldMove: true,
                path: fallback.path,
            };
        }
        if (mustMove) {
            // Last-resort: choose first-step angle that survives longest.
            var emergency = null;
            for (var ei = 0; ei < allAngles.length; ei++) {
                var ea = allAngles[ei];
                if (ea === null) continue;
                var es = firstAngleSafety(ea);
                if (!emergency || es > emergency.safety) emergency = { a: ea, safety: es };
            }
            if (emergency) {
                return {
                    angle: emergency.a,
                    shouldMove: true,
                    path: null,
                };
            }
        }
        return null;
    }

    var firstAngle = best.angles[0];
    if (firstAngle === null) {
        if (mustMove) {
            for (var mi = 0; mi < best.angles.length; mi++) {
                if (best.angles[mi] !== null) {
                    firstAngle = best.angles[mi];
                    break;
                }
            }
            if (firstAngle === null) return null;
        } else {
            return null;
        }
    }

    // 6) output first angle
    return {
        angle: firstAngle,
        shouldMove: true,
        path: best.path,
    };
};

t.exports.drawDodgePath = function (ctx, cam, tankX, tankY, dodgePath) {
    var ranked = _latestRankedDodgePaths;
    if ((!ranked || ranked.length === 0) && (!dodgePath || !dodgePath.length)) return;

    var drawList = [];
    if (ranked && ranked.length) {
        for (var di = 0; di < Math.min(5, ranked.length); di++) {
            if (ranked[di].path && ranked[di].path.length) drawList.push(ranked[di].path);
        }
    } else {
        drawList.push(dodgePath);
    }

    ctx.save();
    var camLeft = cam.camLeft;
    var camTop = cam.camTop;
    for (var p = 0; p < drawList.length; p++) {
        var path = drawList[p];
        var prevX = tankX - camLeft;
        var prevY = tankY - camTop;
        var pathLen = path.length;

        var rankT = p / Math.max(1, drawList.length - 1);
        var baseAlpha = p === 0 ? 1 : (0.58 * Math.pow(1 - rankT, 1.25) + 0.12);
        var baseWidth = p === 0 ? 6.5 : (4.8 - 2.1 * rankT);

        for (var i = 0; i < pathLen; i++) {
            var t = i / pathLen;
            var segAlpha = Math.max(0.08, baseAlpha * (1 - 0.45 * Math.pow(t, 1.1)));
            ctx.beginPath();
            ctx.moveTo(prevX, prevY);
            prevX = path[i].x - camLeft;
            prevY = path[i].y - camTop;
            ctx.lineTo(prevX, prevY);
            ctx.lineWidth = Math.max(1.1, baseWidth * (0.95 - 0.35 * t));
            ctx.strokeStyle = "rgba(50, 255, 50, " + segAlpha + ")";
            ctx.stroke();
        }
    }
    ctx.restore();
};

t.exports.getTopRankedDodgePaths = function () {
    return _latestRankedDodgePaths;
};

},
function(t, e, a) {

var _laneShotMemory = {};
var _latestRankedPaths = [];

t.exports.findAutoKillShot = function (args) {
    var localTank = args.localTank;
    var tanks = args.tanks;
    var maze = args.maze;
    var constants = args.constants;
    var physics = args.physics;
    var simulateBulletPath = args.simulateBulletPath;
    var activeBulletPaths = args.activeBulletPaths || [];
    var bulletsSpawnedCount = args.bulletsSpawnedCount;
    var maxBullets = args.maxBullets;
    var tickNum = args.tickNum;
    var lastShotTick = args.lastShotTick;
    var preferredTargetIds = args.preferredTargetIds || null;
    var avoidTargetIds = args.avoidTargetIds || null;

    var preferredTargetMap = null;
    var avoidTargetMap = null;
    if (preferredTargetIds && preferredTargetIds.length) {
        preferredTargetMap = Object.create(null);
        for (var pmi = 0; pmi < preferredTargetIds.length; pmi++) {
            preferredTargetMap[preferredTargetIds[pmi]] = true;
        }
    }
    if (avoidTargetIds && avoidTargetIds.length) {
        avoidTargetMap = Object.create(null);
        for (var ami = 0; ami < avoidTargetIds.length; ami++) {
            avoidTargetMap[avoidTargetIds[ami]] = true;
        }
    }

    _latestRankedPaths = [];

    if (!localTank || !tanks || tanks.length < 2 || !maze || !maze.cellsAcross) return null;
    if (bulletsSpawnedCount >= maxBullets) return null;
    if (tickNum - lastShotTick <= 1) return null;

    var dt = constants.PHYSICS_INTERVAL;
    var ttlSteps = Math.ceil(9000 / dt);
    var quant = (2 * Math.PI) / 720;
    var DIR8 = [
        { c: 1, s: 0 },
        { c: 0.7071067811865476, s: 0.7071067811865476 },
        { c: 0, s: 1 },
        { c: -0.7071067811865476, s: 0.7071067811865476 },
        { c: -1, s: 0 },
        { c: -0.7071067811865476, s: -0.7071067811865476 },
        { c: 0, s: -1 },
        { c: 0.7071067811865476, s: -0.7071067811865476 },
    ];

    function normAngle(a) {
        while (a <= -Math.PI) a += 2 * Math.PI;
        while (a > Math.PI) a -= 2 * Math.PI;
        return a;
    }

    function pointBlocked(px, py, radius) {
        if (px - radius < 0 || py - radius < 0 || px + radius > maze.worldWidth || py + radius > maze.worldHeight) return true;

        var cellX = Math.floor(px / 100);
        var cellY = Math.floor(py / 100);
        var modX = px - 100 * cellX;
        var modY = py - 100 * cellY;
        var across = maze.cellsAcross;

        if (modX < radius && 1 == maze.verticalWalls[cellY * (across + 1) + cellX]) return true;
        if (modX > 100 - radius && 1 == maze.verticalWalls[cellY * (across + 1) + (cellX + 1)]) return true;
        if (modY < radius && 1 == maze.horisontalWalls[cellY * across + cellX]) return true;
        if (modY > 100 - radius && 1 == maze.horisontalWalls[(cellY + 1) * across + cellX]) return true;

        if (modX < radius && modY < radius && 1 == maze.wallCorners[cellY * (across + 1) + cellX]) return true;
        if (modX > 100 - radius && modY < radius && 1 == maze.wallCorners[cellY * (across + 1) + (cellX + 1)]) return true;
        if (modX < radius && modY > 100 - radius && 1 == maze.wallCorners[(cellY + 1) * (across + 1) + cellX]) return true;
        if (modX > 100 - radius && modY > 100 - radius && 1 == maze.wallCorners[(cellY + 1) * (across + 1) + (cellX + 1)]) return true;

        return false;
    }

    function hasLineOfSight(ax, ay, bx, by) {
        var dx = bx - ax;
        var dy = by - ay;
        var dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 1) return true;
        var step = 18;
        var steps = Math.ceil(dist / step);
        for (var i = 1; i <= steps; i++) {
            var t = i / steps;
            var px = ax + dx * t;
            var py = ay + dy * t;
            if (pointBlocked(px, py, 7)) return false;
        }
        return true;
    }

    function localOpenAreaScore(px, py) {
        var maxProbe = 260;
        var step = 26;
        var sum = 0;
        var dirs = DIR8.length;
        for (var i = 0; i < dirs; i++) {
            var dc = DIR8[i].c;
            var ds = DIR8[i].s;
            var reached = 0;
            for (var d = step; d <= maxProbe; d += step) {
                var qx = px + dc * d;
                var qy = py + ds * d;
                if (pointBlocked(qx, qy, 22)) break;
                reached = d;
            }
            sum += reached / maxProbe;
        }
        return sum / dirs;
    }

    function sameCorridor(a, b) {
        var ax = Math.floor(a.x / 100);
        var ay = Math.floor(a.y / 100);
        var bx = Math.floor(b.x / 100);
        var by = Math.floor(b.y / 100);
        if (ax === bx || ay === by) {
            return hasLineOfSight(a.x, a.y, b.x, b.y);
        }
        return false;
    }

    function corridorNetworkDepth(px, py) {
        var dirs = DIR8.length;
        var freeDirs = 0;
        for (var i = 0; i < dirs; i++) {
            var qx = px + DIR8[i].c * 90;
            var qy = py + DIR8[i].s * 90;
            if (!pointBlocked(qx, qy, 20)) freeDirs++;
        }
        return freeDirs / dirs;
    }

    function chooseTarget() {
        var best = null;
        var bestScore = -1e12;
        for (var i = 0; i < tanks.length; i++) {
            var enemy = tanks[i];
            if (!enemy || enemy.ID === localTank.ID || enemy.beenHit) continue;

            if (avoidTargetMap && avoidTargetMap[enemy.ID]) continue;

            var dx = enemy.x - localTank.x;
            var dy = enemy.y - localTank.y;
            var d = Math.sqrt(dx * dx + dy * dy);

            var threat = 0;
            if (d < 500) threat += 200;
            if (hasLineOfSight(localTank.x, localTank.y, enemy.x, enemy.y)) threat += 100;
            if (sameCorridor(localTank, enemy)) threat += 60;

            var openArea = localOpenAreaScore(enemy.x, enemy.y);
            var corridorCentrality = openArea;
            var exposure = corridorCentrality * 40 + openArea * 20;

            var bounceOpportunity = corridorNetworkDepth(enemy.x, enemy.y) * 15;
            var distanceScore = 40 / (1 + d * 0.002);

            var score = threat + exposure + bounceOpportunity + distanceScore;
            if (preferredTargetMap && preferredTargetMap[enemy.ID]) score += 800;
            if (score > bestScore) {
                bestScore = score;
                best = enemy;
            }
        }
        return best;
    }

    function quantizeAngle(a) {
        return normAngle(Math.round(a / quant) * quant);
    }

    function generateCandidateAngles(target) {
        var out = [];
        var seen = {};

        function pushAngle(a) {
            a = quantizeAngle(a);
            var key = Math.round((a + Math.PI) * 10000);
            if (!seen[key]) {
                seen[key] = true;
                out.push(a);
            }
        }

        var base = Math.atan2(target.y - localTank.y, target.x - localTank.x);
        pushAngle(base);
        pushAngle(base + 0.35);
        pushAngle(base - 0.35);
        pushAngle(base + 0.7);
        pushAngle(base - 0.7);

        var stride = 6;
        for (var i = 0; i < 720; i += stride) {
            pushAngle((i / 720) * 2 * Math.PI - Math.PI);
        }

        return out;
    }

    function estimateBounceCount(path) {
        var bounces = 0;
        var len = path.length;
        for (var i = 1; i < len; i++) {
            var pv = path[i - 1];
            var cv = path[i];
            if ((pv.vx > 0 && cv.vx < 0) || (pv.vx < 0 && cv.vx > 0)) bounces++;
            if ((pv.vy > 0 && cv.vy < 0) || (pv.vy < 0 && cv.vy > 0)) bounces++;
        }
        return bounces;
    }

    function pathCoverage(path) {
        var seenCells = {};
        var count = 0;
        var len = path.length;
        for (var i = 0; i < len; i += 6) {
            var cx = Math.floor(path[i].x / 100);
            var cy = Math.floor(path[i].y / 100);
            var key = cx + ":" + cy;
            if (!seenCells[key]) {
                seenCells[key] = true;
                count++;
            }
        }
        return count;
    }

    function pathSimilarity(pathA, pathB) {
        var len = Math.min(pathA.length, pathB.length);
        if (len < 20) return 0;
        var close = 0;
        var total = 0;
        for (var i = 0; i < len; i += 8) {
            var dx = pathA[i].x - pathB[i].x;
            var dy = pathA[i].y - pathB[i].y;
            if (dx * dx + dy * dy < 52 * 52) close++;
            total++;
        }
        if (total === 0) return 0;
        return close / total;
    }

    function similarActiveStats(path) {
        var best = 0;
        var count = 0;
        var len = activeBulletPaths.length;
        for (var i = 0; i < len; i++) {
            var other = activeBulletPaths[i] && activeBulletPaths[i].path;
            if (!other || other.length < 5) continue;
            var sim = pathSimilarity(path, other);
            if (sim > best) best = sim;
            if (sim >= 0.82) count++;
        }
        return { best: best, count: count };
    }

    function makeLaneKey(targetId, angle) {
        var bins = 48;
        var idx = Math.round(((normAngle(angle) + Math.PI) / (2 * Math.PI)) * bins);
        return targetId + ":" + idx;
    }

    function recentLaneCount(key, nowTick, windowTicks) {
        var arr = _laneShotMemory[key];
        if (!arr || arr.length === 0) return 0;
        var kept = [];
        var len = arr.length;
        for (var i = 0; i < len; i++) {
            if (nowTick - arr[i] <= windowTicks) kept.push(arr[i]);
        }
        _laneShotMemory[key] = kept;
        return kept.length;
    }

    function rememberLaneShot(key, nowTick) {
        if (!_laneShotMemory[key]) _laneShotMemory[key] = [];
        _laneShotMemory[key].push(nowTick);
    }

    function isSelfUnsafe(path) {
        // Reject paths that can rebound into the shooter's area.
        var nearStart = 16;
        var nearDist2 = 62 * 62;
        var reboundStart = 60;
        var reboundDist2 = 84 * 84;
        var maxCheck = Math.min(path.length, 320);
        for (var i = nearStart; i < maxCheck; i++) {
            var dx = path[i].x - localTank.x;
            var dy = path[i].y - localTank.y;
            var d2 = dx * dx + dy * dy;
            if (d2 < nearDist2) return true;
            if (i >= reboundStart && d2 < reboundDist2) return true;
        }
        return false;
    }

    function getTargetPredictor(target) {
        var dx = localTank.x - target.x;
        var dy = localTank.y - target.y;
        var dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 0.0001) {
            return {
                tx: target.x,
                ty: target.y,
                dist: 0,
                ux: 0,
                uy: 0,
                approachPerStep: constants.TANK_MAX_SPEED * dt,
                fixed: true,
            };
        }
        return {
            tx: target.x,
            ty: target.y,
            dist: dist,
            ux: dx / dist,
            uy: dy / dist,
            approachPerStep: constants.TANK_MAX_SPEED * dt,
            fixed: false,
        };
    }

    function evaluatePath(path, predictor) {
        var hitRadius = 26;
        var hitRadiusSq = hitRadius * hitRadius;
        var nearRadius = 180;
        var nearRadiusSq = nearRadius * nearRadius;
        var score = 0;
        var bestStep = Infinity;
        var pathLen = path.length;

        for (var step = 0; step < pathLen; step += 2) {
            var bx = path[step].x;
            var by = path[step].y;
            var predX = predictor.tx;
            var predY = predictor.ty;
            if (!predictor.fixed) {
                var move = Math.min(predictor.dist, step * predictor.approachPerStep);
                predX += predictor.ux * move;
                predY += predictor.uy * move;
            }
            var dx = bx - predX;
            var dy = by - predY;
            var dist2 = dx * dx + dy * dy;
            var decay = 1 / (1 + step * 0.03);

            if (dist2 < nearRadiusSq) {
                var d = Math.sqrt(dist2);
                // Bounded proximity reward for tactical pressure lanes.
                score += Math.max(0, (nearRadius - d) / nearRadius) * decay * 3.5;
            }

            if (dist2 < hitRadiusSq) {
                // Reward true hit windows, weighted to earlier arrival.
                score += 14 * decay;
                if (step < bestStep) bestStep = step;
            }
        }

        if (score < 0) score = 0;
        return { score: score, earliestHit: bestStep };
    }

    function minPathDistSqToTarget(path, predictor) {
        var best = Infinity;
        var pathLen = path.length;
        for (var i = 0; i < pathLen; i += 3) {
            var predX = predictor.tx;
            var predY = predictor.ty;
            if (!predictor.fixed) {
                var move = Math.min(predictor.dist, i * predictor.approachPerStep);
                predX += predictor.ux * move;
                predY += predictor.uy * move;
            }
            var dx = path[i].x - predX;
            var dy = path[i].y - predY;
            var d2 = dx * dx + dy * dy;
            if (d2 < best) best = d2;
        }
        return best;
    }

    var target = chooseTarget();
    if (!target) return null;

    var targetDx = target.x - localTank.x;
    var targetDy = target.y - localTank.y;
    var targetDist = Math.sqrt(targetDx * targetDx + targetDy * targetDy);
    var nearbyThreat = targetDist < 500;
    var pointBlankThreat = targetDist < 100;
    var availableBalls = Math.max(0, maxBullets - bulletsSpawnedCount);

    // Tactical cadence: adapt with available ammo and urgency.
    var minShotInterval;
    if (pointBlankThreat) {
        minShotInterval = availableBalls >= 5 ? 2 : 3;
    } else if (nearbyThreat) {
        minShotInterval = availableBalls >= 6 ? 7 : (availableBalls >= 3 ? 11 : 14);
    } else {
        minShotInterval = availableBalls >= 6 ? 18 : 26;
    }
    if (tickNum - lastShotTick <= minShotInterval) return null;

    var defensiveBudget = maxBullets <= 3 ? 1 : (maxBullets <= 6 ? 2 : 3);
    var pressureBudget = maxBullets - defensiveBudget;
    var shouldPreferDefensive = nearbyThreat || bulletsSpawnedCount >= pressureBudget;
    if (pointBlankThreat) shouldPreferDefensive = true;

    // Repeated-lane allowance scales with currently available balls.
    var maxSameLaneShots;
    if (pointBlankThreat) {
        maxSameLaneShots = Math.min(4, Math.max(2, Math.ceil(availableBalls * 0.5)));
    } else if (nearbyThreat) {
        maxSameLaneShots = Math.min(3, Math.max(1, Math.ceil(availableBalls * 0.45)));
    } else {
        maxSameLaneShots = 1;
    }

    var angles = generateCandidateAngles(target);
    var targetPredictor = getTargetPredictor(target);
    var best = null;
    var scoredCandidates = [];

    for (var i = 0; i < angles.length; i++) {
        var angle = angles[i];
        var ca = Math.cos(angle);
        var sa = Math.sin(angle);
        var spawnX = localTank.x + 40 * ca;
        var spawnY = localTank.y + 40 * sa;
        if (!physics.canBulletBeSpawned(localTank, spawnX, spawnY, maze)) continue;

        var path = simulateBulletPath(constants, spawnX, spawnY, angle, maze, ttlSteps);
        if (!path || path.length < 30) continue;
        if (isSelfUnsafe(path)) continue;

        var evalHit = evaluatePath(path, targetPredictor);
        var minTargetD2 = minPathDistSqToTarget(path, targetPredictor);
        var minTargetD = Math.sqrt(minTargetD2);
        var pressureNearScore = Math.max(0, 1 - minTargetD / 820);
        if (evalHit.score <= 0 && pressureNearScore < 0.32) continue;

        var bounceCount = estimateBounceCount(path);
        var coverage = pathCoverage(path);
        var simStats = similarActiveStats(path);
        var similarity = simStats.best;
        var similarActiveCount = simStats.count;
        if (!pointBlankThreat) {
            if (similarActiveCount >= 3) continue;
            if (similarity > 0.90 && similarActiveCount >= 1) continue;
        } else {
            // In point-blank fights allow small stacking, but still avoid hard spam.
            if (similarActiveCount >= maxSameLaneShots + 1) continue;
        }

        var score = evalHit.score * 110 + pressureNearScore * 95;
        if (shouldPreferDefensive) {
            if (evalHit.earliestHit < Infinity) score += Math.max(0, 240 - evalHit.earliestHit * 2.2);
            score += Math.max(0, 8 - bounceCount) * 8;
        } else {
            // Tactical pressure: value coverage, staggered timing, and non-trivial ricochets.
            var arrival = evalHit.earliestHit === Infinity ? 160 : evalHit.earliestHit;
            score += coverage * 12;
            score += Math.min(120, bounceCount * 5);
            score += Math.max(0, 140 - Math.abs(95 - arrival));
            if (arrival < 35) score -= 80;
        }

        score += (1 - similarity) * 110;
        score -= similarActiveCount * 125;

        scoredCandidates.push({
            score: score,
            angle: angle,
            path: path,
        });

        if (!best || score > best.score) {
            best = {
                angle: angle,
                score: score,
                targetId: target.ID,
                path: path,
                similarActiveCount: similarActiveCount,
            };
        }
    }

    scoredCandidates.sort(function (a, b) { return b.score - a.score; });
    _latestRankedPaths = scoredCandidates.slice(0, 20);

    // DONT REMOVE
    if (best) console.log(best.score)

    if (!best || best.score < 55) {
        // Fallback direct shot only when threat is nearby.
        if (!nearbyThreat) return null;
        var directAngle = quantizeAngle(Math.atan2(target.y - localTank.y, target.x - localTank.x));
        var sx = localTank.x + 40 * Math.cos(directAngle);
        var sy = localTank.y + 40 * Math.sin(directAngle);
        if (physics.canBulletBeSpawned(localTank, sx, sy, maze) && hasLineOfSight(localTank.x, localTank.y, target.x, target.y)) {
            var directKey = makeLaneKey(target.ID, directAngle);
            var directRecent = recentLaneCount(directKey, tickNum, 160);
            if (directRecent >= maxSameLaneShots && !pointBlankThreat) return null;
            rememberLaneShot(directKey, tickNum);
            return {
                angle: Math.round(directAngle * 1000) / 1000,
                score: 90,
                targetId: target.ID,
                path: null,
            };
        }
        return null;
    }

    var laneKey = makeLaneKey(best.targetId, best.angle);
    var recentSameLane = recentLaneCount(laneKey, tickNum, 160);
    var highConfidence = best.score >= 1200 || (best.score >= 700 && pointBlankThreat);
    if (recentSameLane >= maxSameLaneShots && !highConfidence) return null;
    if (recentSameLane > 0) {
        var repeatCooldown = pointBlankThreat ? (2 + recentSameLane * 2) : ((nearbyThreat ? 10 : 20) + recentSameLane * 10);
        if (tickNum - lastShotTick <= repeatCooldown && !highConfidence) return null;
    }
    rememberLaneShot(laneKey, tickNum);

    return {
        angle: Math.round(best.angle * 1000) / 1000,
        score: best.score,
        targetId: best.targetId,
        path: best.path,
    };
};

t.exports.getTopRankedPaths = function () {
    return _latestRankedPaths;
};

},
function(t, e, a) {

t.exports.drawMinimap = function (ctx, mazeData, allTanks) {
    if (!mazeData.cellsAcross) return;
    var MINIMAP_SIZE = 180;
    var PADDING = 10;
    var mx = PADDING, my = PADDING;
    var scaleX = MINIMAP_SIZE / mazeData.worldWidth;
    var scaleY = MINIMAP_SIZE / mazeData.worldHeight;

    ctx.save();
    ctx.globalAlpha = 0.7;
    ctx.fillStyle = "#1a1a2e";
    ctx.fillRect(mx, my, MINIMAP_SIZE, MINIMAP_SIZE);
    ctx.globalAlpha = 1;

    ctx.strokeStyle = "#4a6fa5";
    ctx.lineWidth = 1;
    for (var row = 0; row <= mazeData.cellsDown; row++) {
        for (var col = 0; col < mazeData.cellsAcross; col++) {
            if (1 == mazeData.horisontalWalls[row * mazeData.cellsAcross + col]) {
                ctx.beginPath();
                ctx.moveTo(mx + col * 100 * scaleX, my + row * 100 * scaleY);
                ctx.lineTo(mx + (col + 1) * 100 * scaleX, my + row * 100 * scaleY);
                ctx.stroke();
            }
        }
    }
    for (row = 0; row < mazeData.cellsDown; row++) {
        for (col = 0; col <= mazeData.cellsAcross; col++) {
            if (1 == mazeData.verticalWalls[row * (mazeData.cellsAcross + 1) + col]) {
                ctx.beginPath();
                ctx.moveTo(mx + col * 100 * scaleX, my + row * 100 * scaleY);
                ctx.lineTo(mx + col * 100 * scaleX, my + (row + 1) * 100 * scaleY);
                ctx.stroke();
            }
        }
    }

    for (var i = 0; i < allTanks.length; i++) {
        var t = allTanks[i];
        if (t.beenHit) continue;
        var tx = mx + t.x * scaleX;
        var ty = my + t.y * scaleY;
        ctx.beginPath();
        ctx.arc(tx, ty, i === 0 ? 4 : 3, 0, 2 * Math.PI);
        if (i === 0) ctx.fillStyle = "#00ff00";
        else if (t.isKing) ctx.fillStyle = "#ffbb00";
        else ctx.fillStyle = "#ff4444";
        ctx.fill();
    }

    ctx.strokeStyle = "#4a6fa5";
    ctx.lineWidth = 2;
    ctx.strokeRect(mx, my, MINIMAP_SIZE, MINIMAP_SIZE);
    ctx.restore();
};

},
function(t, e, a) {
var physics = a(3);

t.exports = function Bullet(id, x, y, xVel, yVel) {
    this.id = id;
    this.x = x;
    this.y = y;
    this.xVel = xVel;
    this.yVel = yVel;
    this.timeToLive = 9000;

    this.draw = function (ctx, camera) {
        ctx.fillStyle = "#101010";
        ctx.beginPath();
        ctx.arc(
            this.x - camera.camLeft,
            this.y - camera.camTop,
            4,
            0,
            2 * Math.PI,
        );
        ctx.fill();
    };

    this.update = function (maze, deltaTime) {
        physics.updateBulletsPosition(this, maze, deltaTime);
    };
};

},
function(t, e, a) {
t.exports = (function () {
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

},
function(t, e, a) {
var BaseSkin = a(14);
a(5);

function adjustColor(hex, percent) {
    hex = String(hex).replace(/[^0-9a-f]/gi, "");
    if (hex.length < 6)
        hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
    percent = percent || 0;

    var result = "#";
    var channel;
    for (var i = 0; i < 3; i++) {
        channel = parseInt(hex.substr(2 * i, 2), 16);
        channel = Math.round(
            Math.min(Math.max(0, channel + channel * percent), 255),
        ).toString(16);
        result += ("00" + channel).substr(channel.length);
    }
    return result;
}

t.exports = (function (_BaseSkin) {
    _inherits(DefaultSkin, _BaseSkin);

    function DefaultSkin() {
        _classCallCheck(this, DefaultSkin);
        _get(
            Object.getPrototypeOf(DefaultSkin.prototype),
            "constructor",
            this,
        ).apply(this, arguments);
    }

    _createClass(DefaultSkin, [
        {
            key: "drawTank",
            value: function drawTank(scale, dpr, color) {
                var pixelScale = scale * dpr;
                var canvas = document.createElement("canvas");
                var ctx = canvas.getContext("2d");

                var shade1 = adjustColor(color, -0.106);
                var shade2 = adjustColor(color, -0.16);
                var shade3 = adjustColor(color, -0.17);
                var shade4 = adjustColor(color, -0.234);
                var shade5 = adjustColor(color, -0.458);
                var shade6 = adjustColor(color, -0.56);
                var shade7 = adjustColor(color, -0.631);
                var shade8 = adjustColor(color, -0.705);
                var outlineColor = adjustColor(color, -0.5);

                // Tank body outline points
                var bodyPoints = [];
                bodyPoints.push({ x: 0, y: 80 });
                bodyPoints.push({ x: 22, y: 80 });
                bodyPoints.push({ x: 22, y: 65 });
                bodyPoints.push({ x: 70, y: 65 });
                bodyPoints.push({ x: 102, y: 95 });
                bodyPoints.push({ x: 102, y: 265 });
                bodyPoints.push({ x: 90, y: 272 });
                bodyPoints.push({ x: 22, y: 272 });
                bodyPoints.push({ x: 22, y: 255 });
                bodyPoints.push({ x: 0, y: 255 });

                ctx.canvas.width = 204 * pixelScale;
                ctx.canvas.height = 318 * pixelScale;
                ctx.scale(pixelScale, pixelScale);

                // Draw rear exhaust
                ctx.save();
                ctx.translate(102, 40);
                var gradient = ctx.createLinearGradient(0, 255, 0, 274);
                gradient.addColorStop(0, shade4);
                gradient.addColorStop(1, shade6);
                ctx.fillStyle = gradient;
                ctx.fillRect(-28, 255, 56, 19);

                gradient = ctx.createLinearGradient(0, 274, 0, 278);
                gradient.addColorStop(0, shade7);
                gradient.addColorStop(1, shade8);
                ctx.fillStyle = gradient;
                ctx.fillRect(-28, 274, 56, 4);
                ctx.restore();

                // Draw tank body
                ctx.save();
                ctx.translate(102, 40);
                ctx.beginPath();
                ctx.moveTo(bodyPoints[0].x, bodyPoints[0].y);
                for (var i = 1; i < bodyPoints.length; i++)
                    ctx.lineTo(bodyPoints[i].x, bodyPoints[i].y);
                for (i = bodyPoints.length - 2; i >= 0; i--)
                    ctx.lineTo(-bodyPoints[i].x, bodyPoints[i].y);
                ctx.closePath();
                ctx.fillStyle = color;
                ctx.fill();
                ctx.clip();

                // Top shading
                gradient = ctx.createLinearGradient(0, 0, 0, 92);
                gradient.addColorStop(0, shade5);
                gradient.addColorStop(1, shade3);
                ctx.fillStyle = gradient;
                ctx.fillRect(-200, 0, 400, 92);

                gradient = ctx.createLinearGradient(0, 92, 0, 102);
                gradient.addColorStop(0, shade3);
                gradient.addColorStop(1, color);
                ctx.fillStyle = gradient;
                ctx.fillRect(-200, 92, 400, 173);

                // Bottom edge shading
                gradient = ctx.createLinearGradient(0, 265, 0, 272);
                gradient.addColorStop(0, shade1);
                gradient.addColorStop(1, shade2);
                ctx.fillStyle = gradient;
                ctx.fillRect(-200, 265, 400, 8);

                // Barrel shadow
                ctx.shadowBlur = 15 * dpr;
                ctx.shadowColor = "rgba(0, 0, 0, 0.6)";
                ctx.fillRect(-17, 0, 34, 106);
                ctx.shadowBlur = 0;
                ctx.restore();

                // Draw barrel
                ctx.save();
                ctx.fillStyle = color;
                ctx.translate(102, 40);
                ctx.beginPath();
                ctx.rect(-17, -40, 34, 146);
                ctx.closePath();
                ctx.fill();

                gradient = ctx.createLinearGradient(-17, 0, -5, 0);
                gradient.addColorStop(0, shade5);
                gradient.addColorStop(1, shade4);
                ctx.fillStyle = gradient;
                ctx.fillRect(-17, -40, 17, 146);

                gradient = ctx.createLinearGradient(5, 0, 17, 0);
                gradient.addColorStop(0, shade4);
                gradient.addColorStop(1, shade5);
                ctx.fillStyle = gradient;
                ctx.fillRect(0, -40, 17, 146);
                ctx.restore();

                // Draw barrel base
                ctx.save();
                ctx.fillStyle = color;
                ctx.translate(102, 40);
                ctx.beginPath();
                ctx.rect(-29, 106, 58, 26);
                ctx.closePath();
                ctx.shadowBlur = 10 * dpr;
                ctx.shadowColor = "rgba(0, 0, 0, 0.6)";
                ctx.fill();
                ctx.shadowBlur = 0;
                ctx.clip();

                gradient = ctx.createLinearGradient(-29, 0, -5, 0);
                gradient.addColorStop(0, shade5);
                gradient.addColorStop(1, shade4);
                ctx.fillStyle = gradient;
                ctx.fillRect(-29, 106, 29, 26);

                gradient = ctx.createLinearGradient(5, 0, 29, 0);
                gradient.addColorStop(0, shade4);
                gradient.addColorStop(1, shade5);
                ctx.fillStyle = gradient;
                ctx.fillRect(0, 106, 29, 26);
                ctx.restore();

                // Draw turret dome
                ctx.save();
                ctx.fillStyle = shade4;
                ctx.translate(102, 40);
                ctx.shadowBlur = 10 * dpr;
                ctx.shadowColor = "black";
                ctx.beginPath();
                ctx.arc(0, 185, 60, 0, 2 * Math.PI);
                ctx.closePath();
                ctx.fill();
                ctx.shadowBlur = 0;

                ctx.strokeStyle = outlineColor;
                ctx.lineWidth = 5;
                ctx.beginPath();
                ctx.arc(0, 185, 50, 0, 2 * Math.PI);
                ctx.closePath();
                ctx.stroke();
                ctx.restore();

                return canvas;
            },
        },
        {
            key: "drawTankTrack",
            value: function drawTankTrack(pixelScale) {
                var canvas = document.createElement("canvas");
                var ctx = canvas.getContext("2d");

                var trackCircumference = 0 + 120 * Math.PI;
                var treadGap = trackCircumference / 5 - 36;

                ctx.canvas.width = 65 * pixelScale;
                ctx.canvas.height = 240 * pixelScale;
                ctx.scale(pixelScale, pixelScale);

                // Draw track base
                ctx.fillStyle = "#292929";
                ctx.fillRect(0, 0, 65, 240);

                // Top/bottom gradient overlays
                ctx.globalAlpha = 0.9;
                var topGradient = ctx.createLinearGradient(0, 0, 0, 36);
                topGradient.addColorStop(0, "#101010");
                topGradient.addColorStop(1, "transparent");
                ctx.fillStyle = topGradient;
                ctx.fillRect(0, 0, 65, 36);

                var bottomGradient = ctx.createLinearGradient(0, 240, 0, 204);
                bottomGradient.addColorStop(0, "#101010");
                bottomGradient.addColorStop(1, "transparent");
                ctx.fillStyle = bottomGradient;
                ctx.fillRect(0, 204, 65, 36);
                ctx.globalAlpha = 1;

                // Calculate tread positions along the track
                var halfCircumference = 0.5 * Math.PI * 120;
                var straightLength = halfCircumference + 0;
                var treads = [];

                for (var i = 0; i <= 5; i++) {
                    var pos = (i * (36 + treadGap) + 36) % trackCircumference;
                    var yPos;
                    var tiltAngle = 0;

                    if (pos < halfCircumference) {
                        tiltAngle = (halfCircumference - pos) / 120;
                        yPos = 120 - 120 * Math.sin(tiltAngle);
                    } else if (pos > straightLength) {
                        tiltAngle = (pos - straightLength) / 120;
                        yPos = 120 + 120 * Math.sin(tiltAngle);
                    } else {
                        yPos = pos - halfCircumference + 120;
                    }

                    treads.push({
                        x: 0,
                        y: yPos,
                        angle: tiltAngle,
                        treadHeight: 36,
                        treadWidth: 65,
                        treadDepth: 40,
                        trackHeight: 240,
                    });
                }

                var drawTread = function drawTread(ctx, tread) {
                    var x = tread.x;
                    var y = tread.y;
                    var angle = tread.angle;
                    var treadHeight = tread.treadHeight;
                    var treadWidth = tread.treadWidth;
                    var treadDepth = tread.treadDepth;
                    var trackHeight = tread.trackHeight;

                    var cosAngle = Math.cos(angle);
                    var visibleHeight = treadHeight * cosAngle;
                    var depthOffset = treadDepth * (1 - cosAngle);

                    // Draw tread face
                    ctx.fillStyle = "#616161";
                    ctx.fillRect(
                        x,
                        y - visibleHeight / 2,
                        treadWidth,
                        visibleHeight,
                    );

                    // Draw tread side
                    ctx.fillStyle = "#404040";
                    var isBottomHalf = y > trackHeight / 2 ? 1 : 0;
                    if (isBottomHalf)
                        ctx.fillRect(
                            x,
                            y - visibleHeight / 2 - depthOffset,
                            treadWidth,
                            depthOffset,
                        );
                    else
                        ctx.fillRect(
                            x,
                            y + visibleHeight / 2,
                            treadWidth,
                            depthOffset,
                        );

                    // Draw tread shadows
                    var gradient;
                    gradient = ctx.createLinearGradient(
                        x,
                        y - visibleHeight / 2,
                        0,
                        y - visibleHeight / 2 - (visibleHeight / 10) * 5,
                    );
                    gradient.addColorStop(0, "#101010");
                    gradient.addColorStop(1, "transparent");
                    ctx.fillStyle = gradient;
                    if (isBottomHalf)
                        ctx.fillRect(
                            x,
                            y -
                                visibleHeight / 2 -
                                (visibleHeight / 10) * 5 -
                                depthOffset,
                            treadWidth,
                            (visibleHeight / 10) * 5,
                        );
                    else
                        ctx.fillRect(
                            x,
                            y - visibleHeight / 2 - (visibleHeight / 10) * 5,
                            treadWidth,
                            (visibleHeight / 10) * 5,
                        );

                    gradient = ctx.createLinearGradient(
                        x,
                        y + visibleHeight / 2,
                        0,
                        y + visibleHeight / 2 + (visibleHeight / 10) * 5,
                    );
                    gradient.addColorStop(0, "#101010");
                    gradient.addColorStop(1, "transparent");
                    ctx.fillStyle = gradient;
                    if (isBottomHalf)
                        ctx.fillRect(
                            x,
                            y + visibleHeight / 2,
                            treadWidth,
                            (visibleHeight / 10) * 5,
                        );
                    else
                        ctx.fillRect(
                            x,
                            y + visibleHeight / 2 + depthOffset,
                            treadWidth,
                            (visibleHeight / 10) * 5,
                        );
                };

                // Sort by angle (draw most tilted first)
                var sortedTreads = treads.sort(function (a, b) {
                    return b.angle - a.angle;
                });

                for (i = 0; i < sortedTreads.length; i++)
                    drawTread(ctx, sortedTreads[i]);

                // Additional shading overlays
                ctx.globalAlpha = 0.4;
                var topShade = ctx.createLinearGradient(0, 0, 0, 96);
                topShade.addColorStop(0, "#101010");
                topShade.addColorStop(1, "transparent");
                ctx.fillStyle = topShade;

                var bottomShade = ctx.createLinearGradient(0, 240, 0, 204);
                bottomShade.addColorStop(0, "#101010");
                bottomShade.addColorStop(1, "transparent");
                ctx.fillStyle = bottomShade;

                return canvas;
            },
        },
        {
            key: "drawSkin",
            value: function drawSkin(ctx, dpr, state) {
                var _this = this;
                var scale = this.tankScale;

                var tankSprite = this.getCachedGraphic(
                    "tankSprite",
                    function () {
                        return _this.drawTank(scale, dpr, _this.config.colour);
                    },
                );

                var trackSprite = this.getCachedGraphic(
                    "trackSprite",
                    function () {
                        return _this.drawTankTrack(scale * dpr);
                    },
                );

                var tankWidth = tankSprite.width / dpr;
                var tankHeight = tankSprite.height / dpr;
                var trackWidth = trackSprite.width / dpr;
                var trackHeight = trackSprite.height / dpr;

                ctx.translate(0.5 * -tankWidth, (225 / 318) * -tankHeight);
                ctx.drawImage(
                    trackSprite,
                    9 * scale,
                    80 * scale,
                    trackWidth,
                    trackHeight,
                );
                ctx.drawImage(
                    trackSprite,
                    130 * scale,
                    80 * scale,
                    trackWidth,
                    trackHeight,
                );
                ctx.drawImage(tankSprite, 0, 0, tankWidth, tankHeight);
            },
        },
    ]);

    return DefaultSkin;
})(BaseSkin);

},
function(t, e, a) {
var BaseSkin = a(14);
a(5);

t.exports = (function (_BaseSkin) {
    _inherits(FlagSkin, _BaseSkin);

    function FlagSkin(config) {
        _classCallCheck(this, FlagSkin);
        _get(
            Object.getPrototypeOf(FlagSkin.prototype),
            "constructor",
            this,
        ).call(this, config);

        this.points = [];
        for (var i = 0; i < 10; i++) this.points.push({ x: 0, y: 0 });
    }

    _createClass(FlagSkin, [
        {
            key: "preDrawInScreenSpace",
            value: function preDrawInScreenSpace(ctx, state) {
                var cosAngle = Math.cos(this.angle);
                var sinAngle = Math.sin(this.angle);

                // Position flag attachment point behind the tank
                this.points[0].x = this.x + (-16 * cosAngle - 0 * sinAngle);
                this.points[0].y = this.y + (0 * cosAngle + -16 * sinAngle);
                this.points[1].x = this.points[0].x + -2 * cosAngle;
                this.points[1].y = this.points[0].y + -2 * sinAngle;

                // Simulate trailing rope physics
                for (var i = 0; i < this.points.length - 1; i++) {
                    var curX = this.points[i].x;
                    var curY = this.points[i].y;
                    var nextX = this.points[i + 1].x;
                    var nextY = this.points[i + 1].y;
                    var angle = Math.atan2(nextY - curY, nextX - curX);
                    var segmentLength = 3;
                    this.points[i + 1].x =
                        curX + segmentLength * Math.cos(angle);
                    this.points[i + 1].y =
                        curY + segmentLength * Math.sin(angle);
                }

                // Draw the flag trail
                ctx.beginPath();
                ctx.moveTo(this.points[0].x, this.points[0].y);
                for (i = 1; i < this.points.length; i++) {
                    ctx.lineTo(this.points[i].x, this.points[i].y);
                }
                ctx.strokeStyle = "#ce0804";
                ctx.lineWidth = 34;
                ctx.lineJoin = "round";
                ctx.lineCap = "square";
                ctx.stroke();
            },
        },
        {
            key: "drawSkin",
            value: function drawSkin(ctx, dpr, state) {
                this.tankScale;
            },
        },
    ]);

    return FlagSkin;
})(BaseSkin);

},
function(t, e, a) {
var spriteGenerator = a(5);
var defaultSkin = a(15);
a(16);

t.exports = function (tankScale, dpr) {
    var explosionFrames = spriteGenerator.generateExplosionSpriteSheet(
        200 * dpr,
        90,
    );
    var scorchSprite = spriteGenerator.generateScorchSprite(100 * dpr);

    return {
        TankModel: function TankModel() {
            this.drawColourIndex = 0;
            this.showingScorch = false;
            this.showingExplosion = false;
            this.explodeAnimIndex = 0;
            this.skins = [
                new defaultSkin({
                    colour: spriteGenerator.skins[this.drawColourIndex],
                }),
            ];

            this.setSkin = function (colorIndex) {
                this.drawColourIndex = colorIndex;
                this.skins[0].setConfig({
                    colour: spriteGenerator.skins[this.drawColourIndex],
                });
            };

            this.playMovementAnimation = function () {
                this.showingExplosion = false;
                this.showingScorch = false;
            };

            this.playDeathAnimation = function () {
                this.explodeAnimIndex = 0;
                this.showingExplosion = true;
            };

            this.renderModelOntoCanvas = function (
                ctx,
                camera,
                x,
                y,
                angle,
                isKing,
                name,
            ) {
                if (this.showingScorch) {
                    var scorchWidth = scorchSprite.width / dpr;
                    var scorchHeight = scorchSprite.height / dpr;
                    var scorchX = x - camera.camLeft - 0.5 * scorchWidth;
                    var scorchY = y - camera.camTop - 0.5 * scorchHeight;
                    ctx.drawImage(
                        scorchSprite,
                        scorchX,
                        scorchY,
                        scorchWidth,
                        scorchHeight,
                    );
                } else {
                    ctx.save();
                    ctx.translate(x - camera.camLeft, y - camera.camTop);

                    // Draw name
                    ctx.font = "14px Fredoka One";
                    ctx.fillStyle = "#000000";
                    ctx.fillText(name, 3 * -name.length, -40);

                    // Draw crown if king
                    if (isKing) {
                        ctx.font = "14px Anton";
                        ctx.fillStyle = "#000000";
                        ctx.fillText(
                            "\uD83D\uDC51",
                            3 * -name.length - 20,
                            -40,
                        );
                    }

                    // Draw all skins
                    this.skins.forEach(function (skin) {
                        skin.draw(
                            ctx,
                            0,
                            {
                                angle: angle,
                                x: x,
                                y: y,
                            },
                            {
                                tankScale: tankScale,
                                camLeft: camera.camLeft,
                                camTop: camera.camTop,
                                dpr: dpr,
                            },
                        );
                    });

                    ctx.restore();
                }

                // Draw explosion animation
                if (this.showingExplosion) {
                    if (this.explodeAnimIndex < explosionFrames.length - 1) {
                        this.explodeAnimIndex += 1;
                        if (this.explodeAnimIndex > 50) {
                            this.showingScorch = true;
                            this.showingExplosion = false;
                        } else {
                            this.showingScorch = false;
                        }
                    }

                    var frameWidth =
                        explosionFrames[this.explodeAnimIndex].width / dpr;
                    var frameHeight =
                        explosionFrames[this.explodeAnimIndex].height / dpr;
                    var frameX = x - camera.camLeft - 0.5 * frameWidth;
                    var frameY = y - camera.camTop - 0.5 * frameHeight;
                    ctx.drawImage(
                        explosionFrames[this.explodeAnimIndex],
                        frameX,
                        frameY,
                        frameWidth,
                        frameHeight,
                    );
                }
            };
        },

        skins: spriteGenerator.skins,
    };
};

},
function(t, e, a) {
var constants = a(0);
var physics = a(3);
var tankModel = a(17)(0.18, window.devicePixelRatio || 1);

t.exports = function Tank(x, y) {
    this.x = x;
    this.y = y;
    this.angle = 0;
    this.name = "Name Unset";
    this.isKing = false;
    this.model = new tankModel.TankModel();
    this.xVel = 0;
    this.yVel = 0;
    this.maxSpeed = constants.TANK_MAX_SPEED;
    this.angularSpeed = 0.25;
    this.moving = true;
    this.beenHit = false;
    this.alive = true;
    this.boundingBox = [-18, -16, 26, -16, 26, 16, -18, 16];
    this.player = false;
    this.hitLastTurn = false;

    this.moveTowards = function (targetX, targetY, maze, deltaTime) {
        if (!this.beenHit)
            return physics.tankMoveTowards(
                this,
                targetX,
                targetY,
                maze,
                deltaTime,
            );
    };

    this.lookAt = function (targetX, targetY, maze) {
        if (!this.beenHit)
            physics.tankLookAtPoint(this, targetX, targetY, maze);
    };

    this.setSkin = function (colorIndex) {
        this.model.setSkin(colorIndex);
    };

    this.draw = function (ctx, camera) {
        if (this.beenHit) {
            if (!this.hitLastTurn) {
                this.model.playDeathAnimation();
                this.hitLastTurn = true;
            }
        } else {
            this.model.playMovementAnimation();
            this.hitLastTurn = false;
        }

        this.model.renderModelOntoCanvas(
            ctx,
            camera,
            this.x,
            this.y,
            this.angle,
            this.isKing,
            this.name,
        );
    };
};

},
function(t, e, a) {
var GraphicsObject = function GraphicsObject() {
};

GraphicsObject.prototype = {
  draw: function draw(ctx, camera, deltaTime) {
  }
};

t.exports = GraphicsObject;

},
function(t, e, a) {
var GraphicsObject = a(19);

function PopUpNotification(message) {
    var timeToLive =
        arguments.length <= 1 || arguments[1] === undefined
            ? 2000
            : arguments[1];

    this.timeToLive = timeToLive;
    this.message = message;
    this.width = 13 * message.length + 40;
    this.height = 60;

    this.draw = function (ctx, camera, deltaTime) {
        if (this.timeToLive <= 0) destroyGraphicsObject(this);

        this.timeToLive -= deltaTime;

        var x = 0.5 * (ctx.canvas.clientWidth - this.width);
        var y = 0.5 * ctx.canvas.clientHeight - this.height - 70;

        // Draw shadow
        ctx.globalAlpha = 0.3;
        ctx.shadowOffsetY = 6;
        ctx.shadowBlur = 5;
        ctx.shadowColor = "black";
        ctx.fillRect(x, y, this.width, this.height);

        // Draw background
        ctx.globalAlpha = 0.95;
        ctx.shadowOffsetY = 0;
        ctx.shadowBlur = 0;
        ctx.fillStyle = "#febd09";
        ctx.fillRect(x, y, this.width, this.height);

        // Draw border
        ctx.strokeStyle = "#ffffff";
        ctx.lineWidth = 4;
        ctx.strokeRect(x, y, this.width, this.height);

        // Draw text
        ctx.globalAlpha = 1;
        ctx.fillStyle = "#ffffff";
        ctx.font = "26px Fredoka One";
        ctx.textAlign = "center";
        ctx.shadowColor = "#e55b0e";
        ctx.shadowOffsetY = 4;
        ctx.fillText(
            this.message,
            x + 0.5 * this.width,
            y + 0.5 * this.height + 5,
        );
        ctx.shadowOffsetY = 0;
        ctx.textAlign = "start";
    };
}

PopUpNotification.prototype = new GraphicsObject();

t.exports.PopUpNotification = PopUpNotification;

},
function(t, e) {
var a;

a = (function () {
    return this;
})();

try {
    a = a || new Function("return this")();
} catch (e) {
    "object" == typeof window && (a = window);
}

t.exports = a;

},
function(t, e, a) {
(function (exports) {
    var constants = a(0),
        collision = a(1),
        networkProtocol = a(2),
        physics = a(3),
        SocketWrapper = a(4),
        spriteGenerator = a(5),
        pathfind = a(6),
        modUi = a(7),
        smartAimMod = a(8),
        bulletLinesMod = a(9),
        autoDodgeMod = a(10),
        autoKillMod = a(11),
        minimapMod = a(12);

    var canvas,
        ctx,
        Bullet = a(13),
        Tank = a(18),
        PopUpNotification =
            (a(19),
                a(20).PopUpNotification);

    console.log("Running game...");
    console.log("V 2.0 [MOD]");
    console.log("Supertanks Mod by Omena0");

    var tanks,
        bullets,
        nextBulletId,
        tickNum,
        movementInputBuffer,
        shootInputBuffer,
        socket,
        hasJoined,
        playerName,
        mouseToTankX,
        mouseToTankY,
        isMoving,
        maze = {
            cellsAcross: void 0,
            cellsDown: void 0,
            worldWidth: void 0,
            worldHeight: void 0,
            verticalWalls: [],
            horisontalWalls: [],
            wallCorners: [],
        },
        wallCornerSprites = [],
        graphicsObjects = [],
        camera = {
            camLeft: 0,
            camTop: 0,
            scale: 1,
        },
        mouseX = 0,
        mouseY = 0,
        mouseClicked = false,
        kingID = -1,
        kingStartTime = 0,
        bulletsSpawnedCount = 0,
        maxBullets = constants.TANK_DEFAULT_BULLETCOUNT,
        lastShotTick = 0,
        leaderBoard = [
            { name: "Player 1", score: 10 },
            { name: "Joe", score: 5 },
            { name: "Alex", score: "12" },
        ];

    // === MOD STATE ===
    var ctrlPressed = false;
    var mouseWorldX = 0;
    var mouseWorldY = 0;
    var currentSmartAimAngle = 0;
    var currentSmartAimPath = null;
    var smartAimValid = false;
    var smartAimEnabled = true;
    var ctrlMoveEnabled = true;
    var trajectoryEnabled = true;
    var minimapEnabled = true;
    var autoDodgeEnabled = true;
    var autoKillEnabled = true;
    var _dodgeActive = false;
    var _dodgeAngle = 0;
    var _dodgePath = []; // [{x, y}] for visualization
    var _cachedBulletPaths = []; // [{path, bulletIndex}] reused by drawing + dodge
    var autoRespawnEnabled = true;
    var pathfindEnabled = true;
    var _pathfindTarget = null;
    var _pathfindPath = [];
    var _pathfindIndex = 0;
    var _pathfindAngle = 0;
    var _pathfindActive = false;
    var _pathfindPauseUntilTick = 0;
    var _pathfindRecalcTick = 0;
    var _bulletThreatGrid = Object.create(null);
    var _bulletThreatCellSize = 44;
    var _bulletCacheWorker = null;
    var _bulletCacheWorkerBusy = false;
    var _bulletCacheWorkerEnabled = false;
    var _bulletCacheRequestId = 0;
    var _bulletCacheAppliedId = 0;
    var _bulletThreatGridDirty = true;

    function initBulletCacheWorker() {
        if (_bulletCacheWorker || typeof Worker === "undefined" || typeof Blob === "undefined" || typeof URL === "undefined") return;
        try {
            var workerSource = "(function(){" +
                "function simulatePath(constants,startX,startY,angle,mazeData,maxSteps){" +
                "var bulletSpeed=constants.TANK_MAX_SPEED*1.2;var dt=constants.PHYSICS_INTERVAL;" +
                "var bx=startX,by=startY;var vx=Math.cos(angle)*bulletSpeed;var vy=Math.sin(angle)*bulletSpeed;var path=[];" +
                "for(var step=0;step<maxSteps;step++){" +
                "bx+=vx*dt;by+=vy*dt;var bounced=false;" +
                "if(bx+9>mazeData.worldWidth){bx=mazeData.worldWidth-9;vx*=-1;bounced=true;}else if(bx-9<0){bx=9;vx*=-1;bounced=true;}" +
                "if(by+9>mazeData.worldHeight){by=mazeData.worldHeight-9;vy*=-1;bounced=true;}else if(by-9<0){by=9;vy*=-1;bounced=true;}" +
                "if(!bounced&&mazeData.cellsAcross){" +
                "var cellX=Math.floor(bx/100);var cellY=Math.floor(by/100);var modX=bx%100,modY=by%100;" +
                "var nearL=modX<9,nearR=modX>91,nearT=modY<9,nearB=modY>91;" +
                "if(nearT&&nearL&&1==mazeData.wallCorners[cellY*(mazeData.cellsAcross+1)+cellX]){" +
                "if(vx*(modY-9)-vy*(modX-9)<0){vy*=-1;by=100*cellY+9;}else{vx*=-1;bx=100*cellX+9;}}" +
                "else if(nearT&&nearR&&1==mazeData.wallCorners[cellY*(mazeData.cellsAcross+1)+(cellX+1)]){" +
                "if(vx*(modY-9)-vy*(modX-91)>0){vy*=-1;by=100*cellY+9;}else{vx*=-1;bx=100*cellX+91;}}" +
                "else if(nearB&&nearL&&1==mazeData.wallCorners[(cellY+1)*(mazeData.cellsAcross+1)+cellX]){" +
                "if(vx*(modY-91)-vy*(modX-9)>0){vy*=-1;by=100*cellY+91;}else{vx*=-1;bx=100*cellX+9;}}" +
                "else if(nearB&&nearR&&1==mazeData.wallCorners[(cellY+1)*(mazeData.cellsAcross+1)+(cellX+1)]){" +
                "if(vx*(modY-91)-vy*(modX-91)<0){vy*=-1;by=100*cellY+91;}else{vx*=-1;bx=100*cellX+91;}}" +
                "else if(nearB&&1==mazeData.horisontalWalls[(cellY+1)*mazeData.cellsAcross+cellX]){vy*=-1;by=100*cellY+91;}" +
                "else if(nearT&&1==mazeData.horisontalWalls[cellY*mazeData.cellsAcross+cellX]){vy*=-1;by=100*cellY+9;}" +
                "else if(nearL&&1==mazeData.verticalWalls[cellY*(mazeData.cellsAcross+1)+cellX]){vx*=-1;bx=100*cellX+9;}" +
                "else if(nearR&&1==mazeData.verticalWalls[cellY*(mazeData.cellsAcross+1)+(cellX+1)]){vx*=-1;bx=100*cellX+91;}" +
                "}" +
                "path.push({x:bx,y:by,vx:vx,vy:vy,step:step});}" +
                "return path;}" +
                "self.onmessage=function(ev){var d=ev.data||{};var bullets=d.bullets||[];var out=[];" +
                "for(var i=0;i<bullets.length;i++){var b=bullets[i];if(!b)continue;" +
                "var path=simulatePath(d.constants,b.x,b.y,Math.atan2(b.yVel,b.xVel),d.mazeData,b.stepsLeft);" +
                "out.push({id:b.id,path:path,ignoreForDodge:b.ignoreForDodge});}" +
                "self.postMessage({requestId:d.requestId,entries:out});};" +
                "})();";
            var blob = new Blob([workerSource], { type: "application/javascript" });
            var url = URL.createObjectURL(blob);
            _bulletCacheWorker = new Worker(url);
            URL.revokeObjectURL(url);

            _bulletCacheWorker.onmessage = function (ev) {
                var data = ev && ev.data ? ev.data : null;
                _bulletCacheWorkerBusy = false;
                if (!data || !data.entries) return;
                if (data.requestId <= _bulletCacheAppliedId) return;
                _bulletCacheAppliedId = data.requestId;

                var idBuckets = Object.create(null);
                for (var bi = 0; bi < bullets.length; bi++) {
                    var b = bullets[bi];
                    var key = String(b.id);
                    if (!idBuckets[key]) idBuckets[key] = [];
                    idBuckets[key].push(b);
                }

                var rebuilt = [];
                for (var i = 0; i < data.entries.length; i++) {
                    var e = data.entries[i];
                    var bucket = idBuckets[String(e.id)];
                    if (!bucket || !bucket.length) continue;
                    var bulletRef = bucket.shift();
                    rebuilt.push({ path: e.path, bullet: bulletRef, ignoreForDodge: !!e.ignoreForDodge });
                }

                _cachedBulletPaths = rebuilt;
                _bulletThreatGridDirty = true;
            };

            _bulletCacheWorker.onerror = function () {
                _bulletCacheWorkerEnabled = false;
                _bulletCacheWorkerBusy = false;
            };

            _bulletCacheWorkerEnabled = true;
        } catch (e) {
            _bulletCacheWorkerEnabled = false;
            _bulletCacheWorkerBusy = false;
        }
    }

    // === BULLET PATH CACHE: computed once per tick, shared across systems ===
    function updateBulletPathCache(mazeData) {
        if (!mazeData.cellsAcross) {
            _cachedBulletPaths = [];
            _bulletThreatGrid = Object.create(null);
            _bulletThreatGridDirty = false;
            return;
        }

        if (_bulletCacheWorkerEnabled && _bulletCacheWorker && !_bulletCacheWorkerBusy) {
            var now = Date.now();
            var bulletPayload = [];
            for (var i = 0; i < bullets.length; i++) {
                var b = bullets[i];
                var remainingTTL = b.timeToLive !== undefined ? b.timeToLive : 9000;
                if (b.fireTime) remainingTTL = 9000 - (now - b.fireTime);
                if (remainingTTL <= 0) continue;
                var stepsLeft = Math.ceil(remainingTTL / constants.PHYSICS_INTERVAL);
                bulletPayload.push({
                    id: b.id,
                    x: b.x,
                    y: b.y,
                    xVel: b.xVel,
                    yVel: b.yVel,
                    stepsLeft: stepsLeft,
                    ignoreForDodge: !!(b.ignoreForDodgeUntil && now < b.ignoreForDodgeUntil),
                });
            }

            _bulletCacheWorkerBusy = true;
            _bulletCacheRequestId++;
            _bulletCacheWorker.postMessage({
                requestId: _bulletCacheRequestId,
                bullets: bulletPayload,
                mazeData: mazeData,
                constants: constants,
            });
        }

        // Fallback path (or initial warm-up before first worker result).
        if (!_bulletCacheWorkerEnabled || _cachedBulletPaths.length === 0) {
            _cachedBulletPaths = bulletLinesMod.updateBulletPathCache(
                bullets,
                mazeData,
                constants,
                smartAimMod.simulateBulletPath
            );
            _bulletThreatGridDirty = true;
        }

        if (_bulletThreatGridDirty) rebuildBulletThreatGrid();
    }

    function rebuildBulletThreatGrid() {
        _bulletThreatGrid = Object.create(null);
        if (!_cachedBulletPaths || !_cachedBulletPaths.length) {
            _bulletThreatGridDirty = false;
            return;
        }
        var cellSize = _bulletThreatCellSize;
        var grid = _bulletThreatGrid;

        for (var i = 0; i < _cachedBulletPaths.length; i++) {
            var entry = _cachedBulletPaths[i];
            if (!entry || entry.ignoreForDodge) continue;
            var path = entry.path;
            var pathLen = path && path.length;
            if (!pathLen || pathLen < 2) continue;

            var maxStep = pathLen < 130 ? pathLen : 130;
            for (var s = 0; s < maxStep; s += 2) {
                var pt = path[s];
                var cx = (pt.x / cellSize) | 0;
                var cy = (pt.y / cellSize) | 0;
                var key = cx + ":" + cy;
                var bucket = grid[key];
                if (!bucket) {
                    bucket = [];
                    grid[key] = bucket;
                }
                bucket.push({ x: pt.x, y: pt.y, s: s });
            }
        }
        _bulletThreatGridDirty = false;
    }

    function clearPathfindTarget() {
        _pathfindTarget = null;
        _pathfindPath = [];
        _pathfindIndex = 0;
        _pathfindActive = false;
        _pathfindPauseUntilTick = 0;
        _pathfindRecalcTick = 0;
    }

    function setPathfindTarget(targetX, targetY) {
        if (!maze.cellsAcross || !tanks || !tanks[0]) return;
        if (_pathfindTarget && _pathfindPath && _pathfindPath.length > 0 && _pathfindIndex < _pathfindPath.length) {
            var dx = targetX - _pathfindTarget.x;
            var dy = targetY - _pathfindTarget.y;
            if (dx * dx + dy * dy <= 20 * 20) return;
        }
        var computed = pathfind.findPath(maze, tanks[0].x, tanks[0].y, targetX, targetY, {
            bulletPaths: _cachedBulletPaths,
        });
        if (!computed || computed.length === 0) {
            clearPathfindTarget();
            return;
        }
        _pathfindTarget = { x: targetX, y: targetY };
        _pathfindPath = computed;
        _pathfindIndex = 0;
    }

    function drawPathfindPath(ctx, cam) {
        if (!_pathfindPath || _pathfindPath.length === 0 || !tanks || !tanks[0]) return;
        ctx.save();
        ctx.strokeStyle = "rgba(255, 235, 59, 0.95)";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(tanks[0].x - cam.camLeft, tanks[0].y - cam.camTop);
        for (var i = _pathfindIndex; i < _pathfindPath.length; i++) {
            ctx.lineTo(_pathfindPath[i].x - cam.camLeft, _pathfindPath[i].y - cam.camTop);
        }
        ctx.stroke();
        ctx.restore();
    }

    function findDodgeAction(tankX, tankY, mazeData) {
        var result = autoDodgeMod.findDodgeAction(tankX, tankY, mazeData, _cachedBulletPaths, constants);
        if (!result) {
            _dodgePath = [];
            return null;
        }
        _dodgePath = result.path || [];
        return { angle: result.angle, shouldMove: !!result.shouldMove };
    }

    function findSmartAimAngle(tankX, tankY, targetX, targetY, mazeData) {
        var result = smartAimMod.findSmartAimAngle({
            tankX: tankX,
            tankY: tankY,
            targetX: targetX,
            targetY: targetY,
            mazeData: mazeData,
            smartAimEnabled: smartAimEnabled,
            constants: constants,
            physics: physics,
            playerTank: tanks[0],
        });
        smartAimValid = result.valid;
        currentSmartAimPath = result.path;
        currentSmartAimAngle = result.angle;
        return result.angle;
    }

    // === BULLET TRAJECTORY PREDICTION (TTL-aware, uses cached paths) ===
    function drawBulletPredictions(ctx, cam, mazeData) {
        bulletLinesMod.drawBulletPredictions(ctx, cam, mazeData, _cachedBulletPaths, tanks[0].x, tanks[0].y);
    }

    // === DODGE PATH VISUALIZATION ===
    function drawDodgePath(ctx, cam) {
        autoDodgeMod.drawDodgePath(ctx, cam, tanks[0].x, tanks[0].y, _dodgePath);
    }

    // === SMART AIM PREVIEW PATH ===
    function drawSmartAimPreview(ctx, cam) {
        smartAimMod.drawSmartAimPreview(ctx, cam, tanks[0].x, tanks[0].y, currentSmartAimAngle, currentSmartAimPath);
    }

    // === MINIMAP ===
    function drawMinimap(ctx, mazeData, allTanks, localTank) { 
        minimapMod.drawMinimap(ctx, mazeData, allTanks);
    }

    // === AUTOKILL SHOT PATH VISUALIZATION ===
    function drawAutoKillRankedPaths(ctx, cam) {
        if (!autoKillEnabled || !autoKillMod.getTopRankedPaths) return;
        var ranked = autoKillMod.getTopRankedPaths();
        if (!ranked || ranked.length === 0) return;

        ctx.save();
        ctx.setLineDash([6, 6]);

        var minVisibleAlpha = 0.065;
        var minVisibleWidth = 0.7;

        var count = Math.min(20, ranked.length);
        for (var i = 0; i < count; i++) {
            var cand = ranked[i];
            if (!cand.path || cand.path.length < 2) continue;

            // Style depends on index only; ranks 10-20 are intentionally faint.
            var baseAlpha;
            var baseWidth;

            if (i === 0) {
                // Explicit highlight for best path.
                baseAlpha = 1;
                baseWidth = 4;
            } else if (i < 10) {
                var tTop = i / 9;
                baseAlpha = 0.46 * Math.pow(1 - tTop, 1.15) + 0.1;
                baseWidth = 3 - 1.4 * tTop;
            } else {
                var tLow = (i - 10) / 9;
                baseAlpha = 0.09 * Math.pow(1 - tLow, 1.45) + 0.02;
                baseWidth = 1.1 - 0.45 * tLow;
            }

            var pathLen = cand.path.length;
            for (var p = 1; p < pathLen; p += 2) {
                var a = cand.path[p - 1];
                var b = cand.path[p];
                var distT = p / Math.max(1, pathLen - 1);
                // Slight fade with travel distance along each path.
                var segFade = (i === 0) ? 1 : (1 - 0.45 * Math.pow(distT, 1.2));
                var alpha = Math.max(minVisibleAlpha, baseAlpha * segFade);

                ctx.beginPath();
                ctx.moveTo(a.x - cam.camLeft, a.y - cam.camTop);
                ctx.lineTo(b.x - cam.camLeft, b.y - cam.camTop);
                var widthScale = (i === 0) ? 1 : (0.9 + 0.1 * segFade);
                ctx.lineWidth = Math.max(minVisibleWidth, baseWidth * widthScale);
                ctx.strokeStyle = "rgba(255, 120, 120, " + alpha + ")";
                ctx.stroke();
            }
        }

        ctx.setLineDash([]);
        ctx.restore();
    }

    function shortestAngleDiff(a, b) {
        var d = a - b;
        while (d <= -Math.PI) d += 2 * Math.PI;
        while (d > Math.PI) d -= 2 * Math.PI;
        return Math.abs(d);
    }

    function isPointUnderBulletThreat(px, py, maxSteps, radius) {
        if (!_bulletThreatGrid) return false;
        var r2 = radius * radius;
        var cell = _bulletThreatCellSize;
        var cx = (px / cell) | 0;
        var cy = (py / cell) | 0;

        for (var ox = -1; ox <= 1; ox++) {
            for (var oy = -1; oy <= 1; oy++) {
                var key = (cx + ox) + ":" + (cy + oy);
                var bucket = _bulletThreatGrid[key];
                if (!bucket) continue;
                for (var i = 0; i < bucket.length; i++) {
                    var h = bucket[i];
                    if (h.s > maxSteps) continue;
                    var dx = h.x - px;
                    var dy = h.y - py;
                    if (dx * dx + dy * dy <= r2) return true;
                }
            }
        }
        return false;
    }

    // === MOD GUI PANEL ===
    function getModDefinitions() {
        return [
            { id: "smartaim", label: "Smart Aim", key: "S", get: function() { return smartAimEnabled; }, set: function(v) { smartAimEnabled = v; } },
            { id: "ctrlmove", label: "Ctrl to Move", key: "C", get: function() { return ctrlMoveEnabled; }, set: function(v) { ctrlMoveEnabled = v; } },
            { id: "trajectory", label: "Trajectories", key: "T", get: function() { return trajectoryEnabled; }, set: function(v) { trajectoryEnabled = v; } },
            { id: "minimap", label: "Minimap", key: "M", get: function() { return minimapEnabled; }, set: function(v) { minimapEnabled = v; } },
            { id: "autododge", label: "Auto Dodge", key: "D", get: function() { return autoDodgeEnabled; }, set: function(v) { autoDodgeEnabled = v; } },
            { id: "autokill", label: "Auto Kill", key: "K", get: function() { return autoKillEnabled; }, set: function(v) { autoKillEnabled = v; } },
            { id: "pathfind", label: "Pathfind", key: "P", get: function() { return pathfindEnabled; }, set: function(v) { pathfindEnabled = v; if (!v) clearPathfindTarget(); } },
            { id: "autorespawn", label: "Auto Respawn", key: "R", get: function() { return autoRespawnEnabled; }, set: function(v) { autoRespawnEnabled = v; } }
        ];
    }

    function createModPanel() {
        modUi.createModPanel(getModDefinitions());
    }

    function updateModSwitch(id, value) {
        modUi.updateModSwitch(id, value);
    }

    // === END MOD HELPERS ===

    function drawSplashScreen(splashCtx) {
        var mazeString = "16x16\n+---+---+---+---+---+---+---+---+---+---+---+---+---+---+---+---+\n|           |                   |           |               |   |\n+---+---+   +   +---+   +---+   +---+   +   +   +---+   +   +   +\n|   |       |       |   |       |       |       |   |   |       |\n+   +   +   +---+   +   +   +---+   +---+   +---+   +   +---+---+\n|   |   |   |           |   |               |       |           |\n+   +   +   +   +---+---+   +---+---+---+   +   +---+---+       +\n|       |       |                       |   |                   |\n+---+---+---+---+---+   +---+       +---+   +   +---+   +       +\n|           |       |   |   |               |   |   |   |   |   |\n+   +---+   +   +---+   +   +   +---+---+---+   +   +---+---+---+\n|       |       |           |   |       |   |   |               |\n+---+   +---+---+   +---+   +   +   +   +   +   +   +---+---+   +\n|       |           |   |   |   |   |           |           |   |\n+   +---+   +---+---+   +---+   +   +---+       +---+       +   +\n|           |               |       |   |           |       |   |\n+   +---+   +   +---+   +---+---+   +   +           +---+   +   +\n|       |       |   |   |           |   |                   |   |\n+---+---+   +   +   +   +           +   +---+---+---+---+---+   +\n|           |       |   |       |   |           |       |       |\n+---+       +---+   +---+       +   +---+---+   +       +       +\n|           |                   |       |               |       |\n+---+   +---+---+---+   +---+   +   +   +   +---+   +---+       +\n|                       |   |       |   |   |   |               |\n+   +---+   +---+---+---+   +---+   +---+   +   +---+   +---+---+\n|       |                       |           |                   |\n+       +---+---+---+---+       +---+---+---+---+---+---+       +\n|                       |       |   |               |           |\n+       +---+   +   +---+       +   +---+---+---+   +   +---+---+\n|           |   |                   |               |           |\n+---+   +---+   +---+---+       +   +---+   +   +   +   +---+   +\n|           |           |       |           |   |       |       |\n+---+---+---+---+---+---+---+---+---+---+---+---+---+---+---+---+";

        var lines = mazeString.replace(/[\r]+/g, "").split("\n");
        var dimensions = lines[0].split("x");
        var cols = parseInt(dimensions[0]);
        var rows = parseInt(dimensions[1]);

        var horizontalWalls = [];
        for (var row = 0; row < rows + 1; row++) {
            var line = lines[1 + 2 * row];
            for (var col = 2; col < line.length; col += 4)
                horizontalWalls.push(line[col] == "-" ? 1 : 0);
        }

        var verticalWalls = [];
        for (row = 0; row < rows; row++) {
            line = lines[2 + 2 * row];
            for (col = 0; col < line.length; col += 4)
                verticalWalls.push(line[col] == "|" ? 1 : 0);
        }

        var corners = [];
        for (var y = 0; y <= rows; y++) {
            for (var x = 0; x <= cols; x++) {
                var weight = 0;
                if (y > 0) weight += 1 * verticalWalls[(y - 1) * (cols + 1) + x];
                if (y < rows) weight += 4 * verticalWalls[y * (cols + 1) + x];
                if (x > 0) weight += 8 * horizontalWalls[y * cols + (x - 1)];
                if (x < cols) weight += 2 * horizontalWalls[y * cols + x];
                if (weight != 0) corners.push({ x: x, y: y, weight: weight });
            }
        }

        splashCtx.fillStyle = BACKGROUND_COLOR;
        splashCtx.fillRect(0, 0, splashCtx.canvas.width, splashCtx.canvas.height);

        for (var i = 0; i < corners.length; i++) {
            var sprite = wallSprites[corners[i].weight];
            var drawX = 100 * corners[i].x - 220 - 0.5 * sprite.width;
            var drawY = 100 * corners[i].y - 830 - 0.5 * sprite.height;
            if (drawX + sprite.width > 0 && drawX < splashCtx.canvas.width &&
                drawY + sprite.height > 0 && drawY < splashCtx.canvas.height)
                splashCtx.drawImage(sprite, drawX, drawY);
        }

        splashCtx.globalAlpha = 0.3;
        splashCtx.fillStyle = "#434647";
        splashCtx.fillRect(0, 0, splashCtx.canvas.width, splashCtx.canvas.height);
    }

    function resizeCanvas() {
        var panelWidth = $("#dataPanel").width();
        var gameCanvas = document.getElementById("gameCanvas");

        gameCanvas.width = (document.body.clientWidth - panelWidth) * window.devicePixelRatio;
        gameCanvas.height = document.body.clientHeight * window.devicePixelRatio;
        gameCanvas.style.width = document.body.clientWidth - panelWidth + "px";
        gameCanvas.style.height = document.body.clientHeight + "px";

        gameCanvas.getContext("2d").scale(window.devicePixelRatio, window.devicePixelRatio);
    }

    function beginClient(name, serverUrl) {
        playerName = name;
        canvas = document.getElementById("gameCanvas");
        ctx = canvas.getContext("2d");
        canvas.style = "position: fixed; left: 0px; top: 0px; display: inline;";

        resizeCanvas();
        $("#gameScreen").show();
        onmousemove = handleMouseMove;
        canvas.addEventListener("click", handleClick, false);
        canvas.addEventListener("mousedown", handleMouseDown, false);
        canvas.addEventListener("auxclick", function (e) {
            if (e.button === 1) e.preventDefault();
        }, false);
        window.addEventListener("resize", resizeCanvas);

        // === MOD: Key listeners for Ctrl + mod hotkeys ===
        window.addEventListener("keydown", function(e) {
            if (e.key === "Control") ctrlPressed = true;
            var k = e.key.toUpperCase();
            if (k === "S") { smartAimEnabled = !smartAimEnabled; updateModSwitch("smartaim", smartAimEnabled); }
            if (k === "C") { ctrlMoveEnabled = !ctrlMoveEnabled; updateModSwitch("ctrlmove", ctrlMoveEnabled); }
            if (k === "T") { trajectoryEnabled = !trajectoryEnabled; updateModSwitch("trajectory", trajectoryEnabled); }
            if (k === "M") { minimapEnabled = !minimapEnabled; updateModSwitch("minimap", minimapEnabled); }
            if (k === "D") { autoDodgeEnabled = !autoDodgeEnabled; updateModSwitch("autododge", autoDodgeEnabled); }
            if (k === "K") { autoKillEnabled = !autoKillEnabled; updateModSwitch("autokill", autoKillEnabled); }
            if (k === "P") {
                pathfindEnabled = !pathfindEnabled;
                if (!pathfindEnabled) clearPathfindTarget();
                updateModSwitch("pathfind", pathfindEnabled);
            }
            if (k === "R") { autoRespawnEnabled = !autoRespawnEnabled; updateModSwitch("autorespawn", autoRespawnEnabled); }
        });
        window.addEventListener("keyup", function(e) {
            if (e.key === "Control") ctrlPressed = false;
        });

        // === MOD: Create mod toggle panel ===
        createModPanel();
        initBulletCacheWorker();

        tanks = [];
        tanks.push(new Tank(50, 50));
        bullets = [];
        nextBulletId = -1;

        socket = new SocketWrapper(new WebSocket(serverUrl), onConnected);
        hasJoined = false;

        socket.on("JOIN_SUCCESS", onJoinSuccess);
        socket.on(networkProtocol.newStateFromServer, onNewTankState);
        socket.on(networkProtocol.syncBullets, onSyncBullets);
        socket.on("leaderBoardInfo", onLeaderBoardInfo);
        socket.on("updateTankList", onUpdateTankList);
        socket.on("tankKilled", onTankKilled);
        socket.on("playerSpawned", onPlayerSpawned);

        socket.on("NEW_BULLET_LIMIT", function (newLimit) {
            if (newLimit > maxBullets) {
                var gained = newLimit - maxBullets;
                if (gained > 1)
                    graphicsObjects.push(new PopUpNotification("You gained +" + gained + " balls!"));
                else
                    graphicsObjects.push(new PopUpNotification("You gained +" + gained + " ball!"));
            }
            maxBullets = newLimit;
        });

        socket.on("EXP", function (exp) {
            addEXP(exp);
        });

        document.getElementById("startScreen").style.display = "none";

        tickNum = 0;
        movementInputBuffer = [];
        shootInputBuffer = [];
        true;

        requestAnimationFrame(gameLoop);
        setInterval(physicsStep, constants.PHYSICS_INTERVAL);
    }

    function onConnected() {
        var cookieName = "session_token";
        var cookieParts = ("; " + document.cookie).split("; " + cookieName + "=");
        var sessionCookie = cookieParts.length == 2 ? cookieParts.pop().split(";").shift() : null;

        socket.send("joinGame", {
            name: playerName,
            sessionCookie: sessionCookie,
        });
        console.log("Connected");
    }

    function onJoinSuccess(data) {
        tanks[0].ID = data.newID;
        tanks[0].name = data.name;
        tanks[0].setSkin(data.colourIndex);
        hasJoined = true;

        maze.cellsAcross = data.cellsAcross;
        maze.cellsDown = data.cellsDown;
        maze.verticalWalls = data.verticalWalls;
        maze.horisontalWalls = data.horisontalWalls;
        maze.wallCorners = data.wallCorners;
        maze.worldWidth = 100 * maze.cellsAcross;
        maze.worldHeight = 100 * maze.cellsDown;

        for (var row = 0; row <= maze.cellsDown; row++) {
            for (var col = 0; col <= maze.cellsAcross; col++) {
                var weight = 0;
                if (row > 0) weight += 1 * maze.verticalWalls[(row - 1) * (maze.cellsAcross + 1) + col];
                if (row < maze.cellsDown) weight += 4 * maze.verticalWalls[row * (maze.cellsAcross + 1) + col];
                if (col > 0) weight += 8 * maze.horisontalWalls[row * maze.cellsAcross + (col - 1)];
                if (col < maze.cellsAcross) weight += 2 * maze.horisontalWalls[row * maze.cellsAcross + col];
                if (weight != 0) wallCornerSprites.push({ x: col, y: row, weight: weight });
            }
        }
    }

    function askToSpawn() {
        console.log("Respawning...");
        socket.send("spawnPlayer");
        $("#gameScreen").show();

        var gameCanvas = document.getElementById("gameCanvas");
        gameCanvas.style.display = "inline";
        ctx.globalAlpha = 1;

        var deathScreen = document.getElementById("deathScreen");
        deathScreen.style.display = "none";
        true;
    }

    function onBulletFired(shotTick) {
        bulletsSpawnedCount++;
        lastShotTick = shotTick;
    }

    function applyMovementInputs(deltaTime, inputs) {
        for (var i = 0; i < inputs.length; i++) {
            var input = inputs[i];

            if (input.moveForward)
                tanks[0].moveTowards(
                    tanks[0].x + input.targetX,
                    tanks[0].y + input.targetY,
                    maze,
                    deltaTime,
                );
            else
                tanks[0].lookAt(
                    tanks[0].x + input.targetX,
                    tanks[0].y + input.targetY,
                    maze,
                );

            for (var j = 1; j < tanks.length; j++) {
                if (Math.abs(tanks[j].x - tanks[j].latestX) > 70 || Math.abs(tanks[j].y - tanks[j].latestY) > 70) {
                    tanks[j].x = tanks[j].latestX;
                    tanks[j].y = tanks[j].latestY;
                    tanks[j].angle = tanks[j].latestAngle;
                } else {
                    tanks[j].x = tanks[j].x + 0.4 * (tanks[j].latestX - tanks[j].x);
                    tanks[j].y = tanks[j].y + 0.4 * (tanks[j].latestY - tanks[j].y);
                    tanks[j].angle = collision.angleLerp(tanks[j].angle, tanks[j].latestAngle, 0.3);
                }
            }
        }
    }

    function applyShootInputs(deltaTime, inputs) {
        var localTank = tanks[0];
        var bulletSpeed = constants.TANK_MAX_SPEED * 1.2;
        for (var i = 0; i < inputs.length; i++) {
            var currentTick;

            if (inputs[i].mouseClicked) {
                currentTick = inputs[i].tickNum;
                if (!localTank.beenHit && bulletsSpawnedCount < maxBullets && currentTick - lastShotTick > 2) {
                    var angle = localTank.angle;
                    var cosA = Math.cos(angle);
                    var sinA = Math.sin(angle);
                    var spawnX = localTank.x + 40 * cosA;
                    var spawnY = localTank.y + 40 * sinA;

                    if (physics.canBulletBeSpawned(localTank, spawnX, spawnY, maze)) {
                        var dirX = cosA;
                        var dirY = sinA;
                        var magnitude = Math.sqrt(dirX * dirX + dirY * dirY);
                        var bulletVelX = (dirX / magnitude) * bulletSpeed;
                        var bulletVelY = (dirY / magnitude) * bulletSpeed;
                        var newBullet = new Bullet(nextBulletId, spawnX, spawnY, bulletVelX, bulletVelY);
                        var now = Date.now();
                        newBullet.fireTime = now;
                        newBullet.ignoreForDodgeUntil = now + 450;
                        nextBulletId--;
                        bullets.push(newBullet);
                        onBulletFired(inputs[i].tickNum);
                    }
                }
            }

            for (var j = 0; j < bullets.length; j++)
                bullets[j].update(maze, deltaTime);
        }
    }

    function onLeaderBoardInfo(data) {
        leaderBoard = data.leaderBoard;
        data.longestReigns;

        for (var i = 0; i < tanks.length; i++) {
            for (var j = 0; j < data.playerScores.length; j++) {
                if (tanks[i].ID == data.playerScores[j].id) {
                    tanks[i].score = data.playerScores[j].score;
                    tanks[i].leaderBoardPos = data.playerScores[j].leaderBoardPos;
                }
            }
        }

        for (i = 0; i < leaderBoard.length; i++) {
            if (leaderBoard[i].id == tanks[0].ID) leaderBoard[i].isplayer = true;
        }

        setLeaderboard(leaderBoard);
        kingID = data.kingID;
        kingStartTime = data.kingStartTime;
    }

    function onSyncBullets(buffer) {
        var state = networkProtocol.binaryToBulletState(buffer);
        var serverBullets = state.bullets;
        var matchFlags = new Array(bullets.length).fill(0);

        for (var i = 0; i < serverBullets.length; i++) {
            var found = false;
            for (var j = 0; j < bullets.length; j++) {
                if (bullets[j].id == serverBullets[i].id) {
                    bullets[j].x = serverBullets[i].x;
                    bullets[j].y = serverBullets[i].y;
                    bullets[j].xVel = serverBullets[i].xVel;
                    bullets[j].yVel = serverBullets[i].yVel;
                    found = true;
                    matchFlags[j] = 1;
                    break;
                }
            }
            if (!found) {
                var newBullet = new Bullet(
                    serverBullets[i].id, serverBullets[i].x, serverBullets[i].y,
                    serverBullets[i].xVel, serverBullets[i].yVel
                );
                newBullet.fireTime = Date.now();
                bullets.push(newBullet);
            }
        }

        for (i = matchFlags.length - 1; i >= 0; i--) {
            if (matchFlags[i] == 0) bullets.splice(i, 1);
        }

        bulletsSpawnedCount = state.bulletsSpawnedCount;

        for (i = 0; i < shootInputBuffer.length; i++) {
            if (shootInputBuffer[i].tickNum >= state.tickNum) {
                shootInputBuffer.splice(0, i);
                break;
            }
        }
        applyShootInputs(constants.PHYSICS_INTERVAL, shootInputBuffer);
    }

    function onUpdateTankList(serverTankList) {
        var matchFlags = new Array(tanks.length).fill(0);

        for (var i = 0; i < serverTankList.length; i++) {
            var found = false;
            for (var j = 0; j < tanks.length; j++) {
                if (tanks[j].ID == serverTankList[i].id) {
                    found = true;
                    matchFlags[j] = 1;
                    break;
                }
            }
            if (!found) {
                var newTank = new Tank(0, 0);
                newTank.ID = serverTankList[i].id;
                newTank.name = serverTankList[i].name;
                newTank.setSkin(serverTankList[i].colourIndex);
                newTank.beenHit = serverTankList[i].beenHit;
                newTank.justJoined = true;
                tanks.push(newTank);
            }
        }

        for (i = matchFlags.length - 1; i >= 0; i--) {
            if (matchFlags[i] == 0) tanks.splice(i, 1);
        }
    }

    function onNewTankState(buffer) {
        var state = networkProtocol.binaryToTankState(buffer);

        for (var i = 0; i < tanks.length; i++) {
            for (var j = 0; j < state.tanks.length; j++) {
                if (tanks[i].ID == state.tanks[j].id) {
                    if (i == 0 || tanks[i].justJoined) {
                        tanks[i].x = state.tanks[j].x;
                        tanks[i].y = state.tanks[j].y;
                        tanks[i].angle = state.tanks[j].angle;
                        tanks[i].latestX = tanks[i].x;
                        tanks[i].latestY = tanks[i].y;
                        tanks[i].latestAngle = tanks[i].angle;
                        tanks[i].justJoined = false;
                    } else {
                        tanks[i].latestX = state.tanks[j].x;
                        tanks[i].latestY = state.tanks[j].y;
                        tanks[i].latestAngle = state.tanks[j].angle;
                    }

                    tanks[i].isKing = kingID == tanks[i].ID;
                    break;
                }
            }
        }

        for (j = 0; j < movementInputBuffer.length; j++) {
            if (movementInputBuffer[j].tickNum >= state.tickNum) {
                movementInputBuffer.splice(0, j);
                break;
            }
        }
        applyMovementInputs(constants.PHYSICS_INTERVAL, movementInputBuffer);
    }

    function handleMouseMove(event) {
        mouseX = event.clientX;
        mouseY = event.clientY;
    }

    function handleClick(event) {
        mouseClicked = true;
    }

    function handleMouseDown(event) {
        if (event.button !== 1) return;
        event.preventDefault();
        if (!hasJoined || !pathfindEnabled || !maze.cellsAcross) return;
        var targetX = event.clientX + camera.camLeft;
        var targetY = event.clientY + camera.camTop;
        setPathfindTarget(targetX, targetY);
    }

    function onPlayerSpawned(data) {
        var tankID = data.tankID;
        var spawnX = data.x;
        var spawnY = data.y;

        for (var i = 0; i < tanks.length; i++) {
            if (tanks[i].ID == tankID) {
                tanks[i].beenHit = false;
                tanks[i].x = tanks[i].latestX = spawnX;
                tanks[i].y = tanks[i].latestY = spawnY;
            }
        }
    }

    function onTankKilled(killedID) {
        for (var i = 0; i < tanks.length; i++) {
            if (tanks[i].ID == killedID) tanks[i].beenHit = true;
        }

        if (killedID == tanks[0].ID) {
            if (autoRespawnEnabled) {
                askToSpawn()
                return;
            }

            (function showDeathScreen() {
                false;
                console.log("Showing death screen");

                var startScreen = document.getElementById("startScreen");
                startScreen.style.display = "none";

                var deathScreen = document.getElementById("deathScreen");
                deathScreen.style.display = "block";

                setTimeout(function () {
                    $("#gameScreen").fadeOut(1000, function () {
                        fadeFinishedCallback();
                    });
                }, 400);

                triggerDeathTrackingEvent();
                showDeathScreenCallback();
            })();
        }
    }

    var fadeSnapshot,
        fadeAlpha = 1,
        fadeCanvas = false,
        isFading = false;

    exports.destroyGraphicsObject = function (obj) {
        var index = graphicsObjects.indexOf(obj);
        graphicsObjects.splice(index, 1);
    };

    var lastFrameTime,
        BACKGROUND_COLOR = "#f0f0f0",
        isFirstFrame = true,
        introAlpha = 1,
        introTimer = 0;

    function renderFrame(timestamp) {
        if (isFirstFrame) {
            lastFrameTime = timestamp;
            isFirstFrame = false;
        }

        var deltaTime = timestamp - lastFrameTime;
        lastFrameTime = timestamp;

        camera.camLeft = tanks[0].x - 0.5 * canvas.clientWidth;
        camera.camTop = tanks[0].y - 0.5 * canvas.clientHeight;

        ctx.fillStyle = BACKGROUND_COLOR;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Draw wall tiles
        var dpr = window.devicePixelRatio || 1;
        var camLeft = camera.camLeft;
        var camTop = camera.camTop;
        var canvasWidth = canvas.width;
        var canvasHeight = canvas.height;
        for (var i = 0; i < wallCornerSprites.length; i++) {
            var sprite = wallSprites[wallCornerSprites[i].weight];
            var spriteW = sprite.width / dpr;
            var spriteH = sprite.height / dpr;
            var drawX = Math.floor(100 * wallCornerSprites[i].x - camLeft - 0.5 * spriteW);
            var drawY = Math.floor(100 * wallCornerSprites[i].y - camTop - 0.5 * spriteH);

            if (drawX + spriteW > 0 && drawX < canvasWidth && drawY + spriteH > 0 && drawY < canvasHeight)
                ctx.drawImage(sprite, drawX, drawY, spriteW, spriteH);
        }

        // === MOD: Draw smart aim preview path ===
        if (smartAimEnabled) drawSmartAimPreview(ctx, camera);

        // === MOD: Draw dodge path ===
        if (autoDodgeEnabled && _dodgeActive) drawDodgePath(ctx, camera);

        // === MOD: Draw pathfinder path ===
        if (pathfindEnabled) drawPathfindPath(ctx, camera);

        // === MOD: Draw bullet trajectory predictions ===
        if (trajectoryEnabled) drawBulletPredictions(ctx, camera, maze);

        // === MOD: Draw top auto-kill candidate paths ===
        if (autoKillEnabled) drawAutoKillRankedPaths(ctx, camera);

        // Draw bullets
        for (i = 0; i < bullets.length; i++) bullets[i].draw(ctx, camera);

        // Sort tanks
        var sortedTanks = tanks.slice().sort(function (a, b) {
            if (a.model.showingExplosion) return 1;
            if (b.model.showingExplosion || a.model.showingScorch) return -1;
            if (b.model.showingScorch) return 1;
            return 0;
        });

        for (i = 0; i < sortedTanks.length; i++) {
            if (!sortedTanks[i].justJoined) sortedTanks[i].draw(ctx, camera);
        }

        // Intro overlay
        if (introAlpha > 0) {
            ctx.globalAlpha = introAlpha;
            ctx.fillStyle = "rgba(240,240,240,0.8)";
            ctx.strokeStyle = "#f0f0f0";
            ctx.fillRect(0.5 * (canvas.clientWidth - 700), 0.5 * canvas.clientHeight - 100 - 120, 700, 160);

            ctx.fillStyle = "#fbac00";
            ctx.textAlign = "center";
            ctx.font = "40px Fredoka One";
            ctx.fillText("King of the Hill!", 0.5 * canvas.clientWidth, 0.5 * canvas.clientHeight - 40 - 120);

            ctx.font = "900 22px Nunito";
            ctx.fillStyle = "#737373";
            ctx.fillText("Stay at the top of the leaderboard for as long as possible", 0.5 * canvas.clientWidth, 0.5 * canvas.clientHeight - 120);
            ctx.fillText("(Click to shoot)", 0.5 * canvas.clientWidth, 0.5 * canvas.clientHeight + 30 - 120);

            ctx.textAlign = "start";
            if (introTimer > 4) introAlpha -= deltaTime / 3000;
            introTimer += deltaTime / 1000;
            ctx.globalAlpha = 1;
        }

        // King indicator
        var kingDuration = 0;
        if (kingID != -1) {
            kingDuration = new Date().getTime() - kingStartTime;

            var kingPos = { x: 0, y: 0 };
            for (i = 0; i < tanks.length; i++) {
                if (tanks[i].ID == kingID) {
                    kingPos.x = tanks[i].x;
                    kingPos.y = tanks[i].y;
                    tanks[i].name;
                }
            }

            var diffX = kingPos.x - tanks[0].x;
            var diffY = kingPos.y - tanks[0].y;
            var offScreenX = Math.abs(diffX) > 0.5 * canvas.clientWidth - 20;
            var offScreenY = Math.abs(diffY) > 0.5 * canvas.clientHeight - 20;

            if (tanks[0].isKing || (!offScreenX && !offScreenY)) {
                if (tanks[0].isKing) {
                    ctx.textAlign = "center";
                    ctx.font = "28px Fredoka One";
                    ctx.strokeStyle = "white";
                    ctx.lineWidth = 4;
                    ctx.strokeText("You are King!", 0.5 * canvas.clientWidth, 0.9 * canvas.clientHeight - 30 + 2);
                    ctx.strokeText("You are King!", 0.5 * canvas.clientWidth, 0.9 * canvas.clientHeight - 30);
                    ctx.fillStyle = "#e75800";
                    ctx.fillText("You are King!", 0.5 * canvas.clientWidth, 0.9 * canvas.clientHeight - 30 + 2);
                    ctx.fillStyle = "#fbac00";
                    ctx.fillText("You are King!", 0.5 * canvas.clientWidth, 0.9 * canvas.clientHeight - 30);

                    ctx.fillStyle = "#324965";
                    ctx.font = "900 22px Nunito";
                    var timerDate = new Date(null);
                    timerDate.setMilliseconds(kingDuration);
                    var timeString = timerDate.toISOString().substr(14, 8);

                    ctx.strokeStyle = "white";
                    ctx.lineWidth = 4;
                    ctx.lineJoin = "round";
                    ctx.strokeText("Time as King: " + timeString, 0.5 * canvas.clientWidth, 0.9 * canvas.clientHeight);
                    ctx.fillText("Time as King: " + timeString, 0.5 * canvas.clientWidth, 0.9 * canvas.clientHeight);
                    ctx.textAlign = "start";
                }
            } else {
                var arrowAngle = Math.atan2(diffY, diffX);
                var arrowCos = Math.cos(arrowAngle);
                var arrowSin = Math.sin(arrowAngle);
                var arrowX = diffX + 0.5 * canvas.clientWidth;
                var arrowY = diffY + 0.5 * canvas.clientHeight;

                if (offScreenX)
                    arrowX = diffX < 0 ? 20 - 10 * arrowCos : canvas.clientWidth - 20 - 10 * arrowCos;
                if (offScreenY)
                    arrowY = diffY < 0 ? 20 - 10 * arrowSin : canvas.clientHeight - 20 - 10 * arrowSin;

                ctx.save();
                ctx.translate(arrowX, arrowY);
                ctx.fillStyle = "#ffbb00";
                ctx.font = "30px Anton";
                ctx.fillText("\uD83D\uDC51", -20 - 40 * arrowCos, 40 * -arrowSin);
                ctx.rotate(arrowAngle + 0.5 * Math.PI);
                ctx.beginPath();
                ctx.moveTo(0, -10);
                ctx.lineTo(8, 10);
                ctx.lineTo(-8, 10);
                ctx.closePath();
                ctx.fillStyle = "#ffbb00";
                ctx.strokeStyle = "#733415";
                ctx.lineWidth = 2;
                ctx.lineJoin = "round";
                ctx.shadowBlur = 5;
                ctx.shadowColor = "rgba(0, 0, 0, 0.4)";
                ctx.fill();
                ctx.stroke();
                ctx.shadowBlur = 0;
                ctx.restore();
            }
        }

        // Ammo counter
        ctx.fillStyle = "rgba(0,0,0,0.8)";
        ctx.font = "900 12px Nunito";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";

        var tankAngle = tanks[0].angle;
        var tankCos = Math.cos(tankAngle);
        var tankSin = Math.sin(tankAngle);
        var ammoX = 0.5 * canvas.clientWidth + -32 * tankCos;
        var ammoY = 0.5 * canvas.clientHeight + -32 * tankSin;

        ctx.beginPath();
        ctx.arc(ammoX - 7, ammoY, 3, 0, 2 * Math.PI);
        ctx.fill();
        ctx.fillText("" + (maxBullets - bulletsSpawnedCount), ammoX + 7, ammoY);
        ctx.textAlign = "start";
        ctx.textBaseline = "alphabetic";

        // Popup notifications
        for (i = 0; i < graphicsObjects.length; i++)
            graphicsObjects[i].draw(ctx, camera, deltaTime);

        // === MOD: Minimap ===
        if (minimapEnabled) drawMinimap(ctx, maze, tanks, tanks[0]);

        // === MOD: "No valid shot" indicator ===
        if (smartAimEnabled && !smartAimValid) {
            ctx.save();
            ctx.font = "bold 14px monospace";
            ctx.fillStyle = "rgba(255, 60, 60, 0.8)";
            ctx.textAlign = "center";
            ctx.fillText("No safe shot", 0.5 * canvas.clientWidth, canvas.clientHeight - 30);
            ctx.restore();
        }

        // Death fade
        if (isFading) {
            (function applyFade(dt) {
                fadeSnapshot.drawImage(canvas, 0, 0);
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                ctx.globalAlpha = fadeAlpha;
                ctx.drawImage(fadeCanvas, 0, 0);
                fadeAlpha -= dt / 1000;
                if (fadeAlpha <= 0) {
                    document.getElementById("gameCanvas").style.display = "none";
                    isFading = false;
                    fadeFinishedCallback();
                }
            })(deltaTime);
        }
    }

    function physicsStep() {
        var dt = constants.PHYSICS_INTERVAL;

        if (hasJoined) {

            // === MOD: Update cached bullet paths for dodge + trajectory drawing ===
            updateBulletPathCache(maze);

            (function gatherAndSendInput() {
                mouseToTankX = mouseX + camera.camLeft - tanks[0].x;
                mouseToTankY = mouseY + camera.camTop - tanks[0].y;

                // === MOD: Mouse world position for smart aim ===
                mouseWorldX = mouseX + camera.camLeft;
                mouseWorldY = mouseY + camera.camTop;

                // === MOD: Only move when Ctrl is pressed (if enabled) ===
                isMoving = ctrlMoveEnabled ? ctrlPressed : !(Math.abs(mouseToTankX) < 60 && Math.abs(mouseToTankY) < 60);

                // === MOD: Auto-dodge has first priority over smart aim ===
                _dodgeActive = false;
                if (autoDodgeEnabled && maze.cellsAcross) {
                    var dodgeResult = findDodgeAction(tanks[0].x, tanks[0].y, maze);
                    if (dodgeResult) {
                        _dodgeActive = true;
                        _dodgeAngle = dodgeResult.angle;
                        isMoving = true;
                        // Bullet threats take priority: cancel current pathfind run.
                        clearPathfindTarget();
                    }
                }

                // === MOD: Pathfind movement (disabled while dodging) ===
                _pathfindActive = false;
                if (!_dodgeActive && pathfindEnabled && _pathfindPath.length > 0 && tickNum >= _pathfindPauseUntilTick) {
                    if (_pathfindTarget && tickNum >= _pathfindRecalcTick) {
                        var checkIdx = _pathfindIndex;
                        if (checkIdx >= _pathfindPath.length) checkIdx = _pathfindPath.length - 1;
                        var checkWp = checkIdx >= 0 ? _pathfindPath[checkIdx] : null;
                        if (checkWp && isPointUnderBulletThreat(checkWp.x, checkWp.y, 90, 38)) {
                            setPathfindTarget(_pathfindTarget.x, _pathfindTarget.y);
                        }
                        _pathfindRecalcTick = tickNum + 4;
                    }

                    while (_pathfindIndex < _pathfindPath.length) {
                        var wp = _pathfindPath[_pathfindIndex];
                        var wdx = wp.x - tanks[0].x;
                        var wdy = wp.y - tanks[0].y;
                        if (wdx * wdx + wdy * wdy <= 24 * 24) {
                            _pathfindIndex++;
                        } else {
                            break;
                        }
                    }

                    if (_pathfindIndex >= _pathfindPath.length) {
                        clearPathfindTarget();
                    } else {
                        var nextWp = _pathfindPath[_pathfindIndex];
                        if (!isPointUnderBulletThreat(nextWp.x, nextWp.y, 70, 36)) {
                            _pathfindAngle = Math.atan2(nextWp.y - tanks[0].y, nextWp.x - tanks[0].x);
                            _pathfindActive = true;
                            isMoving = true;
                        }
                    }
                }

                // === MOD: Smart aim is disabled while actively dodging ===
                var aimAngle;
                if (_dodgeActive) {
                    aimAngle = _dodgeAngle;
                } else if (_pathfindActive) {
                    aimAngle = _pathfindAngle;
                } else if (maze.cellsAcross) {
                    aimAngle = findSmartAimAngle(tanks[0].x, tanks[0].y, mouseWorldX, mouseWorldY, maze);
                } else {
                    aimAngle = Math.atan2(mouseToTankY, mouseToTankX);
                }

                var autoKillShot = null;
                if (autoKillEnabled && !_dodgeActive && maze.cellsAcross) {
                    var preferredTargetIds = null;
                    var avoidTargetIds = null;
                    var allowAutoKill = true;

                    if (allowAutoKill) {
                        autoKillShot = autoKillMod.findAutoKillShot({
                            localTank: tanks[0],
                            tanks: tanks,
                            maze: maze,
                            constants: constants,
                            physics: physics,
                            simulateBulletPath: smartAimMod.simulateBulletPath,
                            activeBulletPaths: _cachedBulletPaths,
                            bulletsSpawnedCount: bulletsSpawnedCount,
                            maxBullets: maxBullets,
                            tickNum: tickNum,
                            lastShotTick: lastShotTick,
                            preferredTargetIds: preferredTargetIds,
                            avoidTargetIds: avoidTargetIds,
                        });
                    }
                    if (autoKillShot) {
                        aimAngle = autoKillShot.angle;
                    }
                }
                var autoKillAiming = !!autoKillShot;

                // === MOD: Block shooting only when smart aim is active and invalid ===
                var effectiveClick = mouseClicked;
                if (!_dodgeActive && !_pathfindActive && smartAimEnabled && !smartAimValid && !autoKillShot) effectiveClick = false;
                if (autoKillShot) {
                    // Only fire once the local barrel is aligned with autokill angle.
                    var aligned = shortestAngleDiff(tanks[0].angle, autoKillShot.angle) < 0.14;
                    effectiveClick = aligned;
                    if (aligned && pathfindEnabled) {
                        // Briefly pause path following after a shot so aim/firing can complete cleanly.
                        _pathfindPauseUntilTick = tickNum + 6;
                        _pathfindActive = false;
                    }
                }

                // === MOD: When moving with ctrl and not shooting, use direct mouse angle ===
                var directAngle = Math.atan2(mouseToTankY, mouseToTankX);
                var sendAngle = _dodgeActive ? _dodgeAngle : (autoKillAiming ? aimAngle : (_pathfindActive ? _pathfindAngle : aimAngle));
                if (!_dodgeActive && !_pathfindActive && isMoving && !effectiveClick && !autoKillAiming) {
                    sendAngle = directAngle;
                }

                var networkInput = {
                    targetAngle: sendAngle,
                    moveForward: isMoving,
                    mouseClicked: effectiveClick,
                    tickNum: tickNum,
                };

                var moveTargetX = Math.cos(sendAngle) * 100;
                var moveTargetY = Math.sin(sendAngle) * 100;

                var movementInput = {
                    targetX: moveTargetX,
                    targetY: moveTargetY,
                    moveForward: (_dodgeActive || _pathfindActive) ? true : isMoving,
                    tickNum: tickNum,
                };

                var shootInput = {
                    mouseClicked: effectiveClick,
                    tickNum: tickNum,
                };

                var binaryData = networkProtocol.userInputToBinaryData(networkInput);
                socket.sendBinary(networkProtocol.tankInputToServer, binaryData);
                movementInputBuffer.push(movementInput);
                shootInputBuffer.push(shootInput);
                tickNum++;
            })();

            var latestMove = movementInputBuffer.length > 0 ? movementInputBuffer[movementInputBuffer.length - 1] : null;

            applyMovementInputs(dt, [{
                targetX: latestMove ? latestMove.targetX : mouseToTankX,
                targetY: latestMove ? latestMove.targetY : mouseToTankY,
                moveForward: latestMove ? latestMove.moveForward : isMoving,
            }]);

            applyShootInputs(dt, [{
                mouseClicked: (shootInputBuffer.length > 0 ? shootInputBuffer[shootInputBuffer.length - 1].mouseClicked : mouseClicked),
                tickNum: tickNum - 1,
            }]);
        }

        mouseClicked = false;
    }

    var hasShownDisconnect = false;

    function gameLoop(timestamp) {
        renderFrame(timestamp);

        if (movementInputBuffer.length > 1500 && !hasShownDisconnect) {
            alert("Unable to reconnect to the server, you are being redirected to the homepage.");
            window.location.href = "/";
            hasShownDisconnect = true;
        }

        requestAnimationFrame(gameLoop);
    }

    var wallSprites = spriteGenerator.generateWallSpriteSheet(
        BACKGROUND_COLOR,
        window.devicePixelRatio || 1,
    );

    exports.drawSplashScreen = drawSplashScreen;
    exports.beginClient = beginClient;
    exports.askToSpawn = askToSpawn;
    t.exports.drawSplashScreen = drawSplashScreen;
    t.exports.beginClient = beginClient;
    t.exports.askToSpawn = askToSpawn;
}).call(this, a(21));

}
]);
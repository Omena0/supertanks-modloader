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
        a((a.s = 15))
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

    tank.xVel = Math.cos(tank.angle) * tank.maxSpeed;
    tank.yVel = Math.sin(tank.angle) * tank.maxSpeed;
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
var BaseSkin = a(7);
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
var BaseSkin = a(7);
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
var defaultSkin = a(8);
a(9);

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
var tankModel = a(10)(0.18, window.devicePixelRatio || 1);

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
var GraphicsObject = a(12);

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
        spriteGenerator = a(5);

    var canvas,
        ctx,
        Bullet = a(6),
        Tank = a(11),
        PopUpNotification =
            (a(12),
                a(13).PopUpNotification);

    console.log("Running game...");
    console.log("V 2.0");

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

    function drawSplashScreen(splashCtx) {
        var mazeString =
            "16x16\n+---+---+---+---+---+---+---+---+---+---+---+---+---+---+---+---+\n|           |                   |           |               |   |\n+---+---+   +   +---+   +---+   +---+   +   +   +---+   +   +   +\n|   |       |       |   |       |       |       |   |   |       |\n+   +   +   +---+   +   +   +---+   +---+   +---+   +   +---+---+\n|   |   |   |           |   |               |       |           |\n+   +   +   +   +---+---+   +---+---+---+   +   +---+---+       +\n|       |       |                       |   |                   |\n+---+---+---+---+---+   +---+       +---+   +   +---+   +       +\n|           |       |   |   |               |   |   |   |   |   |\n+   +---+   +   +---+   +   +   +---+---+---+   +   +---+---+---+\n|       |       |           |   |       |   |   |               |\n+---+   +---+---+   +---+   +   +   +   +   +   +   +---+---+   +\n|       |           |   |   |   |   |           |           |   |\n+   +---+   +---+---+   +---+   +   +---+       +---+       +   +\n|           |               |       |   |           |       |   |\n+   +---+   +   +---+   +---+---+   +   +           +---+   +   +\n|       |       |   |   |           |   |                   |   |\n+---+---+   +   +   +   +           +   +---+---+---+---+---+   +\n|           |       |   |       |   |           |       |       |\n+---+       +---+   +---+       +   +---+---+   +       +       +\n|           |                   |       |               |       |\n+---+   +---+---+---+   +---+   +   +   +   +---+   +---+       +\n|                       |   |       |   |   |   |               |\n+   +---+   +---+---+---+   +---+   +---+   +   +---+   +---+---+\n|       |                       |           |                   |\n+       +---+---+---+---+       +---+---+---+---+---+---+       +\n|                       |       |   |               |           |\n+       +---+   +   +---+       +   +---+---+---+   +   +---+---+\n|           |   |                   |               |           |\n+---+   +---+   +---+---+       +   +---+   +   +   +   +---+   +\n|           |           |       |           |   |       |       |\n+---+---+---+---+---+---+---+---+---+---+---+---+---+---+---+---+";

        var lines = mazeString.replace(/[\r]+/g, "").split("\n");
        var dimensions = lines[0].split("x");
        var cols = parseInt(dimensions[0]);
        var rows = parseInt(dimensions[1]);

        // Parse horizontal walls
        var horizontalWalls = [];
        for (var row = 0; row < rows + 1; row++) {
            var line = lines[1 + 2 * row];
            for (var col = 2; col < line.length; col += 4)
                horizontalWalls.push(line[col] == "-" ? 1 : 0);
        }

        // Parse vertical walls
        var verticalWalls = [];
        for (row = 0; row < rows; row++) {
            line = lines[2 + 2 * row];
            for (col = 0; col < line.length; col += 4)
                verticalWalls.push(line[col] == "|" ? 1 : 0);
        }

        // Calculate wall corner weights for sprite selection
        var corners = [];
        for (var y = 0; y <= rows; y++) {
            for (var x = 0; x <= cols; x++) {
                var weight = 0;
                if (y > 0)
                    weight += 1 * verticalWalls[(y - 1) * (cols + 1) + x];
                if (y < rows) weight += 4 * verticalWalls[y * (cols + 1) + x];
                if (x > 0) weight += 8 * horizontalWalls[y * cols + (x - 1)];
                if (x < cols) weight += 2 * horizontalWalls[y * cols + x];
                if (weight != 0) corners.push({ x: x, y: y, weight: weight });
            }
        }

        // Draw background
        splashCtx.fillStyle = BACKGROUND_COLOR;
        splashCtx.fillRect(
            0,
            0,
            splashCtx.canvas.width,
            splashCtx.canvas.height,
        );

        // Draw wall tiles
        for (var i = 0; i < corners.length; i++) {
            var sprite = wallSprites[corners[i].weight];
            var drawX = 100 * corners[i].x - 220 - 0.5 * sprite.width;
            var drawY = 100 * corners[i].y - 830 - 0.5 * sprite.height;
            if (
                drawX + sprite.width > 0 &&
                drawX < splashCtx.canvas.width &&
                drawY + sprite.height > 0 &&
                drawY < splashCtx.canvas.height
            )
                splashCtx.drawImage(sprite, drawX, drawY);
        }

        // Draw darkening overlay
        splashCtx.globalAlpha = 0.3;
        splashCtx.fillStyle = "#434647";
        splashCtx.fillRect(
            0,
            0,
            splashCtx.canvas.width,
            splashCtx.canvas.height,
        );
    }

    function resizeCanvas() {
        var panelWidth = $("#dataPanel").width();
        var gameCanvas = document.getElementById("gameCanvas");

        gameCanvas.width =
            (document.body.clientWidth - panelWidth) * window.devicePixelRatio;
        gameCanvas.height =
            document.body.clientHeight * window.devicePixelRatio;
        gameCanvas.style.width = document.body.clientWidth - panelWidth + "px";
        gameCanvas.style.height = document.body.clientHeight + "px";

        gameCanvas
            .getContext("2d")
            .scale(window.devicePixelRatio, window.devicePixelRatio);
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
        window.addEventListener("resize", resizeCanvas);

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
                    graphicsObjects.push(
                        new PopUpNotification(
                            "You gained +" + gained + " balls!",
                        ),
                    );
                else
                    graphicsObjects.push(
                        new PopUpNotification(
                            "You gained +" + gained + " ball!",
                        ),
                    );
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
        var cookieParts = ("; " + document.cookie).split(
            "; " + cookieName + "=",
        );
        var sessionCookie =
            cookieParts.length == 2
                ? cookieParts.pop().split(";").shift()
                : null;

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

        // Build wall corner sprites for rendering
        for (var row = 0; row <= maze.cellsDown; row++) {
            for (var col = 0; col <= maze.cellsAcross; col++) {
                var weight = 0;
                if (row > 0)
                    weight +=
                        1 *
                        maze.verticalWalls[
                        (row - 1) * (maze.cellsAcross + 1) + col
                        ];
                if (row < maze.cellsDown)
                    weight +=
                        4 *
                        maze.verticalWalls[row * (maze.cellsAcross + 1) + col];
                if (col > 0)
                    weight +=
                        8 *
                        maze.horisontalWalls[
                        row * maze.cellsAcross + (col - 1)
                        ];
                if (col < maze.cellsAcross)
                    weight +=
                        2 * maze.horisontalWalls[row * maze.cellsAcross + col];
                if (weight != 0)
                    wallCornerSprites.push({ x: col, y: row, weight: weight });
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

            // Apply local player movement
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

            // Interpolate remote tanks
            for (var j = 1; j < tanks.length; j++) {
                if (
                    Math.abs(tanks[j].x - tanks[j].latestX) > 70 ||
                    Math.abs(tanks[j].y - tanks[j].latestY) > 70
                ) {
                    tanks[j].x = tanks[j].latestX;
                    tanks[j].y = tanks[j].latestY;
                    tanks[j].angle = tanks[j].latestAngle;
                } else {
                    tanks[j].x =
                        tanks[j].x + 0.4 * (tanks[j].latestX - tanks[j].x);
                    tanks[j].y =
                        tanks[j].y + 0.4 * (tanks[j].latestY - tanks[j].y);
                    tanks[j].angle = collision.angleLerp(
                        tanks[j].angle,
                        tanks[j].latestAngle,
                        0.3,
                    );
                }
            }
        }
    }

    function applyShootInputs(deltaTime, inputs) {
        for (var i = 0; i < inputs.length; i++) {
            var currentTick;

            if (inputs[i].mouseClicked) {
                currentTick = inputs[i].tickNum;
                if (
                    !tanks[0].beenHit &&
                    bulletsSpawnedCount < maxBullets &&
                    currentTick - lastShotTick > 2
                ) {
                    var spawnX = tanks[0].x + 40 * Math.cos(tanks[0].angle);
                    var spawnY = tanks[0].y + 40 * Math.sin(tanks[0].angle);

                    if (
                        physics.canBulletBeSpawned(
                            tanks[0],
                            spawnX,
                            spawnY,
                            maze,
                        )
                    ) {
                        var dirX = Math.cos(tanks[0].angle);
                        var dirY = Math.sin(tanks[0].angle);
                        var magnitude = Math.sqrt(dirX * dirX + dirY * dirY);
                        var bulletVelX =
                            (dirX / magnitude) * constants.TANK_MAX_SPEED * 1.2;
                        var bulletVelY =
                            (dirY / magnitude) * constants.TANK_MAX_SPEED * 1.2;
                        var newBullet = new Bullet(
                            nextBulletId,
                            spawnX,
                            spawnY,
                            bulletVelX,
                            bulletVelY,
                        );
                        nextBulletId--;
                        bullets.push(newBullet);
                        onBulletFired(inputs[i].tickNum);
                    }
                }
            }

            // Update all bullets
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
                    tanks[i].leaderBoardPos =
                        data.playerScores[j].leaderBoardPos;
                }
            }
        }

        for (i = 0; i < leaderBoard.length; i++) {
            if (leaderBoard[i].id == tanks[0].ID)
                leaderBoard[i].isplayer = true;
        }

        setLeaderboard(leaderBoard);
        kingID = data.kingID;
        kingStartTime = data.kingStartTime;
    }

    function onSyncBullets(buffer) {
        var state = networkProtocol.binaryToBulletState(buffer);
        var serverBullets = state.bullets;
        var matchFlags = new Array(bullets.length).fill(0);

        // Sync bullet positions with server state
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
                    serverBullets[i].id,
                    serverBullets[i].x,
                    serverBullets[i].y,
                    serverBullets[i].xVel,
                    serverBullets[i].yVel,
                );
                bullets.push(newBullet);
            }
        }

        // Remove bullets not present on server
        for (i = matchFlags.length - 1; i >= 0; i--) {
            if (matchFlags[i] == 0) bullets.splice(i, 1);
        }

        bulletsSpawnedCount = state.bulletsSpawnedCount;

        // Replay buffered shoot inputs after the server tick
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

        // Remove tanks not in server list
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
                        // Local player or just-joined: snap to server position
                        tanks[i].x = state.tanks[j].x;
                        tanks[i].y = state.tanks[j].y;
                        tanks[i].angle = state.tanks[j].angle;
                        tanks[i].latestX = tanks[i].x;
                        tanks[i].latestY = tanks[i].y;
                        tanks[i].latestAngle = tanks[i].angle;
                        tanks[i].justJoined = false;
                    } else {
                        // Remote: store target for interpolation
                        tanks[i].latestX = state.tanks[j].x;
                        tanks[i].latestY = state.tanks[j].y;
                        tanks[i].latestAngle = state.tanks[j].angle;
                    }

                    tanks[i].isKing = kingID == tanks[i].ID;
                    break;
                }
            }
        }

        // Replay buffered movement inputs after the server tick
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

        // Update camera to follow a sensible tank (prefer lowest ID)
        var followTank = null;
        if (tanks && tanks.length) {
            for (var fi = 0; fi < tanks.length; fi++) {
                var tc = tanks[fi];
                if (!tc || tc.ID == null) continue;
                if (!followTank || tc.ID < followTank.ID) followTank = tc;
            }
        }
        if (followTank && typeof followTank.x === 'number' && typeof followTank.y === 'number') {
            camera.camLeft = followTank.x - 0.5 * canvas.clientWidth;
            camera.camTop = followTank.y - 0.5 * canvas.clientHeight;
        }

        // Clear screen
        ctx.fillStyle = BACKGROUND_COLOR;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Draw wall tiles
        for (var i = 0; i < wallCornerSprites.length; i++) {
            var sprite = wallSprites[wallCornerSprites[i].weight];
            var dpr = window.devicePixelRatio || 1;
            var spriteW = sprite.width / dpr;
            var spriteH = sprite.height / dpr;
            var drawX = Math.floor(
                100 * wallCornerSprites[i].x - camera.camLeft - 0.5 * spriteW,
            );
            var drawY = Math.floor(
                100 * wallCornerSprites[i].y - camera.camTop - 0.5 * spriteH,
            );

            if (
                drawX + spriteW > 0 &&
                drawX < canvas.width &&
                drawY + spriteH > 0 &&
                drawY < canvas.height
            )
                ctx.drawImage(sprite, drawX, drawY, spriteW, spriteH);
        }

        // Draw bullets
        for (i = 0; i < bullets.length; i++) bullets[i].draw(ctx, camera);

        // Sort tanks: explosions on top, scorch marks behind
        var sortedTanks = tanks.slice().sort(function (a, b) {
            if (a.model.showingExplosion) return 1;
            if (b.model.showingExplosion || a.model.showingScorch) return -1;
            if (b.model.showingScorch) return 1;
            return 0;
        });

        for (i = 0; i < sortedTanks.length; i++) {
            if (!sortedTanks[i].justJoined) sortedTanks[i].draw(ctx, camera);
        }

        // Draw intro overlay
        if (introAlpha > 0) {
            ctx.globalAlpha = introAlpha;
            ctx.fillStyle = "rgba(240,240,240,0.8)";
            ctx.strokeStyle = "#f0f0f0";
            ctx.fillRect(
                0.5 * (canvas.clientWidth - 700),
                0.5 * canvas.clientHeight - 100 - 120,
                700,
                160,
            );

            ctx.fillStyle = "#fbac00";
            ctx.textAlign = "center";
            ctx.font = "40px Fredoka One";
            ctx.fillText(
                "King of the Hill!",
                0.5 * canvas.clientWidth,
                0.5 * canvas.clientHeight - 40 - 120,
            );

            ctx.font = "900 22px Nunito";
            ctx.fillStyle = "#737373";
            ctx.fillText(
                "Stay at the top of the leaderboard for as long as possible",
                0.5 * canvas.clientWidth,
                0.5 * canvas.clientHeight - 120,
            );
            ctx.fillText(
                "(Click to shoot)",
                0.5 * canvas.clientWidth,
                0.5 * canvas.clientHeight + 30 - 120,
            );

            ctx.textAlign = "start";
            if (introTimer > 4) introAlpha -= deltaTime / 3000;
            introTimer += deltaTime / 1000;
            ctx.globalAlpha = 1;
        }

        // Draw king indicator
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
                    // "You are King!" text
                    ctx.textAlign = "center";
                    ctx.font = "28px Fredoka One";
                    ctx.strokeStyle = "white";
                    ctx.lineWidth = 4;
                    ctx.strokeText(
                        "You are King!",
                        0.5 * canvas.clientWidth,
                        0.9 * canvas.clientHeight - 30 + 2,
                    );
                    ctx.strokeText(
                        "You are King!",
                        0.5 * canvas.clientWidth,
                        0.9 * canvas.clientHeight - 30,
                    );
                    ctx.fillStyle = "#e75800";
                    ctx.fillText(
                        "You are King!",
                        0.5 * canvas.clientWidth,
                        0.9 * canvas.clientHeight - 30 + 2,
                    );
                    ctx.fillStyle = "#fbac00";
                    ctx.fillText(
                        "You are King!",
                        0.5 * canvas.clientWidth,
                        0.9 * canvas.clientHeight - 30,
                    );

                    // Timer display
                    ctx.fillStyle = "#324965";
                    ctx.font = "900 22px Nunito";
                    var timerDate = new Date(null);
                    timerDate.setMilliseconds(kingDuration);
                    var timeString = timerDate.toISOString().substr(14, 8);

                    ctx.strokeStyle = "white";
                    ctx.lineWidth = 4;
                    ctx.lineJoin = "round";
                    ctx.strokeText(
                        "Time as King: " + timeString,
                        0.5 * canvas.clientWidth,
                        0.9 * canvas.clientHeight,
                    );
                    ctx.fillText(
                        "Time as King: " + timeString,
                        0.5 * canvas.clientWidth,
                        0.9 * canvas.clientHeight,
                    );
                    ctx.textAlign = "start";
                }
            } else {
                // Draw off-screen king arrow indicator
                var arrowAngle = Math.atan2(diffY, diffX);
                var arrowX = diffX + 0.5 * canvas.clientWidth;
                var arrowY = diffY + 0.5 * canvas.clientHeight;

                if (offScreenX)
                    arrowX =
                        diffX < 0
                            ? 20 - 10 * Math.cos(arrowAngle)
                            : canvas.clientWidth -
                            20 -
                            10 * Math.cos(arrowAngle);
                if (offScreenY)
                    arrowY =
                        diffY < 0
                            ? 20 - 10 * Math.sin(arrowAngle)
                            : canvas.clientHeight -
                            20 -
                            10 * Math.sin(arrowAngle);

                ctx.save();
                ctx.translate(arrowX, arrowY);
                ctx.fillStyle = "#ffbb00";
                ctx.font = "30px Anton";
                ctx.fillText(
                    "\uD83D\uDC51",
                    -20 - 40 * Math.cos(arrowAngle),
                    40 * -Math.sin(arrowAngle),
                );
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

        // Draw ammo counter behind the tank
        ctx.fillStyle = "rgba(0,0,0,0.8)";
        ctx.font = "900 12px Nunito";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";

        var ammoX = 0.5 * canvas.clientWidth + -32 * Math.cos(tanks[0].angle);
        var ammoY = 0.5 * canvas.clientHeight + -32 * Math.sin(tanks[0].angle);

        ctx.beginPath();
        ctx.arc(ammoX - 7, ammoY, 3, 0, 2 * Math.PI);
        ctx.fill();
        ctx.fillText("" + (maxBullets - bulletsSpawnedCount), ammoX + 7, ammoY);
        ctx.textAlign = "start";
        ctx.textBaseline = "alphabetic";

        // Draw popup notifications
        for (i = 0; i < graphicsObjects.length; i++)
            graphicsObjects[i].draw(ctx, camera, deltaTime);

        // Handle fade effect on death
        if (isFading) {
            (function applyFade(dt) {
                fadeSnapshot.drawImage(canvas, 0, 0);
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                ctx.globalAlpha = fadeAlpha;
                ctx.drawImage(fadeCanvas, 0, 0);
                fadeAlpha -= dt / 1000;
                if (fadeAlpha <= 0) {
                    document.getElementById("gameCanvas").style.display =
                        "none";
                    isFading = false;
                    fadeFinishedCallback();
                }
            })(deltaTime);
        }
    }

    function physicsStep() {
        var dt = constants.PHYSICS_INTERVAL;

        if (hasJoined) {
            // Gather input
            (function gatherAndSendInput() {
                mouseToTankX = mouseX + camera.camLeft - tanks[0].x;
                mouseToTankY = mouseY + camera.camTop - tanks[0].y;
                isMoving = true;
                if (Math.abs(mouseToTankX) < 60 && Math.abs(mouseToTankY) < 60)
                    isMoving = false;

                var networkInput = {
                    targetAngle: Math.atan2(mouseToTankY, mouseToTankX),
                    moveForward: isMoving,
                    mouseClicked: mouseClicked,
                    tickNum: tickNum,
                };

                var movementInput = {
                    targetX: mouseToTankX,
                    targetY: mouseToTankY,
                    moveForward: isMoving,
                    tickNum: tickNum,
                };

                var shootInput = {
                    mouseClicked: mouseClicked,
                    tickNum: tickNum,
                };

                var binaryData =
                    networkProtocol.userInputToBinaryData(networkInput);
                socket.sendBinary(
                    networkProtocol.tankInputToServer,
                    binaryData,
                );
                movementInputBuffer.push(movementInput);
                shootInputBuffer.push(shootInput);
                tickNum++;
            })();

            // Apply immediate prediction
            var shootInput = {
                mouseClicked: mouseClicked,
                tickNum: tickNum - 1,
            };

            applyMovementInputs(dt, [
                {
                    targetX: mouseToTankX,
                    targetY: mouseToTankY,
                    moveForward: isMoving,
                },
            ]);
            applyShootInputs(dt, [shootInput]);
        }

        mouseClicked = false;
    }

    var hasShownDisconnect = false;

    function gameLoop(timestamp) {
        renderFrame(timestamp);

        if (movementInputBuffer.length > 1500 && !hasShownDisconnect) {
            alert(
                "Unable to reconnect to the server, you are being redirected to the homepage.",
            );
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
}).call(this, a(14));

}
]);
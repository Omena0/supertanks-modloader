var constants = require("./constants");
var collision = require("./collision");

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

module.exports.tankMoveTowards = function (
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

module.exports.tankLookAtPoint = function (tank, targetX, targetY, maze) {
    rotateTankTowards(tank, targetX, targetY);
    resolveTankWallCollisions(tank, maze);
};

module.exports.canBulletBeSpawned = function (tank, bulletX, bulletY, maze) {
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

module.exports.updateBulletsPosition = function (bullet, maze, deltaTime) {
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

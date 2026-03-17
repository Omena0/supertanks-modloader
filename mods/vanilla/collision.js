function sideOfLine(p1, p2, p3) {
    return (p2.x - p1.x) * (p3.y - p1.y) - (p3.x - p1.x) * (p2.y - p1.y) <= 0
        ? -1
        : 1;
}

module.exports.angleLerp = function (from, to, t) {
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

module.exports.line_intersect = function (x1, y1, x2, y2, x3, y3, x4, y4) {
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

module.exports.doPointsSpanLine = function (
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

module.exports.checkOBBCircleIntersection = function (
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

module.exports.checkAndResolveOBBAABB = function (
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

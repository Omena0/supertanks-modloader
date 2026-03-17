var constants = require('./constants');

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

module.exports.skins = constants.TANK_COLOURS;

module.exports.generateWallSpriteSheet = function (bgColor, dpr) {
  var sprites = [0];
  var scale = dpr;
  for (var type = 1; type <= 15; type++)
    sprites.push(generateWallTile(type, scale, bgColor));
  return sprites;
};

module.exports.generateExplosionSpriteSheet = function (spriteSize, frameCount) {
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

module.exports.generateScorchSprite = function (size) {
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

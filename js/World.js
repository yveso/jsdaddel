function World(viewportWidth, viewportHeight) {
  this.tilemap = new Image();
  this.tilemap.src = "textures/iso-64x64-outside.png";
  this.cam = new Camera(viewportWidth, viewportHeight)
  this.map = sampleMap();

  var cellWidth = 64;
  var cellHeight = 32;

  var mouseCell = { x: 0, y: 0 }

  this.update = function (mouseX, mouseY, pressedKeys) {
      if (pressedKeys[37]) {//left
        if (this.cam.x > 0)this.cam.x--;
      }
      if (pressedKeys[38]) {//up
        if (this.cam.y > 0) this.cam.y--;
      }
      if (pressedKeys[39]) {//right
        if (this.cam.x < this.map.rows[1].cols.length * cellWidth) this.cam.x++;
      }
      if (pressedKeys[40]) {//down
        this.cam.y++;
      }
  }

  this.draw = function (context) {
    var verOffset = 16;

    for (var r = 0; r < this.map.rows.length; r++) {
      var row = this.map.rows[r];
      var horOffset = r % 2 === 0 ? 0 : 32;
      for (var c = 0; c < row.cols.length; c++) {
        var cell = row.cols[c];


        var drawX = (c * cellWidth + horOffset) - this.cam.x;
        var drawY = (r * (cellHeight - verOffset)) - this.cam.y;

        if (drawX > -cellWidth && drawX < context.canvas.width
            && drawY > -cellHeight && drawY < context.canvas.height) {
          context.drawImage(this.tilemap,
            cell.baseTextureX, cell.baseTextureY,
            cellWidth, cellHeight,
            drawX, drawY,
            cellWidth, cellHeight
          );
        }
      }
    }
    context.fillStyle = "rgba(255, 255, 255, 0.5)";
    context.fillRect(mouseCell.x, mouseCell.y, cellWidth, cellHeight)
  }
}

function Camera(width, height) {
  this.x = 0;
  this.y = 0;
  this.width = width;
  this.height = height;
}

function Cell(baseTexturePoint) {
  this.baseTextureX = baseTexturePoint.x;
  this.baseTextureY = baseTexturePoint.y;
  this.width = 64; //...
  this.height = 32;
}

var baseTileCutter = function (row, col) {
  var offsetY = 32;
  var width = 64;
  var height = 32;

  return { x: col * width, y: row * (height + offsetY) + offsetY };
}

var seaTile = function () {
  return { x: 256, y: 544 };
}

var sampleMap = function () {
  var map = {};
  map.rows = [];

  for (var r = 0; r < 50; r++) {
    map.rows[r] = {}
    map.rows[r].cols = []
    if (r < 10 || r > 15) {
      for (var i = 0; i < 30; i++) {
        map.rows[r].cols.push(new Cell(baseTileCutter(r % 3, r % 3)));
      }
    } else {
      for (var i = 0; i < 30; i++) {
        if (i < 5 || i > 17) {
          map.rows[r].cols.push(new Cell(baseTileCutter(r % 3, r % 3)));
        } else {
          map.rows[r].cols.push(new Cell(seaTile()));
        }
      }
    }
  }

  return map;
}
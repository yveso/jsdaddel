function World(viewportWidth, viewportHeight) {
  this.tilemap = new Image();
  this.tilemap.src = "textures/iso-64x64-outside.png";
  this.cam = new Camera(viewportWidth, viewportHeight)
  this.map = sampleMap();

  var cellWidth = 64;
  var cellHeight = 32;

  this.update = function (kbState) {
    if (kbState[32]) {
      alert("yay");
    }
  }

  this.draw = function (context) {
    var firstX = Math.floor(this.cam.x / cellWidth);
    var firstY = Math.floor(this.cam.y / cellHeight);
    var countAcross = Math.min(Math.floor(this.cam.width / cellWidth) + 1, this.map.rows[0].cols.length - firstX);
    var countDown = Math.min(Math.floor(2 * this.cam.height / cellHeight) + 1, this.map.rows.length - firstY);

    var verOffset = 16;
    for (var i = firstX; i < countDown; i++) {
      var row = this.map.rows[i];
      var horOffset = i % 2 === 0 ? 0 : 32;
      for (var j = firstX; j < countAcross; j++) {
        var cell = row.cols[j];
        context.drawImage(this.tilemap,
          cell.baseTextureX, cell.baseTextureY,
          cellWidth, cellHeight,
          j * cellWidth + horOffset, i * (cellHeight - verOffset),
          cellWidth, cellHeight);
      }
    }
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
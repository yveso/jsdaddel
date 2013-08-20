function World(viewportWidth, viewportHeight) {
  this.tilemap = new Image();
  this.tilemap.src = "textures/iso-64x64-outside.png";
  this.cam = new Camera(viewportWidth, viewportHeight)
  this.map = sampleMap();

  var drawnMap = {};

  var cellWidth = 64;
  var cellHeight = 32;

  var mouseCell = {};

  this.update = function (mouseX, mouseY, pressedKeys) {
    var scrollFactor = 4;
    if (pressedKeys[37]) {//left
      if (this.cam.x > 0) this.cam.x -= scrollFactor;
    }
    if (pressedKeys[38]) {//up
      if (this.cam.y > 0) this.cam.y -= scrollFactor;
    }
    if (pressedKeys[39]) {//right
      if (this.cam.x + viewportWidth < (this.map.rows[1].cols.length + 0.5) * cellWidth)
        this.cam.x += scrollFactor;
    }
    if (pressedKeys[40]) {//down
      if (this.cam.y + viewportHeight < this.map.rows.length * (cellHeight / 2) + (cellHeight / 2))
        this.cam.y += scrollFactor;
    }
    
    if (drawnMap.evenRows && mouseX && mouseY) {
      var cursorCell = getCellFromScreenPoint(mouseX, mouseY);
      if (cursorCell) { mouseCell = { x: cursorCell.x, y: cursorCell.y }; }
    }
  }

  this.draw = function (context) {
    drawnMap = {};
    drawnMap.evenRows = [];
    drawnMap.oddRows = [];

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

          cell.drawBase(this.tilemap, context, drawX, drawY);

          if (r % 2 == 0) {
            drawnMap.evenRows[r] = drawnMap.evenRows[r] || [];
            drawnMap.evenRows[r][c] = { x: drawX, y: drawY };
          } else {
            drawnMap.oddRows[r] = drawnMap.oddRows[r] || [];
            drawnMap.oddRows[r][c] = { x: drawX, y: drawY };
          }
        }
      }
    }
    if (mouseCell) {
      context.fillStyle = "rgba(255, 255, 255, 0.2)";
      context.beginPath();
      context.moveTo(mouseCell.x, mouseCell.y + cellHeight / 2);
      context.lineTo(mouseCell.x + cellWidth / 2, mouseCell.y);
      context.lineTo(mouseCell.x + cellWidth, mouseCell.y + cellHeight / 2);
      context.lineTo(mouseCell.x + cellWidth / 2, mouseCell.y + cellHeight);
      context.closePath();
      context.fill();
      context.stroke();
    }
  }

  var nearerCell = function (cellOne, cellTwo, x, y) {
    var midOne = getMiddleOfCell(cellOne);
    var midTwo = getMiddleOfCell(cellTwo);
    var distOne = Math.sqrt(Math.pow(x - midOne.x, 2) + Math.pow(y - midOne.y, 2));
    var distTwo = Math.sqrt(Math.pow(x - midTwo.x, 2) + Math.pow(y - midTwo.y, 2));

    return distOne < distTwo ? cellOne : cellTwo;
  }

  var getMiddleOfCell = function (cell) {
    return { x: cell.x + (cellWidth * 0.5), y: cell.y + (cellHeight / 2) };
  }

  var getCellFromScreenPoint = function (screenX, screenY) {
    var candidateEven = getCellFromOne(drawnMap.evenRows, screenX, screenY);
    var candidateOdd = getCellFromOne(drawnMap.oddRows, screenX, screenY);

    if (candidateEven && !candidateOdd) {
      return candidateEven;
    } else if (!candidateEven && candidateOdd) {
      return candidateOdd;
    } else if (candidateEven && candidateOdd) {
      var cell = nearerCell(candidateEven, candidateOdd, screenX, screenY);
      return cell;
    }
  }

  var getCellFromOne = function (one, screenX, screenY) {
    var candidateRow = 0;
    var candidateCell;

    for (var r in one) {
      var horValue = one[r][one[r].length - 1].y;
      if (horValue < screenY) {
        candidateRow = r;
      } else {
        for (var c in one[candidateRow]) {
          var currentCell = one[candidateRow][c];
          if (currentCell.x < screenX) {
            candidateCell = currentCell;
          } else {
            break;
          }
        }
        break;
      }
    }

    return candidateCell;
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

  this.drawBase = function (tilemap, context, x, y) {
    context.drawImage(
      tilemap,
      this.baseTextureX, this.baseTextureY,
      this.width, this.height,
      x, y,
      this.width, this.height);
  }
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

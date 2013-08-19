function World(viewportWidth, viewportHeight) {
  this.tilemap = new Image();
  this.tilemap.src = "textures/iso-64x64-outside.png";
  this.cam = new Camera(viewportWidth, viewportHeight)
  this.map = sampleMap();

  var drawnMapEvenRows = [];
  var drawnMapOddRows = [];

  var cellWidth = 64;
  var cellHeight = 32;

  var mouseCell = {};//{ x: 0, y: 0 }

  this.update = function (mouseX, mouseY, pressedKeys) {
    var scrollFactor = 4;
    if (pressedKeys[37]) {//left
      if (this.cam.x > 0) this.cam.x -= scrollFactor;
    }
    if (pressedKeys[38]) {//up
      if (this.cam.y > 0) this.cam.y -= scrollFactor;
    }
    //TODO: Overflows
    if (pressedKeys[39]) {//right
      if (this.cam.x + viewportWidth < (this.map.rows[1].cols.length + 0.5) * cellWidth)
        this.cam.x += scrollFactor;
    }
    if (pressedKeys[40]) {//down
      if (this.cam.y + viewportHeight < this.map.rows.length * (cellHeight / 2) + (cellHeight / 2))
        this.cam.y += scrollFactor;
    }

    //Rewrite this...
    if (mouseX && mouseY) {
      var goodRowEven = 0, goodCellEven;
      for (var i in drawnMapEvenRows) {
        var firstCol = drawnMapEvenRows[i][drawnMapEvenRows[i].length - 1]; //l-1 should always be defined
        if (firstCol.y <= mouseY) {
          goodRowEven = i;
        } else {
          break;
        }
      }
      for (var i in drawnMapEvenRows[goodRowEven]) {
        var cell = drawnMapEvenRows[goodRowEven][i];
        if (cell.x < mouseX) {
          goodCellEven = cell;
        } else {
          break;
        }
      }

      var goodRowOdd = 0, goodCellOdd;
      for (var i in drawnMapOddRows) {
        var firstCol = drawnMapOddRows[i][drawnMapOddRows[i].length - 1];
        if (firstCol.y <= mouseY) {
          goodRowOdd = i;
        } else {
          break;
        }
      }
      for (var i in drawnMapOddRows[goodRowOdd]) {
        var cell = drawnMapOddRows[goodRowOdd][i];
        if (cell.x < mouseX) {
          goodCellOdd = cell;
        } else {
          break;
        }
      }
      var goodCell;
      if (goodCellEven && !goodCellOdd) {
        goodCell = goodCellEven;
      } else if (!goodCellEven && goodCellOdd) {
        goodCell = goodCellOdd;
      } else if (goodCellEven && goodCellOdd) {
        goodCell = this.nearerCell(goodCellEven, goodCellOdd, mouseX, mouseY);
      }


      if (goodCell) { mouseCell = { x: goodCell.x, y: goodCell.y }; }
    }
  }

  this.draw = function (context) {
    drawnMapEvenRows = [];
    drawnMapOddRows = [];

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
          if (r % 2 == 0) {
            drawnMapEvenRows[r] = drawnMapEvenRows[r] || [];
            drawnMapEvenRows[r][c] = { x: drawX, y: drawY };
          } else {
            drawnMapOddRows[r] = drawnMapOddRows[r] || [];
            drawnMapOddRows[r][c] = { x: drawX, y: drawY };
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

  this.nearerCell = function (cellOne, cellTwo, x, y) {
    var midOne = getMiddleOfCell(cellOne);
    var midTwo = getMiddleOfCell(cellTwo);
    var distOne = Math.sqrt(Math.pow(x - midOne.x, 2) + Math.pow(y - midOne.y, 2));
    var distTwo = Math.sqrt(Math.pow(x - midTwo.x, 2) + Math.pow(y - midTwo.y, 2));

    return distOne < distTwo ? cellOne : cellTwo;
  }

  var getMiddleOfCell = function (cell) {
    return { x: cell.x + (cellWidth * 0.5), y: cell.y + (cellHeight / 2) };
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
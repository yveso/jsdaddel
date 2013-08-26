function World(camera) {
  this.tilemap = new Image();
  this.tilemap.src = "textures/iso-64x64-outside.png";
  this.cam = camera;
  this.map = sampleMap();

  var drawnMap = [];

  var cellWidth = 64;
  var cellHeight = 32;

  var mouseCell = {};
  var lastMouseX, lastMouseY;

  var scrollbars = new Scrollbars(
    document.getElementById("horScrollbar").getContext("2d"),
    document.getElementById("verScrollbar").getContext("2d"),
    (this.map.rows[0].cols.length + 0.5) * cellWidth,
    this.map.rows.length * (cellHeight / 2) + (cellHeight / 2))

  this.update = function (mouseX, mouseY, pressedKeys) {
    var scrollFactor = 4;
    var scrollingActive = false;
    if (pressedKeys[37] && this.cam.x > 0) {//left
      this.cam.x -= scrollFactor;
      scrollingActive = true;
    }
    if (pressedKeys[38] && this.cam.y > 0) {//up
      this.cam.y -= scrollFactor;
      scrollingActive = true;
    }
    if (pressedKeys[39] && this.cam.x + this.cam.width < (this.map.rows[1].cols.length + 0.5) * cellWidth) {//right
      this.cam.x += scrollFactor;
      scrollingActive = true;
    }
    if (pressedKeys[40] && this.cam.y + this.cam.height < this.map.rows.length * (cellHeight / 2) + (cellHeight / 2)) {//down
      this.cam.y += scrollFactor;
      scrollingActive = true;
    }

    drawnMap = [];
    var verOffset = cellHeight / 2;

    for (var r = 0; r < this.map.rows.length; r++) {
      var row = this.map.rows[r];
      var horOffset = r % 2 === 0 ? 0 : (cellWidth / 2);
      for (var c = 0; c < row.cols.length; c++) {
        var cell = row.cols[c];

        var drawX = (c * cellWidth + horOffset) - this.cam.x;
        var drawY = (r * (cellHeight - verOffset)) - this.cam.y;

        if (drawX > -cellWidth && drawX < this.cam.width
            && drawY > -cellHeight && drawY < this.cam.height) {
          drawnMap[r] = drawnMap[r] || [];
          drawnMap[r][c] = { x: drawX, y: drawY };
        }
      }
    }

    if (mouseX != lastMouseX || mouseY != lastMouseY || scrollingActive) {
      var cursorCell = getCellFromScreenPoint(mouseX, mouseY);
      if (cursorCell) { mouseCell = { x: cursorCell.x, y: cursorCell.y }; }
    }
    lastMouseX = mouseX;
    lastMouseY = mouseY;

    if (scrollingActive) {
      scrollbars.update(this.cam);
    }
  }

  this.draw = function (context) {
    for (var r in drawnMap) {
      for (var c in drawnMap[r]) {
        var coordinates = drawnMap[r][c];
        var cell = this.map.rows[r].cols[c];
        cell.drawBase(this.tilemap, context, coordinates.x, coordinates.y);
      }
    }

    drawMouseCell(context);

    for (var r in drawnMap) {
      for (var c in drawnMap[r]) {
        var coordinates = drawnMap[r][c];
        var cell = this.map.rows[r].cols[c];
        cell.drawHigher(this.tilemap, context, coordinates.x, coordinates.y);
      }
    }

    scrollbars.draw();
  }

  var nearerCell = function (cellOne, cellTwo, x, y) {
    var midOne = getMiddleOfCell(cellOne);
    var midTwo = getMiddleOfCell(cellTwo);
    var distOne = Math.sqrt(Math.pow(x - midOne.x, 2) + Math.pow(y - midOne.y, 2));
    var distTwo = Math.sqrt(Math.pow(x - midTwo.x, 2) + Math.pow(y - midTwo.y, 2));

    return distOne < distTwo ? cellOne : cellTwo;
  }

  var getMiddleOfCell = function (cell) {
    return { x: cell.x + (cellWidth * 0.5), y: cell.y + (cellHeight * 0.5) };
  }

  var getCellFromScreenPoint = function (screenX, screenY) {
    var evenRows = [], oddRows = [];
    for (var i in drawnMap) {
      (i % 2 === 0 ? evenRows : oddRows).push(drawnMap[i]);
    }

    var candidateEven = getCellFromOne(evenRows, screenX, screenY);
    var candidateOdd = getCellFromOne(oddRows, screenX, screenY);

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

  var drawMouseCell = function (context) {
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
}

function Camera(width, height) {
  this.x = 0;
  this.y = 0;
  this.width = width;
  this.height = height;
}

function Cell(baseTextureOrigin) {
  this.baseTextureOrigin = baseTextureOrigin;
  this.baseTextureOriginEnhanced;
  this.width = 64; 
  this.height = 32;
  this.toppingTexture;
  this.heightItems;

  this.addTopping = function (toppingData) {
    this.toppingTexture = toppingData;
  }

  this.addHeightItem = function (hItem) {
    this.heightItems = this.heightItems || [];
    this.heightItems.push(hItem);
  }

  this.drawBase = function (tilemap, context, x, y) {
    context.drawImage(
      tilemap,
      this.baseTextureOrigin.x, this.baseTextureOrigin.y,
      this.width, this.height,
      x, y,
      this.width, this.height);
    if (this.baseTextureOriginEnhanced) {
      context.drawImage(
        tilemap,
        this.baseTextureOriginEnhanced.x, this.baseTextureOriginEnhanced.y,
        this.width, this.height,
        x, y,
        this.width, this.height);
    }
  }

  this.drawHigher = function (tilemap, context, x, y) {
    if (this.heightItems) {
      //var drawX = x;
      var drawY = y;
      
      for (var i in this.heightItems) {
        var item = this.heightItems[i];
        context.drawImage(
          tilemap,
          item.x, item.y,
          this.width, this.height * 2,
          x, drawY - this.height,
          this.width, this.height * 2);
        drawY -= this.height
      }
    }

    if (this.toppingTexture) {
      context.drawImage(
        tilemap,
        this.toppingTexture.x, this.toppingTexture.y,
        this.toppingTexture.width, this.toppingTexture.height,
        x - (this.toppingTexture.width - this.width), y - (this.toppingTexture.height - this.height),
        this.toppingTexture.width, this.toppingTexture.height);
    }
  } 
}

function Scrollbars(contextHor, contextVer, mapWidth, mapHeight) {
  this.horBarWidth;
  this.horPos;

  this.verBarHeight;
  this.verPos;

  this.update = function (camera) {
    var horRatio = camera.width / mapWidth;
    this.horBarWidth = horRatio * contextHor.canvas.width;
    this.horPos = (camera.x / mapWidth) * contextHor.canvas.width;

    var verRatio = camera.height / mapHeight;
    this.verBarHeight = verRatio * contextVer.canvas.height;
    this.verPos = (camera.y / mapHeight) * contextVer.canvas.height;
    //console.log(verRatio, this.verBarHeight, this.verPos)
  };

  this.draw = function () {
    contextHor.canvas.width = contextHor.canvas.width;
    contextHor.fillRect(this.horPos, 0, this.horBarWidth, contextHor.canvas.height);

    contextVer.canvas.width = contextVer.canvas.width;
    contextVer.fillRect(0, this.verPos, contextVer.canvas.width, this.verBarHeight);
  }
}
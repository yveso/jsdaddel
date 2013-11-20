function Level() {
  this.map = Map.sampleMap();
  this.hero = new MoveableObject(1, 1);
  this.aStar = new AStar(this.map); 
}

Level.prototype.update = function (mouseX, mouseY, hasClicked) {
  if (hasClicked) {
    this.hero.moveTo({ x: mouseX, y: mouseY }, this.aStar);
  }
  
  this.hero.update();
}

Level.prototype.draw = function (context) {
  this.map.draw(context);
  this.hero.draw(context);
}

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function Map(width, height) {
  this.width = width;
  this.height = height;

  this.map = function (wdth, hght) {
    var map = { rows: [] };
    for (var r = 0; r < hght; r++) {
      map.rows[r] = { cols: [] };
      for (var c = 0; c < wdth; c++) {
        map.rows[r].cols.push(1);
      }
    }
    return map;
  } (width, height);
}

Map.prototype.setWalkableFactor = function (x, y, width, height, factor) {
  var verticalLimit = y + height < this.height ? y + height : this.height;
  var horizontalLimit = x + width < this.width ? x + width : this.width;
  for (var r = y; r < verticalLimit; r++) {
    for (var c = x; c < horizontalLimit; c++) {
      this.map.rows[r].cols[c] = factor;
    }
  }

  //temp
  if (factor === 0) {
    this.tmpNotWalkableAreas = this.tmpNotWalkableAreas || [];
    this.tmpNotWalkableAreas.push({ x: x, y: y, width: width, height: height });
  }
}

Map.prototype.draw = function (context) {
  context.fillStyle = "#FF0000";
  for (var i in this.tmpNotWalkableAreas) {
    var area = this.tmpNotWalkableAreas[i];
    context.fillRect(area.x, area.y, area.width, area.height);
  }
}

Map.prototype.isCoordinateInBounds = function (x, y) {
  return this.map.rows !== undefined
    && this.map.rows[y] !== undefined
    && this.map.rows[y].cols !== undefined
    && this.map.rows[y].cols[x] !== undefined;
}

Map.prototype.isCoordinateWalkable = function (x, y) {
  return this.isCoordinateInBounds(x, y)
    && this.map.rows[y].cols[x] !== 0;
}

Map.sampleMap = function () {
  var map = new Map(800, 600);
  map.setWalkableFactor(50, 30, 123, 67, 0);
  map.setWalkableFactor(0, 450, 400, 123, 0);
  map.setWalkableFactor(200, 80, 87, 267, 0);
  map.setWalkableFactor(323, 313, 373, 87, 0);
  map.setWalkableFactor(560, 60, 193, 227, 0);
  return map;
}

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function AStar(map) {
  this.map = map;

  this.findPath = function (from, to) {
    if (!this.map.isCoordinateWalkable(to.x, to.y)) {
      return [];
    }

    var closedList = [];
    var openList = [];
    openList.push({ x: from.x, y: from.y, g_value: 0, h_value: 0, path: [] });

    while (openList.length) {
      openList.sort(function (a, b) {
        return (a.g_value + a.h_value) - (b.g_value + b.h_value);
      });
      var current = openList.shift();

      if (current.x === to.x && current.y === to.y) {
        return current.path;
      }

      closedList.push(current);

      var possibleNeighbours = [
        { x: current.x - 1, y: current.y - 1, cost: 14 }
        , { x: current.x, y: current.y - 1, cost: 10 }
        , { x: current.x + 1, y: current.y - 1, cost: 14 }
        , { x: current.x - 1, y: current.y, cost: 10 }
        , { x: current.x + 1, y: current.y, cost: 10 }
        , { x: current.x - 1, y: current.y + 1, cost: 14 }
        , { x: current.x, y: current.y + 1, cost: 10 }
        , { x: current.x + 1, y: current.y + 1, cost: 14 }
      ];

      for (var i = 0; i < possibleNeighbours.length; i++) {
        var currNb = possibleNeighbours[i];

        if (this.map.isCoordinateWalkable(currNb.x, currNb.y)
            && !contains(closedList, currNb)) {

          var costs_g = current.g_value + currNb.cost;
          var costs_h = heuristic(currNb, to);
          var path = current.path.slice(0);
          path.push({ x: currNb.x, y: currNb.y })

          var indexInOpenList = indexOf(openList, currNb);
          if (indexInOpenList !== -1) {
            if (openList[indexInOpenList].g_value <= costs_g) {
              continue;
            } else {
              openList[indexInOpenList] = { x: currNb.x, y: currNb.y, g_value: costs_g, h_value: costs_h, path: path };
            }
          } else {
            openList.push({ x: currNb.x, y: currNb.y, g_value: costs_g, h_value: costs_h, path: path });
          }
        }
      }
    }
    return null;
  }

  var contains = function (array, point) {
    return indexOf(array, point) !== -1;
  }

  var indexOf = function (array, point) {
    if (array.length === 0) {
      return -1;
    }
    for (var i = 0; i < array.length; i++) {
      if (array[i].x === point.x && array[i].y === point.y) {
        return i;
      }
    }
    return -1;
  }

  var heuristic = function (from, to) {
    return Math.sqrt(Math.pow(from.x - to.x, 2) + Math.pow(from.y - to.y, 2)) * 40;
  }
}

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function MoveableObject(startX, startY) {
  this.x = startX;
  this.y = startY;  
  this.movingPath = [];
}

MoveableObject.prototype.draw = function (context) {
  context.fillStyle = "#00FF00";
  context.beginPath();
  context.arc(this.x, this.y, 4, 0, 2 * Math.PI, false);
  context.fill();
  context.closePath();
}

MoveableObject.prototype.moveTo = function (point, astar) {
  var path = astar.findPath({ x: this.x, y: this.y }, point);
  if (path) {    
    this.movingPath = path;
  } else {
    console.log("there is no path...")
  }
}

MoveableObject.prototype.update = function () {
  if (this.movingPath.length > 0) {
    var nextStep = this.movingPath.shift();
    this.x = nextStep.x;
    this.y = nextStep.y;
  }
}
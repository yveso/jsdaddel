var baseTileCutter = function (row, col) {
  var offsetY = 32;
  var width = 64;
  var height = 32;

  return { x: col * width, y: row * (height + offsetY) + offsetY };
}

var seaTile = function () {
  return { x: 256, y: 544 };
}

var grassTopping = function () {
  return { x: 0, y: 720, width: 64, height: 40 };
}

var treeTopping = function () {
  return { x: 128, y: 786, width: 64, height: 108 };
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
  map.rows[3].cols[3].addTopping(grassTopping());

  map.rows[20].cols[1].addTopping(treeTopping());

  return map;
}
function MapBuilder () {
  this.baseTileCutter = function (row, col) {
    var offsetY = 32;
    var width = 64;
    var height = 32;
    return { x: col * width, y: row * (height + offsetY) + offsetY };
  }

  this.seaTile = function () {
    return { x: 256, y: 544 };
  }

  this.grassTopping = function () {
    return { x: 0, y: 720, width: 64, height: 40 };
  }

  this.treeTopping = function () {
    return { x: 128, y: 786, width: 64, height: 108 };
  }

  this.rockHeight = function () {
    return { x: 256, y: 320 };
  }

  this.rockTopping = function () {
    return { x: 0, y: 320 };
  }
}

var sampleMap = function () {
  var mb = new MapBuilder();
  var map = {};
  map.rows = [];

  for (var r = 0; r < 50; r++) {
    map.rows[r] = {}
    map.rows[r].cols = []
    if (r < 10 || r > 15) {
      for (var i = 0; i < 30; i++) {
        map.rows[r].cols.push(new Cell(mb.baseTileCutter(r % 3, r % 3)));
      }
    } else {
      for (var i = 0; i < 30; i++) {
        if (i < 5 || i > 17) {
          map.rows[r].cols.push(new Cell(mb.baseTileCutter(r % 3, r % 3)));
        } else {
          map.rows[r].cols.push(new Cell(mb.seaTile()));
        }
      }
    }
  }
  map.rows[3].cols[3].addTopping(mb.grassTopping());

  map.rows[20].cols[1].addTopping(mb.treeTopping());

  map.rows[23].cols[6].addHeightItem(mb.rockHeight());
  map.rows[23].cols[6].addHeightItem(mb.rockHeight());
  map.rows[23].cols[6].addHeightItem(mb.rockHeight());
  map.rows[23].cols[6].addHeightItem(mb.rockHeight());
  map.rows[23].cols[6].addHeightItem(mb.rockHeight());
  map.rows[23].cols[6].addHeightItem(mb.rockTopping());

  map.rows[23].cols[7].addHeightItem(mb.rockHeight());
  map.rows[23].cols[7].addHeightItem(mb.rockHeight());
  map.rows[23].cols[7].addHeightItem(mb.rockHeight());
  map.rows[23].cols[7].addHeightItem(mb.rockHeight());
  map.rows[23].cols[7].addHeightItem(mb.rockHeight());
  map.rows[23].cols[7].addHeightItem(mb.rockTopping());

  map.rows[24].cols[7].addHeightItem(mb.rockHeight());
  map.rows[24].cols[7].addHeightItem(mb.rockHeight());
  map.rows[24].cols[7].addHeightItem(mb.rockHeight());
  map.rows[24].cols[7].addHeightItem(mb.rockTopping());

  map.rows[24].cols[8].addHeightItem(mb.rockHeight());
  map.rows[24].cols[8].addHeightItem(mb.rockHeight());
  map.rows[24].cols[8].addHeightItem(mb.rockHeight());
  map.rows[24].cols[8].addHeightItem(mb.rockHeight());
  map.rows[24].cols[8].addHeightItem(mb.rockTopping());

  map.rows[25].cols[6].addHeightItem(mb.rockHeight());
  map.rows[25].cols[6].addHeightItem(mb.rockHeight());
  map.rows[25].cols[6].addHeightItem(mb.rockTopping());

  map.rows[25].cols[7].addHeightItem(mb.rockHeight());
  map.rows[25].cols[7].addHeightItem(mb.rockHeight());
  map.rows[25].cols[7].addHeightItem(mb.rockTopping());

  map.rows[25].cols[8].addHeightItem(mb.rockTopping());


  return map;
}
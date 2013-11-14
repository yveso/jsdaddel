var ressources = (function () {
  var _mapTilesheet = new Image();
  _mapTilesheet.src = "textures/iso-64x64-outside.png";

  return {
    textures: {
      map: _mapTilesheet
    }
  };
})();
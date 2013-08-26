var canvas = document.getElementById("mainCanvas");

var camera = new Camera(canvas.width, canvas.height);

var world = new World(camera);

var game = new Game(30, canvas, world);

var btn = document.getElementById("btnToggleGameState");

btn.onclick = function () {
  if (game.getIsRunning()) {
    game.stop();
    btn.innerHTML = "Start Game";
  } else {
    game.start();
    btn.innerHTML = "Stop Game";
  }
}

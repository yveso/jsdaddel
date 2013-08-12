var game = new Game(1, document.getElementById("mainCanvas"));

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
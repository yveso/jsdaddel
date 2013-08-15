var canvas = document.getElementById("mainCanvas");
var world = new World(canvas.width, canvas.height)
var keyboardState = {};

var game = new Game(60, canvas, world, keyboardState);

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
/*
window.onkeydown = function (e) {
  e = e || window.event;
  keyboardState[e.keyCode] = true;
}
*/
window.onkeyup = function (e) {
  e = e || window.event;
  //delete keyboardState[e.keyCode];
  keyboardState[e.keyCode] = true;
}
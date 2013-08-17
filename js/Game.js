function Game(framesPerSecond, canvas, world) {
  var fps = framesPerSecond;
  var intervalId;
  var isRunning = false;
  var canvas = canvas;
  var ctx = canvas.getContext("2d");
  this.world = world;

  var mouseX, mouseY;
  var pressedKeys = {};

  canvas.onmousemove = function (e) {
    //http://stackoverflow.com/questions/1114465/getting-mouse-location-in-canvas
    if(e.offsetX) {
        mouseX = e.offsetX;
        mouseY = e.offsetY;
    } else if(e.layerX) {
        mouseX = e.layerX;
        mouseY = e.layerY;
    }

    document.getElementById("mouseX").innerHTML = mouseX;
    document.getElementById("mouseY").innerHTML = mouseY;
  }

  window.onkeydown = function (e) {
    pressedKeys[e.keyCode] = true;
  }

  window.onkeyup = function (e) {
    delete pressedKeys[e.keyCode];
  }

  this.start = function () {
    isRunning = true;
    intervalId = setInterval(function () {
      update();
      draw();
    }, 1000 / fps);
    console.log("game loop started")
  }

  this.stop = function () {
    isRunning = false;
    clearInterval(intervalId);
    console.log("game loop ended");
  }

  this.getIsRunning = function () {
    return isRunning;
  }

  var update = function () {
    //console.log("updating");
    world.update(mouseX, mouseY, pressedKeys);
  }

  var draw = function () {
    //console.log("drawing");
    canvas.width = canvas.width;
    this.world.draw(ctx);
  }
}
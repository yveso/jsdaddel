function Game(framesPerSecond, canvas) {
  var fps = framesPerSecond;
  var intervalId;
  var isRunning = false;
  var canvas = canvas;
  var ctx = canvas.getContext("2d");

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
    console.log("updating");


    tmpObject = { x: Math.random() * canvas.width, y: Math.random() * canvas.height };
  }

  var draw = function () {
    console.log("drawing");

    canvas.width = canvas.width;
    ctx.fillRect(tmpObject.x, tmpObject.y, 10, 10)
  }

  var tmpObject;
}
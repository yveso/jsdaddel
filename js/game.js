function Game(canvas) {
  this.fps = 60;
  this.level = new Level();
  this.canvas = canvas;

  var instance = this;
  var context = canvas.getContext("2d");
  var mouseX, mouseY;
  var hasClicked = false;
  var requestID;

  this.canvas.onmousemove = function (e) {
    //http://stackoverflow.com/questions/1114465/getting-mouse-location-in-canvas
    if(e.offsetX) {
        mouseX = e.offsetX;
        mouseY = e.offsetY;
    } else if(e.layerX) {
        mouseX = e.layerX;
        mouseY = e.layerY;
    }

    document.getElementById("mouseXspan").innerHTML = mouseX;
    document.getElementById("mouseYspan").innerHTML = mouseY;
  }

  this.canvas.onmousedown = function () {
    hasClicked = true;
  }

  this.start = function () {
    requestID = window.setInterval(
      step
      , 1000 / this.fps);
  }

  var step = function () {
    instance.level.update(mouseX, mouseY, hasClicked);
    hasClicked = false;
    instance.level.draw(context);
  }

  this.stop = function () {
    window.clearInterval(requestID);
  }
}

"use strict";
(function() {
  let socket = io();
  let canvas = document.getElementsByClassName("board")[0];
  let colors = document.getElementsByClassName("color");
  let context = canvas.getContext("2d");

  let current = {
    color: "black",
    userCount: 0
  };
  let drawing = false;
  let data;

  document.body.ontouchmove = e => {
    e.preventDefault();
    return false;
  };
  canvas.ontouchend = e => {
    e.preventDefault();
  };
  canvas.addEventListener("mousedown", onMouseDown, false);
  canvas.addEventListener("mouseup", onMouseUp, false);
  canvas.addEventListener("mouseout", onMouseUp, false);
  canvas.addEventListener("mousemove", throttle(onMouseMove, 10), false);

  //Touch support for mobile devices
  canvas.addEventListener("touchstart", onMouseDown, false);
  canvas.addEventListener("touchend", onMouseUp, false);
  canvas.addEventListener("touchcancel", onMouseUp, false);
  canvas.addEventListener("touchmove", throttle(onMouseMove, 10), false);

  for (let i = 0; i < colors.length - 1; i++) {
    colors[i].addEventListener("click", onColorUpdate, false);
  }

  console.log(colors[colors.length - 1]);
  colors[colors.length - 1].addEventListener(
    "click",
    triggerClearCanvas,
    false
  );

  socket.on("clear_canvas", clearCanvas);
  socket.on("drawing", onDrawingEvent);
  socket.on("state_update", state => {
    console.table(state);
    data = state.data;
    if (state.toClear) clearCanvas();
    current.userCount = state.userCount;
    document.getElementById("userCount").innerHTML = state.userCount;
    for (let i = 0; i < data.length; i++) {
      let d = data[i];
      onDrawingEvent(d);
    }
  });
  window.addEventListener("resize", onResize, false);
  onResize();

  function drawLine(x0, y0, x1, y1, color, emit) {
    context.beginPath();
    context.moveTo(x0, y0);
    context.lineTo(x1, y1);
    context.strokeStyle = color;
    context.lineWidth = 4;
    context.stroke();
    context.closePath();

    if (!emit) {
      return;
    }
    let w = canvas.width;
    let h = canvas.height;

    socket.emit("drawing", {
      x0: x0 / w,
      y0: y0 / h,
      x1: x1 / w,
      y1: y1 / h,
      color: color
    });
  }

  function triggerClearCanvas() {
    socket.emit("clear_canvas", "true");
  }

  function onMouseDown(e) {
    drawing = true;
    current.x = e.clientX || e.touches[0].clientX;
    current.y = e.clientY || e.touches[0].clientY;
  }

  function onMouseUp(e) {
    if (!drawing) {
      return;
    }
    drawing = false;
    drawLine(
      current.x,
      current.y,
      e.clientX || e.touches[0].clientX,
      e.clientY || e.touches[0].clientY,
      current.color,
      true
    );
  }

  function onMouseMove(e) {
    if (!drawing) {
      return;
    }
    drawLine(
      current.x,
      current.y,
      e.clientX || e.touches[0].clientX,
      e.clientY || e.touches[0].clientY,
      current.color,
      true
    );
    current.x = e.clientX || e.touches[0].clientX;
    current.y = e.clientY || e.touches[0].clientY;
  }

  function onColorUpdate(e) {
    current.color = e.target.className.split(" ")[1];
  }

  // limit the number of events per second
  function throttle(callback, delay) {
    let previousCall = new Date().getTime();
    return function() {
      let time = new Date().getTime();

      if (time - previousCall >= delay) {
        previousCall = time;
        callback.apply(null, arguments);
      }
    };
  }

  function onDrawingEvent(data) {
    let w = canvas.width;
    let h = canvas.height;
    drawLine(data.x0 * w, data.y0 * h, data.x1 * w, data.y1 * h, data.color);
  }

  // make the canvas fill its parent
  function onResize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  function clearCanvas() {
    context.clearRect(0, 0, canvas.width, canvas.height);
  }
})();

var bindHandlers = require("./utils/handlers");

document.addEventListener("DOMContentLoaded", function(){
  canvasEl = document.getElementById("canvas");
  ctx = canvasEl.getContext("2d");
  bindHandlers(ctx);
});

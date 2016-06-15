var Grid = require("./grid");

window.canvasEl = document.getElementById("canvas");

window.ctx = canvasEl.getContext("2d");

grid = new Grid();

grid.draw(ctx);

grid.buildMaze(ctx);

var Grid = require("./grid");
var Game = require("./game");
var MazeBuilder = require("./mazeBuilder");

window.canvasEl = document.getElementById("canvas");

window.ctx = canvasEl.getContext("2d");

window.grid = new Grid(ctx);

window.game = new Game(grid, ctx);

window.MazeBuilder = new MazeBuilder(grid);
grid.draw(ctx);

var Grid = require("./grid");
var Game = require("./game");

window.canvasEl = document.getElementById("canvas");

window.ctx = canvasEl.getContext("2d");

window.grid = new Grid(ctx);

window.game = new Game(grid, ctx);

grid.draw(ctx);

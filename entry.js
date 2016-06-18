var Grid = require("./grid");
var Game = require("./game");
var MazeBuilder = require("./mazeBuilder");
var MazeSolver = require("./mazeSolver");
var DfSolver = require("./dfSolver");
var StarSolver = require("./starSolver");

window.canvasEl = document.getElementById("canvas");

window.ctx = canvasEl.getContext("2d");

window.grid = new Grid(ctx);

window.game = new Game(grid, ctx);

window.MazeBuilder = new MazeBuilder(grid);

window.MazeSolver = new MazeSolver(grid);

window.DfSolver = new DfSolver(grid);

window.StarSolver = new StarSolver(grid);

grid.draw(ctx);

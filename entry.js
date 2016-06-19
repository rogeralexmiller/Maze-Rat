var Grid = require("./grid");
var Game = require("./game");

var MazeBuilder = require("./builders/mazeBuilder");
var StreetBuilder = require("./builders/streetBuilder");

var MazeSolver = require("./solvers/mazeSolver");
var DfSolver = require("./solvers/dfSolver");
var StarSolver = require("./solvers/starSolver");

window.canvasEl = document.getElementById("canvas");

window.ctx = canvasEl.getContext("2d");

window.grid = new Grid(ctx);

window.game = new Game(grid, ctx);

window.MazeBuilder = new MazeBuilder(grid);
window.StreetBuilder = new StreetBuilder(grid);

window.MazeSolver = new MazeSolver(grid);

window.DfSolver = new DfSolver(grid);

window.StarSolver = new StarSolver(grid);

grid.draw(ctx);

var Grid = require("./components/grid");
var MazeBuilder = require("./builders/mazeBuilder");
var StreetBuilder = require("./builders/streetBuilder");
var MazeSolver = require("./solvers/mazeSolver");
var DfSolver = require("./solvers/dfSolver");
var StarSolver = require("./solvers/starSolver");

function bindHandlers(ctx){
  grid = new Grid(ctx);
  MazeBuilder = new MazeBuilder(grid);
  StreetBuilder = new StreetBuilder(grid);
  MazeSolver = new MazeSolver(grid);
  DfSolver = new DfSolver(grid);
  StarSolver = new StarSolver(grid);
  grid.draw(ctx);

  $("#build-maze").click(function(){
    grid.addCells(ctx);
    grid.draw(ctx);
    MazeBuilder.buildMaze(1);
  });

  $("#build-street").click(function(){
    grid.addCells(ctx);
    grid.draw(ctx);
    StreetBuilder.buildStreets();
  });

  $("#solve-maze").click(function(){
    MazeSolver.solveMaze();
  });

  $("#depth-first").click(function(){
    DfSolver.solveMaze();
  });

  $("#star").click(function(){
    StarSolver.solveMaze();
  });

  $("#race").click(function(){
    DfSolver.solveMaze();
  });
}

module.exports = bindHandlers;

var SolverUtil = require("../utils/solverUtil");

function MazeSolver(grid){
  this.grid = grid;
  this.ctx = this.grid.ctx;
}

MazeSolver.prototype.solveMaze = function(){
  var ctx = this.ctx;
  var grid = this.grid;
  var moveQueue = [];
  var startCell = this.grid.getCell(grid.startPos);

  var pathOptions = SolverUtil.getPathOptions(startCell, grid);
  var mazeSolved = false;
  moveQueue = moveQueue.concat(pathOptions);
  var solveIntervalId = setInterval(function(){
    if (moveQueue.length > 0 && mazeSolved === false) {
      if (moveQueue.length > 1000) {
      }
      var move = moveQueue.shift();
      move.explored = true;
      move.draw(ctx);
      if (move.end) {
        SolverUtil.traceBackHome(move, ctx, solveIntervalId);
        mazeSolved = true;
      } else {
        var pathOptions = SolverUtil.getPathOptions(move, grid);
        moveQueue = moveQueue.concat(pathOptions);
      }
    } else {
      clearInterval(solveIntervalId);
    }
  }, 0);
};

module.exports = MazeSolver;

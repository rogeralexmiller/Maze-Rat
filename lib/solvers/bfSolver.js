var SolverUtil = require("../utils/solverUtil");

function BfSolver(grid){
  this.grid = grid;
  this.ctx = this.grid.ctx;
}

BfSolver.prototype.solveMaze = function(){
  var ctx = this.ctx;
  var grid = this.grid;
  var moveQueue = [];
  var startCell = this.grid.getCell(grid.startPos);

  var pathOptions = SolverUtil.getPathOptions(startCell, grid);
  var mazeSolved = false;
  moveQueue = moveQueue.concat(pathOptions);
  var solveIntervalId = setInterval(function(){
    if (moveQueue.length > 0 && mazeSolved === false) {
      var move = moveQueue.shift();
      move.state.explored = true;
      move.draw(ctx);
      if (move.state.end) {
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

module.exports = BfSolver;

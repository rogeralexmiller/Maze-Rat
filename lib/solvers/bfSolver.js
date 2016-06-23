var SolverUtil = require("../utils/solverUtil");

function BfSolver(grid){
  this.grid = grid;
  this.ctx = this.grid.ctx;
  this.moveQueue = [];
  this.solved = false;
}

BfSolver.prototype.chartPathOptions = function(cell){
  var pathOptions = SolverUtil.getPathOptions(cell);
  this.moveQueue = this.moveQueue.concat(pathOptions);
};

BfSolver.prototype.exploreMaze = function(){
  var cell = this.moveQueue.shift();
  SolverUtil.explorePath(cell);

  if (cell.state.end) {
    SolverUtil.traceBackHome(cell);
    this.solved = true;
  } else {
    this.chartPathOptions(cell);
  }
};

BfSolver.prototype.resetSolver = function(){
  this.solved = false;
  this.moveQueue = [];
};

BfSolver.prototype.solveMaze = function(){
  this.resetSolver();
  var startCell = this.grid.getStartCell();
  this.chartPathOptions(startCell);
  var solver = this;

  var solveIntervalId = setInterval(function(){
    if (solver.solved === false) {
      solver.exploreMaze();
    } else {
      clearInterval(solveIntervalId);
    }
  }, 0);
};

module.exports = BfSolver;

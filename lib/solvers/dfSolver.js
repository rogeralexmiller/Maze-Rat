var SolverUtil = require("../utils/solverUtil");

function DfSolver(grid){
  this.grid = grid;
  this.ctx = this.grid.ctx;
  this.moveStack = [];
  this.solved = false;
}

DfSolver.prototype.chartPathOptions = function(cell){
  var pathOptions = SolverUtil.getPathOptions(cell);
  this.moveStack = this.moveStack.concat(pathOptions);
};

DfSolver.prototype.exploreMaze = function(){
  var cell = this.moveStack.pop();
  SolverUtil.explorePath(cell);

  if (cell.state.end) {
    SolverUtil.traceBackHome(cell);
    this.solved = true;
  } else {
    this.chartPathOptions(cell);
  }
};

DfSolver.prototype.resetSolver = function(){
  this.solved = false;
  this.moveStack = [];
};

DfSolver.prototype.solveMaze = function(){
  this.resetSolver();
  var startCell = this.grid.getStartCell();
  this.chartPathOptions(startCell);
  var solver = this;

  var solveIntervalId = setInterval(function(){
    if (solver.solved === false) {
      solver.exploreMaze();
    } else {
      $("button").prop("disabled", false);
      clearInterval(solveIntervalId);
    }
  }, 5);
};

module.exports = DfSolver;

var SolverUtil = require("../utils/solverUtil");

function DfSolver(grid){
  this.grid = grid;
  this.ctx = this.grid.ctx;
  this.moves = [];
  this.solved = false;
}

DfSolver.prototype.chartPathOptions = function(cell){
  var pathOptions = SolverUtil.getPathOptions(cell);
  this.moves = this.moves.concat(pathOptions);
};

DfSolver.prototype.exploreMaze = function(){
  var cell = this.moves.pop();
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
  this.moves = [];
};

DfSolver.prototype.solveMaze = function(){
  SolverUtil.reset(this);
  var startCell = this.grid.getStartCell();
  this.chartPathOptions(startCell);
  var solver = this;

  var solveIntervalId = setInterval(function(){
    if (solver.solved === false) {
      solver.exploreMaze();
    } else {
      clearInterval(solveIntervalId);
    }
  }, 5);
};

module.exports = DfSolver;

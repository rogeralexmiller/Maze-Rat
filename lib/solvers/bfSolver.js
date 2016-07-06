var SolverUtil = require("../utils/solverUtil");

function BfSolver(grid){
  this.grid = grid;
  this.ctx = this.grid.ctx;
  this.moves = [];
  this.solved = false;
}

BfSolver.prototype.chartPathOptions = function(cell){
  var pathOptions = SolverUtil.getPathOptions(cell);
  this.moves = this.moves.concat(pathOptions);
};

BfSolver.prototype.exploreMaze = function(){
  var cell = this.moves.shift();
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
  this.moves = [];
};

BfSolver.prototype.solveMaze = function(){
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
  }, 0);
};

module.exports = BfSolver;

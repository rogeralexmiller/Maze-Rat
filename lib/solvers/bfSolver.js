var SolverUtil = require("../utils/solverUtil");

function BfSolver(grid){
  this.grid = grid;
  this.ctx = this.grid.ctx;
  this.moves = [];
  this.solved = false;
}

BfSolver.prototype.exploreMaze = function(){
  var cell = this.moves.shift();
  SolverUtil.explorePath(cell);

  if (cell.state.end) {
    SolverUtil.traceBackHome(cell);
    this.solved = true;
  } else {
    SolverUtil.chartPathOptions(this, cell);
  }
};

BfSolver.prototype.solveMaze = function(){
  SolverUtil.reset(this);
  var startCell = this.grid.getStartCell();
  SolverUtil.chartPathOptions(this, startCell);
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

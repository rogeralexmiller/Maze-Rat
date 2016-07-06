var SolverUtil = require("../utils/solverUtil");

function DfSolver(grid){
  this.grid = grid;
  this.ctx = this.grid.ctx;
  this.moves = [];
  this.solved = false;
}

DfSolver.prototype.exploreMaze = function(){
  var cell = this.moves.pop();
  SolverUtil.explorePath(cell);

  if (cell.state.end) {
    SolverUtil.traceBackHome(cell);
    this.solved = true;
  } else {
    SolverUtil.chartPathOptions(this, cell);
  }
};

DfSolver.prototype.solveMaze = function(){
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

module.exports = DfSolver;

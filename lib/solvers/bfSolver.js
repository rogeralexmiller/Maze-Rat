var SolverUtil = require("../utils/solverUtil");

function BfSolver(grid){
  this.grid = grid;
  this.ctx = this.grid.ctx;
  this.moves = [];
  this.solved = false;
  this.timerId = null;
  this.time = 0;
}

BfSolver.prototype.exploreMaze = function(){
  var cell = this.moves[0];
  var i = 0;
  while (cell.state.explored) {
    cell = this.moves[i];
    i++;
  }
  SolverUtil.explorePath(cell);

  if (cell.state.end) {
    clearInterval(this.timerId);
    SolverUtil.traceBackHome(cell);
    this.solved = true;
  } else {
    SolverUtil.chartPathOptions(this, cell);
  }
};

BfSolver.prototype.startTimer = function(){
  var solver = this;
  this.timerId = setInterval(function(){
    solver.time ++;
    $("#bf-time").html("Time: "+solver.time);
  }, 1000);
};

BfSolver.prototype.solveMaze = function(){

  this.time = 0;
  this.startTimer();
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

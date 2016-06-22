var SolverUtil = require("../utils/solverUtil");

function BfSolver(grid){
  this.grid = grid;
  this.ctx = this.grid.ctx;
  this.moveQueue = [];
  this.solved = false;
}

BfSolver.prototype.chartPathOptions = function(cell){
  var pathOptions = SolverUtil.getPathOptions(cell, grid);
  this.moveQueue = this.moveQueue.concat(pathOptions);
};

var explorePath = function(move){
  move.state.explored = true;
  move.draw(this.ctx);
};

BfSolver.prototype.exploreMaze = function(){
  var cell = this.moveQueue.shift();
  explorePath(cell);

  if (cell.state.end) {
    SolverUtil.traceBackHome(cell, 20);
    this.solved = true;
  } else {
    this.chartPathOptions(cell);
  }
};

BfSolver.prototype.solveMaze = function(){
  this.solved = false;
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

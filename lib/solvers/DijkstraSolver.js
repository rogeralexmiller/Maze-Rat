var SolverUtil = require("../utils/solverUtil");

function DijkstraSolver(grid){
  this.grid = grid;
  this.ctx = this.grid.ctx;
  this.solved = false;
  this.currentCell = grid.getStartCell();
  this.frontier = [];
}

DijkstraSolver.prototype.deadEnd = function(cell){
  var validPaths = this.getPathOptions(cell);
  if (validPaths.length > 0){
    return false;
  } else{
    return true;
  }
};

DijkstraSolver.prototype.validPath = function(cell){
  if (cell.state.type === "path" && (cell.state.explored === false) && !cell.state.start) {
    return true;
  } else {
    return false;
  }
};

DijkstraSolver.prototype.jumpToParent = function(){
  this.currentCell = this.currentCell.parent;
};

DijkstraSolver.prototype.traceBackToFork = function(){
  if (!this.deadEnd(this.currentCell)) {
    return;
  } else {
    this.jumpToParent();
    this.traceBackToFork();
  }
};

DijkstraSolver.prototype.updateNeighbors = function(){
  var neighbors = this.getPathOptions(this.currentCell);
  for (var i = 0; i < neighbors.length; i++) {
    var neighbor = neighbors[i];
    this.frontier.push(neighbor);
    if (neighbor.distance) {
      if (this.currentCell.distance + 1 < neighbor.distance) {
        neighbor.parent = this.currentCell;
        neighbor.distance = this.currentCell.distance + 1;
      }
    } else{
      neighbor.parent = this.currentCell;
      neighbor.distance = this.currentCell.distance + 1;
    }
  }
};

DijkstraSolver.prototype.moveToClosestNeighbor = function(){
  SolverUtil.explorePath(this.currentCell);
  var closestNeighbor = null;
  for (var i = 0; i < this.frontier.length; i++) {
    var neighbor = this.frontier[i];
    if (!closestNeighbor) {
      if (this.validPath(neighbor)) {
        closestNeighbor = neighbor;
      }
    } else{
      if (neighbor.distance < closestNeighbor.distance && this.validPath(neighbor)){
        closestNeighbor = neighbor;
      }
    }
  }
  this.currentCell = closestNeighbor;
};

DijkstraSolver.prototype.getPathOptions = function(cell){
  var options = cell.getMoves();
  var paths = [];

  for (var i = 0; i < options.length; i++) {
    var option = options[i];
    if (this.grid.inBounds(option)) {
      var optionCell = this.grid.getCell(option);
      if (this.validPath(optionCell)) {
        paths.push(optionCell);
      }
    }
  }
  return paths;
};

DijkstraSolver.prototype.solve = function(){
  this.solved = false;
  this.frontier = [];
  this.currentCell = this.grid.getStartCell();
  this.currentCell.distance = 0;
  var solver = this;

  var solveIntervalId = setInterval(function(){
    if (solver.solved === false) {
      if (solver.currentCell.state.end) {
        SolverUtil.traceBackHome(solver.currentCell);
        console.log(solver.currentCell.distance);
        solver.solved = true;
      } else{
        solver.updateNeighbors();
        solver.moveToClosestNeighbor();
      }
    } else {
      $("button").prop("disabled", false);
      clearInterval(solveIntervalId);
    }
  }, 5);

};

module.exports = DijkstraSolver;

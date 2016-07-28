var SolverUtil = require("../utils/solverUtil");

function DijkstraSolver(grid){
  this.grid = grid;
  this.ctx = this.grid.ctx;
  this.solved = false;
  this.currentCell = grid.getStartCell();
  this.time = 0;
  this.timerId = null;
  this.moves = [];
  this.distance = 0;
  this.distanceId = "#dijkstra-distance";
}

DijkstraSolver.prototype.validPath = function(cell){
  if (cell.state.type === "path" && (cell.state.explored === false) && !cell.state.start) {
    return true;
  } else {
    return false;
  }
};

DijkstraSolver.prototype.closestNeighbor = function(cell){
  if (this.validPath(cell)) {
    return cell;
  } else{
    var shortest = this.moves[0];
    for (var i = 0; i < this.moves.length; i++) {
      if (this.moves[i].state.explored === false) {
        return this.moves[i];
      }
      if (this.moves[i].distance < shortest.distance){
        shortest = this.moves[i];
      }
    }
    return this.closestNeighbor(shortest);
  }
};

DijkstraSolver.prototype.moveToClosestNeighbor = function(){
  SolverUtil.explorePath(this.currentCell);
  // get closest neighbor by finding unexplored neighbor with lowest value.
  this.currentCell = this.closestNeighbor(this.grid.getStartCell());
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

DijkstraSolver.prototype.updateNeighbors = function(){
  var neighbors = this.getPathOptions(this.currentCell);
  for (var i = 0; i < neighbors.length; i++) {
    var neighbor = neighbors[i];
    if (neighbor.distance) {
      if (this.currentCell.distance + 1 < neighbor.distance) {
        this.moves.push(neighbor);
        this.currentCell.children.push(neighbor);
        var formerParent = neighbor.parent;
        neighbor.parent = this.currentCell;
        neighbor.distance = this.currentCell.distance + 1;
        formerParent.removeChild(neighbor);
      }
    } else{
      this.moves.push(neighbor);
      neighbor.parent = this.currentCell;
      this.currentCell.children.push(neighbor);
      neighbor.distance = this.currentCell.distance + 1;
    }
  }
};

DijkstraSolver.prototype.solve = function(){
  SolverUtil.reset(this);
  this.grid.clearChildren();
  this.currentCell = this.grid.getStartCell();
  SolverUtil.startTimer(this, "#dijkstra-time");
  this.currentCell.distance = 0;
  var solver = this;

  var solveIntervalId = setInterval(function(){
    if (solver.solved === false) {
      if (solver.currentCell.state.end) {
        clearInterval(solver.timerId);
        SolverUtil.traceBackHome(solver.currentCell, solver);
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

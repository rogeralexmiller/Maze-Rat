SolverUtil = require("../utils/solverUtil");

function RogerSolver(grid){
  this.grid = grid;
  this.ctx = this.grid.ctx;
  this.solved = false;
  this.currentCell = grid.getStartCell();
  this.currentDistance = 0;
  this.timerId = null;
  this.time = 0;
}

RogerSolver.prototype.distanceToEnd = function(coords){
  var endPos = this.grid.end.gridCoords;
  var row1 = coords[0];
  var row2 = endPos[0];
  var col1 = coords[1];
  var col2 = endPos[1];

  return Math.abs(row2 - row1) + Math.abs(col2 - col1);
};

RogerSolver.prototype.towardsEnd = function(coords){
  return this.distanceToEnd(coords) < this.distanceToEnd(this.currentCell.gridCoords);
};

RogerSolver.prototype.getMoves = function(){
  var solver = this;
  var moves = this.getPathOptions(this.currentCell);

  var bestMoves = moves.filter(function(move){
    return solver.towardsEnd(move.gridCoords);
  });
  return bestMoves.length > 0 ? bestMoves : moves;
};

RogerSolver.prototype.jumpToParent = function(){
  this.currentCell = this.currentCell.parent;
};

RogerSolver.prototype.traceBackToFork = function(){
  if (!this.deadEnd(this.currentCell)) {
    return;
  } else {
    this.markDeadEnd(this.currentCell);
    this.currentDistance --;
    $("#roger-distance").html("Distance: "+this.currentDistance);
    this.jumpToParent();
    this.traceBackToFork();
  }
};

RogerSolver.prototype.deadEnd = function(cell){
  var validPaths = this.getPathOptions(cell);
  if (validPaths.length > 0){
    return false;
  } else{
    return true;
  }
};

RogerSolver.prototype.chooseRandomMove = function(){
  var moveCells = this.getMoves();
  var randomIdx = Math.floor(Math.random()*(moveCells.length));
  return moveCells[randomIdx];
};

RogerSolver.prototype.explorePath = function(moveCell){
  var prevCell = this.currentCell;
  this.currentCell = moveCell;
  this.currentCell.distance = this.currentDistance;
  this.currentDistance ++;
  $("#roger-distance").html("Distance: "+this.currentDistance);
  moveCell.parent = prevCell;
  moveCell.state.solvePath = true;
  moveCell.draw(this.grid.ctx);
};

RogerSolver.prototype.markDeadEnd = function(cell){
  cell.state.solvePath = false;
  cell.state.explored = true;
  cell.draw(this.grid.ctx);
};

RogerSolver.prototype.exploreMaze = function(){
  if (!this.deadEnd(this.currentCell)) {
    moveCell = this.chooseRandomMove();
    this.explorePath(moveCell);
  } else {
    this.markDeadEnd(this.currentCell);
    this.traceBackToFork();
  }
  return;
};

RogerSolver.prototype.validPath = function(cell){
  return cell.state.type === "path" && cell.state.explored === false && cell.state.solvePath === false && cell.state.start === false;
};

RogerSolver.prototype.getPathOptions = function(cell){
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

RogerSolver.prototype.solveMaze = function(){
  this.solved = false;
  this.time = 0;
  this.currentCell = this.grid.getStartCell();
  SolverUtil.startTimer(this, "#roger-time");
  this.currentCell.solvePath = true;
  this.currentDistance = 0;
  var solver = this;

  var solveIntervalId = setInterval(function(){
    if (solver.solved === false) {
      if (solver.currentCell.match(solver.grid.end)) {
        solver.solved = true;
      } else {
        solver.exploreMaze();
      }
    } else {
      clearInterval(solver.timerId);
      $("button").prop("disabled", false);
      clearInterval(solveIntervalId);
    }
  }, 5);

};

module.exports = RogerSolver;

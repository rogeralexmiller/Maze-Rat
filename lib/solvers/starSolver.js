var SolverUtil = require("../utils/solverUtil");

function StarSolver(grid){
  this.grid = grid;
  this.currentPos = this.grid.startPos;
  this.ctx = this.grid.ctx;
}

StarSolver.prototype.distanceToEnd = function(coords){
  var endPos = this.grid.end.gridCoords;
  var row1 = coords[0];
  var row2 = endPos[0];
  var col1 = coords[1];
  var col2 = endPos[1];

  return Math.pow(Math.pow((row2 - row1),2) + Math.pow((col2 - col1),2),0.5);
};

StarSolver.prototype.towardsEnd = function(coords){
  return this.distanceToEnd(coords) < this.distanceToEnd(this.currentPos);
};

StarSolver.prototype.getMoves = function(){
  var solver = this;
  var cell = this.grid.getCell(this.currentPos);
  var moves = this.getPathOptions(cell);

  var bestMoves = moves.filter(function(move){
    return solver.towardsEnd(move.gridCoords);
  });
  return bestMoves.length > 0 ? bestMoves : moves;
};

StarSolver.prototype.traceBackHome = function(cell){
  if (cell.start === true) {
    return;
  } else {
    var parent = cell.parent;
    parent.solvePath = false;
    if (this.deadEnd(parent)){
      parent.dead = true;
    }
    parent.draw(this.ctx);
    this.traceBackHome(parent);
  }
};

StarSolver.prototype.deadEnd = function(cell){
  var validPaths = this.getPathOptions(cell);
  if (validPaths.length > 0){
    return false;
  } else{
    return true;
  }
};

StarSolver.prototype.chooseValidMove = function(){
  var cell = this.grid.getCell(this.currentPos);

  if (!this.deadEnd(cell)) {
    var moveCells = this.getMoves();
    var randomIdx = Math.floor(Math.random()*(moveCells.length));
    var moveCell = moveCells[randomIdx];
    var prevCell = this.grid.getCell(this.currentPos);
    this.currentPos = moveCell.gridCoords;

    moveCell.parent = prevCell;
    moveCell.solvePath = true;
    moveCell.draw(this.grid.ctx);
  } else {

    var currentCell = this.grid.getCell(this.currentPos);
    currentCell.solvePath = false;
    currentCell.dead = true;
    currentCell.draw(this.grid.ctx);
    this.currentPos = this.grid.startPos;
    this.traceBackHome(currentCell);
  }
  return;
};

StarSolver.prototype.getPathOptions = function(cell){

  var grid = this.grid;
  var options = cell.getMoves();
  var paths = [];
  for (var i = 0; i < options.length; i++) {
    var option = options[i];
    if (grid.inBounds(option)) {
      var optionCell = grid.getCell(option);
      if (optionCell.state === "path" && optionCell.dead === false && optionCell.solvePath === false) {
        optionCell.parent = cell;
        paths.push(optionCell);
      }
    }
  }
  return paths;
};

StarSolver.prototype.solveMaze = function(){
  var grid = this.grid;
  var endPos = grid.end.gridCoords;
  this.currentPos = grid.startPos;

  var solver = this;
  var mazeSolved = false;
  var solveIntervalId = setInterval(function(){
    if (mazeSolved === false) {
      var currentCell = grid.getCell(solver.currentPos);
      if (currentCell.match(grid.end)) {
        mazeSolved = true;
      } else{
        solver.chooseValidMove();
      }

    } else {
      clearInterval(solveIntervalId);
    }
  }, 5);

};

module.exports = StarSolver;

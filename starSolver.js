var SolverUtil = require("./utils/solverUtil");

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
  return this.distanceToEnd(coords) < this.distancetoEnd(this.currentPos);
};

StarSolver.prototype.getMoves = function(){
  var solver = this;
  var moves = this.getPathOptions(this.currentPos);

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
    parent.draw(this.ctx);
    this.traceBackHome(parent);
  }
};

StarSolver.prototype.chooseValidMove = function(){
  if (!SolverUtil.deadEnd(this.currentPos)) {
    var moves = this.getMoves();
    var randomIdx = Math.floor(Math.random()*(moves.length));
    var move = moves[randomIdx];
    var prevCell = this.grid.getCell(this.currentPos);
    this.currentPos = move;
    var moveCell = this.grid.getCell(move);
    moveCell.parent = prevCell;
    moveCell.SolvePath = true;
    moveCell.draw(this.grid.ctx);
  } else {
    var currentCell = this.grid.getCell(this.currentPos);
    currentCell.solvePath = false;
    currentCell.dead = true;
    currentCell.draw(this.grid.ctx);
    this.currentPos = this.grid.startPos;
    this.traceBackHome();
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
      if (optionCell.state === "path" && optionCell.dead === false) {
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
  var currentPos = grid.startPos;
  var startCell = grid.startCell;

  var solver = this;

  var mazeSolved = false;

  var solveIntervalId = setInterval(function(){
    if (mazeSolved === false) {
      var currentCell = this.grid.getCell(this.currentPos);
      if (currentCell.match(grid.end)) {
        mazeSolved = true;
      }
      solver.chooseValidMove();

    } else {
      clearInterval(solveIntervalId);
    }
  }, 5);

};

module.exports = StarSolver;

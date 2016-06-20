var Cell = require("./cell");

function Grid(ctx) {
  this.DIM_Y = 510;
  this.DIM_X = 510;
  this.cells = [];
  this.addCells();
  this.startPos = [0, 49];
  this.startCell = null;
  this.userPos = [0,49];
  this.ctx = ctx;
  this.end = null;
}

Grid.prototype.updateUserPos = function(move){
  var pos = this.userPos;
  prevUserCell = this.getCell(pos);
  prevUserCell.occupied = false;
  prevUserCell.draw(this.ctx);

  this.userPos = [pos[0]+move[0], pos[1]+move[1]];
  var userCell = this.getCell(userPos);
  userCell.occupied = true;
  userCell.draw(this.ctx);
};

Grid.prototype.getStartCell = function(){
  return this.getCell(this.startPos);
};

Grid.prototype.addCells = function(){
  this.cells = [];
  for (var i = 0; i < 50 ; i++) {
    var row = [];
    for (var j = 0; j < 50; j++) {
      var cell = new Cell([(i*10)+15,(j*10)+15],[i,j], this);
      row.push(cell);
    }
    this.cells.push(row);
  }
};

Grid.prototype.validPath = function(coords){
  var cell = this.getCell(coords);
  var parent = cell.parent ? cell.parent : {gridCoords:[-1,-1]};
  var grandparent = parent.parent ? parent.parent : {gridCoords:[-1,-1]};
  var siblings = parent.children;

  var neighbors = cell.getValidNeighbors(this);
  for (var i = 0; i < neighbors.length; i++) {
    var neighbor = neighbors[i];
    if (neighbor.match(grandparent) || neighbor.match(parent) || parent.isChild(neighbor)) {
    } else{
      if (neighbor.state === "path") {
        return false;
      }
    }
  }
  return true;
};

Grid.prototype.draw = function(ctx) {
  ctx.lineWidth = 10;
  ctx.strokeRect(10, 10, this.DIM_X, this.DIM_Y);
  this.cells.forEach( function(row){
    row.forEach(function(cell){
      cell.draw(ctx);
    });
  });
};

Grid.prototype.inBounds = function(coords) {
  var row = coords[0];
  var col = coords[1];
  if (row >= 0 && row < 50 && col >= 0 && col < 50) {
    return true;
  } else {
    return false;
  }
};

Grid.prototype.getCell = function(coords){
  return this.cells[coords[0]][coords[1]];
};

Grid.prototype.getPathOptions = function(cell){
  var coords = cell.gridCoords;

  var up = [coords[0]+1 ,coords[1]];
  var down =[coords[0]-1 ,coords[1]];
  var left = [coords[0],coords[1]-1];
  var right = [coords[0],coords[1]+1];

  var options = [up, down, left, right];

  var paths = [];
  for (var i = 0; i < options.length; i++) {
    var option = options[i];
    if (this.inBounds(option)) {
      var optionCell = this.getCell(option);
      if (optionCell.state === "path" && optionCell.explored === false) {
        optionCell.parent = cell;
        paths.push(optionCell);
      }
    }
  }
  return paths;
};

Grid.prototype.traceBackHome = function(cell, ctx, solveIntervalId){
  if (cell.start === true) {
    clearInterval(solveIntervalId);
    return;
  } else {
    var parent = cell.parent;
    parent.solvePath = true;
    parent.draw(ctx);
    this.traceBackHome(parent, ctx);
  }
};

Grid.prototype.solveMaze = function(ctx){
  var moveQueue = [];
  var startCell = this.getCell(this.startPos);
  var pathOptions = this.getPathOptions(startCell, this.startPos);
  var grid = this;
  var mazeSolved = false;
  moveQueue = moveQueue.concat(pathOptions);
  var solveIntervalId = setInterval(function(){
    if (moveQueue.length > 0 && mazeSolved === false) {
      var move = moveQueue.shift();
      move.explored = true;
      move.draw(ctx);
      if (move.end) {
        grid.traceBackHome(move, ctx, solveIntervalId);
        mazeSolved = true;
      } else {
        var pathOptions = grid.getPathOptions(move);
        moveQueue = moveQueue.concat(pathOptions);
      }
    } else {
      clearInterval(solveIntervalId);
    }
  }, 5);
};

module.exports = Grid;

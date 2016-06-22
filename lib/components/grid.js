var Cell = require("./cell");

function Grid(ctx) {
  this.ctx = ctx;
  this.DIM_Y = 510;
  this.DIM_X = 510;
  this.cells = [];
  this.addCells();
  this.startPos = [0, 49];
  this.startCell = null;
  this.userPos = [0,49];
  this.end = null;
}

Grid.prototype.updateUserPos = function(move){
  var pos = this.userPos;
  prevUserCell = this.getCell(pos);
  prevUserCell.state.occupied = false;
  prevUserCell.draw(this.ctx);

  this.userPos = [pos[0]+move[0], pos[1]+move[1]];
  var userCell = this.getCell(userPos);
  userCell.state.occupied = true;
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

Grid.prototype.reset = function(){
  for (var i = 0; i < this.cells.length; i++) {
    for (var j = 0; j < this.cells.length; j++) {
      var cell = this.cells[i][j];
      cell.clearPath();
      cell.draw(this.ctx);
    }
  }
};

Grid.prototype.validPath = function(coords){
  var cell = this.getCell(coords);
  var neighbors = cell.getValidNeighbors(this);
  for (var i = 0; i < neighbors.length; i++) {
    if (!cell.isRelatedTo(neighbors[i])) {
      if (neighbors[i].state.type=== "path") {return false;}
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


module.exports = Grid;

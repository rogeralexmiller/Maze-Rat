var Cell = require("./cell");

function Grid() {
  this.DIM_Y = 501;
  this.DIM_X = 501;
  this.cells = [];
  this.addCells();
}

Grid.prototype.addCells = function(){
  for (var i = 0; i < 50 ; i++) {
    var row = [];
    for (var j = 0; j < 50; j++) {
      var cell = new Cell([(i*10)+1,(j*10)+1]);
      row.push(cell);
    }
    this.cells.push(row);
  }
};

Grid.prototype.draw = function(ctx) {
  ctx.strokeRect(0, 0, this.DIM_X, this.DIM_Y);
  this.cells.forEach( function(row){
    row.forEach(function(cell){
      cell.draw(ctx);
    });
  });
};

var inBounds = function(coords) {
  var row = coords[0];
  var col = coords[1];
  if (row >= 0 && row < 50 && col >= 0 && col < 50) {
    return true;
  } else {
    return false;
  }
};



Grid.prototype.validMove = function(coords, frontierPos){
  //check if the move is in bounds, then check move's neighbors to see if any are path cells
  if (inBounds(coords)) {
    var cell = this.getCell(coords);
    if (cell.state === "wall" && this.hasValidNeighbors(coords, frontierPos)) {
      return true;
    } else {
      return false;
    }
  } else{
    return false;
  }
};

Grid.prototype.hasValidNeighbors = function(pos, frontierPos) {
  var grid = this;
  var up = [pos[0]-1,pos[1]];
  var down = [pos[0]+1,pos[1]];
  var left = [pos[0],pos[1]-1];
  var right = [pos[0],pos[1]+1];

  var neighbors = [up,down,left,right];

  return neighbors.every(function(neighbor){
    if (inBounds(neighbor)) {
      var cell = grid.getCell(neighbor);
      if (neighbor[0] === frontierPos[0] && neighbor[1] === frontierPos[1]) {
        return true;
      } else{
        return cell.state !== "path";
      }
    } else {
      return true;
    }
  });
};

Grid.prototype.getValidMoves = function(pos){
  var grid = this;
  //valid move is one that doesn't have a neighbor other than the frontier cell that is also a path
  var up = [pos[0]-1,pos[1]];
  var down = [pos[0]+1,pos[1]];
  var left = [pos[0],pos[1]-1];
  var right = [pos[0],pos[1]+1];

  var moves = [up, down, left, right];

  var validMoves =  moves.filter(function(move){
    //for each move, first check if the move is in bounds, then check move's neighbors to see if any are path cells
    return grid.validMove(move, pos);
  });

  if (validMoves.length > 0) {
    return validMoves;
  } else {
    return null;
  }
};

Grid.prototype.getCell = function(coords){
  return this.cells[coords[0]][coords[1]];
};

Grid.prototype.buildMaze = function(ctx) {
  var frontier = [];
  var startPos = [0,49];
  var startCell = this.getCell(startPos);
  startCell.makePath();
  startCell.draw(ctx);
  var grid = this;
  frontier.push(startPos);

  var mazeIntervalId = setInterval(function(){
    if (frontier.length > 0) {
      var randomIdx = Math.floor(Math.random()*(frontier.length));
      var randomFrontier = frontier.splice(randomIdx, 1)[0];
      // get random frontier cell's coordinates
      // Expand frontier into any valid neighbors
      //valid neighbor is one that doesn't have a neighbor other than the frontier cell that is also a path
      var newMoves = grid.getValidMoves(randomFrontier);
      if (newMoves) {
        for (var i = 0; i < newMoves.length; i++) {
          var move = newMoves[i];
          var cell = grid.getCell(move);
          cell.makePath();
          cell.draw(ctx);
          frontier.push(move);
        }
      }
    } else{
      clearInterval(mazeIntervalId);
    }
  },1);

  // while (frontier.length > 0) {
  //   var randomIdx = Math.floor(Math.random()*(frontier.length));
  //   var randomFrontier = frontier.splice(randomIdx, 1)[0];
  //   // get random frontier cell's coordinates
  //   // Expand frontier into any valid neighbors
  //     //valid neighbor is one that doesn't have a neighbor other than the frontier cell that is also a path
  //   var newMoves = this.getValidMoves(randomFrontier);
  //   if (newMoves) {
  //     for (var i = 0; i < newMoves.length; i++) {
  //       var move = newMoves[i];
  //       var cell = grid.getCell(move);
  //       cell.makePath();
  //       cell.draw(ctx);
  //       frontier.push(move);
  //     }
  //   }
  // }
};

module.exports = Grid;

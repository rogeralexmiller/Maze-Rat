var Cell = require("./cell");

function Grid(ctx) {
  this.DIM_Y = 501;
  this.DIM_X = 501;
  this.cells = [];
  this.addCells();
  this.startPos = [0, 49];
  this.userPos = [0,49];
  this.ctx = ctx;
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

Grid.prototype.addCells = function(){
  this.cells = [];
  for (var i = 0; i < 50 ; i++) {
    var row = [];
    for (var j = 0; j < 50; j++) {
      var cell = new Cell([(i*10)+1,(j*10)+1],[i,j]);
      row.push(cell);
    }
    this.cells.push(row);
  }
};

Grid.prototype.draw = function(ctx) {
  ctx.fillStyle = "#FF0000";
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

  var upRight = [pos[0]-1, pos[1]+1];
  var upLeft = [pos[0]-1, pos[1]-1];
  var downRight = [pos[0]+1, pos[1]+1];
  var downLeft = [pos[0]+1, pos[1]-1];

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
  var startPos = this.startPos;
  var startCell = this.getCell(startPos);

  startCell.makePath();
  startCell.makeStart();
  startCell.draw(ctx);

  var grid = this;

  frontier.push(startPos);
  var lastPathCell = null;
  
  var mazeIntervalId = setInterval(function(){
    if (frontier.length > 0) {
      var randomIdx = Math.floor(Math.random()*(frontier.length));
      var randomFrontier = frontier.splice(randomIdx, 1)[0];

      var newMoves = grid.getValidMoves(randomFrontier);
      if (newMoves) {
        for (var i = 0; i < newMoves.length; i++) {
          var move = newMoves[i];
          var cell = grid.getCell(move);
          cell.makePath();
          cell.draw(ctx);
          frontier.push(move);
          lastPathCell = cell;
        }
      }
    } else{
      clearInterval(mazeIntervalId);
      lastPathCell.makeEnd();
      lastPathCell.draw(ctx);
    }
  },1);
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
    if (inBounds(option)) {
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
  //begin at start.
  // get valid moves.
  // Loop through move options.
    // move to a square. If it is the end, trace path back to beginning.
    // if it is not, add all the possible moves into the optional moves queue.
    // for each subsequent move, store the cell's parent and child.
    // To trace back to the start from the end, just ask for each cells parent.
  var moveQueue = [];
  var startCell = this.getCell(this.startPos);
  var pathOptions = this.getPathOptions(startCell, this.startPos);
  var grid = this;
  var mazeSolved = false;
  moveQueue = moveQueue.concat(pathOptions);
  var solveIntervalId = setInterval(function(){
    if (moveQueue.length > 0 && mazeSolved === false) {
      var move = moveQueue.shift();
      move.explore();
      move.draw(ctx);
      if (move.end) {
        grid.traceBackHome(move, ctx, solveIntervalId);
        mazeSolved = true;
      } else {
        var pathOptions = grid.getPathOptions(move);
        moveQueue = moveQueue.concat(pathOptions);
      }
    } else {
      // clearInterval(solveIntervalId);
    }
  }, 5);



};

module.exports = Grid;

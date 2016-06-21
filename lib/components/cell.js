function Cell(displayPos,gridCoords, grid){
  this.displayPos = displayPos;
  this.gridCoords = gridCoords;
  this.width = Cell.WIDTH;
  this.grid = grid;
  this.parent = null;
  this.children = [];
  this.state = {
    type: "wall",
    start: false,
    end: false,
    explored: false,
    solvePath: false,
    occupied: false,
    frontier: false,
    dead: false
  };
}

Cell.WALL_COLOR = "black";
Cell.PATH_COLOR = "white";
Cell.WIDTH = 10;

Cell.DELTAS = {
  up:         [1, 0],
  down:       [-1, 0],
  left:       [0, 1],
  right:      [0, -1],
  upRight:    [-1, 1],
  upLeft:     [-1, -1],
  downRight:  [1, 1],
  downLeft:   [1, -1]
};

Cell.prototype.makePath = function(){
  this.state.type = "path";
};

Cell.prototype.isChild = function(cell){
  var myChildren = this.children;
  for (var i = 0; i < myChildren.length; i++) {
    var child = myChildren[i];
    if (child.match(cell)){
      return true;
    }
  }
  return false;
};

Cell.prototype.getParent = function(){
  return this.parent ? this.parent : {gridCoords:[-1,-1]};
};


Cell.prototype.getMove = function(direction){
  myPos = this.gridCoords;
  var delta = Cell.DELTAS[direction];
  return [delta[0] + myPos[0], delta[1] + myPos[1]];
};

Cell.prototype.getMoves = function() {
  var directions = ["up","down","left","right"];
  var moves = [];
  for (var i = 0; i < directions.length; i++) {
    moves.push(this.getMove(directions[i]));
  }
  return moves;
};

Cell.prototype.checkMoveNeighbors = function(moveCell){
  var parent = this.getParent();
  var neighbors = moveCell.getValidNeighbors();
  for (var i = 0; i < neighbors.length; i++) {
    var neighbor = neighbors[i];
    if (!(neighbor.match(this) || neighbor.match(parent)) && neighbor.state.type === "path") {
      return false;
    }
  }
  return true;
};

Cell.prototype.validMove = function(moveCoords){
  if (!this.grid.inBounds(moveCoords)) {return false;}
  var moveCell = this.grid.getCell(moveCoords);
  var parent = this.getParent();
  if (moveCell.match(parent)) {return false;}
  return this.checkMoveNeighbors(moveCell);
};

Cell.prototype.getValidMoves = function(){
  var moves = this.getMoves();
  var cell = this;
  var validMoves =  moves.filter(function(move){
    return cell.validMove(move);
  });
  return validMoves.length > 0 ? validMoves : null;
};

Cell.prototype.match = function(cell){
  var otherCoords = cell.gridCoords;
  var myCoords = this.gridCoords;
  if (myCoords[0] === otherCoords[0] && myCoords[1] === otherCoords[1]) {
    return true;
  } else {
    return false;
  }
};

Cell.prototype.clearPath = function(){
  this.state.solvePath = false;
  this.state.dead = false;
  this.state.explored = false;
};

Cell.prototype.getNeighbors = function(){
  var pos = this.gridCoords;
  var directions = ["up","down","left","right", "upRight","downRight", "upLeft", "downLeft"];
  var neighbors = [];
  for (var i = 0; i < directions.length; i++) {
    var dir = directions[i];
    neighbors.push(this.getMove(dir));
  }
  return neighbors;
};

Cell.prototype.getValidNeighbors = function(){
  var neighbors = this.getNeighbors();
  var validNeighbors = [];

  for (var i = 0; i < neighbors.length; i++) {
    var neighbor = neighbors[i];
    if (this.grid.inBounds(neighbor)) {
      var neighborCell = this.grid.getCell(neighbor);
      validNeighbors.push(neighborCell);
    }
  }
  return validNeighbors;
};

Cell.prototype.draw = function(ctx){

  if (this.state.start) {
    ctx.fillStyle = "#00e229";
    ctx.fillRect(this.displayPos[0],this.displayPos[1],this.width, this.width);
    return;
  }

  if (this.state.end) {
    ctx.fillStyle = "red";
    ctx.fillRect(this.displayPos[0],this.displayPos[1],this.width, this.width);
    return;
  }

  if (this.state.occupied) {
    ctx.fillStyle = "yellow";
    ctx.fillRect(this.displayPos[0],this.displayPos[1],this.width, this.width);
    return;
  }

  if (this.state.solvePath) {
    ctx.fillStyle = "#ea5241";
    ctx.fillRect(this.displayPos[0],this.displayPos[1],this.width, this.width);
    return;
  }

  if (this.state.explored || this.state.dead) {
    ctx.fillStyle = "#a43cd8";
    ctx.fillRect(this.displayPos[0],this.displayPos[1],this.width, this.width);
    return;
  }

  switch(this.state.type){
    case "wall":
      ctx.fillStyle = "#000";
      ctx.fillRect(this.displayPos[0],this.displayPos[1],this.width, this.width);
      break;
    case "path":
      ctx.fillStyle = "white";
      ctx.fillRect(this.displayPos[0],this.displayPos[1],this.width, this.width);
      break;
  }
};

module.exports = Cell;

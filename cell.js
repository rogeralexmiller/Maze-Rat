function Cell(displayPos,gridCoords){
  this.displayPos = displayPos;
  this.gridCoords = gridCoords;
  this.width = Cell.WIDTH;
  this.state = "wall";
  this.start = false;
  this.end = false;
  this.explored = false;
  this.parent = null;
  this.children = [];
  this.solvePath = false;
}

Cell.WALL_COLOR = "black";
Cell.PATH_COLOR = "white";
Cell.WIDTH = 10;

Cell.prototype.makePath = function(){
  this.state = "path";
};

Cell.prototype.makeStart = function(){
  this.start = true;
};

Cell.prototype.makeEnd = function(){
  this.end = true;
};

Cell.prototype.explore = function(){
  this.explored = true;
};

Cell.prototype.draw = function(ctx){
  if (this.start) {
    ctx.fillStyle = "green";
    ctx.fillRect(this.displayPos[0],this.displayPos[1],this.width, this.width);
    return;
  }

  if (this.end) {
    ctx.fillStyle = "red";
    ctx.fillRect(this.displayPos[0],this.displayPos[1],this.width, this.width);
    return;
  }

  if (this.solvePath) {
    ctx.fillStyle = "blue";
    ctx.fillRect(this.displayPos[0],this.displayPos[1],this.width, this.width);
    return;
  }

  if (this.explored) {
    ctx.fillStyle = "gray";
    ctx.fillRect(this.displayPos[0],this.displayPos[1],this.width, this.width);
    return;
  }

  switch(this.state){
    case "wall":
      ctx.fillStyle = "black";
      ctx.fillRect(this.displayPos[0],this.displayPos[1],this.width, this.width);
      break;
    case "path":
      ctx.fillStyle = "white";
      ctx.fillRect(this.displayPos[0],this.displayPos[1],this.width, this.width);
      break;
  }
};

module.exports = Cell;

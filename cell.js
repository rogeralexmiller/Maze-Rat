function Cell(pos){
  this.pos = pos;
  this.width = Cell.WIDTH;
  this.state = "wall";
}

Cell.WALL_COLOR = "black";
Cell.PATH_COLOR = "white";
Cell.WIDTH = 10;

Cell.prototype.makePath = function(){
  this.state = "path";
};

Cell.prototype.draw = function(ctx){
  if (this.state === "wall") {
    ctx.fillRect(this.pos[0],this.pos[1],this.width, this.width);
  } else {
    ctx.clearRect(this.pos[0],this.pos[1],this.width, this.width);
  }
};


module.exports = Cell;

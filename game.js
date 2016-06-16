function Game(grid, ctx){
  this.ctx = ctx;
  this.grid = grid;
}

Game.MOVES = {
  "ArrowLeft": [ 0, -1],
  "ArrowUp": [-1,  0],
  "ArrowRight": [ 0,  1],
  "ArrowDown": [ 1,  0],
};

Game.prototype.moveUser = function(keyCode){
  var move = Game.MOVES[keyCode];
  grid.updateUserPos(move);
};

Game.prototype.playMaze = function () {
  this.lastTime = 0;
  //start the animation
  requestAnimationFrame(this.animate.bind(this));
};

Game.prototype.animate = function(time){
  this.grid.draw(this.ctx);
  this.lastTime = time;

  //every call to animate requests causes another call to animate
  requestAnimationFrame(this.animate.bind(this));
};

module.exports = Game;

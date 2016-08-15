var BuilderUtil = require("../utils/builderUtil");

function BfBuilder(grid){
  this.grid = grid;
  this.frontier = [];
  this.endCell = null;
}

BfBuilder.prototype.animateMaze = function(interval) {
  var builder = this;
  this.exploreStart();
  var mazeIntervalId = setInterval(function(){
    if (builder.frontier.length > 0) {
      frontierCell = builder.getRandomFrontier();
      if (builder.grid.validPath(frontierCell)) {
        builder.exploreFrontier(frontierCell);
      }
    } else{
      BuilderUtil.buildEnd(builder.endCell);
      $("button").prop("disabled", false);
      $("#solvers").show();
      clearInterval(mazeIntervalId);
    }
  }, interval);
};

BfBuilder.prototype.getRandomFrontier = function(){
  if (this.frontier.length === 0) {return null;}

  var randomIdx = Math.floor(Math.random()*(this.frontier.length));
  var randomFrontier = this.frontier.splice(randomIdx, 1)[0];
  var frontierCell = this.grid.getCell(randomFrontier);
  frontierCell.state.frontier = false;
  frontierCell.draw(this.grid.ctx);
  return frontierCell;
};

BfBuilder.prototype.exploreFrontier = function(frontierCell){
  frontierCell.makePath();
  frontierCell.draw(ctx);
  this.endCell = frontierCell;
  var newMoves = frontierCell.getValidMoves();
  if (newMoves) {BuilderUtil.addToFrontier(this, newMoves);}
};

BfBuilder.prototype.exploreStart = function(){
  var startCell = this.grid.getStartCell();
  BuilderUtil.buildStart(startCell);
  var firstMoves = startCell.getValidMoves();
  BuilderUtil.addToFrontier(this, firstMoves);
};

BfBuilder.prototype.buildMaze = function() {
  this.exploreStart();
  while (this.frontier.length > 0){
    frontierCell = this.getRandomFrontier();
    if (this.grid.validPath(frontierCell)) {
      this.exploreFrontier(frontierCell);
    }
  }
  $("#solvers").show();
  BuilderUtil.buildEnd(this.endCell);
};

module.exports = BfBuilder;

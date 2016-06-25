var BuilderUtil = require("../utils/builderUtil");

function DfBuilder(grid){
  this.grid = grid;
  this.frontier = [];
}

DfBuilder.prototype.animateMaze = function(interval) {
  var builder = this;
  this.exploreStart();

  var mazeIntervalId = setInterval(function(){
    if (builder.frontier.length > 0) {
      frontierCell = builder.getRandomDeepFrontier();
      if (builder.grid.validPath(frontierCell)) {
        builder.exploreFrontier(frontierCell);
      }
    } else{
      builder.buildEnd();
      clearInterval(mazeIntervalId);
    }
  }, interval);
};

DfBuilder.prototype.exploreFrontier = function(frontierCell){
  frontierCell.makePath();
  frontierCell.draw(ctx);

  var newMoves = frontierCell.getValidMoves();

  if (newMoves) {
    this.addToFrontier(newMoves);
  }
};

DfBuilder.prototype.addToFrontier = function(moves){
  this.frontier = this.frontier.concat(moves);
};

DfBuilder.prototype.exploreStart = function(){
  var startCell = this.grid.getStartCell();
  BuilderUtil.buildStart(startCell);
  var firstMoves = startCell.getValidMoves();
  this.addToFrontier(firstMoves);
};

DfBuilder.prototype.buildEnd = function(){
  while(true){
    var randCoords = BuilderUtil.getRandomCoords();
    var randCell = this.grid.getCell(randCoords);
    if (randCell.state.type === "path" && randCell.gridCoords[0] > 20 && randCell.gridCoords[1] > 20) {
      randCell.state.end = true;
      randCell.grid.end = randCell;
      randCell.draw(this.grid.ctx);
      return;
    }
  }
};

DfBuilder.prototype.getRandomDeepFrontier = function(){
  if (this.frontier.length === 0) {return null;}
  var deepestIdx = this.frontier.length - 1;

  var randomNum = Math.floor(Math.random()*5);
  var randomFrontier = this.frontier.splice(deepestIdx-randomNum, 1)[0];
  return this.grid.getCell(randomFrontier);
};

DfBuilder.prototype.buildMaze = function() {
  this.exploreStart();
  while (this.frontier.length > 0){
    frontierCell = this.getRandomDeepFrontier();
    if (this.grid.validPath(frontierCell)) {
      this.exploreFrontier(frontierCell);
    }
  }
  this.buildEnd();
};

module.exports = DfBuilder;

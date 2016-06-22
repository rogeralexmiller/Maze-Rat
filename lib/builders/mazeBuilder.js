function MazeBuilder(grid){
  this.grid = grid;
  this.frontier = [];
  this.endCell = null;
}

MazeBuilder.prototype.animateMaze = function(interval) {
  var frontier = [];
  var grid = this.grid;
  var startCell = grid.getStartCell();
  var ctx = this.grid.ctx;

  startCell.makePath();
  startCell.state.start = true;
  startCell.draw(grid.ctx);

  var firstMoves = [[0,48],[1,49]];

  for (var i = 0; i < firstMoves.length; i++) {
    var move = firstMoves[i];
    var moveCell = grid.getCell(move);
    startCell.children.push(moveCell);
    moveCell.parent = startCell;
    moveCell.state.frontier = true;
    moveCell.draw(ctx);
  }

  frontier = frontier.concat([[0,48],[1,49]]);

  var lastPathCell = null;

  var mazeIntervalId = setInterval(function(){
    if (frontier.length > 0) {
      var randomIdx = Math.floor(Math.random()*(frontier.length));
      var randomFrontier = frontier.splice(randomIdx, 1)[0];
      var frontierCell = grid.getCell(randomFrontier);
      frontierCell.state.frontier = false;
      if (grid.validPath(randomFrontier)) {
        frontierCell.makePath();
        frontierCell.draw(ctx);
        lastPathCell = frontierCell;
        var newMoves = frontierCell.getValidMoves();
        if (newMoves) {
          for (var i = 0; i < newMoves.length; i++) {
            var move = newMoves[i];
            var moveCell = grid.getCell(move);
            moveCell.parent = frontierCell;
            frontierCell.children.push(moveCell);
            moveCell.state.frontier = true;
            moveCell.draw(ctx);
          }
          frontier = frontier.concat(newMoves);
        } else{
          var frontierChildren = frontierCell.children;
          for (var j = 0; j < frontierChildren.length; j++) {
            var child = frontierChildren[j];
            child.state.frontier = false;
          }
        }
      }
    } else{
      clearInterval(mazeIntervalId);
      lastPathCell.state.end = true;
      grid.end = lastPathCell;
      lastPathCell.draw(ctx);
    }
  },interval);
};

var buildStart = function(startCell){
  startCell.makePath();
  startCell.state.start = true;
  startCell.draw(startCell.grid.ctx);
};

var buildEnd = function(endCell){
  endCell.state.end = true;
  endCell.grid.end = endCell;
  endCell.draw(endCell.grid.ctx);
};

MazeBuilder.prototype.getRandomFrontier = function(){
  if (this.frontier.length === 0) {return null;}

  var randomIdx = Math.floor(Math.random()*(this.frontier.length));
  var randomFrontier = this.frontier.splice(randomIdx, 1)[0];
  return this.grid.getCell(randomFrontier);
};

MazeBuilder.prototype.exploreFrontier = function(frontierCell){
  frontierCell.makePath();
  frontierCell.draw(ctx);
  this.endCell = frontierCell;
  var newMoves = frontierCell.getValidMoves();
  if (newMoves) {this.addToFrontier(newMoves);}
};

MazeBuilder.prototype.addToFrontier = function(moves){
  this.frontier = this.frontier.concat(moves);
};

MazeBuilder.prototype.exploreStart = function(){
  var startCell = this.grid.getStartCell();
  buildStart(startCell);
  var firstMoves = startCell.getValidMoves();
  this.addToFrontier(firstMoves);
};

MazeBuilder.prototype.buildMaze = function() {
  this.exploreStart();
  while (this.frontier.length > 0){
    frontierCell = this.getRandomFrontier();
    if (grid.validPath(frontierCell)) {
      this.exploreFrontier(frontierCell);
    }
  }
  buildEnd(this.endCell);
};

module.exports = MazeBuilder;

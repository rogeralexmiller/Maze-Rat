function MazeBuilder(grid){
  this.grid = grid;
}

MazeBuilder.prototype.buildMaze = function() {
  var frontier = [];
  var grid = this.grid;
  var startCell = grid.getStartCell();
  var ctx = this.grid.ctx;

  startCell.makePath();
  startCell.start = true;
  startCell.draw(grid.ctx);

  var firstMoves = [[0,48],[1,49]];

  for (var i = 0; i < firstMoves.length; i++) {
    var move = firstMoves[i];
    var moveCell = grid.getCell(move);
    startCell.children.push(moveCell);
    moveCell.parent = startCell;
    moveCell.frontier = true;
    moveCell.draw(ctx);
  }

  frontier = frontier.concat([[0,48],[1,49]]);

  var lastPathCell = null;

  var mazeIntervalId = setInterval(function(){
    if (frontier.length > 0) {
      var randomIdx = Math.floor(Math.random()*(frontier.length));
      var randomFrontier = frontier.splice(randomIdx, 1)[0];
      var frontierCell = grid.getCell(randomFrontier);
      frontierCell.frontier = false;
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
            moveCell.frontier = true;
            moveCell.draw(ctx);
          }
          frontier = frontier.concat(newMoves);
        } else{
          var frontierChildren = frontierCell.children;
          for (var j = 0; j < frontierChildren.length; j++) {
            var child = frontierChildren[j];
            child.frontier = false;
          }
        }
      }
    } else{
      clearInterval(mazeIntervalId);
      lastPathCell.end = true;
      grid.end = lastPathCell;
      lastPathCell.draw(ctx);
    }
  },1);
};

module.exports = MazeBuilder;

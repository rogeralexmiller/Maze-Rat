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
    moveCell.parent = startCell;
  }

  frontier = frontier.concat([[0,48],[1,49]]);

  var lastPathCell = null;

  var mazeIntervalId = setInterval(function(){
    if (frontier.length > 0) {
      var randomIdx = Math.floor(Math.random()*(frontier.length));
      var randomFrontier = frontier.splice(randomIdx, 1)[0];
      var frontierCell = grid.getCell(randomFrontier);
      // debugger;
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
          }
          // debugger;
          frontier = frontier.concat(newMoves);
        }
      }
    } else{
      clearInterval(mazeIntervalId);
      lastPathCell.end = true;
      lastPathCell.draw(ctx);
    }
  },1);
};
module.exports = MazeBuilder;

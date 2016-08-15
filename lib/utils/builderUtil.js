module.exports = {
  buildStart: function(startCell){
    startCell.makePath();
    startCell.state.start = true;
    startCell.draw(startCell.grid.ctx);
  },

  addToFrontier: function(builder, moveCoords){
    moveCoords.forEach(function(move){
      var cell = builder.grid.getCell(move);
      cell.state.frontier = true;
      cell.draw(builder.grid.ctx);
    });
    builder.frontier = builder.frontier.concat(moveCoords);
  },

  buildEnd: function(endCell){
    endCell.state.end = true;
    endCell.grid.end = endCell;
    endCell.draw(endCell.grid.ctx);
  },

  getRandomCoords: function(){
    var randRow = Math.floor(Math.random()*49);
    var randCol = Math.floor(Math.random()*49);
    return [randRow, randCol];
  }
};

module.exports = {
  buildStart: function(startCell){
    startCell.makePath();
    startCell.state.start = true;
    startCell.draw(startCell.grid.ctx);
  },

  buildEnd: function(endCell){
    endCell.state.end = true;
    endCell.grid.end = endCell;
    endCell.draw(endCell.grid.ctx);
  }
};

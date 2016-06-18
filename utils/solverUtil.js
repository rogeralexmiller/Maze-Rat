var SolverUtil = {
  traceBackHome: function(cell, ctx, solveIntervalId){
    if (cell.start === true) {
      clearInterval(solveIntervalId);
      return;
    } else {
      var parent = cell.parent;
      parent.solvePath = true;
      parent.draw(ctx);
      SolverUtil.traceBackHome(parent, ctx);
    }
  },

  getPathOptions: function(cell){
    var grid = cell.grid;

    var options = cell.getMoves();

    var paths = [];
    for (var i = 0; i < options.length; i++) {
      var option = options[i];
      if (grid.inBounds(option)) {
        var optionCell = grid.getCell(option);
        if (optionCell.state === "path" && optionCell.explored === false) {
          optionCell.parent = cell;
          paths.push(optionCell);
        }
      }
    }
    return paths;
  },

  pathDistance: function(){
    var cells = grid.cells;
    var count = 0;
    for (var i = 0; i < cells.length; i++) {
      if (cells[i].solvePath) {
        count++;
      }
    }
    return count;
  }
};

module.exports = SolverUtil;

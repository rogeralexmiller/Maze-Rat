var SolverUtil = {
  traceBackHome: function(cell, interval){
    setTimeout(function(){
      if (cell.state.start === true) {
        return;
      } else {
        var parent = cell.parent;
        parent.state.solvePath = true;
        parent.draw(cell.grid.ctx);
        SolverUtil.traceBackHome(parent, interval);
      }
    }, interval);
  },

  getPathOptions: function(cell, grid){

    var options = cell.getMoves();

    var paths = [];
    for (var i = 0; i < options.length; i++) {
      var option = options[i];
      if (grid.inBounds(option)) {
        var optionCell = grid.getCell(option);
        if (optionCell.state.type === "path" && optionCell.state.explored === false) {
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
      if (cells[i].state.solvePath) {
        count++;
      }
    }
    return count;
  }
};

module.exports = SolverUtil;

var SolverUtil = {
  traceBackHome: function(cell){
    setTimeout(function(){
      if (cell.state.start === true) {
        $("button").prop("disabled", false);
        return;
      } else {
        var parent = cell.parent;
        parent.state.solvePath = true;
        parent.draw(cell.grid.ctx);
        SolverUtil.traceBackHome(parent);
      }
    }, 20);
    cell.grid.active = false;
  },

  chartPathOptions: function(solver, cell){
    var pathOptions = SolverUtil.getPathOptions(cell);
    solver.moves = solver.moves.concat(pathOptions);
  },

  reset: function(solver){
    solver.solved = false;
    solver.moves = [];
  },

  explorePath: function(move){
    move.state.explored = true;
    move.draw(move.grid.ctx);
  },

  getPathOptions: function(cell){

    var options = cell.getMoves();

    var paths = [];
    for (var i = 0; i < options.length; i++) {
      var option = options[i];
      if (cell.grid.inBounds(option)) {
        var optionCell = cell.grid.getCell(option);
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

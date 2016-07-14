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
    }, 0);
  },

  chartPathOptions: function(solver, cell){
    var pathOptions = SolverUtil.getPathOptions(cell);
    solver.moves = solver.moves.concat(pathOptions);
  },

  reset: function(solver){
    solver.solved = false;
    solver.moves = [];
    solver.time = 0;
    solver.timerId = null;
  },

  startTimer: function(solver, timerId){
    solver.timerId = setInterval(function(){
      solver.time = solver.time+100;
      var seconds = Math.floor(solver.time / 1000);
      var decisecs = (solver.time % 1000)/100;
      $(timerId).html("Time: "+seconds+"."+decisecs);
    }, 100);
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

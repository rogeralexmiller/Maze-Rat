var BuilderUtil = require("../utils/builderUtil");

function DijkstraTest(grid){
  this.grid = grid;
}

var validWall = function(pos){
  var row = pos[1];
  var col = pos[0];

  if ((col > 10 && col < 40) && row === 10) {
    return true;
  }
  if (col === 40 && ( row > 9 && row < 40)) {
    return true;
  }
  return false;
};

DijkstraTest.prototype.build = function(){
  var cells = this.grid.cells;
  for (var i = 0; i < cells.length; i++) {
    var col = cells[i];
    for (var j = 0; j < col.length; j++) {
      var cell = col[j];
      if(!validWall(cell.gridCoords)){
        cell.state.type = "path";
        cell.draw(this.grid.ctx);
      }
    }
  }
  var startCell = this.grid.getStartCell();
  BuilderUtil.buildStart(startCell);
  var endCell = this.grid.getCell([28,8]);
  BuilderUtil.buildEnd(endCell);
  $("#solvers").show();
};

module.exports = DijkstraTest;

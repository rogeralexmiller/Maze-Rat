function StreetBuilder(grid){
  this.grid = grid;

}

StreetBuilder.prototype.buildStreets = function(){

  var cells = this.grid.cells;
  for (var i = 0; i < cells.length; i++) {
    var row = cells[i];
    if (i % 2 === 0) {
      for (var j = 0; j < row.length; j++) {
        var evenCol = row[j];
        evenCol.state = "path";
        evenCol.draw(this.grid.ctx);
      }
    } else{
      for (var k = 0; k < row.length; k++) {
        if (k % 2 === 0) {
          var oddCol = row[k];
          oddCol.state = "path";
          oddCol.draw(this.grid.ctx);
        }
      }
    }
  }
  var startCell = this.grid.getStartCell();
  startCell.start = true;
  startCell.path = true;
  startCell.draw(this.grid.ctx);
  var endCell = cells[49][0];
  endCell.end = true;
  grid.end = endCell;
  endCell.draw(this.grid.ctx);
};


module.exports = StreetBuilder;

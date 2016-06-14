var React = require("react");

var Grid = React.createClass({

  makeGrid: function(){
    var grid = [];
    for (var i = 0; i < 500; i++) {
      for (var j = 0; j < 500; i++) {
        grid.push([i,j])
      }
    }
    return grid;
  },

  render: function(){
    var grid = this.makeGrid();
    console.log(grid);
    return(
      <div className="grid group">
        {grid.map(function(coords){
          return(
            <div className="cell" data-pos={coords}>
            </div>
          );
        })}
      </div>
    );
  }
});

module.exports = Grid;

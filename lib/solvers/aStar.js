var SolverUtil = require("../utils/solverUtil");

function AStar(grid){
  this.grid = grid;
  this.ctx = this.grid.ctx;
  this.solved = false;
  this.currentCell = grid.getStartCell();
  this.time = 0;
  this.timerId = null;
  this.distance = 0;
  this.distanceId = "#astar-distance";
  this.heap = [];
  this.heapPos = 0;
}


// Include heuristic to favor nodes that are closer to end.
// still need ned keep track of distance to beginning
AStar.prototype.validPath = function(cell){
  if (cell.state.type === "path" && (cell.state.explored === false) && !cell.state.start) {
    return true;
  } else {
    return false;
  }
};

AStar.prototype.extractHeapMin = function(){
  var min = this.heap[1];
  this.heap[1] = this.heap.pop();
  this.heapPos --;
  this.sinkDown(1);
  return min;
};

AStar.prototype.sinkDown = function(idx){
  var sinkIdx = idx;

  if (2*idx < this.heapPos && this.heap[sinkIdx].distance > this.heap[2*idx].distance) {
    sinkIdx = 2*idx;
  }

  if (2*idx+1 < this.heapPos && this.heap[sinkIdx].distance > this.heap[2*idx+1].distance) {
    sinkIdx = 2*idx+1;
  }

  if (sinkIdx !== idx) {
    this.heapSwap(idx, sinkIdx);
    this.sinkDown(sinkIdx);
  }
};

AStar.prototype.bubbleUpFromIdx = function(idx){
  var parentIdx = idx;

  if (Math.floor(idx/2) < this.heapPos && this.heap[parentIdx].distance > this.heap[idx].distance) {
    parentIdx = Math.floor(idx/2);
    this.heapSwap(idx, parentIdx);
    this.bubbleUpFromIdx(parentIdx);
  }

};

AStar.prototype.heapSwap = function(idx1, idx2){
  var temp = this.heap[idx1];
  this.heap[idx1] = this.heap[idx2];
  this.heap[idx2] = temp;
  temp.heapIdx = idx1;
  this.heap[idx1].heapIdx = idx2;
};

AStar.prototype.heapInsert = function(cell){
  if (this.heapPos === 0){
    this.heap[1] = cell;
    cell.heapIdx = 1;
    this.heapPos = 2;
    return;
  }
  this.heap[this.heapPos] = cell;
  cell.heapIdx = this.heapPos;
  this.heapPos ++;
  this.bubbleUp();
};

AStar.prototype.updateHeap = function(cell){
  var heapParent = this.heap[Math.floor(cell.heapIdx/2)];
  var heapLeft = this.heap[cell.heapIdx*2];
  var heapRight = this.heap[cell.heapIdx*2];
  if (heapParent && heapParent.distance > cell.distance) {
    this.bubbleUpFromIdx(cell.heapIdx);
  }
  if ((heapLeft && cell.distance > heapLeft.distance) || (heapRight && cell.distance > heapRight.distance)) {
    this.sinkDown(cell.heapIdx);
  }
};

AStar.prototype.bubbleUp = function(){
  var cellIdx = this.heapPos - 1;
  var cell = this.heap[cellIdx];
  var parentIdx = Math.floor(Math.floor(cellIdx/2));
  var parent = this.heap[parentIdx];
  while (cellIdx > 0 && parent && cell && parent.distance > cell.distance) {
    this.heapSwap(cellIdx, parentIdx);
    cellIdx = Math.floor(cellIdx/2);
    cell = this.heap[cellIdx];
    parentIdx = Math.floor(cellIdx/2);
    parent = this.heap[parentIdx];
  }
};



AStar.prototype.moveToClosestNeighbor = function(){
  SolverUtil.explorePath(this.currentCell);
  // get closest neighbor by finding unexplored neighbor with lowest value.
  this.currentCell = this.extractHeapMin();
};

AStar.prototype.getPathOptions = function(cell){
  var options = cell.getMoves();
  var paths = [];

  for (var i = 0; i < options.length; i++) {
    var option = options[i];
    if (this.grid.inBounds(option)) {
      var optionCell = this.grid.getCell(option);
      if (this.validPath(optionCell)) {
        paths.push(optionCell);
      }
    }
  }
  return paths;
};

AStar.prototype.updateNeighbors = function(){
  var neighbors = this.getPathOptions(this.currentCell);
  for (var i = 0; i < neighbors.length; i++) {
    var neighbor = neighbors[i];
    if (neighbor.distance) {
      if (this.currentCell.distance + 1 < neighbor.distance) {
        neighbor.distance = neighbor.startDistance + neighbor.endDistance;
        this.updateHeap(neighbor);
      }
    } else{
      neighbor.startDistance = this.currentCell.startDistance + 1;
      neighbor.endDistance = this.calcDistance(neighbor, this.grid.end);
      neighbor.distance = neighbor.startDistance + neighbor.endDistance;
      neighbor.parent = this.currentCell;
      this.heapInsert(neighbor);
    }
  }
};

AStar.prototype.calcDistance = function(cell1, cell2){
  var startPos = cell1.gridCoords;
  var endPos = cell2.gridCoords;
  var row1 = startPos[0];
  var row2 = endPos[0];
  var col1 = startPos[1];
  var col2 = endPos[1];
  return Math.pow(Math.pow((row2 - row1),2) + Math.pow((col2 - col1),2),0.5);
};

AStar.prototype.solve = function(){
  SolverUtil.reset(this);
  this.grid.clearChildren();
  this.currentCell = this.grid.getStartCell();
  SolverUtil.startTimer(this, "#astar-time");
  this.currentCell.endDistance = this.calcDistance(this.currentCell, this.grid.end);
  this.currentCell.startDistance = 0;
  this.currentCell.distance = this.currentCell.endDistance + this.currentCell.startDistance;
  this.heap = [];
  this.heapPos = 0;
  var solver = this;

  var solveIntervalId = setInterval(function(){
    if (solver.solved === false) {
      if (solver.currentCell.state.end) {
        clearInterval(solver.timerId);
        SolverUtil.traceBackHome(solver.currentCell, solver);
        solver.solved = true;
      } else{
        solver.updateNeighbors();
        solver.moveToClosestNeighbor();
      }
    } else {
      $("button").prop("disabled", false);
      clearInterval(solveIntervalId);
    }
  }, 0);

};

module.exports = AStar;

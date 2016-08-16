# Maze Rat

[Maze Rat live][rogercodes]
[rogercodes]: http://rogercodes.com/maze-rat

Maze Rat is a series of visualizations built with JavaScript and HTML5 Canvas that are designed to illustrate the power of algorithms that build and solve mazes.

![Maze-Rat]

[Maze-Rat]: ./docs/images/maze.png

## General Implementation

### The blank canvas and the grid behind it.

The core architecture of Maze Rat is a canvas element that reflects the state of a JavaScript grid component that is essentially a two-dimensional array of cell components.

Each of these cells keeps track of its state and renders itself in different colors depending on the state. The `Grid` class initializes with pure wall cells, so at first the grid is colored pure black.

## Maze generation

One of the most challenging aspects of this project was to translate the abstract logic of the random-traversal algorithm into JavaScript code. The random traversal algorithm works by keeping track of a 'frontier' of nodes that represent options for where the maze path might branch out to, then selecting one of these nodes randomly to branch out from. To maintain a maze-like structure I had to exclude frontier cells that would intersect with an existing maze branch.

```
Grid.prototype.validPath = function(coords){
  var cell = this.getCell(coords);
  var parent = cell.parent ? cell.parent : {gridCoords:[-1,-1]};
  var grandparent = parent.parent ? parent.parent : {gridCoords:[-1,-1]};
  var siblings = parent.children;

  var neighbors = cell.getValidNeighbors(this);
  for (var i = 0; i < neighbors.length; i++) {
    var neighbor = neighbors[i];
    if (neighbor.match(grandparent) || neighbor.match(parent) || parent.isChild(neighbor)) {
    } else{
      if (neighbor.state.type=== "path") {
        return false;
      }
    }
  }
  return true;
};
```

Initially, the method above only ensured that the cell at the input coordinates was not intersecting directly with another maze branch, but it did not take into account diagonally adjacent cells, which resulted in mazes which were more reminiscent of product scanner codes than classical mazes.

Of course, when a maze path turns a corner, its frontier cell is adjacent diagonally to the cell that precedes its parent, so I had to adjust the filter to ignore cases where the adjacent cell was a direct 'ancestor' of the frontier cell.

The animation of this algorithm was accomplished by wrapping the maze generation steps inside a `setInterval()` function that halts the code for a millisecond after each cycle. The interval is cleared once there are no more frontiers to explore.

## Maze Solving

Visitors to Maze Rat have three options for solving the randomly generated mazes: a breadth-first search, a depth-first search, and a naive implementation of A* search.

### Breadth-first

A breadth-first search solves a maze by keeping a queue (first in, first out) of all possible moves it can take from a given position and exploring each of those moves before exploring the possible moves that follow one of those choices. In this way, the maze is explored in a uniform manner, spreading out to the full width of the grid, until the end is found, at which point the solver traces its way back to the start of the maze, therby finding the shortest path.

```
utils/SolverUtil.js

traceBackHome: function(cell, solver){
  if (cell.state.start === true) {
    clearInterval(solveIntervalId);
    return;
  } else {
    var parent = cell.parent;
    parent.solvePath = true;
    parent.draw(ctx);
    SolverUtil.traceBackHome(parent, solver);
  }
}
...
```

The method above traces the 'solvePath' by recursively  finding a cell's parent until the cell has the attribute 'start' set to true.

Like the maze-building algorithm, breadth-first, depth-first and A* are all animated by wrapping their steps inside an interval that is only cleared once the maze is solved.

### Depth-first

The depth-first search algorithm takes the inverse approach of its breadth-first cousin. Instead of a queue to store its possible paths, depth-first using a stack (first in, last out), so that the algorithm will go as deep into the grid as it can before exploring an alternate branch.

### RogerSolver

RogerSover (my algorithm) is markedly different than depth or breadth-first. Rather than exploring a grid blindly, it knows the coordinates of the endpoint and favors trying out paths that bring it closer. This is not to be confused with A*, however. Unlike A*, RogerSolver does not factor each node's distance from the starting point into the algorithm, and therefore will not always find the shortest path between two nodes on a graph.

At each step, the algorithm sends out an exploratory probe and finds all possible valid moves it can make, then calculates how close each of those moves are to the end, and prioritizes those moves that bring it the closest. If the exploring probe gets to a dead end, where it has no choice but to backtrack, it traces its way back to a fork in the maze where it has a valid move.

```
RogerSolver.js

...
RogerSolver.prototype.traceBackToFork = function(){
  if (!this.deadEnd(this.currentCell)) {
    return;
  } else {
    this.markDeadEnd(this.currentCell);
    this.jumpToParent();
    this.traceBackToFork();
  }
};
...
```

## A*

A* is a pathfinding algorithm based on Dijkstra's but improves upon it by using a heuristic
that favors exploring paths that bring the current node closer to the end node first.

This actually only requires a slight change in Dijkstra's algorithm. When updating
the distance values of a nodes neighbors, the algorithm calculates the neighbor's
horizontal and vertical distance from the end node and adds that to the neighbor's distance from
the start to calculate the nodes total distance value.

Watching the algorithm find a shortest path on the Dijkstra's test graph reveals
how this subtle change effects the behavior of the algorithm. Rather than exploring
the maze as wide as possible, A* favors first exploring nodes that are closest to
the end node of the graph.

## A* Test

To test the effectiveness of my implementation of the A* algorithm, I created a simple
graph with a single L-shaped wall.

## Street Tested

While building the maze generators and solvers I was curious to see how the various solvers would do if given a simple city street grid structure to navigate to find an end point. I started by building a simple class, `streetBuilder` to construct a grid of alternating walls and paths, setting the beginning to the bottom-left corner, and the end to the top right.

This allows users to compare how the solving algorithms behave in a more realistic path-finding scenario. Whereas the depth-first search algorithm finds a valid path to the end faster, it's solution is wildly inefficient and convoluted. Breadth-first search, on the other hand, floods the grid searching the shortest paths first, and thus finds a shortest path. Similarly, the RogerSolver, DijkstraSolver and A* algorithms all find a valid shortest path.

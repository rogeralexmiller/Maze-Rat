# Maze-Rat

## MVP
Maze-Rat will be a two-part visualization showing how a random-traversal algorithm
generates a maze, and how the breadth-first search algorithm can then solve that
maze.

1. Visually interesting visualization showing how a random-traversal algorithm
  can build a maze.
2. Visually interesting visualization showing how a breadth-first-search algorithm
  can then solve that maze.

## Design Docs
![Maze-Rat]

[Maze-Rat]: ./wireframes/Maze-Rat.png
## Completion Timeline

### Phase 1: Maze Generation (1.5 days)

- [x] Create project
- [x] Set up Project with webpack
- [x] Write Grid class that stores cells
- [x] Write Cell class that stores its display position and position in the grid
- [x] Write maze building method for grid that builds a maze with the random step
      algorithm and animates the process
- [x] Add button to trigger maze generation

### Phase 2: Maze solving (1.5 days)

- [x] Write maze solving method for the grid class that uses breadth-first search
      to find the end of the maze.
- [x] Add state variables to the cell class to represent the start and end of the maze.
- [x] Add state variables to the cell class to represent cells being explored and the shortest path.
- [x] Add styling to make more visually appealing

### Bonus Features
- [x] Add depth-first search algorithm as a maze solving option
- [x] Add A* algorithm
- [x] Add a different algorithm for generating mazes
- [ ] Allow users to navigate mazes

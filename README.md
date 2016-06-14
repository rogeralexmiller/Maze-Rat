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

[Maze-Rat]: ./docs/wireframes/Maze-Rat.png
## Completion Timeline

### Phase 1: Maze Generation (1.5 days)

- [ ] Create project
- [ ] Set up React with webpack
- [ ] Write pure javascript backend class representing grid with methods to change
    the state of a blank cell to a wall, and to randomly pick an edge coordinate
    to be the end.
- [ ] Write grid react component to set up 20x20 grid on DOM
- [ ] Write maze generator class to generate maze on the backend, which will trigger re-renders
    on the DOM
- [ ] Add button to trigger maze generation

### Phase 2: Maze solving (1.5 days)

- [ ] Write maze solver class for the backend, implementing breadth-first search.
- [ ] Add styles to make visualizations more appealing.

### Bonus Features
- Add depth-first search algorithm as a maze solving option
- Add my own naive algorithm for solving mazes

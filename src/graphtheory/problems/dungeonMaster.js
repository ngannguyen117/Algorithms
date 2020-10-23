import { Queue } from '../../datastructures/queue';
/**
 * You are trapped in a 2D dungeon and need to find the quickest way out!
 * The dungeon is composed of unit cubes which may or may not be filled with rock.
 * It takes one minute to move one unit north, south, east, west.
 * You cannot move diagonally and the maze is surrounded by solid rock on all sides.
 * 
 * Is an escape possible? If yes, how many steps will it take?
 * 
 *    S . . # . . .
 *    . # . . . # .
 *    . # . . . . .
 *    . . # # . . .
 *    # . # E . # .
 */
export const dungeonMaster = (grid, startRow, startCol) => {
  const numRows = grid.length;
  const numCols = grid[0].length;
  const rowDirection = [-1, 1, 0, 0];
  const colDirection = [0, 0, 1, -1];
  const rowQueue = new Queue(startRow);
  const colQueue = new Queue(startCol);

  // variables to track number of steps taken
  let moveCount = 0;
  let nodesLeftInLayer = 1;
  let nodesInNextLayer = 0;
  let reachEnd = false;

  // a numRows x numCols matrix to check if a node is visited
  const visited = [];
  const rowVisited = [];
  for (let i = 0; i < numCols; i++) rowVisited.push(false);
  for (let i = 0; i < numRows; i++) visited.push([...rowVisited]);
  visited[startRow][startCol] = true;

  const exploreNeighbors = (row, col) => {
    for (let i = 0; i < 4; i++) {
      const rr = rowDirection[i] + row;
      const cc = colDirection[i] + col;

      if (rr < 0 || rr >= numRows) continue;
      if (cc < 0 || cc >= numCols) continue;
      if (visited[rr][cc]) continue;
      if (grid[rr][cc] === '#') continue;

      visited[rr][cc] = true;
      rowQueue.enqueue(rr);
      colQueue.enqueue(cc);
      nodesInNextLayer++;
    }
  };

  while (!rowQueue.isEmpty()) {
    const row = rowQueue.dequeue();
    const col = colQueue.dequeue();

    if (grid[row][col] === 'E') {
      reachEnd = true;
      break;
    }

    exploreNeighbors(row, col);
    nodesLeftInLayer--;
    if (nodesLeftInLayer === 0) {
      nodesLeftInLayer = nodesInNextLayer;
      nodesInNextLayer = 0;
      moveCount++;
    }
  }

  return reachEnd ? moveCount : -1;
};

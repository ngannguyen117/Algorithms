import { APSPFloydWarshall } from '../allPairShortestPath';

test('Test All Pair Shortest Paths using Floyd-Warshall to find shortest distances and paths', () => {
  //    |   0   1   2   3   4   5   6
  //  --------------------------------
  //  0 |   0   2   5   ∞   ∞   ∞   10
  //  1 |   ∞   0   2   ∞   11  ∞   ∞
  //  2 |   ∞   ∞   0   ∞   ∞   ∞   2
  //  3 |   ∞   ∞   ∞   0   ∞   ∞   ∞
  //  4 |   ∞   ∞   ∞   ∞   0   1   ∞
  //  5 |   ∞   ∞   ∞   ∞   -2  0   ∞
  //  6 |   ∞   ∞   ∞   ∞   ∞   11  0

  //                (0)         (3)
  //              /  |  \
  //           2 /  5|   \6
  //            /    |    \
  //           <  2  <  2  >
  //          (1)-->(2)--->(6)
  //           |            |
  //        11 |            | 11
  //           |            |
  //           <      1     >
  //          (4)----------(5)
  //             <---------
  //                  -2

  // set up test matrix
  const matrix = [];
  const size = 7;
  for (let i = 0; i < size; i++) {
    matrix[i] = [...Array(size)].fill(Infinity);
    matrix[i][i] = 0;
  }

  matrix[0][1] = 2;
  matrix[0][2] = 5;
  matrix[0][6] = 10;
  matrix[1][2] = 2;
  matrix[1][4] = 11;
  matrix[2][6] = 2;
  matrix[6][5] = 11;
  matrix[4][5] = 1;
  matrix[5][4] = -2;

  const solver = APSPFloydWarshall(matrix);
  expect(solver.shortestDistance(0, 0)).toBe(0);
  expect(solver.shortestDistance(0, 2)).toBe(4);
  expect(solver.shortestDistance(1, 6)).toBe(4);
  expect(solver.shortestDistance(1, 3)).toBe(Infinity);
  expect(solver.shortestDistance(2, 1)).toBe(Infinity);
  expect(solver.shortestDistance(1, 5)).toBe(-Infinity);
  expect(solver.shortestDistance(6, 4)).toBe(-Infinity);

  expect(solver.shortestPath(0, 2)).toStrictEqual([0, 1, 2]);
  expect(solver.shortestPath(1, 6)).toStrictEqual([1, 2, 6]);
  expect(solver.shortestPath(1, 3)).toStrictEqual([]);
  expect(solver.shortestPath(2, 1)).toStrictEqual([]);
  expect(solver.shortestPath(1, 5)).toBeNull();
  expect(solver.shortestPath(6, 4)).toBeNull();

  expect(solver.sssp(0)).toStrictEqual([0, 2, 4, Infinity, -Infinity, -Infinity, 6]);
  expect(solver.sssp(2)).toStrictEqual([Infinity, Infinity, 0, Infinity, -Infinity, -Infinity, 2]);
});

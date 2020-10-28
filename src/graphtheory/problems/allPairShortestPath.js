
/**
 * Compute All Pair Shortest Paths using Floyd-Warshall's algorithm
 * 
 * This algorithm can find the shortest distances and paths between all pairs of nodes.
 * 
 * Time Complexity: O(V^3)
 * Space Complexity: O(V^2)
 * 
 * Graph size: Small (no more than a couple hundreds vertices)
 * 
 * Best for: Finding APSP (also works with negative edge weight graphs)
 * 
 * @param {number[][]} matrix an adjaciency matrix representation of the graph
 */
export const APSPFloydWarshall = matrix => {
  const n = matrix.length;
  const dp = [];
  const next = [];

  // Initialize dp and next arrays
  for (let i = 0; i < n; i++)
    for (let j = 0; j < n; j++) {
      if (!dp[i]) dp[i] = [];
      dp[i][j] = matrix[i][j];

      if (matrix[i][j] !== Infinity) {
        if (!next[i]) next[i] = [];
        next[i][j] = j;
      }
    }

  // Compute all pairs shortest paths
  for (let k = 0; k < n; k++)
    for (let i = 0; i < n; i++)
      for (let j = 0; j < n; j++)
        if (dp[i][k] + dp[k][j] < dp[i][j]) {
          dp[i][j] = dp[i][k] + dp[k][j];
          next[i][j] = next[i][k];
        }

  // Detect negative cycles
  for (let k = 0; k < n; k++)
    for (let i = 0; i < n; i++)
      for (let j = 0; j < n; j++)
        if (dp[i][k] + dp[k][j] < dp[i][j]) {
          dp[i][j] = -Infinity;
          next[i][j] = -1;
        }

  return {
    shortestPath: (start, end) => {
      if (dp[start][end] === Infinity) return []; // not reachable

      const path = [];
      let at = start;
      for ( ; at !== end && at !== -1; at = next[at][end]) path.push(at);

      // the path from start to end contains nodes that are part of or affected by negative cycles
      if (at === -1) return null;

      path.push(end);
      return path;
    },
    sssp: start => dp[start],
    shortestDistance: (start, end) => dp[start][end],
  };
};

/**
 * Depth First Search implementation using Javascript (based on a William Fiset's DFS Java implementation)
 *
 * @author Ngan Nguyen, ngan.tx.nguyen@gmail.com
 *
 * Date: 10/21/2020
 * 
 * Depth First Search (DFS):
 *  - the most fundamental search algorithm used to explore nodes and edges of a graph
 *  - By itself, it isn't useful but when augmented to perform other tasks then DFS really shines
 *  - O(V + E)
 *  - a DFS plunges depth first into a graph without regards for which edge it takes next until it cannot go any further, at which point it backtracks and continues.
 *  - We can augment the DFS algorithm to:
 *    - Find/count connected components for undirected graphs, find Strongly Connected Components for directed graphs - Tarjan's
 *    - Determine connectivity
 *    - Compute a graph's Minimum Spanning Tree
 *    - Detect and find cycle in a graph
 *    - Check if a graph is bipartite
 *    - Topologically sort the nodes of a graph
 *    - Find bridges and articulation points
 *    - Find augmenting paths in a flow network
 *    - Generate maze
 * 
 * Pseudocode:
 *  global or class scope variables
 *  - n = number of nodes in the graph
 *  - g = adjaciency list representation of the graph
 *  - visited = [false, ..., false] (of size n)
 * 
 *  Depth first search declaration
 *  function dfs(i):
 *    if (visited[i]): return;
 *    visited[i] = true:
 *    for (neighbor of g[i]): dfs(neighbor)
 * 
 *  Start dfs at node 0
 *  - dfs(0)
 */

import { Edge } from '../../utils/graph';
import { ArrayStack } from '../../datastructures/stack';

export const Type = Object.freeze({
  RECURSIVE: 1,
  ITERATIVE: 2,
});

/**
 * Perform an depth first search on a graph to count the number of nodes
 * traversed starting at some point.
 * @param {Map<number, Edge[]>} graph Adjaciency list representation of a graph
 * @param {number} start the index of the first vertex to be visited
 * @param {number} numNodes the number of vertices in the graph
 * @param {Type} type either recursive or iterative
 * @returns {number} the number of nodes traversed
 */
export const dfs = (graph, start, numNodes, type) => {
  const visited = [];
  for (let i = 0; i < numNodes; i++) visited[i] = false;

  switch (type) {
    case Type.RECURSIVE:
      const dfsRecursive = i => {
        if (visited[i]) return 0;
      
        visited[i] = true;
        let count = 1;
      
        const edges = graph.get(i);
        if (edges)
          for (let edge of edges) count += dfsRecursive(edge.to);
        
        return count;
      };

      return dfsRecursive(start);
    case Type.ITERATIVE:
      let count = 0;
      const stack = new ArrayStack();

      // Start by visiting the starting vertex
      stack.push(start);
      visited[start] = true;

      while (!stack.isEmpty()) {
        const node = stack.pop();
        count++;

        const edges = graph.get(node);
        if (edges) for (let edge of edges)
          if (!visited[edge.to]) {
            stack.push(edge.to);
            visited[edge.to] = true;
          }
      }

      return count;
  }
};

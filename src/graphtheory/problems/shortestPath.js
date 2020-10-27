/**
 * Shortest Path algorithms implementation using different technique depending on types of graphs
 * 
 * These Javascript implementation is based on William Fiset's Java implementation.
 * 
 * @author Ngan Nguyen, ngan.tx.nguyen@gmail.com
 */

import { topSort } from '../fundamental/topologicalSort';
import { Edge } from '../../utils/graph';

/**
 * Single Source Shortest Path (SSSP) finds the shortest distances
 * from a provided start node to all other nodes in the graph.
 * 
 * This implementation only works for DAGs. It goes through the 
 * topological ordering (found by applying top sort on the graph)
 * to compute all the shortest distances from the start node.
 * 
 * Complexity O(V + E)
 * 
 * @param {Map<number, Edge[]>} graph an adjaciency representation of a DAG 
 * @param {number} numVertices number of vertices of the graph 
 * @param {number} start the starting's node index
 * @returns {number[]} an array of indexes holding the distances from the start node to all other nodes
 */
export const SSSPTopSort = (graph, numVertices, start) => {
  const topologicalOrdering = topSort(graph, numVertices);
  const dist = [];
  dist[start] = 0;

  for (let id of topologicalOrdering)
    if (dist[id] != null) {
      const edges = graph.get(id);
      if (edges) for (let edge of edges) {
        const newDist = dist[id] + edge.cost;
        dist[edge.to] = dist[edge.to] ? Math.min(dist[edge.to], newDist) : newDist;
      }
  }

  return dist;
};

/**
 * Find the shortest path from a starting node to an ending node on a DAG using top sort.
 * This implementation terminates early when it reaches the end node.
 * 
 * Complexity O(V + E)
 * 
 * @param {Map<number, Edge[]>} graph an adjaciency representation of a DAG 
 * @param {number} numVertices number of vertices of the graph 
 * @param {number} start the starting node's index
 * @param {number} end the ending node's index
 * @returns {{distance: number; path: number[]}} distance from start to end and an array of
 * indexes showing the shortest path from start node to end node
 */
export const shortestPathTopSort = (graph, numVertices, start, end) => {
  const topologicalOrdering = topSort(graph, numVertices);
  const prev = [];
  const dist = [];
  dist[start] = 0;

  let index = 0;
  let id = topologicalOrdering[index];
  while (id !== end) {
    if (dist[id] != null) {
      const edges = graph.get(id);
      if (edges) for (let edge of edges) {
        const newDist = dist[id] + edge.cost;
        if (!dist[edge.to] || newDist < dist[edge.to]) {
          dist[edge.to] = newDist;
          prev[edge.to] = id;
        }
      }
    }

    id = topologicalOrdering[++index];
  }

  const path = [];
  for (let at = end; at != null; at = prev[at]) path.push(at);
  path.reverse();

  if (path[0] !== start) return { distance: null, path: [] };
  return { distance: dist[end], path };
};

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
 * @param {Map<number, Edge[]>} graph an adjaciency representation of a DAG 
 * @param {number} numVertices number of vertices of the graph 
 * @param {number} start the starting index
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

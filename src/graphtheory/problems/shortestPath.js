/**
 * Shortest Path algorithms implementation using different technique depending on types of graphs
 * 
 * These Javascript implementation is based on William Fiset's Java implementation.
 * 
 * @author Ngan Nguyen, ngan.tx.nguyen@gmail.com
 */

import { topSort } from '../fundamental/topologicalSort';
import { Edge } from '../../utils/graph';
import { IndexedDHeap } from '../../datastructures/priorityqueue';

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

/**
 * Single Source Shortest Path with Dijkstra's algorithm.
 * 
 * Find the shortest distances from a starting node to all nodes on
 * NON-NEGATIVE edge weight graphs using Dijkstra's algorithm (cycles allowed).
 * The non-negative edge weight constraint is imposed to ensure that
 * once a node has been visited, its optimal distance cannot be improved.
 * 
 * This property is important because it enables Dijkstra's algorithm to
 * act in a greedy manner by always selecting the next most promising node.
 * 
 * In a lazy implementation:
 *  - Use a priority queue to keep track of the next most promising node
 *  - Store stale (index, distance) pairs => waste space
 *  - Optimization: skip this iteration if the current best distance is better than the one we just receive from the PQ.
 *  - Complexity O(E x log(V))
 * 
 * In an eager implementation:
 *  - Use an Indexed Priority Queue to efficiently update the (index, distance) pairs with better distance found
 *  - In addition, if we use a D-ary heap, it'll speed up update operations (deletes are a little bit slower). Best D = E/V
 *  - Complexity O(E x log base D of (V))
 *  - Much better for dense graphs which have a lot of decrease key operations.
 * 
 * @param {Map<number, Edge[]>} graph an adjaciency representation of a non-negative edge weight graph
 * @param {number} numVertices number of vertices of the graph 
 * @param {number} start the starting node's index
 * @returns {number[]} an array of indexes holding the distances from the start node to all other nodes
 */
export const SSSPDijkstras = (graph, numVertices, start) => {
  let edgeCount = 0;
  for (let edges of graph.values()) edgeCount += edges.length;

  // Keep an Indexed Priority Queue (ipq) of the next most promising node to visit
  const degree = Math.floor(edgeCount / numVertices);
  const ipq = new IndexedDHeap(degree, numVertices);
  ipq.insert(start, 0);

  // Maintain an array of the minimum distance to each node.
  const dist = [...Array(numVertices)].fill(Number.POSITIVE_INFINITY);
  dist[start] = 0;

  const visited = [...Array(numVertices)].fill(false);

  while (!ipq.isEmpty()) {
    const nodeId = ipq.peakKeyIndex();

    visited[nodeId] = true;
    const value = ipq.pollValue();

    // We already found a better path before we got to process this node so we can ignore it
    if (value > dist[nodeId]) continue;

    const edges = graph.get(nodeId);
    if (edges) for (let edge of edges) {
      if (visited[edge.to]) continue;

      // Relax edge by updating minimum cost if applicable.
      const newDist = dist[nodeId] + edge.cost;
      if (newDist < dist[edge.to]) {
        dist[edge.to] = newDist;

        if (ipq.contains(edge.to)) ipq.decrease(edge.to, newDist);
        else ipq.insert(edge.to, newDist);
      }
    }
  }

  return dist;
};

/**
 * Find the shortest path from a starting node to an ending node on
 * NON-NEGATIVE edge weight graphs using Dijkstra's algorithm.
 * This implementation terminates early when it reaches the end node.
 * 
 * @param {Map<number, Edge[]>} graph an adjaciency representation of a non-negative edge weight graph
 * @param {number} numVertices number of vertices of the graph 
 * @param {number} start the starting node's index
 * @param {number} end the ending node's index
 * @returns {{distance: number; path: number[]}} distance from start to end and an array of
 * indexes showing the shortest path from start node to end node
 */
export const shortestPathDijkstras = (graph, numVertices, start, end) => {
  let edgeCount = 0;
  for (let edges of graph.values()) edgeCount += edges.length;

  const degree = Math.floor(edgeCount / numVertices);
  const ipq = new IndexedDHeap(degree, numVertices);
  ipq.insert(start, 0);

  const dist = [...Array(numVertices)].fill(Number.POSITIVE_INFINITY);
  const visited = [...Array(numVertices)].fill(false);
  const prev = [];
  dist[start] = 0;

  while (!ipq.isEmpty()) {
    if (nodeId === end) break;

    const nodeId = ipq.peakKeyIndex();
    visited[nodeId] = true;
    const value = ipq.pollValue();
    if (value > dist[nodeId]) continue;

    const edges = graph.get(nodeId);
    if (edges) for (let edge of edges) {
      const newDist = dist[nodeId] + edge.cost;
      if (newDist < dist[edge.to]) {
        dist[edge.to] = newDist;
        prev[edge.to] = nodeId;

        if (ipq.contains(edge.to)) ipq.decrease(edge.to, newDist);
        else ipq.insert(edge.to, newDist);
      }
    }
  }

  // reconstruct path
  const path = [];
  for (let at = end; at != null; at = prev[at]) path.push(at);
  path.reverse();

  if (path[0] !== start) return { distance: null, path: [] };
  return { distance: dist[end], path };
};

/**
 * Single Source Shortest Path (SSSP) finds the shortest distances from a provided
 * start node to all other nodes in the graph using Bellman Ford algorithm
 * 
 * Bellman Ford's algorithm has higher time complexity than Dijkstra's so we only
 * use this algorithm when there are negative edge weights in a directed graph.
 * It can also detect negative cycles.
 * 
 * Complexity O(VE)
 * 
 * @param {Map<number, Edge[]>} graph an adjaciency representation of a DAG 
 * @param {number} numVertices number of vertices of the graph 
 * @param {number} start the starting's node index
 * @returns {number[]} an array of indexes holding the distances from the start node to all other nodes
 */
export const SSSPBellmanFord = (graph, numVertices, start) => {
  const dist = [...Array(numVertices)].fill(Number.POSITIVE_INFINITY);
  dist[start] = 0;

  // Only in the worst case does it take V-1 iterations for the Bellman-Ford
  // algorithm to complete. Another stopping condition is when we're unable to
  // relax an edge, this means we have reached the optimal solution early.
  let relaxable = true;

  // For each vertex, apply relaxation for all the edges
  for (let i = 0; i < numVertices - 1 && relaxable; i++) {
    relaxable = false;
    for (let edges of graph.values())
      for (let edge of edges)
        if (dist[edge.from] + edge.cost < dist[edge.to]) {
          dist[edge.to] = dist[edge.from] + edge.cost;
          relaxable = true;
        }
  }

  // Run algorithm a second time to detect which nodes are part
  // of a negative cycle. A negative cycle has occurred if we
  // can find a better path beyond the optimal solution.
  for (let i = 0; i < numVertices - 1 && relaxable; i++) {
    relaxable = false;
    for (let edges of graph.values())
      for (let edge of edges)
        if (dist[edge.from] + edge.cost < dist[edge.to]) {
          dist[edge.to] = Number.NEGATIVE_INFINITY;
          relaxable = true;
        }
  }

  return dist;
};

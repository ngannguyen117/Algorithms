/**
 * Single Source Shortest Path algorithms implementation using different technique depending on different types of graphs
 * 
 * These Javascript implementation is based on William Fiset's Java implementation.
 * 
 * @author Ngan Nguyen, ngan.tx.nguyen@gmail.com
 * 
 * NOTES for SSSP:
 *  - Top Sort: weighted Directed Acyclic Graphs. Complexity: O(V + E)
 *  - BFS: large, unweighted graphs. Complexity: O(V + E)
 *  - Dijkstra's: Large/Medium non-negative edge weight graphs. Complexity:  O((V + E) x log(V))
 *  - Bellman Ford's: Small weighted graphs with negative edge weight. Complexity: O(VE) [max: a couple of hundreds vertices]
 * 
 * Belman Ford can detect negative cycles
 */

import { topSort } from '../fundamental/topologicalSort';
import { Edge } from '../../utils/graph';
import { IndexedDHeap } from '../../datastructures/priorityqueue';
import { Queue } from '../../datastructures/queue';

/**
 * Single Source Shortest Path (SSSP) finds the shortest distances from a provided
 * start node to all other nodes in DIRECTED ACYCLIC GRAPHs.
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
  const dist = Array(numVertices).fill(Infinity);
  dist[start] = 0;

  for (let id of topologicalOrdering)
    if (dist[id] != Infinity) {
      const edges = graph.get(id);
      if (edges) for (let edge of edges) {
        const newDist = dist[id] + edge.cost;
        dist[edge.to] = Math.min(dist[edge.to], newDist);
      }
    }

  return dist;
};

/**
 * Single Source Shortest Path (SSSP) finds the shortest distances from a provided
 * start node to all other nodes in Undirected Unweighted graphs using BFS.
 * 
 * Complexity O(V + E)
 * 
 * @param {Map<number, Edge[]>} graph an adjaciency representation of a Undirected Unweighted graph
 * @param {number} numVertices number of vertices of the graph 
 * @param {number} start the starting's node index
 * @returns {number[]} an array of indexes holding the distances from the start node to all other nodes
 */
export const SSSPBFS = (graph, numVertices, start) => {
  const visited = Array(numVertices).fill(false);
  const dist = Array(numVertices).fill(Infinity);
  const queue = new Queue(start);
  visited[start] = true;
  let nodesLeftInLayer = 1;
  let nodesInNextLayer = 0;
  let layer = 0;

  while (!queue.isEmpty()) {
    const at = queue.dequeue();
    dist[at] = layer;

    const edges = graph.get(at);
    if (edges) for (let edge of edges)
      if (!visited[edge.to]) {
        visited[edge.to] = true;
        queue.enqueue(edge.to);
        nodesInNextLayer++;
      }
    
    nodesLeftInLayer--;
    if (nodesLeftInLayer === 0 && nodesInNextLayer) {
      nodesLeftInLayer = nodesInNextLayer;
      nodesInNextLayer = 0;
      layer++;
    }
  }

  return dist;
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
 *  - Complexity O((V + E) x log(V))
 * 
 * In an eager implementation:
 *  - Use an Indexed Priority Queue to efficiently update the (index, distance) pairs with better distance found
 *  - In addition, if we use a D-ary heap, it'll speed up update operations (deletes are a little bit slower). Best D = E/V
 *  - Complexity O((V + E) x log base D of (V))
 *  - Much better for dense graphs which have a lot of decrease key operations.
 * 
 * @param {Map<number, Edge[]>} graph an adjaciency representation of a non-negative edge weight graph
 * @param {number} numVertices number of vertices of the graph 
 * @param {number} start the starting node's index
 * @returns {number[]} an array of indexes holding the distances from the start node to all other nodes
 */
export const SSSPDijkstras = (graph, numVertices, start) => {
  let numEdges = 0;
  for (let edges of graph.values()) numEdges += edges.length;

  // Keep an Indexed Priority Queue (ipq) of the next most promising node to visit
  const ipq = new IndexedDHeap(Math.floor(numEdges / numVertices), numVertices);
  ipq.insert(start, 0);

  // Maintain an array of the minimum distance to each node.
  const dist = Array(numVertices).fill(Infinity);
  dist[start] = 0;

  const visited = Array(numVertices).fill(false);

  while (!ipq.isEmpty()) {
    const nodeId = ipq.peakKeyIndex();
    visited[nodeId] = true;

    // We already found a better path before we got to process this node so we can ignore it
    if (ipq.pollValue() > dist[nodeId]) continue;

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
 * Single Source Shortest Path (SSSP) finds the shortest distances from a provided
 * start node to all other nodes in the graph using Bellman Ford algorithm
 * 
 * Bellman Ford's algorithm has higher time complexity than Dijkstra's so we only
 * use this algorithm when there are negative edge weights in a directed graph.
 * It can also detect negative cycles.
 * 
 * Complexity O(VE)
 * 
 * @param {Map<number, Edge[]>} graph an adjaciency representation of a graph 
 * @param {number} numVertices number of vertices of the graph 
 * @param {number} start the starting's node index
 * @returns {number[]} an array of indexes holding the distances from the start node to all other nodes
 */
export const SSSPBellmanFord = (graph, numVertices, start) => {
  const dist = Array(numVertices).fill(Infinity);
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
  relaxable = true;
  for (let i = 0; i < numVertices - 1 && relaxable; i++) {
    relaxable = false;
    for (let edges of graph.values())
      for (let edge of edges)
        if (dist[edge.from] + edge.cost < dist[edge.to]) {
          dist[edge.to] = -Infinity;
          relaxable = true;
        }
  }

  return dist;
};

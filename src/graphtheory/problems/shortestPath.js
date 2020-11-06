/**
 * Shortest Path algorithms implementation using different technique depending on different types of graphs
 * 
 * These Javascript implementation is based on William Fiset's Java implementation.
 * 
 * @author Ngan Nguyen, ngan.tx.nguyen@gmail.com
 * 
 * NOTES for finding SP from start node to end node:
 *  - Top Sort: weighted Directed Acyclic Graphs. Complexity: O(V + E)
 *  - BFS: large, unweighted, unweighted graphs. Complexity: O(V + E)
 *  - Dijkstra's: Large/Medium non-negative edge weight graphs. Complexity:  O((V + E) x log(V))
 */

import { topSort } from '../fundamental/topologicalSort';
import { Edge } from '../../utils/graph';
import { IndexedDHeap } from '../../datastructures/priorityqueue';
import { Queue } from '../../datastructures/queue';

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
  const ordering = topSort(graph, numVertices);
  const prev = [];
  const dist = Array(numVertices).fill(Infinity);
  dist[start] = 0;

  for (let i = 0, id = ordering[i]; i < numVertices && id !== end; id = ordering[++i])
    if (dist[id] != Infinity) {
      const edges = graph.get(id);
      if (edges) for (let edge of edges) {
        const newDist = dist[id] + edge.cost;
        if (newDist < dist[edge.to]) {
          dist[edge.to] = newDist;
          prev[edge.to] = id;
        }
      }
    }

  const path = [];
  for (let at = end; at != null; at = prev[at]) path.push(at);
  path.reverse();

  if (path[0] !== start) return { distance: null, path: [] };
  return { distance: dist[end], path };
};

/**
 * Find the SP using Breadth First Search on undirected, unweighted graph
 * 
 * @param {Map<number, Edge[]>} graph an adjaciency representation of a undirected graph
 * @param {number} numVertices number of vertices of the graph 
 * @param {number} start the starting node's index
 * @param {number} end the ending node's index
 * @returns {{distance: number; path: number[]}} distance from start to end and an array of
 * indexes showing the shortest path from start node to end node
 */
export const shortestPathBFS = (graph, numVertices, start, end) => {
  const visited = Array(numVertices).fill(false);
  const queue = new Queue(start);
  const prev = [];
  let distance = 0;
  let nodesLeftInLayer = 1;
  let nodesInNextLayer = 0;
  visited[start] = true;

  while (!queue.isEmpty()) {
    const at = queue.dequeue();
    if (at === end) break;

    const edges = graph.get(at);
    if (edges) for (let edge of edges)
      if (!visited[edge.to]) {
        visited[edge.to] = true;
        queue.enqueue(edge.to);
        nodesInNextLayer++;
        prev[edge.to] = at;
      }
    
    nodesLeftInLayer--;
    if (nodesLeftInLayer === 0 && nodesInNextLayer) {
      nodesLeftInLayer = nodesInNextLayer;
      nodesInNextLayer = 0;
      distance++;
    }
  }

  // reconstruct path
  const path = [];
  for (let at = end; at != null; at = prev[at]) path.push(at);
  path.reverse();

  if (path[0] !== start) return { distance: null, path: [] };
  return { distance, path };
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
  let numEdges = 0;
  for (let edges of graph.values()) numEdges += edges.length;

  const ipq = new IndexedDHeap(Math.floor(numEdges / numVertices), numVertices);
  ipq.insert(start, 0);

  const dist = Array(numVertices).fill(Infinity);
  const visited = Array(numVertices).fill(false);
  const prev = [];
  dist[start] = 0;

  while (!ipq.isEmpty()) {
    const at = ipq.peakKeyIndex();
    if (at === end) break;
    visited[at] = true;

    if (ipq.pollValue() > dist[at]) continue;

    const edges = graph.get(at);
    if (edges) for (let edge of edges) {
      if (visited[edge.to]) continue;

      const newDist = dist[at] + edge.cost;
      if (newDist < dist[edge.to]) {
        dist[edge.to] = newDist;
        prev[edge.to] = at;

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

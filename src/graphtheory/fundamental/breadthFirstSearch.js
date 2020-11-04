/**
 * Breadth First Search implementation using Javascript (based on a William Fiset's BFS Java implementation)
 *
 * @author Ngan Nguyen, ngan.tx.nguyen@gmail.com
 *
 * Date: 10/22/2020
 * 
 * Breadth First Search (BFS):
 *  - fundamental search algorithm used to explore nodes and edges of a graph
 *  - a BFS starts at some arbitrary node of a graph, and explores the neighbor nodes first before moving to the next level neighbors.
 *  - O(V + E)
 *  - Very useful for finding the shortest path on unweighted graphs
 */

import { Edge } from '../../utils/graph';
import { Queue } from '../../datastructures/queue';

/**
 * Perform a bfs on the graph from a start node to find the previous node of each node.
 */
const bfs = (graph, size, start) => {
  const visited = Array(size).fill(false);
  const prev = Array(size).fill(-1);
  const queue = new Queue(start);
  visited[start] = true;

  while (!queue.isEmpty()) {
    const at = queue.dequeue();
    const neighbors = graph.get(at);
    if (neighbors) for (let edge of neighbors)
      if (!visited[edge.to]) {
        queue.enqueue(edge.to);
        visited[edge.to] = true;
        prev[edge.to] = at;
      }
  }

  return prev;
};

/**
 * Find a path from startNode to endNode inclusive using breadth first search.
 * 
 * If the edges are unweighted then this method returns the shortest path from 'start' to 'end'
 * @param {Map<number, Edge[]>} graph An adjaciency list representation of a graph
 * @param {number} size number of vertices of the graph
 * @param {number} startNode starting vertex
 * @param {number} endNode ending vertex
 * @returns {number[]} an array of indexes showing the path to go from start to end, if it exists
 */
export const reconstructPath = (graph, size, startNode, endNode) => {
  const prev = bfs(graph, size, startNode);
  const path = [];
  for (let at = endNode; at !== -1; at = prev[at]) path.push(at);

  path.reverse();
  return path[0] === startNode ? path : [];
};

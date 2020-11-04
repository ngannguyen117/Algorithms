/**
 * Topological Sort Javascript implementation based on William Fiset's Java implementation
 * 
 * Date 10/27/2020
 * 
 * @author Ngan Nguyen, ngan.tx.nguyen@gmail.com
 * 
 * Topological Sort (top sort):
 *  - Top sort is an algorithm that find topological ordering of a Directed Acyclic Graph (DAG)
 *  - Complexity: O(V + E)
 *  - Usage: (many real world situations can be modelled as a graph with directed edges where some events must occur before others)
 *    - School class prerequisite
 *    - Program dependencies
 *    - Event scheduling
 *    - Assembly instructions
 *  - Topological Ordering: 
 *    - An ordering of nodes in a directed graph where for each directed edge from node A to node B, node A must appears before node B in the ordering.
 *    - Topological orderings are not unique.
 */

import { Edge } from '../../utils/graph';
import { Queue } from '../../datastructures/queue';

export const Method = Object.freeze({
  DFS: 'Depth First Search',
  KAHNS: 'Kahn Algorithm',
});

const dfs = (graph, numVertices) => {
  const helper = (index, at) => {
    visited[at] = true;

    const edges = graph.get(at);
    if (edges) for (let edge of edges)
      if (!visited[edge.to]) index = helper(index, edge.to);

    ordering[index] = at;
    return index - 1;
  };
  
  const ordering = [];
  const visited = Array(numVertices).fill(false);
  
  let orderingIndex = numVertices - 1;
  for (let at = 0; at < numVertices; at++)
    if (!visited[at]) orderingIndex = helper(orderingIndex, at);
  
  return ordering;
};

const kahns = (graph, numVertices) => {
  const inDegree = Array(numVertices).fill(0);
  for (let i = 0; i < numVertices; i++) {
    const edges = graph.get(i);
    if (edges) for (let edge of edges)
      inDegree[edge.to]++;
  }

  const queue = new Queue();
  for (let i = 0; i < numVertices; i++)
    if (inDegree[i] === 0) queue.enqueue(i);

  const ordering = [];
  while (!queue.isEmpty()) {
    const at = queue.dequeue();
    ordering.push(at);

    const edges = graph.get(at);
    if (edges) for (let edge of edges) {
      inDegree[edge.to]--;
      if (inDegree[edge.to] === 0) queue.enqueue(edge.to);
    }
  }

  return ordering;
};

/**
 * Find topological ordering of a Directed Acyclic Graph
 * @param {Map<number, Edge[]>} graph an adjaciency list representation of a DAG
 * @param {number} numVertices number of vertices in the graph
 * @returns {number[]} an array holds the topological ordering of the graph
 */
export const topSort = (graph, numVertices, method) => {
  switch (method) {
    case Method.DFS:
      return dfs(graph, numVertices);
    case Method.KAHNS:
    default:
      return kahns(graph, numVertices);
  }
};

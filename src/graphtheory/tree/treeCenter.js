import { Edge } from '../../utils/graph';

export const Method = Object.freeze({
  PEEL_ONION: 'peeling an onion',
  FIND_LONGEST_PATH: 'finding the longest path',
});

/**
 * Finding the centers by removing leaf nodes layer by layer until we reach the center
 */
const peelOnion = graph => {
  // record each node's degree and find leaf nodes
  const degree = [];
  let leaves = [];
  for (let i = 0; i < graph.size; i++) {
    degree[i] = graph.get(i).length;
    if (degree[i] <= 1) leaves.push(i);
  }

  let processedLeaves = leaves.length;
  while (processedLeaves < graph.size) {
    const newLeaves = [];
    for (let leafId of leaves) {
      for (let edge of graph.get(leafId))
        if (--degree[edge.to] === 1) newLeaves.push(edge.to);
        
      degree[leafId] = 0;
    }

    processedLeaves += newLeaves.length;
    leaves = newLeaves;
  }

  return leaves; // center Id(s)
};

/**
 * TODO: Find the centers of the tree from the longest path found by DFS
 */
const findLongestPath = graph => {

};

/**
 * Finding center of an undirected tree (A connected graph with N nodes and N-1 edges)
 * This can become handy when we want to select a good node to root an undirected tree.
 * 
 * O(v + E)
 * @param {Map<number, Edge[]>} graph an adjaciency list representation of an undirected tree
 */
export const treeCenter = (graph, method) => {
  switch (method) {
    case Method.FIND_LONGEST_PATH:
      return findLongestPath(graph);
    case Method.PEEL_ONION:
    default:
      return peelOnion(graph);
  }
};

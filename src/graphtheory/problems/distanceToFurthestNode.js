import { Edge } from '../../utils/graph';
import { Queue } from '../../datastructures/queue';

/**
 * Compute the distance to the furthest node from the starting node using BFS
 * @param {Map<number, Edge[]>} graph 
 * @param {number} size number of vertices
 * @param {number} startNode
 * @returns {number} the distance
 */
export const computeDistanceToFurthestNode = (graph, size, startNode) => {
  const visited = Array(size).fill(false);
  visited[startNode] = true;

  let steps = 0;
  let nodesLeftInLayer = 1;
  let nodesInNextLayer = 0;
  const queue = new Queue(startNode);

  while (!queue.isEmpty()) {
    const at = queue.dequeue();

    const edges = graph.get(at);
    if (edges) for (let edge of edges)
      if (!visited[edge.to]) {
        visited[edge.to] = true;
        queue.enqueue(edge.to);
        nodesInNextLayer++;
      }

    nodesLeftInLayer--;
    if (nodesLeftInLayer === 0 && nodesInNextLayer) {
      steps++;
      nodesLeftInLayer = nodesInNextLayer;
      nodesInNextLayer = 0;
    }
  }

  return steps;
};

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
  const visited = [];
  for (let i = 0; i < size; i++) visited.push(false);
  visited[startNode] = true;

  let distance = -1;
  let nodesLeftInLayer = 1;
  let nodesInNextLayer = 0;
  const queue = new Queue(startNode);

  while (!queue.isEmpty()) {
    const at = queue.dequeue();
    const neighbors = graph.get(at);

    if (neighbors) for (let edge of neighbors)
      if (!visited[edge.to]) {
        visited[edge.to] = true;
        queue.enqueue(edge.to);
        nodesInNextLayer++;
      }

    nodesLeftInLayer--;
    if (nodesLeftInLayer === 0) {
      distance++;
      nodesLeftInLayer = nodesInNextLayer;
      nodesInNextLayer = 0;
    }
    
  }

  return distance;
};

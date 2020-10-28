import { computeDistanceToFurthestNode } from '../distanceToFurthestNode';
import { addUndirectedEdge } from '../../../utils/graph';

test('Test distance to the furthest node from a starting node', () => {
  //                     0
  //                /    |    \
  //   5 --- 6 --- 7 --- 11    9
  //                        /     \
  //                      10 - 1 - 8 --- 12 --- 2 --- 3 --- 4

  const size = 13;
  const graph = new Map();
  addUndirectedEdge(graph, 0, 7);
  addUndirectedEdge(graph, 0, 9);
  addUndirectedEdge(graph, 0, 11);
  addUndirectedEdge(graph, 1, 10);
  addUndirectedEdge(graph, 2, 3);
  addUndirectedEdge(graph, 2, 12);
  addUndirectedEdge(graph, 3, 4);
  addUndirectedEdge(graph, 5, 6);
  addUndirectedEdge(graph, 6, 7);
  addUndirectedEdge(graph, 7, 11);
  addUndirectedEdge(graph, 8, 1);
  addUndirectedEdge(graph, 8, 9);
  addUndirectedEdge(graph, 8, 12);
  addUndirectedEdge(graph, 9, 10);

  expect(computeDistanceToFurthestNode(graph, size, 10)).toBe(6);
  expect(computeDistanceToFurthestNode(graph, size, 7)).toBe(7);
});

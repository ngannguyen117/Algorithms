import { reconstructPath } from '../breadthFirstSearch';
import { addUndirectedEdge } from '../../../utils/graph';

test('Test finding a path from start node to end node using Breadth First Search', () => {
  const size = 14;
  const graph = new Map(); // unweighted graph
  addUndirectedEdge(graph, 0, 7);
  addUndirectedEdge(graph, 0, 9);
  addUndirectedEdge(graph, 0, 11);
  addUndirectedEdge(graph, 7, 11);
  addUndirectedEdge(graph, 7, 6);
  addUndirectedEdge(graph, 7, 3);
  addUndirectedEdge(graph, 6, 5);
  addUndirectedEdge(graph, 3, 4);
  addUndirectedEdge(graph, 2, 3);
  addUndirectedEdge(graph, 2, 12);
  addUndirectedEdge(graph, 12, 8);
  addUndirectedEdge(graph, 8, 1);
  addUndirectedEdge(graph, 1, 10);
  addUndirectedEdge(graph, 10, 9);
  addUndirectedEdge(graph, 9, 8);

  expect(reconstructPath(graph, size, 10, 5)).toStrictEqual([10, 9, 0, 7, 6, 5]);
  expect(reconstructPath(graph, size, 10, 13)).toStrictEqual([]); // no path from 10 to 13
});

import { dfs, Type } from '../depthFirstSearch';
import { addDirectedEdge } from '../../../utils/graph';

describe('Test Depth First Search algorithm', () => {
  let graph;
  let numNodes = 5;

  beforeEach(() => {
    // Create a fully connected graph
    //           (0)
    //           / \
    //        5 /   \ 4
    //         /     \
    // 10     <   -2  >
    //   +->(2)<------(1)      (4)
    //   +--- \       /
    //         \     /
    //        1 \   / 6
    //           > <
    //           (3)

    graph = new Map();
    addDirectedEdge(graph, 0, 1, 4);
    addDirectedEdge(graph, 0, 2, 5);
    addDirectedEdge(graph, 1, 2, -2);
    addDirectedEdge(graph, 1, 3, 6);
    addDirectedEdge(graph, 2, 3, 1);
    addDirectedEdge(graph, 2, 2, 10); // Self loop
  });

  test('Test recursive dfs', () => {
    expect(dfs(graph, 0, numNodes, Type.RECURSIVE)).toBe(4);
    expect(dfs(graph, 4, numNodes, Type.RECURSIVE)).toBe(1);
  });

  test('Test iterative dfs', () => {
    expect(dfs(graph, 0, numNodes, Type.ITERATIVE)).toBe(4);
    expect(dfs(graph, 4, numNodes, Type.ITERATIVE)).toBe(1);
  });
});

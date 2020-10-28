import { shortestPathTopSort, shortestPathDijkstras } from '../shortestPath';
import { addDirectedEdge } from '../../../utils/graph';

describe('Test all algorithms for finding Shortest Path from a start node to end nodes', () => {
  test('Find the SP on a DAG using top sort', () => {
    //           (0)          (6)
    //         /  |  \
    //      3 /  2|   \ 3
    //       /    |    \
    //      <  6 \|/    >
    //    (1)--->(2)    (5)
    //     |     /|     /
    //   1 |   1/ |10  /7
    //     |   /  |   /
    //     | /    | /
    //     <   5  <
    //    (3)--->(4)

    const graph = new Map();
    const numVertices = 7;
    addDirectedEdge(graph, 0, 1, 3);
    addDirectedEdge(graph, 0, 2, 2);
    addDirectedEdge(graph, 0, 5, 3);
    addDirectedEdge(graph, 1, 3, 1);
    addDirectedEdge(graph, 1, 2, 6);
    addDirectedEdge(graph, 2, 3, 1);
    addDirectedEdge(graph, 2, 4, 10);
    addDirectedEdge(graph, 3, 4, 5);
    addDirectedEdge(graph, 5, 4, 7);

    let result = shortestPathTopSort(graph, numVertices, 0, 4);
    expect(result.distance).toBe(8);
    expect(result.path).toStrictEqual([0, 2, 3, 4]);

    result = shortestPathTopSort(graph, numVertices, 2, 4);
    expect(result.distance).toBe(6);
    expect(result.path).toStrictEqual([2, 3, 4]);

    result = shortestPathTopSort(graph, numVertices, 0, 0);
    expect(result.distance).toBe(0);
    expect(result.path).toStrictEqual([0]);

    result = shortestPathTopSort(graph, numVertices, 6, 0);
    expect(result.distance).toBeNull();
    expect(result.path).toStrictEqual([]);
  });

  test('Find the SP on a Non-negative edge weight graph using Dijkstras', () => {
    const graph = new Map();
    const numVertices = 6;
    addDirectedEdge(graph, 0, 1, 5);
    addDirectedEdge(graph, 0, 2, 1);
    addDirectedEdge(graph, 1, 2, 2);
    addDirectedEdge(graph, 1, 3, 3);
    addDirectedEdge(graph, 1, 4, 20);
    addDirectedEdge(graph, 2, 1, 3);
    addDirectedEdge(graph, 2, 4, 12);
    addDirectedEdge(graph, 3, 2, 3);
    addDirectedEdge(graph, 3, 4, 2);
    addDirectedEdge(graph, 3, 5, 6);
    addDirectedEdge(graph, 4, 5, 1);

    let result = shortestPathDijkstras(graph, numVertices, 0, 5);
    expect(result.distance).toBe(10);
    expect(result.path).toStrictEqual([0, 2, 1, 3, 4, 5]);

    result = shortestPathDijkstras(graph, numVertices, 2, 0);
    expect(result.distance).toBeNull();
    expect(result.path).toStrictEqual([]);
  });
});

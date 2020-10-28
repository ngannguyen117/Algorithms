import { SSSPTopSort, shortestPathTopSort, SSSPDijkstras, shortestPathDijkstras } from '../shortestPath';
import { addDirectedEdge } from '../../../utils/graph';

describe('Test all shortest path algorithms', () => {
  test('Single source shortest path on Directed Acyclic Graphs using Top Sort', () => {
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

    let distance = SSSPTopSort(graph, numVertices, 0); 
    expect(distance[6]).toBeUndefined(); // node 6 can't be reached
    expect(distance[0]).toBe(0); // distance to itself is 0
    expect(distance[4]).toBe(8);

    distance = SSSPTopSort(graph, numVertices, 2);
    expect(distance[0]).toBeUndefined();
    expect(distance[1]).toBeUndefined();
    expect(distance[5]).toBeUndefined();
    expect(distance[6]).toBeUndefined();
    expect(distance[2]).toBe(0);
    expect(distance[3]).toBe(1);
    expect(distance[4]).toBe(6);
  });

  test('Find the shortest path on a DAG from a start node to an end node by using top sort', () => {
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

  test('Single source shortest path on Non-negative edge weight graphs using Dijkstras', () => {
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

    let distance = SSSPDijkstras(graph, numVertices, 0);
    expect(distance).toStrictEqual([ 0, 4, 1, 7, 9, 10 ]);

    distance = SSSPDijkstras(graph, numVertices, 4);
    expect(distance).toStrictEqual([ Infinity, Infinity, Infinity, Infinity, 0, 1 ]);
  });

  test('Find the shortest path on a Non-negative edge weight graph from a start node to an end node by using Dijkstras', () => {
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

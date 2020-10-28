import { SSSPTopSort, SSSPBFS, SSSPDijkstras, SSSPBellmanFord } from '../singleSourceShortestPath';
import { addDirectedEdge, addUndirectedEdge } from '../../../utils/graph';

describe('Test all Single Source Shortest Path algorithms', () => {
  test('SSSP on Directed Acyclic Graphs using Top Sort', () => {
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

  test('SSSP on undirected, unweighted graphs using BFS', () => {
    //                     0
    //                /    |    \
    //   5 --- 6 --- 7 --- 11    9
    //                        /     \
    //                      10 - 1 - 8 --- 12 --- 2 --- 3 --- 4
                            
    const numVertices = 13;
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

    let distance = SSSPBFS(graph, numVertices, 10);
    expect(distance).toStrictEqual([2, 1, 4, 5, 6, 5, 4, 3, 2, 1, 0, 3, 3]);

    distance = SSSPBFS(graph, numVertices, 0);
    expect(distance).toStrictEqual([0, 3, 4, 5, 6, 3, 2, 1, 2, 1, 2, 1, 3]);
  });

  test('SSSP on Non-negative edge weight graphs using Dijkstras', () => {
    //                        3
    //              (1) ------------> (3)
    //            < | < \            / | \
    //            / | |   \        /   |  \
    //          5/  | |     \    /     |   \6
    //          /   | |      \ /       |    >
    //        (0)  2| |3     / \       |    (5)
    //          \   | |    /3   \ 20   |2   >
    //          1\  | |   /       \    |   /
    //            \ | |  /         \   |  /1
    //            > > | <           >  > /
    //              (2) ------------> (4) 
    //                        12

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

  test('SSSP on negative edge weight connected graphs using Bellman Ford', () => {
    const graph = new Map();
    const numVertices = 9;
    addDirectedEdge(graph, 0, 1, 1);
    addDirectedEdge(graph, 1, 2, 1);
    addDirectedEdge(graph, 2, 4, 1);
    addDirectedEdge(graph, 4, 3, -3);
    addDirectedEdge(graph, 3, 2, 1);
    addDirectedEdge(graph, 1, 5, 4);
    addDirectedEdge(graph, 1, 6, 4);
    addDirectedEdge(graph, 5, 6, 5);
    addDirectedEdge(graph, 6, 7, 4);
    addDirectedEdge(graph, 5, 7, 3);

    const distance = SSSPBellmanFord(graph, numVertices, 0);
    expect(distance).toStrictEqual([0, 1, -Infinity, -Infinity, -Infinity, 5, 5, 8, Infinity]);
  });
});

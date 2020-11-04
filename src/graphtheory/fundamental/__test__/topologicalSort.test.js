import { topSort, Method } from '../topologicalSort';
import { addDirectedEdge } from '../../../utils/graph';
import { mergeSort } from '../../../sorting/mergesort';

const testTopSort = method => {
  test(`Test topological sort with ${method}`, () => {
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

    const ordering = topSort(graph, numVertices, method);
    const group1 = ordering.slice(0, 2); // [0, 6] or [6, 0]
    const group2 = ordering.slice(2, 4); // [1, 5] or [5, 1]
    const group3 = ordering.slice(4, 5); // [2]
    const group4 = ordering.slice(5);    // [3, 4] or [4, 3]
    expect(mergeSort(group1)).toStrictEqual([0, 6]);
    expect(mergeSort(group2)).toStrictEqual([1, 5]);
    expect(group3).toStrictEqual([2]);
    expect(mergeSort(group4)).toStrictEqual([3, 4]);
  });
};

testTopSort(Method.DFS);
testTopSort(Method.KAHNS);

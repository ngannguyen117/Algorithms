import { lowestCommonAncestor, Method } from '../lca';
import { rootTree } from '../rootTree';
import { addUndirectedEdge } from '../../../utils/graph';

const testLCA = method => {
  test(`Test finding lowest common ancestor with ${method}`, () => {
    const graph = new Map();
    const size = 17;
    addUndirectedEdge(graph, 0, 1);
    addUndirectedEdge(graph, 0, 2);
    addUndirectedEdge(graph, 1, 3);
    addUndirectedEdge(graph, 1, 4);
    addUndirectedEdge(graph, 2, 5);
    addUndirectedEdge(graph, 2, 6);
    addUndirectedEdge(graph, 2, 7);
    addUndirectedEdge(graph, 3, 8);
    addUndirectedEdge(graph, 3, 9);
    addUndirectedEdge(graph, 5, 10);
    addUndirectedEdge(graph, 5, 11);
    addUndirectedEdge(graph, 7, 12);
    addUndirectedEdge(graph, 7, 13);
    addUndirectedEdge(graph, 11, 14);
    addUndirectedEdge(graph, 11, 15);
    addUndirectedEdge(graph, 11, 16);

    const root = rootTree(graph, 0);

    const lca = lowestCommonAncestor(root, size, method);
    expect(lca(1, 20)).toBeNull();
    expect(lca(12, 12)).toBe(12);
    expect(lca(14, 16)).toBe(11);
    expect(lca(10, 15)).toBe(5);
    expect(lca(10, 15)).toBe(5);
    expect(lca(3, 2)).toBe(0);
  });
};

testLCA(Method.DFS);
testLCA(Method.EULER_TOUR);
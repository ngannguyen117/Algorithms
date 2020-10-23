import { addUndirectedEdge } from '../../../utils/graph';
import { findCCsDFS, findCCsUnionFind } from '../connectedComponents';

const testConnectedComponents = (findCCs, technique) => {
  let graph = new Map();
  let size = 7;

  // Setup a graph with four connected components
  // namely: {0,1,2}, {3,4}, {5}, {6}
  addUndirectedEdge(graph, 0, 1);
  addUndirectedEdge(graph, 1, 2);
  addUndirectedEdge(graph, 2, 0);
  addUndirectedEdge(graph, 3, 4);
  addUndirectedEdge(graph, 5, 5); // Self loop

  test(`Test Finding Connected Components (CCs) by using ${technique}`, () => {
    const { components, count } = findCCs(graph, size);
    expect(count).toBe(4);
    expect(components[0]).toBe(components[1]);
    expect(components[0]).toBe(components[2]);
    expect(components[1]).toBe(components[2]);
    expect(components[3]).toBe(components[4]);
    expect(components[5]).toBe(components[5]);
    expect(components[6]).toBe(components[6]);
    expect(components[1]).not.toBe(components[3]);
    expect(components[1]).not.toBe(components[5]);
  });
};

testConnectedComponents(findCCsDFS, 'Depth First Search');
testConnectedComponents(findCCsUnionFind, 'UnionFind');

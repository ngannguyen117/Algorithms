import { addUndirectedEdge } from '../../../utils/graph';
import { treeCenter, Method } from '../treeCenter';

const testFindingTreeCenter = method => {
  test(`Test finding the center(s) of an undirected tree by ${method ? method : 'default method: peel an onion'}`, () => {
    // empty graph
    graph = new Map();
    expect(treeCenter(graph, method)).toStrictEqual([]);
  
    // 0 -- 1
    graph = new Map();
    addUndirectedEdge(graph, 0, 1);
    expect(treeCenter(graph, method)).toStrictEqual([0, 1]);
  
    // 0 -- 1 -- 2
    graph = new Map();
    addUndirectedEdge(graph, 0, 1);
    addUndirectedEdge(graph, 1, 2);
    expect(treeCenter(graph, method)).toStrictEqual([1]);
  
    // 0 -- 1 -- 2 -- 3
    graph = new Map();
    addUndirectedEdge(graph, 0, 1);
    addUndirectedEdge(graph, 1, 2);
    addUndirectedEdge(graph, 2, 3);
    expect(treeCenter(graph, method)).toStrictEqual([1, 2]);
  
    // 0 -- 1 -- 2 -- 3 -- 4
    //                   /   \
    //                  5     6
    graph = new Map();
    addUndirectedEdge(graph, 0, 1);
    addUndirectedEdge(graph, 1, 2);
    addUndirectedEdge(graph, 2, 3);
    addUndirectedEdge(graph, 3, 4);
    addUndirectedEdge(graph, 4, 5);
    addUndirectedEdge(graph, 4, 6);
    expect(treeCenter(graph, method)).toStrictEqual([2, 3]);
  
    // 0 -- 1 --  2
    //          /   \
    //         3     6
    //       /  \   /  \
    //      4   5  7   8 
    let graph = new Map();
    addUndirectedEdge(graph, 0, 1);
    addUndirectedEdge(graph, 1, 2);
    addUndirectedEdge(graph, 2, 3);
    addUndirectedEdge(graph, 2, 6);
    addUndirectedEdge(graph, 3, 4);
    addUndirectedEdge(graph, 3, 5);
    addUndirectedEdge(graph, 6, 7);
    addUndirectedEdge(graph, 6, 8);
    expect(treeCenter(graph, method)).toStrictEqual([2]);
  });
}

testFindingTreeCenter();
testFindingTreeCenter(Method.PEEL_ONION);
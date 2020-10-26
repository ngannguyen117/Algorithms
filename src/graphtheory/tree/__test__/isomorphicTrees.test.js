import { isomorphicTrees, Method } from '../isomorphicTrees';
import { addUndirectedEdge } from '../../../utils/graph';

const testIsomorphicTree = method => {
  test(`Test implementation of checking whether 2 trees are isomorphic by using ${method}`, () => {
    let tree1 = new Map();
    //   2 -- 0
    //  / \
    // 1  3 -- 4
    addUndirectedEdge(tree1, 2, 0);
    addUndirectedEdge(tree1, 3, 4);
    addUndirectedEdge(tree1, 2, 1);
    addUndirectedEdge(tree1, 2, 3);
  
    let tree2 = new Map();
    // 3 -- 1 -- 0
    //      |
    //      2 -- 4
    addUndirectedEdge(tree2, 1, 0);
    addUndirectedEdge(tree2, 2, 4);
    addUndirectedEdge(tree2, 1, 3);
    addUndirectedEdge(tree2, 1, 2);
  
    expect(isomorphicTrees(tree1, tree2, method)).toBeTruthy();
  
    tree2 = new Map();
    // 3 -- 1 -- 2 -- 4 -- 0
    addUndirectedEdge(tree2, 4, 0);
    addUndirectedEdge(tree2, 2, 4);
    addUndirectedEdge(tree2, 1, 3);
    addUndirectedEdge(tree2, 1, 2);
  
    expect(isomorphicTrees(tree1, tree2, method)).toBeFalsy();
  });  
};

testIsomorphicTree(Method.ROOTED_TREE);
testIsomorphicTree(Method.BFS);

/**
 * Lowest Common Ancestor (LCA) Javascript implementation for rooted trees based on William Fiset's Java implementation
 * 
 * LCA:
 *  - The LCA of two nodes a and b in a rooted tree is the deepest node c that has both a & b as decendents.
 *  - A node can be a decendent of itself.
 *  - Applications:
 *    - Finding distance between 2 nodes
 *    - Inheritance hierarchies in OOP
 *    - As a subroutine in several advanced algorithms & data structures.
 */

import { TreeNode } from '../../utils/tree';
import { SparseTable, Operation } from '../../datastructures/sparsetable';

export const Method = Object.freeze({
  DFS: 'Depth First Search',
  EULER_TOUR: 'Euler Tour',
});

/**
 * This implementation traverse tree from the root node depth first and check if it encounters
 * the two nodes.
 * 
 * This implementation should be used if we only look for LCA in a tree once. It'd be efficient.
 * However, it's not efficient when we keep finding more LCA of the same tree. It's better to use
 * Euler Tour method in that case.
 * 
 * Time Complexity: runtime O(V + E)
 * Space Complexity: O(1)
 * 
 * @param {TreeNode} root the root of a tree
 * @param {number} id1 id of node #1
 * @param {number} id2 id of node #2
 */
const dfs = (root, id1, id2, size) => {
  const isInvalidIndex = i => i < 0 || i >= size;
  if (isInvalidIndex(id1) || isInvalidIndex(id2)) return null;

  let ancestor;

  const helper = node => {
    if (!node) return false;

    let count = 0;
    if (node.id() === id1) count++;
    if (node.id() === id2) count++;

    for (let childNode of node.getChildren())
      if (helper(childNode)) count++;
    
    if (count === 2) ancestor = node;
    return count > 0;
  };

  helper(root);
  return ancestor.id();
};

/**
 * This implementation first finds a Euler tour from the root node which visits all the nodes in the tree.
 * The node height values obtained from the Euler tour can then be used in combination with
 * a sparse table to find the LCA in O(1).
 * 
 * This implementation should be used if we need to find LCA in a tree multiple time. It is efficient because
 * all the later queries takes constant time to compute.
 *
 * Time Complexity: O(1) queries, O(nlog(n)) pre-processing.
 *
 * Space Complexity: O(nlog(n))
 * 
 * @param {TreeNode} root the root of a tree
 * @param {number} size the number of vertices in this tree
 */
const eulerTour = (root, size) => {
  const visit = (node, depth) => {
    nodeOrder[tourIndex] = node;
    nodeDepth[tourIndex] = depth;
    lastOccurrenceIndex[node.id()] = tourIndex++;
  };

  const constructEulerTour = (node, depth) => {
    if (!node) return;

    visit(node, depth);
    for (let childNode of node.getChildren()) {
      constructEulerTour(childNode, depth + 1);
      visit(node, depth);
    }
  };

  const isInvalidIndex = i => i < 0 || i >= size;

  let tourIndex = 0;
  const nodeDepth = []; // length = 2 * size + 1
  const nodeOrder = []; // length = 2 * size + 1
  const lastOccurrenceIndex = []; // size = tree size

  constructEulerTour(root, 0);

  // Initialize and build sparse table on the `nodeDepth` array which will
  // allow us to index into the `nodeOrder` array and return the LCA.
  const minSparseTable = new SparseTable(nodeDepth, Operation.MIN);

  const lca = (id1, id2) => {
    if (isInvalidIndex(id1) || isInvalidIndex(id2)) return null;

    const left = Math.min(lastOccurrenceIndex[id1], lastOccurrenceIndex[id2]);
    const right = Math.max(lastOccurrenceIndex[id1], lastOccurrenceIndex[id2]);
    const index = minSparseTable.queryIndex(left, right);
    return nodeOrder[index].id();
  };

  return lca;
};

/**
 * Find the lowest common ancestor of two nodes
 * @param {TreeNode} root the root of a tree
 * @param {number} size the number of vertices in this tree
 * @param {Method} method which technique to use to find LCA
 */
export const lowestCommonAncestor = (root, size, method) => {
  let lca;
  switch (method) {
    case Method.DFS:
      lca = (id1, id2) => dfs(root, id1, id2, size);
      break;
    case Method.EULER_TOUR:
    default:
      lca = eulerTour(root, size);
  }

  return { lca };
};

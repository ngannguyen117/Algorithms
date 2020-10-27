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
 */
const dfs = (root, id1, id2) => {
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
  return ancestor ? ancestor.id() : null;
};

/**
 * Find the lowest common ancestor of two nodes
 * @param {TreeNode} root the root of a tree
 * @param {number} id1 id of node #1
 * @param {number} id2 id of node #2
 * @param {Method} method which technique to use to find LCA
 */
export const lowestCommonAncestor = (root, method) => {
  switch (method) {
    case Method.EULER_TOUR:
      return eulerTour(root, id1, id2);
    case Method.DFS:
    default:
      return { lca: (id1, id2) => dfs(root, id1, id2) };
  }
};

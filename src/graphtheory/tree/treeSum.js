import { TreeNode } from '../../utils/tree';

/**
 * Finding the sum of all node's value in the tree.
 * In this version, we'll use the id as its value.
 * @param {TreeNode} root a root node of a tree
 */
export const treeSum = root => {
  if (!root) return 0;

  let total = root.id();
  for (let childNode of root.getChildren()) total += treeSum(childNode);

  return total;
};

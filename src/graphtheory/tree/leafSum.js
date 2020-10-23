import { TreeNode, isLeafNode } from '../../utils/tree';

/**
 * Get the sum of this tree's leaf nodes' values.
 * In this version, we use node's id as value.
 * @param {TreeNode} root a root node of a tree
 */
export const leafSum = root => {
  if (!root) return 0;

  if (isLeafNode(root)) return root.id();

  let total = 0;
  for (let childNode of root.getChildren()) total += leafSum(childNode);

  return total;
};

import { TreeNode } from '../../utils/tree';

/**
 * Get a tree height from the provided root node
 * @param {TreeNode} root a root node of a tree
 */
export const treeHeight = root => {
  if (!root) return -1;

  let height = -1;

  for (let child of root.getChildren()) {
    const childHeight = treeHeight(child);
    height = Math.max(height, childHeight);
  }

  return height + 1;
};

import { treeSum } from '../treeSum';
import { TreeNode } from '../../../utils/tree';

test('Test computing tree height from a provided root node', () => {
  // building a tree
  //        0
  //       / \
  //      1   2
  //     / \ / \
  //    3  4 5  6
  //   / \
  //  7   8
  const root = new TreeNode(0);
  const node1 = new TreeNode(1, root);
  const node2 = new TreeNode(2, root);
  root.addChildren(node1, node2);

  const node3 = new TreeNode(3, node1);
  const node4 = new TreeNode(4, node1);
  node1.addChildren(node3, node4);

  const node5 = new TreeNode(5, node2);
  const node6 = new TreeNode(6, node2);
  node2.addChildren(node5, node6);

  const node7 = new TreeNode(7, node3);
  const node8 = new TreeNode(8, node3);
  node3.addChildren(node7, node8)

  expect(treeSum(root)).toBe(36);
  expect(treeSum(node3)).toBe(18);
  expect(treeSum(node6)).toBe(6);
  expect(treeSum()).toBe(0);
});

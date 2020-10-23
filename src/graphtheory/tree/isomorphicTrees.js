import { Edge } from '../../utils/graph';
import { TreeNode } from '../../utils/tree';
import { mergeSort } from '../../sorting/mergesort';
import { treeCenter } from './treeCenter';
import { rootTree } from './rootTree';

/**
 * Constructs the canonical form representation of a tree as a string.
 * @param {TreeNode} root a root node of a tree
 * @returns {string}
 */
const encode = root => {
  if (!root) return '';

  let labels = [];
  for (let child of root.getChildren())
    labels.push(encode(child));
  
  labels = mergeSort(labels);
  return `(${labels.join('')})`;
};

/**
 * Determine if two unrooted trees are isomorphic. O(V + E).
 * @param {Map<number, Edge[]>} tree1 an adjaciency list representation of tree1
 * @param {Map<number, Edge[]>} tree2 an adjaciency list representation of tree2
 */
export const isomorphicTrees = (tree1, tree2) => {
  // process tree1 first
  const centers1 = treeCenter(tree1);
  const root1 = rootTree(tree1, centers1[0]);
  const tree1Encoding = encode(root1);

  // process tree2 and compare with tree1
  const centers2 = treeCenter(tree2);
  for (let center of centers2) {
    const root2 = rootTree(tree2, center);
    const tree2Encoding = encode(root2);
    if (tree1Encoding === tree2Encoding) return true;
  }

  return false;
};

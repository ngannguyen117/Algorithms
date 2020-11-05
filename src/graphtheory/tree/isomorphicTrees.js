import { Edge } from '../../utils/graph';
import { TreeNode } from '../../utils/tree';
import { mergeSort } from '../../sorting/mergesort';
import { treeCenter } from './treeCenter';
import { rootTree } from './rootTree';
import { Queue } from '../../datastructures/queue';

export const Method = Object.freeze({
  ROOTED_TREE: 'rooted tree',
  BFS: 'BFS'
});

/**
 * Check if two trees are isomorphic by comparing rooted trees' encoding.
 */
const withRootedTree = (tree1, tree2) => {
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
}

/**
 * Check if two trees are isomorphic by comparing their string encoding using BFS.
 * 
 * Refer to this slide for detail explanation how this encoding works
 * 
 * {@link http://webhome.cs.uvic.ca/~wendym/courses/582/16/notes/582_12_tree_can_form.pdf}
 */
const withBfs = (tree1, tree2) => {
  /**
   * Constructs the canonical form representation of a tree as a string with breadth first search
   * @param {Map<number, Edge[]>} tree an adjaciency list representation of tree1
   * @returns {string}
   */
  const encode = tree => {
    // record each node's degree and find leaf nodes
    const degree = [];
    let leaves = [];
    for (let i = 0; i < tree.size; i++) {
      degree[i] = tree.get(i).length;
      if (degree[i] <= 1) leaves.push(i);
    }

    const map = Array(tree.size).fill('()');
    let processedLeaves = leaves.length;

    while (processedLeaves < tree.size) {
      const newLeaves = [];
      for (let leafId of leaves) {
        for (let edge of tree.get(leafId))
          if (--degree[edge.to] === 1) newLeaves.push(edge.to);
        degree[leafId] = 0;
      }

      // Update parent labels
      for (let p of newLeaves) {
        let labels = [];
        for (let edge of tree.get(p))
          if (degree[edge.to] === 0) labels.push(map[edge.to]);

        labels = mergeSort(labels);
        map[p] = `(${labels.join('')})`;
      }

      processedLeaves += newLeaves.length;
      leaves = newLeaves;
    }

    // Only one vertex remains and it holds the canonical form
    const l1 = map[leaves[0]];
    if (leaves.length === 1) return l1;

    // there are 2 vertices remain, combine 2 labels
    const l2 = map[leaves[1]];
    return l1 < l2 ? l1.concat(l2) : l2.concat(l1);
  };

  return encode(tree1) === encode(tree2);
};

/**
 * Determine if two unrooted trees are isomorphic. O(V + E).
 * @param {Map<number, Edge[]>} tree1 an adjaciency list representation of tree1
 * @param {Map<number, Edge[]>} tree2 an adjaciency list representation of tree2
 */
export const isomorphicTrees = (tree1, tree2, method) => {
  switch (method) {
    case Method.ROOTED_TREE:
      return withRootedTree(tree1, tree2);
    case Method.BFS:
    default:
      return withBfs(tree1, tree2);
  }
};

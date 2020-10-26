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
    const size = tree.size;
    const rootId = treeCenter(tree)[0];

    const degree = [];
    const parent = [];
    const visited = [];
    for (let i = 0; i < size; i++) {
      degree.push(0);
      parent.push(-1);
      visited.push(false);
    }

    let leaves = [];
    const queue = new Queue(rootId);
    visited[rootId] = true;

    // Do a BFS to find leaves nodes
    while (!queue.isEmpty()) {
      const at = queue.dequeue();
      const edges = tree.get(at);
      degree[at] = edges.length;

      for (let edge of edges)
        if (!visited[edge.to]) {
          visited[edge.to] = true;
          parent[edge.to] = at;
          queue.enqueue(edge.to);
        }

      if (degree[at] === 1) leaves.push(at);
    }

    let newLeaves = [];
    const map = [];
    for (let i = 0; i < size; i++) {
      visited[i] = false;
      map[i] = '()';
    }

    let treeSize = size;
    while (treeSize > 2) {
      for (let leaf of leaves) {
        // Find parent of leaf node and check if the parent
        // is a candidate for the next cycle of leaf nodes
        visited[leaf] = true;
        let p = parent[leaf];
        if (--degree[p] === 1) newLeaves.push(p);
        treeSize--;
      }

      // Update parent labels
      for (let p of newLeaves) {
        let labels = [];
        for (let edge of tree.get(p))
          if (visited[edge.to]) labels.push(map[edge.to]);
      
        const innerParentheses = map[p].slice(1, map[p].length - 1);
        labels.push(innerParentheses);
        labels = mergeSort(labels);
        map[p] = '('.concat(labels.join('')).concat(')');
      }

      leaves = newLeaves;
      newLeaves = [];
    }

    // Only one vertex remains and it holds the canonical form
    const l1 = map[leaves[0]];
    if (treeSize === 1) return l1;

    // there are 2 vertices remain, combine 2 labels
    const l2 = map[leaves[1]];
    return l1 < l2 ? l1.concat(l2) : l2.concat(l1);
  };

  // use function encode to encode 2 trees and then compare their encodings
  const encoding1 = encode(tree1);
  const encoding2 = encode(tree2);
  return encoding1 === encoding2;
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

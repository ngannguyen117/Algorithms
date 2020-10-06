/**
 * Binary Search Tree implementation using Javascript (based on a William Fiset's Binary Search Tree Java implementation)
 *
 * @author Ngan Nguyen, ngan.tx.nguyen@gmail.com
 *
 * Date: 10/5/2020
 *
 * TREE is an undirected graph which satisfies any of the following definitions:
 *  - An acyclic connected graph
 *  - A connected graph with N node and N-1 edges
 *  - A graph in which any two vertices are connected by exactly one path
 *
 * Binary Tree: is a tree for which every node has at most two child nodes
 *
 * Binary Search Tree (BST):
 *  - a binary tree that satisfies the BST invariant
 *  - BST invariant: left subtree has smaller elements and right subtree has larger elements
 *  - Usage:
 *    - Implementations of some maps and sets ADT, balanced trees, binary heaps, etc
 *    - Syntax tree (used by compilers and calculators)
 *    - Treap - a probabilistic DS (uses randomized BST)
 *  - Complexity:
 *    - Insert, delete, remove, search: avg (random data) O(log(n)), worse O(n) (tree becomes a line)
 */

import { ArrayStack } from './stack';
import { Queue } from './queue';
import { compare } from '../utils/compare';
import { TreeTraversalOrder } from '../utils/tree-traversal-order';

/**
 * Binary Search Tree (BST) implemenation.
 *
 * By default, this BST accept only string and number. The elements in the tree are unique.
 *
 * To use this BST with other objects, please pass in the BST constructor a comparator that
 * defines how to compare your objects, and override the toString method to define how to print out the tree
 *
 * Comparator interface: (a, b) => -1 | 0 | 1
 *
 * A comparator is a function that takes in 2 elements and return -1 if a < b, 0 if a == b and 1 if a > b
 */
export function BinarySearchTree(compareFunc = compare()) {
  const comparator = compareFunc;
  let nodeCount = 0; // number of nodes in this BST
  let root = null; // this BST is a rooted tree so we maintain a handle on the root node

  /**
   * a private Node class that holds data, a pointer to left child and a pointer to right child
   * @param {string | number} data
   * @param {Node} left reference to left child
   * @param {Node} right reference to right child
   */
  function Node(data, left = null, right = null) {
    this.data = data;
    this.left = left;
    this.right = right;
  }

  /***************** HELPER METHODS *******************/

  /**
   * Clear a subtree from the provided root node
   * @param {Node} node subtree's root
   */
  const clear = node => {
    if (node) {
      node.left = clear(node.left);
      node.right = clear(node.right);
      nodeCount--;
    }

    node = null;
    return node;
  };

  /**
   * A recursive method to find an elements in the tree
   * @param {Node} node the root of a tree/subtree
   * @param {string | number} elem Element that needs to be found
   */
  const contains = (node, elem) => {
    if (!node) return false; // base case: reach bottom, value not found
    const cmp = comparator(elem, node.data);

    if (cmp < 0) return contains(node.left, elem); // check out the left subtree because the elem is smaller than the current node
    if (cmp > 0) return contains(node.right, elem); // check out the right subtree because the elem is larger than the current node

    return true;
  };

  /**
   * A recursive method to find the tree's height
   * @param {Node} node a tree/subtree's root
   * @returns {number} tree's height
   */
  const height = node => {
    if (!node) return -1;
    return Math.max(height(node.left), height(node.right)) + 1;
  };

  /**
   * Find the left most node (which has the smallest value) from the specified node.
   * @param {Node} node a start node
   * @returns {Node} the left most node
   */
  const findMin = node => {
    while (node.left) node = node.left;
    return node;
  };

  /**
   * Find the right most node (which has the largest value) from the specified node.
   * @param {Node} node a start node
   * @returns {Node} the right most node
   */
  const findMax = node => {
    while (node.right) node = node.right;
    return node;
  };

  /**
   * A recursive method to remove an element from the tree
   * @param {Node} node subtree's root
   * @param {string | number} elem Element we need to remove
   * @returns {Node} subtree's root with a new successor
   */
  const remove = (node, elem, rightSuccessor = true) => {
    const cmp = comparator(elem, node.data);
    if (cmp < 0) node.left = remove(node.left, elem);
    else if (cmp > 0) node.right = remove(node.right, elem);
    // found the node we wish to remove
    else {
      // Case: there could be either a right or left subtree (or no subtree)
      if (!node.left) return node.right;
      if (!node.right) return node.left;

      // Case: right and left subtrees are present. The successor of the node being removed can
      // either be the smallest node in the right subtree or the largest node in the left subtree.

      if (rightSuccessor) {
        // Take the smallest of the right subtree as the successor
        const successor = findMin(node.right);
        node.data = successor.data;
        node.right = remove(node.right, successor.data);
      } else {
        // If we were to take the largest of the left subtree
        const successor = findMax(node.left);
        node.data = successor.data;
        node.left = remove(node.left, successor.data, false);
      }
    }
    c;
    return node;
  };

  /**
   * A recursive method to add an element to this tree
   * @param {Node} node subtree's root
   * @param {string | number} elem Element to be added
   */
  const add = (node, elem) => {
    if (!node) return new Node(elem); // Base case: found a leaf node

    if (comparator(elem, node.data) < 0) node.left = add(node.left, elem);
    else node.right = add(node.right, elem);
    return node;
  };

  /**
   * A generator function that create an iterator to traverse the tree pre-order
   * @returns {Iterator} an iterator that let us traverse the tree in pre-order
   */
  const preOrderTraversal = function* () {
    const expectedNodeCount = nodeCount;
    const stack = new ArrayStack(root);

    while (root && !stack.isEmpty()) {
      if (expectedNodeCount !== nodeCount)
        throw new Error('Concurrent Modification');

      const node = stack.pop();
      if (node.right) stack.push(node.right);
      if (node.left) stack.push(node.left);

      yield node.data;
    }
  };

  /**
   * A generator function that create an iterator to traverse the tree in-order
   * @returns {Iterator} an iterator that let us traverse the tree in in-order
   */
  const inOrderTraversal = function* () {
    const expectedNodeCount = nodeCount;
    const stack = new ArrayStack(root);
    let trav = root;

    while (root && !stack.isEmpty()) {
      if (expectedNodeCount !== nodeCount)
        throw new Error('Concurrent Modification');

      for (; trav && trav.left; trav = trav.left) stack.push(trav.left);

      const node = stack.pop();

      if (node.right) {
        stack.push(node.right);
        trav = node.right;
      }

      yield node.data;
    }
  };

  /**
   * A generator function that create an iterator to traverse the tree post-order
   * @returns {Iterator} an iterator that let us traverse the tree in post-order
   */
  const postOrderTraversal = function* () {
    const expectedNodeCount = nodeCount;
    const stack = new ArrayStack();
    const tempStack = new ArrayStack();
    if (root) tempStack.push(root);

    while (!tempStack.isEmpty()) {
      const node = tempStack.pop();
      stack.push(node);
      if (node.left) tempStack.push(node.left);
      if (node.right) tempStack.push(node.right);
    }

    while (root && !stack.isEmpty()) {
      if (expectedNodeCount !== nodeCount)
        throw new Error('Concurrent Modification');

      yield stack.pop().data;
    }
  };

  /**
   * A generator function that create an iterator to traverse the tree level-order
   * @returns {Iterator} an iterator that let us traverse the tree in level-order
   */
  const levelOrderTraversal = function* () {
    const expectedNodeCount = nodeCount;
    const queue = new Queue(root);

    while (root && !queue.isEmpty()) {
      if (expectedNodeCount !== nodeCount)
        throw new Error('Concurrent Modification');

      const node = queue.dequeue();
      if (node.left) queue.enqueue(node.left);
      if (node.right) queue.enqueue(node.right);

      yield node.data;
    }
  };

  /***************** PUBLIC METHODS *******************/

  /** Get this tree's size (number of nodes in the tree) */
  this.size = () => nodeCount;

  /** Check if the tree is empty */
  this.isEmpty = () => this.size() === 0;

  /**
   * Check if an element is in the tree
   * @param {string | number} elem the element that needs to be found
   * @returns {boolean} true if it is in the tree
   */
  this.contains = elem => contains(root, elem);

  /**
   * Get the tree's height
   * @returns {number} tree's height
   */
  this.height = () => height(root);

  /**
   * Remove an element from the tree
   * @param {string | number} elem Element to be removed
   * @param {boolean} rightSuccessor
   * @returns {boolean} true if it is removed, false if element not found
   */
  this.remove = (elem, rightSuccessor = true) => {
    if (!this.contains(elem)) return false;

    root = remove(root, elem, rightSuccessor);
    nodeCount--;
    return true;
  };

  /**
   * Add a new element to the tree
   * @param {string | number} elem Element to be added
   */
  this.add = elem => {
    if (this.contains(elem)) return false;

    root = add(root, elem);
    nodeCount++;
    return true;
  };

  /**
   * Clear this tree by removing all nodes and reset nodeCount
   */
  this.clear = () => (root = clear(root));

  /**
   * Get an iterator to traverse the tree based on the order type the method receives.
   * @param {TreeTraversalOrder} order Type of order to traverse the tree
   * @returns {Iterator} an iterator
   */
  this.traverse = order => {
    switch (order) {
      case TreeTraversalOrder.PRE_ORDER:
        return preOrderTraversal();
      case TreeTraversalOrder.IN_ORDER:
        return inOrderTraversal();
      case TreeTraversalOrder.POST_ORDER:
        return postOrderTraversal();
      case TreeTraversalOrder.LEVEL_ORDER:
        return levelOrderTraversal();
      default:
        return null;
    }
  };

  this[Symbol.iterator] = this.traverse;
}

BinarySearchTree.prototype.toString = function (
  order = TreeTraversalOrder.IN_ORDER
) {
  const values = [];
  for (let value of this[Symbol.iterator](order)) values.push(value);
  return values.join(' ');
};

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
import { printTree } from '../utils/printer';
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
 *
 * @param {(a, b) => -1 | 0 | 1} compareFunc a function to define how to compare the tree's data
 */
export function BinarySearchTree(comparator = compare()) {
  /**
   * a private Node class that holds data, a pointer to left child and a pointer to right child
   * @param {string | number} data
   */
  function Node (data) {
    this.data = data;
    this.left = null;
    this.right = null;

    this.compareTo = other => {
      let value = other;
      if (other instanceof Node) value = other.data;
      return comparator(this.data, value);
    };
  }

  let root = null; // this BST is a rooted tree so we maintain a handle on the root node
  let size = 0;

  //------------------------------ HELPER METHODS ---------------------------------
  /**
   * Clear a subtree from the provided root node
   * @param {Node} node subtree's root
   */
  const clear = (node = root) => {
    if (node) {
      node.left = clear(node.left);
      node.right = clear(node.right);
      size--;
    }
    node = null;
    return node;
  };

  /**
   * A recursive method to find an elements in the tree
   * @param {string | number} elem Element that needs to be found
   * @param {Node} node the root of a tree/subtree
   */
  const contains = (elem, node = root) => {
    if (!node) return false;

    const cmp = node.compareTo(elem);
    if (cmp > 0) return contains(elem, node.left);
    if (cmp < 0) return contains(elem, node.right); 

    return true;
  };

  /**
   * A recursive method to add an element to this tree
   * @param {string | number} elem Element to be added
   * @param {Node} node subtree's root
   */
  const add = (elem, node = root) => {
    if (!node) return new Node(elem);

    const cmp = node.compareTo(elem);
    if (cmp > 0) node.left = add(elem, node.left);
    else if (cmp < 0) node.right = add(elem, node.right);
    return node;
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
   * @param {string | number} elem Element we need to remove
   * @param {Node} node subtree's root
   * @returns {Node} subtree's root with a new successor
   */
  const remove = (elem, node, rightSuccessor) => {
    const cmp = node.compareTo(elem);
    if (cmp > 0) node.left = remove(elem, node.left, rightSuccessor);
    else if (cmp < 0) node.right = remove(elem, node.right, rightSuccessor);
    else {
      // Case: there could be either a right or left subtree (or no subtree)
      if (!node.left) return node.right;
      if (!node.right) return node.left;

      // Case: right and left subtrees are present. The successor of the node being removed can
      // either be the smallest node in the right subtree or the largest node in the left subtree.
      let successor;
      if (rightSuccessor) {
        successor = findMin(node.right);
        node.data = successor.data;
        node.right = remove(successor.data, node.right, rightSuccessor);
      } else {
        successor = findMax(node.left);
        node.data = successor.data;
        node.left = remove(successor.data, node.left, rightSuccessor);
      }
    }
    return node;
  };

  /**
   * A generator function that create an iterator to traverse the tree pre-order
   * @returns {Iterator} an iterator that let us traverse the tree in pre-order
   */
  const preOrderTraversal = function* () {
    const expectedSize = size;
    const stack = new ArrayStack(root);

    while (root && !stack.isEmpty()) {
      if (expectedSize !== size) throw new Error('Concurrent Modification');
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
    const expectedSize = size;
    const stack = new ArrayStack(root);
    let trav = root;

    while (root && !stack.isEmpty()) {
      if (expectedSize !== size) throw new Error('Concurrent Modification');

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
    const expectedSize = size;
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
      if (expectedSize !== size) throw new Error('Concurrent Modification');

      yield stack.pop().data;
    }
  };

  /**
   * A generator function that create an iterator to traverse the tree level-order
   * @returns {Iterator} an iterator that let us traverse the tree in level-order
   */
  const levelOrderTraversal = function* () {
    const expectedSize = size;
    const queue = new Queue(root);

    while (root && !queue.isEmpty()) {
      if (expectedSize !== size) throw new Error('Concurrent Modification');
      const node = queue.dequeue();
      if (node.left) queue.enqueue(node.left);
      if (node.right) queue.enqueue(node.right);
      yield node.data;
    }
  };

  //------------------------------ PUBLIC METHODS ---------------------------------

  /** Get this tree's size (number of nodes in the tree) */
  this.size = () => size;

  /** Check if the tree is empty */
  this.isEmpty = () => size === 0;

  /**
   * Clear this tree by removing all nodes and reset nodeCount
   */
  this.clear = () => (root = clear());

  /**
   * Check if an element is in the tree
   * @param {string | number} elem the element that needs to be found
   * @returns {boolean} true if it is in the tree
   */
  this.contains = elem => contains(elem);

  /**
   * A recursive method to find the tree's height
   * @param {Node} node a tree/subtree's root
   * @returns {number} tree's height
   */
  this.height = (node = root) => {
    if (!node) return -1;
    return Math.max(this.height(node.left), this.height(node.right)) + 1;
  };

  /**
   * Remove an element from the tree
   * @param {string | number} elem Element to be removed
   * @param {boolean} rightSuccessor
   * @returns {boolean} true if it is removed, false if element not found
   */
  this.remove = (elem, rightSuccessor = true) => {
    if (!this.contains(elem)) return false;

    root = remove(elem, root, rightSuccessor);
    size--;
    return true;
  }

  /**
   * Add a new element to the tree
   * @param {string | number} elem Element to be added
   */
  this.add = elem => {
    if (this.contains(elem)) return false;

    root = add(elem);
    size++;
    return true;
  };


  this.validateBSTInvariant = (node = root) => {
    if (!node) return true;

    let isValid = true;
    if (node.left) isValid &&= node.compareTo(node.left) > 0;
    if (node.right) isValid &&= node.compareTo(node.right) < 0;

    return isValid && this.validateBSTInvariant(node.left) && this.validateBSTInvariant(node.right);
  };

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

  this.printTree = () => printTree(root);

  this[Symbol.iterator] = this.traverse;

  this.toString = (order = TreeTraversalOrder.LEVEL_ORDER) => {
    const values = [];
    for (let value of this[Symbol.iterator](order)) values.push(value);
    return values.join(' ');
  };
}

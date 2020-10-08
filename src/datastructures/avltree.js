/**
 * AVL Tree (Balanced Binary Search Tree) implementation using Javascript (based on a William Fiset's Balanced Binary Search Tree Java implementation)
 *
 * @author Ngan Nguyen, ngan.tx.nguyen@gmail.com
 *
 * Date: 10/7/2020
 *
 * Balanced Binary Search Tree (BBST):
 *  - a self-balancing binary search tree
 *  - can adjust itself in order to maintain a low (logarithmic) height allowing for faster operations such as insertions and deletions.
 *  - Complexity: insert, delete, remove, search is O(log(n)) for worst case scenario
 *
 * AVL tree:
 *  - one of many types of BBSTs
 *  - its main rival is red-black tree
 *  - Invariant:
 *    - The property which keeps an AVL tree balanced called Balanced Factor (BF)
 *    - BF(node) = Height(node.right) - Height(node.left)
 *    - Height(x) is calculated as the number of edges between x and the furthest leaf
 *    - The BF is always either -1, 0, or 1
 */

import { ArrayStack } from './stack';
import { Queue } from './queue';
import { compare } from '../utils/compare';
import { printTree } from '../utils/printer';
import { TreeTraversalOrder } from '../utils/tree-traversal-order';

/**
 * AVL Tree (Balanced Binary Search Tree) implemenation.
 *
 * By default, this AVL Tree accept only string and number. The elements in the tree are unique.
 *
 * To use this AVL Tree with other objects, please pass in the AVL Tree constructor a comparator that
 * defines how to compare your objects, and override the toString method to define how to print out the tree
 *
 * Comparator interface: (a, b) => -1 | 0 | 1
 *
 * A comparator is a function that takes in 2 elements and return -1 if a < b, 0 if a == b and 1 if a > b
 * @param {(a, b) => -1 | 0 | 1} compareFunc a function to define how to compare the tree's data
 */
export function AVLTree(compareFunc = compare()) {
  /**
   * A private Node that holds data, pointers to 2 children, its height and a balanced factor
   * @param {string | number} data
   * @param {Node} left a pointer to left child
   * @param {Node} right a pointer to right child
   */
  function Node(data, left = null, right = null) {
    this.data = data;
    this.left = left;
    this.right = right;
    this.balancedFactor = 0;
    this.height = 0;
  }

  const comparator = compareFunc;
  let root = null;
  let size = 0;

  //-------------------- HELPER METHODS ------------------------
  /**
   * Clear a subtree from the provided root node
   * @param {Node} node subtree's root
   */
  const clear = node => {
    if (node) {
      node.left = clear(node.left);
      node.right = clear(node.right);
      size--;
    }

    node = null;
    return node;
  };

  /**
   * A recursive method to check if the element is in the sub tree of the provided node
   * @param {Node} node a subtree's root
   * @param {string | number} elem element to be checked
   * @returns {boolean} true if the elem is in the tree
   */
  const contains = (node, elem) => {
    if (!node) return false; // reach end, node not found

    const cmp = comparator(elem, node.data);
    if (cmp < 0) return contains(node.left, elem); // node must be in the left subtree
    if (cmp > 0) return contains(node.right, elem); // node must be in the right subtree

    return true;
  };

  /**
   * Update a node's height and balanced factor
   * @param {Node} node a subtree's root node
   */
  const update = node => {
    const leftNodeHeight = node.left ? node.left.height : -1;
    const rightNodeHeight = node.right ? node.right.height : -1;

    node.height = 1 + Math.max(leftNodeHeight, rightNodeHeight);
    node.balancedFactor = rightNodeHeight - leftNodeHeight;
  };

  const leftRotation = node => {
    const newParent = node.right;
    node.right = newParent.left;
    newParent.left = node;

    update(node);
    update(newParent);

    return newParent;
  };

  const rightRotation = node => {
    const newParent = node.left;
    node.left = newParent.right;
    newParent.right = node;

    update(node);
    update(newParent);

    return newParent;
  };

  const leftLeftCase = node => rightRotation(node);
  const rightRightCase = node => leftRotation(node);
  const leftRightCase = node => {
    node.left = leftRotation(node.left);
    return leftLeftCase(node);
  };
  const rightLeftCase = node => {
    node.right = rightRotation(node.right);
    return rightRightCase(node);
  };

  /**
   * Re-balance the tree if the node's balanced factor is -2 or +2
   * @param {Node} node a subtree's root node
   * @returns {Node} the updated subtree's root node
   */
  const balance = node => {
    switch (node.balancedFactor) {
      case -2: // left heavy subtree
        if (node.left.balancedFactor <= 0) return leftLeftCase(node);
        return leftRightCase(node);
      case 2: // right heavy subtree
        if (node.right.balancedFactor >= 0) return rightRightCase(node);
        return rightLeftCase(node);
      default:
        return node; // -1, 0, 1 is fine
    }
  };

  /**
   * A recursive method to add a new node to the tree
   * @param {Node} node a subtree's root node
   * @param {string | number} elem element to be added
   * @returns {Node} the updated subtree's root node
   */
  const add = (node, elem) => {
    if (!node) return new Node(elem); // base case, reach the end, add the new elem as a leaf node

    const cmp = comparator(elem, node.data);
    if (cmp < 0) node.left = add(node.left, elem);
    if (cmp > 0) node.right = add(node.right, elem);

    update(node); // update balanced factor and height
    return balance(node); // re-balance the tree
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
   * Find the left most node (which has the smallest value) from the specified node.
   * @param {Node} node a start node
   * @returns {Node} the left most node
   */
  const findMin = node => {
    while (node.left) node = node.left;
    return node;
  };

  /**
   * A recursive method to remove an element from the tree
   * @param {Node} node subtree's root
   * @param {string | number} elem Element we need to remove
   * @returns {Node} subtree's root with a new successor
   */
  const remove = (node, elem) => {
    const cmp = comparator(elem, node.data);
    if (cmp < 0) node.left = remove(node.left, elem);
    else if (cmp > 0) node.right = remove(node.right, elem);
    else {
      if (!node.left) return node.right;
      if (!node.right) return node.left;

      // this node has 2 subtrees. Remove from the subtree with the greatest height to help with balancing
      let successor;
      if (node.left.height > node.right.height) {
        successor = findMax(node.left);
        node.data = successor.data;
        node.left = remove(node.left, successor.data);
      } else {
        successor = findMin(node.right);
        node.data = successor.data;
        node.right = remove(node.right, successor.data);
      }
    }

    update(node);
    return balance(node);
  };

  /**
   * A recursive method to check if this tree satisfies the BST invariant
   * @param {Node} node A subtree's root node
   * @returns {boolean} true if it satisfies the BST invariant
   */
  const validateBSTInvariant = node => {
    if (!node) return true;

    let isValid = true;
    if (node.left) isValid &&= comparator(node.left.data, node.data) < 0;
    if (node.right) isValid &&= comparator(node.right.data, node.data) > 0;

    return (
      isValid &&
      validateBSTInvariant(node.left) &&
      validateBSTInvariant(node.right)
    );
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

  //-------------------- PUBLIC METHODS ------------------------
  this.size = () => size;
  this.isEmpty = () => size === 0;
  this.printTree = () => printTree(root);
  this.height = () => (root ? root.height : -1);
  this.clear = () => (root = clear(root));
  this.validateBSTInvariant = () => validateBSTInvariant(root);

  /**
   * Check if a particular element is in the tree
   * @param {string | number} elem a value to be checked
   * @returns {boolean} true if the elem is in the tree
   */
  this.contains = elem => contains(root, elem);

  /**
   * Add an element to the tree
   * @param {string | number} elem element to be added
   * @returns {boolean} true if the elem is added
   */
  this.add = elem => {
    if (this.contains(elem)) return false;
    root = add(root, elem);
    size++;
    return true;
  };

  /**
   * Remove an element from the tree
   * @param {string | number} elem Element to be removed
   * @returns {boolean} true if the elem is removed
   */
  this.remove = elem => {
    if (!this.contains(elem)) return false;
    root = remove(root, elem);
    size--;
    return true;
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

  this[Symbol.iterator] = this.traverse;

  this.toString = (order = TreeTraversalOrder.LEVEL_ORDER) => {
    const values = [];
    for (let value of this[Symbol.iterator](order)) values.push(value);
    return values.join(' ');
  };
}

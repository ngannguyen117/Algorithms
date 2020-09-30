/**
 * LinkedList implementation using Javascript (based on a William Fiset's LinkedList Java implementation)
 *
 * @author Ngan Nguyen, ngan.tx.nguyen@gmail.com
 *
 * Date: 09/29/2020
 *
 * LinkedList: a sequential list of nodes which hold data and a pointer that points to the next node. The last node in the list will point to null.
 * Head: The first node in the linked list
 * Tail: The last node in the linked list
 * We should always have reference to the head and tail to do quick addition/removal
 *
 * Usage: List, circular List, Queue, Stack implementations, separate chaining (to solve hashtable collision), adjacency list for graphs, etc
 *
 * Singly linked list:
 *  - a LinkedList that each node only holds a reference (pointer) to the next node.
 *  - Pros: uses less memory and has a simpler implementation.
 *  - Cons: cannot access previous element.
 *  - Complexity:
 *    - Search: O(n)
 *    - Insert at head: O(1)
 *    - Insert at tail: O(1)
 *    - Remove at head: O(1)
 *    - Remove at tail: O(n)
 *    - Remove in middle: O(n)
 *
 * Doubly linked list:
 *  - a LinkedList that each node holds a reference (pointer) to the next AND PREVIOUS nodes.
 *  - Cons: uses double memory because it has to store prev pointer
 *  - Pros: can traverse backwards, and has better time complexity on removal at tail
 *  - Complexity:
 *    - Search: O(n)
 *    - Insert at head: O(1)
 *    - Insert at tail: O(1)
 *    - Remove at head: O(1)
 *    - Remove at tail: O(1)
 *    - Remove in middle: O(n)
 */

/**
 * Doubly Linked List that does not allow duplicate value.
 *
 * The allowed data types in this linked list are string and number, no Objects
 */
export function DoublyLinkedList() {
  /**
   * a Node in a linked list that contains data, a pointer to the previous node and a pointer to the next node
   * @param {string | number} data
   * @param {Node} prev a pointer to the previous node
   * @param {Node} next a pointer to the next node
   */
  function Node(data, prev = null, next = null) {
    this.data = data;
    this.prev = prev;
    this.next = next;
  }

  let length = 0; // number of nodes in the list
  let head = null;
  let tail = null;
  const values = new Set(); // keep track of values have been added to the list

  /**
   * Check whether a value exists in the list. O(1)
   * @param {string | number} value node's data
   * @returns {boolean} true if it exists
   */
  this.contains = value => values.has(value);

  /**
   * Throw an error when there's already such a value exists in the list. O(1)
   * @param {string | number} value
   */
  const checkDuplication = value => {
    if (this.contains(value)) throw Error('Duplicate values');
  };

  /**
   * Check if the index is within the valid range [0, length). O(1)
   * @param {number} index an index number for the list
   */
  const validateIndex = index => {
    if (index < 0 || index >= length) throw Error('Index out of range');
  };

  /**
   * when a new node has been added to the list, increment the length and add that value to the set values. O(1)
   * @param {string | number} data
   */
  const nodeAdded = data => {
    length++;
    values.add(data);
  };

  /**
   * when a new node has been removed from the list, decrement the length and delete that value to the set values. O(1)
   * @param {string | number} data
   */
  const nodeRemoved = data => {
    length--;
    values.delete(data);
  };

  this.size = () => length;
  this.isEmpty = () => length === 0;

  /**
   * Return data at the list's head, if the list is not empty. O(1)
   */
  this.peakFirst = () => (head ? head.data : null);

  /**
   * Return data at the list's tail, if the list is not empty. O(1)
   */
  this.peakLast = () => (tail ? tail.data : null);

  /**
   * Clear the list by removing all nodes's pointers. O(n)
   */
  this.clear = () => {
    if (this.isEmpty()) return;

    let trav = head;
    while (trav) {
      const next = trav.next;
      trav.next = trav.prev = trav.data = null;
      trav = next;
    }

    length = 0;
    head = tail = null;
    values.clear();
  };

  /**
   * Add a new node with the provided data to the beginning of the list, if the value hasn't existed in the list. O(1)
   * @param {string | number} data
   */
  this.addFirst = data => {
    checkDuplication(data);

    if (this.isEmpty()) head = tail = new Node(data);
    else {
      head.prev = new Node(data, null, head);
      head = head.prev;
    }

    nodeAdded(data);
  };

  /**
   * Add a new node with the provided data to the end of the list, if the value hasn't existed in the list. O(1)
   * @param {string | number} data
   */
  this.addLast = data => {
    checkDuplication(data);

    if (this.isEmpty()) head = tail = new Node(data);
    else {
      tail.next = new Node(data, tail, null);
      tail = tail.next;
    }

    nodeAdded(data);
  };

  /**
   * Add a new node with the provided data to the end of the list, if the value hasn't existed in the list. O(1)
   * @param {string | number} data
   */
  this.add = data => this.addLast(data);

  /**
   * Insert a new node to the list at the specified index, if the value hasn't existed and the index is within range. O(n)
   * @param {string | number} data
   * @param {number} index
   */
  this.insert = (data, index) => {
    if (index === 0) return this.addFirst(data);
    if (index === length) return this.addLast(data);

    checkDuplication(data);
    validateIndex(index);

    let trav = head;
    for (let i = 0; i < index - 1; i++) trav = trav.next;

    const newNode = new Node(data, trav, trav.next);
    trav.next.prev = newNode;
    trav.next = newNode;

    nodeAdded(data);
  };

  /**
   * Remove the first node from the list. O(1)
   * @returns {string | number} data the removed node's data
   */
  this.removeFirst = () => {
    if (this.isEmpty()) return;

    const data = head.data;
    head = head.next;
    nodeRemoved(data);

    if (this.isEmpty()) tail = null;
    else head.prev = null;

    return data;
  };

  /**
   * Remove the last node from the list. O(1)
   * @returns {string | number} the removed node's data
   */
  this.removeLast = () => {
    if (this.isEmpty()) return;

    const data = tail.data;
    tail = tail.prev;
    nodeRemoved(data);

    if (this.isEmpty()) head = null;
    else tail.next = null;

    return data;
  };

  /**
   * Remove an arbitrary node from the list. O(1)
   * @param {Node} node node to be removed
   * @returns {string | number} the removed node's data
   */
  this.removeNode = node => {
    if (!node.prev) return this.removeFirst();
    if (!node.next) return this.removeLast();

    [node.prev.next, node.next.prev] = [node.next, node.prev];
    const data = node.data;
    node.next = node.prev = null;

    nodeRemoved(data);
    return data;
  };

  /**
   * Remove a node at the specified index. O(n)
   * @param {number} index the index of the node to be removed
   * @returns {string | number} the removed node's data
   */
  this.removeAt = index => {
    if (index === 0) return this.removeFirst();
    if (index === length - 1) return this.removeLast();

    validateIndex(index);
    let trav = head;
    for (let i = 0; i < index; i++) trav = trav.next;

    return this.removeNode(trav);
  };

  /**
   * Remove a node with the specified value. O(n)
   * @param {string | number} value value of a node to be removed
   * @returns {string | number} the removed node's data
   */
  this.removeNodeWithValue = value => {
    if (!values.has(value)) return value;

    for (let trav = head; trav; trav = trav.next)
      if (trav.data === value) return this.removeNode(trav);
  };

  /**
   * Find the index of the node with the specified value. O(n)
   * @param {string | number} value value of a node to be found
   * @returns {number} the node's index, or -1 if it doesn't exist
   */
  this.indexOf = value => {
    if (!this.contains(value)) return -1;
    let trav = head;
    for (let i = 0; trav, i < length; trav = trav.next, i++)
      if (trav.data === value) return i;
  };

  /**
   * Define a iterator for the list so that we can use it as an iterator. For each iteration, the iterator returns a node.
   */
  this[Symbol.iterator] = function* () {
    for (let trav = head; trav; trav = trav.next) yield trav;
  };
}

/**
 * Define the toString method for the list, it returns the list of data in each node, seperated by one space. O(n)
 */
DoublyLinkedList.prototype.toString = function () {
  const values = [];
  for (let node of this[Symbol.iterator]()) values.push(node.data);
  return values.join(' ');
};

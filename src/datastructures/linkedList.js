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
 * Doubly Linked List that allows duplicate values.
 *
 * The allowed data types in this linked list are string and number
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

  /**
   * Check if the index is within the valid range [0, length). O(1)
   * @param {number} index an index number for the list
   */
  const validateIndex = index => {
    if (index < 0 || index >= length) throw Error('Index out of range');
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
  };

  /**
   * Add a new node with the provided data to the beginning of the list. O(1)
   * @param {string | number} data
   */
  this.addFirst = data => {
    if (this.isEmpty()) head = tail = new Node(data);
    else {
      head.prev = new Node(data, null, head);
      head = head.prev;
    }

    length++;
  };

  /**
   * Add a new node with the provided data to the end of the list. O(1)
   * @param {string | number} data
   */
  this.addLast = data => {
    if (this.isEmpty()) head = tail = new Node(data);
    else {
      tail.next = new Node(data, tail, null);
      tail = tail.next;
    }

    length++;
  };

  /**
   * Add a new node with the provided data to the end of the list. O(1)
   * @param {string | number} data
   */
  this.add = data => this.addLast(data);

  /**
   * Insert a new node to the list at the specified index, if the index is within range. O(n)
   * @param {string | number} data
   * @param {number} index
   */
  this.insert = (data, index) => {
    if (index === 0) return this.addFirst(data);
    if (index === length) return this.addLast(data);

    validateIndex(index);

    let trav = head;
    for (let i = 0; i < index - 1; i++) trav = trav.next;

    const newNode = new Node(data, trav, trav.next);
    trav.next.prev = newNode;
    trav.next = newNode;

    length++;
  };

  /**
   * Remove the first node from the list. O(1)
   * @returns {string | number} data the removed node's data
   */
  this.removeFirst = () => {
    if (this.isEmpty()) return;

    const data = head.data;
    head = head.next;
    length--;

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
    length--;

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

    length--;
    return data;
  };

  /**
   * Remove a node at the specified index. O(n)
   * @param {number} index the index of the node to be removed
   * @returns {string | number} the removed node's data
   */
  this.removeAt = index => {
    validateIndex(index);

    if (index === 0) return this.removeFirst();
    if (index === length - 1) return this.removeLast();

    let trav = head;
    for (let i = 0; i < index; i++) trav = trav.next;

    return this.removeNode(trav);
  };

  /**
   * Remove the first node with the specified value. O(n)
   * @param {string | number} value value of a node to be removed
   * @returns {boolean} true if the node with that value is removed, false if there's no node with that value
   */
  this.removeFirstNodeWithValue = value => {
    if (this.isEmpty()) return false;

    if (head.data === value) {
      this.removeFirst();
      return true;
    }

    for (let trav = head; trav; trav = trav.next)
      if (trav.data === value) {
        this.removeNode(trav);
        return true;
      }

    return false;
  };

  /**
   * Remove the all nodes with the specified value. O(n)
   * @param {string | number} value value of a node to be removed
   * @returns {boolean} true if nodes with that value are removed, false if there's no node with that value
   */
  this.removeAllNodesWithValue = value => {
    if (this.isEmpty()) return false;

    let found = false;
    for (let trav = head; trav; trav = trav.next)
      if (trav.data === value) {
        const prev = trav.prev;
        this.removeNode(trav);
        if (prev) trav = prev;

        found = true;
      }

    return found;
  };

  /**
   * Find the first index of the node with the specified value. O(n)
   * @param {string | number} value value of a node to be found
   * @returns {number} the node's index, or -1 if it doesn't exist
   */
  this.indexOf = value => {
    let trav = head;
    for (let i = 0; trav, i < length; trav = trav.next, i++)
      if (trav.data === value) return i;
    return -1;
  };

  /**
   * Check whether a value exists in the list. O(n)
   * @param {string | number} value node's data
   * @returns {boolean} true if it exists
   */
  this.contains = value => this.indexOf(value) !== -1;

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

/**
 * Singly Linked List, accept number or string, and allow duplicate values
 */
export function SinglyLinkedList() {
  /**
   * a Node in a linked list that contains data and a pointer to the next node
   * @param {string | number} data
   * @param {Node} next a pointer to the next node
   */
  function Node(data, next = null) {
    this.data = data;
    this.next = next;
  }

  let length = 0;
  let head = null;
  let tail = null;

  this.size = () => length;
  this.isEmpty = () => length === 0;

  /**
   * Check if the index is within the valid range [0, length). O(1)
   * @param {number} index an index number for the list
   */
  const validateIndex = index => {
    if (index < 0 || index >= length) throw Error('Index out of range');
  };

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
      trav.next = trav.data = null;
      trav = next;
    }

    head = tail = null;
    length = 0;
  };

  /**
   * Add a new node with the provided data to the beginning of the list. O(1)
   * @param {string | number} data
   */
  this.addFirst = data => {
    if (this.isEmpty()) head = tail = new Node(data);
    else {
      const node = new Node(data, head);
      head = node;
    }

    length++;
  };

  /**
   * Add a new node with the provided data to the end of the list. O(1)
   * @param {string | number} data
   */
  this.addLast = data => {
    const node = new Node(data);
    if (this.isEmpty()) head = tail = node;
    else {
      tail.next = node;
      tail = node;
    }

    length++;
  };

  /**
   * Add a new node with the provided data to the end of the list. O(1)
   * @param {string | number} data
   */
  this.add = data => this.addLast(data);

  /**
   * Insert a new node to the list at the specified index, if the index is within range. O(n)
   * @param {string | number} data
   * @param {number} index
   */
  this.insert = (data, index) => {
    if (index === 0) return this.addFirst(data);
    if (index === length) return this.addLast(data);

    validateIndex(index);

    let trav = head;
    for (let i = 0; i < index - 1; i++) trav = trav.next; // trav pos will be at index - 1

    const node = new Node(data, trav.next);
    trav.next = node;

    length++;
  };

  /**
   * Remove the first node from the list. O(1)
   * @returns {string | number} data the removed node's data
   */
  this.removeFirst = () => {
    if (this.isEmpty()) return;

    const prevHead = head;
    const data = prevHead.data;
    head = head.next;
    prevHead.next = null;

    length--;
    if (this.isEmpty()) tail = null;

    return data;
  };

  /**
   * Remove the next node from the list from this specific node. O(n)
   * @param {Node} node node before the node to be removed
   * @returns {Node} the current node
   */
  this.removeNextNode = node => {
    if (!node || !node.next) return node;

    const next = node.next;
    [node.next, next.next] = [next.next, null];
    length--;

    return node;
  };

  /**
   * Get the node at index - 1
   * @param {number} index the index of the node where we want to get the previous node from
   */
  this.getPrevNode = index => {
    let trav = head;
    for (let i = 0; i < index - 1; i++) trav = trav.next;
    return trav;
  };

  /**
   * Remove the last node from the list. O(n)
   * @returns {string | number} data the removed node's data
   */
  this.removeLast = () => {
    if (this.isEmpty()) return;
    if (length === 1) return this.removeFirst();

    let prevNode = this.getPrevNode(length - 1);
    prevNode = this.removeNextNode(prevNode);
    const data = tail.data;
    tail = prevNode;
    return data;
  };

  /**
   * Remove a node at the specified index. O(n)
   * @param {number} index the index of the node to be removed
   * @returns {string | number} the removed node's data
   */
  this.removeAt = index => {
    validateIndex(index);

    if (index === 0) return this.removeFirst();
    if (index === length - 1) return this.removeLast();

    let prevNode = this.getPrevNode(index);
    const data = prevNode.next.data;
    this.removeNextNode(prevNode);

    return data;
  };

  /**
   * Remove node(s) with the specified value, if exists
   * @param {string | number} value
   * @param {boolean} single whether to delete only a single first value or not
   */
  const removeNodesWithValueHelper = (value, single = false) => {
    if (this.isEmpty() || (length === 1 && head.data !== value)) return false;

    if (head.data === value) {
      this.removeFirst();
      if (single) return true;
    }

    let found = false;
    let trav = head;
    while (trav && trav.next) {
      if (trav.next.data === value) {
        const node = this.removeNextNode(trav);
        if (!node.next) tail = node;
        found = true;
        if (single) break;
      }
      trav = trav.next;
    }

    return found;
  };

  /**
   * Remove the first node with the specified value. O(n)
   * @param {string | number} value value of a node to be removed
   * @returns {boolean} true if the node with that value is removed, false if there's no node with that value
   */
  this.removeFirstNodeWithValue = value =>
    removeNodesWithValueHelper(value, true);

  /**
   * Remove the all nodes with the specified value. O(n)
   * @param {string | number} value value of a node to be removed
   * @returns {boolean} true if nodes with that value are removed, false if there's no node with that value
   */
  this.removeAllNodesWithValue = value => removeNodesWithValueHelper(value);

  /**
   * Find the first index of the node with the specified value. O(n)
   * @param {string | number} value value of a node to be found
   * @returns {number} the node's index, or -1 if it doesn't exist
   */
  this.indexOf = value => {
    let trav = head;
    for (let i = 0; trav, i < length; trav = trav.next, i++)
      if (trav.data === value) return i;
    return -1;
  };

  /**
   * Check whether a value exists in the list. O(n)
   * @param {string | number} value node's data
   * @returns {boolean} true if it exists
   */
  this.contains = value => this.indexOf(value) !== -1;

  /**
   * Define a iterator for the list so that we can use it as an iterator. For each iteration, the iterator returns a node.
   */
  this[Symbol.iterator] = function* () {
    for (let trav = head; trav; trav = trav.next) yield trav;
  };
}

SinglyLinkedList.prototype.toString = function () {
  const values = [];
  for (let node of this[Symbol.iterator]()) values.push(node.data);
  return values.join(' ');
};

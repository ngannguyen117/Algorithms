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
 * Doubly LinkedList. Allows duplicate values
 */
export function DoublyLinkedList() {
  /**
   * a private Node class to hold data, prev node and next node
   */
  function Node(data, prev = null, next = null) {
    this.data = data;
    this.prev = prev;
    this.next = next;
  }

  let length = 0;
  let head = null;
  let tail = null;

  /**
   * The number of nodes in this linked list, O(1)
   */
  this.size = () => length;

  /**
   * Is this linked list empty?, O(1)
   */
  this.isEmpty = () => length === 0;

  /**
   * Clear this linked list, O(n)
   */
  this.clear = () => {
    let trav = head;
    while (trav) {
      const next = trav.next;
      trav.prev = trav.next = trav.data = null;
      trav = next;
    }

    length = 0;
    head = tail = trav = null;
  };

  /**
   * Add a new node to the end of the list
   * @param {*} data the data that the new node will hold.
   * O(1)
   */
  this.addLast = data => {
    if (this.isEmpty()) head = tail = new Node(data, null, null);
    else {
      tail.next = new Node(data, tail, null);
      tail = tail.next;
    }
    length++;
  };

  /**
   * Add a new node to the beginning of the list
   * @param {*} data the data that the new node will hold.
   * O(1)
   */
  this.addFirst = data => {
    if (this.isEmpty()) head = tail = new Node(data, null, null);
    else {
      head.prev = new Node(data, null, head);
      head = head.prev;
    }
    length++;
  };

  /**
   * The default add method of a linked list will be added to the end of the list
   * @param {*} data the data that the new node will hold.
   * O(1)
   */
  this.add = data => this.addLast(data);

  /**
   * Insert a new node at the index location. O(n)
   * @param {*} data the data that the new node will hold
   * @param {*} index the index location for data to be inserted at.
   */
  this.insert = (data, index) => {
    if (index < 0 || index > length) throw Error('Illegal Index');
    if (index === 0) return this.addFirst(data);
    if (index === length) return this.addLast(data);

    let trav = head;
    for (let i = 0; i < index - 1; i++) trav = trav.next;

    const node = new Node(data, trav, trav.next);
    trav.next.prev = node;
    trav.next = node;

    length++;
  };

  /**
   * Return the value of the first element, if exists.
   * O(1)
   */
  this.peakFirst = () => (head ? head.data : null);

  /**
   * Return the value of the last element, if exists.
   * O(1)
   */
  this.peakLast = () => (tail ? tail.data : null);

  /**
   * Remove the first element of the list.
   * O(1)
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
   * Remove the last element of the list.
   * O(1)
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
   * Remove an arbitrary node. O(1).
   * Assuming the node provided exists in the linked list
   * @param {*} node
   */
  this.remove = node => {
    if (!node.prev) return this.removeFirst();
    if (!node.next) return this.removeLast();

    node.prev.next = node.next;
    node.next.prev = node.prev;

    const data = node.data;
    node = node.prev = node.next = null;
    length--;

    return data;
  };

  /**
   * Remove a node at a particular index position.
   * O(n).
   * @param {*} index The index of the node that needs to be removed
   */
  this.removeAt = index => {
    if (index < 0 || index >= length) throw Error('Illegal Index');

    let trav;
    if (index < Math.round(length / 2)) {
      trav = head;
      for (let i = 0; i != index; i++) trav = trav.next;
    } else {
      trav = tail;
      for (let i = length - 1; i != index; i--) trav = trav.prev;
    }

    this.remove(trav);
  };

  /**
   * Remove all the nodes in the list with the provided value.
   * O(n).
   * @param {*} value the value of the Node.data
   */
  this.removeNodeWithValue = value => {
    let found = false;
    for (let trav = head; trav; trav = trav.next)
      if (trav.data === value) {
        this.remove(trav);
        found = true;
      }
    return found;
  };

  /**
   * Find the first index of the Node with the provided value. O(n)
   * @param {*} value the value of the Node.data
   */
  this.indexOf = value => {
    let index = 0;
    let trav;

    for (trav = head; trav; trav = trav.next, index++)
      if (trav.data === value) return index;

    return -1;
  };

  /**
   * Check whether the provided value exists in the list. O(n)
   * @param {*} value the value of the Node.data
   */
  this.contains = value => this.indexOf(value) !== -1;

  /**
   * Create a method for @@iterator protocol so that we can iterate through linked list as a iterable
   */
  this[Symbol.iterator] = function* () {
    for (let trav = head; trav; trav = trav.next) yield trav.data;
  };
}

DoublyLinkedList.prototype.toString = function () {
  const values = [];
  for (const value of this[Symbol.iterator]()) values.push(value);
  return values.join(' ');
};

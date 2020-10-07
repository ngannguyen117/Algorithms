/**
 * Priority Queue implementation using Javascript (based on a William Fiset's Priority Queue Java implementation)
 *
 * @author Ngan Nguyen, ngan.tx.nguyen@gmail.com
 *
 * Date: 10/1/2020
 *
 * Priority Queue:
 *  - an Abstract Data Type (ADT) that operates similar to a normal queue except each element has a priority. Element with higher priority will be removed first from the Priority Queue.
 *  - only support comparable data
 *  - Priority queue uses a heap to know which element to be removed next. (However, since PQ is an ADT, it can also be implemented with other data structures)
 *  - Usage:
 *    - Some implementations of Dijkstra's Shortest Path algorithm
 *    - Huffman encoding (which is often used for lossless data compression)
 *    - Prim Minimum Spanning Tree (MST) algorithm on Directed graphs
 *    - Dynamically fetch next best or next worst element
 *  - Complexity: (implemented with binary heap)
 *    - Binary Heap Construction: O(n)
 *    - Poll: O(log(n))
 *    - Peak: O(log(1))
 *    - Add: O(log(n))
 *    - Naive remove: O(n)
 *    - Naive contain: O(n)
 *    - Advanced remove with help from a hashtable: O(log(n))
 *    - Contain check with help from a hashtable: O(1)
 *    Using a hashtable to help optimize these operations take up linear space and also add some overhead to the binary heap implementation
 *
 * - Heap:
 *  - A tree-based data structure that satisfies the heap invariant (heap property).
 *  - Heap invariant:
 *    - if A is a parent to node B then A is ordered with respect to node B for all nodes A, B in the heap.
 *    - In a MinHeap, for all nodes A, B, if A is a parent to B then A <= B
 *    - In a Max Heap, for all nodes A and B, if A is a parent to B then A >= B
 *  - Priority Queue and heap are not the same. Priority Queue is an ADT that defines what behaviors a PQ should have. Heap is one of Priority Queue implementation.
 *  - Heap is a popular PQ implementation because of its best possible time complexity for a PQ.
 *  - Binary Heap:
 *    - A binary tree that satisfies the heap invariant. Each node in a binary heap has exactly 2 children.
 *    - A Binary heap should also be complete.
 *      - A complete binary tree is a tree in which at every level, except at possibly the last is completely filled and all nodes are as far left as possible.
 *      - When we insert a new node, we always insert at the bottom row, far left (insertion point) to meet this complete tree property.
 *    - Representation using Array:
 *      - By using an array, the insertion point is always the end of the array.
 *      - let i be the parent index, left child index = 2i + 1, right child index = 2i + 2
 */

import { compare } from '../utils/compare';

/**
 * Priority queue implementation using a binary heap.
 * By default, it is a min heap and only accept string and number.
 *
 * However, you can provide your own comparator function to make it a max heap or for it to accept other data types.
 *
 * Comparator function has to follow this: (elem1, elem2) => {-1 | 0 | 1}
 * @param {(e1, e2) => -1 | 0 | 1} comparator a function that take two input e1, e2, defines how to compare them.
 */
export function BinaryHeap(comparator = compare()) {
  let data = [];

  this.comparator = comparator;
  this.size = () => data.length;
  this.isEmpty = () => this.size() === 0;
  this.clear = () => (data = []); // O(1)

  /**
   * Check if element at index i has higher priority over element at index j. O(1)
   * It does if the comparator returns -1 or 0
   * @param {number} i index of element at position i
   * @param {number} j index of element at position j
   * @returns {boolean} true if elems[i] has higher priority than elems[j]
   */
  const hasPriority = (i, j) => this.comparator(data[i], data[j]) <= 0;

  /**
   * Swap 2 elements at index i and j, assuming i and j are valid. O(1)
   * @param {number} i index of element at position i
   * @param {number} j index of element at position j
   */
  const swap = (i, j) => {
    const temp = data[i];
    data[i] = data[j];
    data[j] = temp;
  };

  const getParentIndex = i => Math.floor((i - 1) / 2);
  const getLeftChildIndex = i => 2 * i + 1;
  const getRightChildIndex = i => 2 * i + 2;

  /**
   * Perform bubble up for node at position index, assuming index is valid. O(log(n))
   * @param {number} index the index of the node needs to be bubbled up
   */
  const swim = index => {
    let parentInd = getParentIndex(index);

    // Keeps bubbling up if we haven't reached the top or the current node
    // still has higher priority than its parent node
    while (index > 0 && hasPriority(index, parentInd)) {
      swap(index, parentInd);
      index = parentInd;
      parentInd = getParentIndex(index);
    }
  };

  /**
   * Perform sifting down for the node at position index, assuming index is valid. O(log(n))
   * @param {number} index the index of the node needs to be sifted down
   */
  const sink = index => {
    while (true) {
      const leftInd = getLeftChildIndex(index);
      const rightInd = getRightChildIndex(index);

      if (leftInd >= this.size()) break; // children indexes are both greater than heapSize

      // if right & left indexes are both valid, then get the one with higher priority,
      // otherwise, pick leftInd (because rightInd at this point is invalid)
      let vip = leftInd;
      if (rightInd < this.size() && !hasPriority(leftInd, rightInd))
        vip = rightInd;

      // if current node has higher priority than the chosen node then we're done
      if (hasPriority(index, vip)) break;

      swap(index, vip);
      index = vip;
    }
  };

  /**
   * Remove an element at a particular index. O(log(n))
   * @param {number} index index of the element to be removed
   */
  this.removeAt = index => {
    if (this.isEmpty()) return null;

    if (index < 0 || index >= this.size())
      throw new Error('Index out of range');

    const lastInd = this.size() - 1;
    swap(index, lastInd);
    const removedData = data.pop();

    // if index was the last element, we're done
    if (index == lastInd) return removedData;

    const elem = data[index];
    sink(index); // try sinking

    // if sinking doesn't work, try swimming
    if (this.comparator(elem, data[index]) === 0) swim(index);
    return removedData;
  };

  /**
   * Remove a particular element from the heap. O(n)
   * @param {any} elem a value that might be in the heap
   * @returns {boolean} true if element found and deleted, otherwise false
   */
  this.remove = elem => {
    if (!elem) return false;

    for (let i = 0; i < this.size(); i++)
      if (this.comparator(elem, data[i]) === 0) {
        this.removeAt(i);
        return true;
      }

    return false;
  };

  /**
   * Returns the element that has highest priority. If the PQ is empty, return null. O(1)
   * @returns highest priority's element
   */
  this.peak = () => (this.isEmpty() ? null : data[0]);

  /**
   * Remove the highest priority element from the heap
   * @returns top priority element
   */
  this.poll = () => this.removeAt(0);

  /**
   * Check if the heap contains the provided value. O(n)
   * @param {any} value
   * @returns {boolean} true if this value is in the heap, otherwise false
   */
  this.contains = value => {
    for (let i = 0; i < this.size(); i++)
      if (this.comparator(value, data[i]) === 0) return true;
    return false;
  };

  /**
   * Add a new value to the heap only if it is not null
   * @param {any} value new value to be added to the heap
   */
  this.add = value => {
    if (!value) throw new Error('Parameter Missing or Invalid');
    data.push(value);
    swim(data.length - 1);
  };

  /**
   * Add multiple values to the heap at once. This method only append
   * those elements to the end of the heap but doesn't rearrange them
   * to satisfy the heap invariant. To satisfy the heap invariant,
   * this method should be followed by heapify() method.
   * @param {any[]} values an array of values to be added to the heap, the original order may not satisfied heap invariant
   */
  this.addBulk = values => {
    if (!values || !Array.isArray(values) || values.length < 1)
      throw new Error('Parameter Missing or Invalid');
    data.push(...values);
  };

  /**
   * Rearrange elements in the heap to satisfy the heap invariant
   */
  this.heapify = () => {
    for (let i = Math.max(0, Math.floor(data.length / 2) - 1); i >= 0; i--)
      sink(i);
  };

  /**
   * Recursively check if this heap is a valid heap (which satisfies the heap invariant,
   * it could be either min or max heap).
   *
   * Call with index = 0 to start at the root
   * @param {number} index the parent index of the tree/subtree
   */
  this.isValidHeap = (index = 0) => {
    const heapSize = this.size();
    if (index >= heapSize) return true;

    const leftInd = getLeftChildIndex(index);
    const rightInd = getRightChildIndex(index);

    if (leftInd < heapSize && !hasPriority(index, leftInd)) return false;
    if (rightInd < heapSize && !hasPriority(index, rightInd)) return false;

    return this.isValidHeap(leftInd) && this.isValidHeap(rightInd);
  };

  this[Symbol.iterator] = function* () {
    for (let i = 0; i < this.size(); i++) yield data[i];
  };

  this.toString = () => data.join(' ');
}

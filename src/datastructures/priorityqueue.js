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
 *    - Peak: O(1)
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
 * 
 * Indexed Priority Queue:
 *  - A traditional priority queue invariant which on top of the regular PQ operations, it also supports quick updates and deletions of Key-Value pair.
 *  - Complexity: (indexed binary heap)
 *    - Update, Remove, Poll min key index, Poll min value, insert, decrease key, increase key: O(log(n))
 *    - Value of, Contains, Peak min key index, Peak min value: O(1)
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

  //----------------------------- HELPER METHODS -------------------------------
  /**
   * Check if element at index i has higher priority over element at index j. O(1)
   * It does if the comparator returns -1
   * @param {number} i index of element at position i
   * @param {number} j index of element at position j
   * @returns {boolean} true if elems[i] has higher priority than elems[j]
   */
  const hasPriority = (i, j) => comparator(data[i], data[j]) < 0;

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
    while (parentInd >= 0 && hasPriority(index, parentInd)) {
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
      if (rightInd < this.size() && hasPriority(rightInd, leftInd))
        vip = rightInd;

      // if current node has higher priority than the chosen node then we're done
      if (hasPriority(index, vip)) break;

      swap(index, vip);
      index = vip;
    }
  };

  //----------------------------- PUBLIC METHODS -------------------------------
  this.size = () => data.length;
  this.isEmpty = () => this.size() === 0;
  this.clear = () => (data = []); // O(1)

  /**
   * Remove an element at a particular index. O(log(n))
   * @param {number} index index of the element to be removed
   */
  this.removeAt = index => {
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
    if (comparator(elem, data[index]) === 0) swim(index);
    return removedData;
  };
  
  /**
   * Remove a particular element from the heap. O(n)
   * @param {any} elem a value that might be in the heap
   * @returns {boolean} true if element found and deleted, otherwise false
   */
  this.remove = elem => {
    if (elem == null || elem === '') return false;

    for (let i = 0; i < this.size(); i++)
      if (comparator(elem, data[i]) === 0) {
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
  this.poll = () => (this.isEmpty() ? null : this.removeAt(0));

  /**
   * Check if the heap contains the provided value. O(n)
   * @param {any} value
   * @returns {boolean} true if this value is in the heap, otherwise false
   */
  this.contains = value => {
    for (let i = 0; i < this.size(); i++)
      if (comparator(value, data[i]) === 0) return true;
    return false;
  };

  /**
   * Add a new value to the heap only if it is not null
   * @param {any} value new value to be added to the heap
   */
  this.add = value => {
    if (value == null || value === '') throw new Error('Parameter Missing or Invalid');
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

    if (leftInd < heapSize && hasPriority(leftInd, index)) return false;
    if (rightInd < heapSize && hasPriority(rightInd, index)) return false;

    return this.isValidHeap(leftInd) && this.isValidHeap(rightInd);
  };

  this[Symbol.iterator] = function* () {
    for (let value of data) yield value;
  };

  this.toString = () => data.join(' ');
}

/**
 * Indexed Priority Queue (IPQ) implementation using a D-ary heap which help PQ have quick
 * updates and removals. The higher degree D is, the faster it takes to update, but it also takes
 * more operations to remove/delete a key-value pair.
 * 
 * Example of how a min IPQ works:
 *  - names = ['anna', 'bella', 'carly'], ages = [23, 12, 15] (anna is 23, bella is 12, carly is 15)
 *  - for i, names[i] related to ages[i] => i is the key index
 *  - We only insert ages into IPQ. Age is used to determine priority. The indexes of ages will be used to refer back to names array.
 *  - The IPQ has an array pm (position Map) that stores the ages' indexes with priority.
 *  - In normal PQ, the underlying array stores the actual value and arr[0] is the element with the highest priority.
 *  - However, in IPQ, pm[0] is the index of the value that has the highest priority.
 *  - In this example, ipq.poll() returns 1
 *  - names[1] is 'bella' which has the lowest age 12 - ages[1]. 
 * 
 * By default, it is a min heap and only accept string and number.
 *
 * However, you can provide your own comparator function to make it a max heap or for it to accept other data types.
 *
 * Comparator function has to follow this: (elem1, elem2) => {-1 | 0 | 1}
 * @param {(e1, e2) => -1 | 0 | 1} comparator a function that take two input e1, e2, defines how to compare them.
 */
export function IndexedDHeap(deg, size, comparator = compare()) {
  //-------------------------- Initialization --------------------------
  if (deg == null) throw new Error('Invalid degree value');
  if (size == null || size <= 0) throw new Error('Invalid size value');

  const degree = Math.max(2, deg);
  const maxSize = Math.max(degree + 1, size);
  let curSize = 0;
  const im = []; // inverse map (im's indexes = PQ's indexes): im[2] = 5 => in the PQ, the node at index 2 holds the key-value pair data[5]
  const pm = []; // position map - position of key-value pair in the priority queue: pm[5] = 2 => key-value pair data[5] is at index 2 of the PQ
  const data = []; // key-value pairs (key is array index, value is array element): const v = data[5] => ki = 5, value = v
  const child = [];
  const parent = [];

  for (let i = 0; i < maxSize; i++) {
    parent[i] = Math.floor((i - 1) / degree);
    child[i] = i * degree + 1;
    pm[i] = im[i] = -1;
  }

  //------------------------- HELPER METHODS --------------------------
  const validateKeyIndex = ki => {
    if (ki < 0 || ki >= maxSize) throw new Error('Key Index out of range');
  };

  const validateValue = value => {
    if (value == null || value === '') throw new Error('Invalid Value');
  };

  const doesKeyIndexExist = ki => {
    if (!this.contains(ki)) throw new Error('Key Index does not exist');
  };

  const hasPriority = (i, j) => comparator(data[im[i]], data[im[j]]) < 0;

  const swap = (i, j) => {
    pm[im[j]] = i;
    pm[im[i]] = j;
    const temp = im[i];
    im[i] = im[j];
    im[j] = temp;
  };

  /**
   * From the parent index i, find the most promising child below it
   * @param {number} i index in the im array (IPQ's)
   */
  const getChild = i => {
    let index = -1;
    const upperBound = Math.min(curSize, child[i] + degree);

    for (let j = child[i]; j < upperBound; j++)
      if (hasPriority(j, i)) index = i = j;

    return index;
  };

  /**
   * Sift the element down the heap if it has lower priority than its children
   */
  const sink = i => {
    for (let j = getChild(i); j !== -1; j = getChild(i)) {
      swap(i, j);
      i = j;
    }
  };

  /**
   * Bubble the element up if it has higher priority than its parent
   */
  const swim = i => {
    while (hasPriority(i, parent[i])) {
      swap(i, parent[i]);
      i = parent[i];
    }
  };

  /**
   * Replace/update value of a key index when applied
   */
  const replace = (ki, value, condition) => {
    doesKeyIndexExist(ki);
    validateValue(value);

    if (
      !condition ||
      (condition === 'decrease' && comparator(value, data[ki]) < 0) ||
      (condition === 'increase' && comparator(value, data[ki]) > 0)
    ) {
      const i = pm[ki];
      const oldValue = data[ki];
      data[ki] = value;
      sink(i);
      swim(i);
  
      return oldValue;
    }
  };

  //------------------------- PUBLIC METHODS --------------------------
  this.size = () => curSize;
  this.isEmpty = () => curSize === 0;
  this.contains = ki => {
    validateKeyIndex(ki);
    return pm[ki] !== -1;
  };

  this.valueOf = ki => this.contains(ki) ? data[ki] : null;

  /**
   * Get the key index of the key-value pair with the highest priority
   */
  this.peakKeyIndex = () => this.isEmpty() ? null : im[0];

  /**
   * Get the value of the key-value pair with the highest priority
   */
  this.peakValue = () => this.isEmpty() ? null : data[im[0]];

  /**
   * Insert a new key-value pair, doesn't accept duplicate key index
   */
  this.insert = (ki, value) => {
    if (this.contains(ki)) throw new Error('Duplicate Key Index');
    validateValue(value);

    data[ki] = value;
    pm[ki] = curSize;
    im[curSize] = ki;
    swim(curSize++);
  };

  /**
   * Delete the key-value pair with the provided key index
   */
  this.delete = ki => {
    doesKeyIndexExist(ki);

    // swap value at index i, then sink/swim to maintain the heap invariant
    const i = pm[ki];
    swap(i, --curSize);
    sink(i);
    swim(i);

    // clear value at index ki
    const value = data[ki];
    data[ki] = null;
    pm[ki] = im[curSize] = -1;
    return value;
  };

  /**
   * Delete the key-value pair with the highest priority
   */
  this.pollKeyIndex = () => {
    const ki = this.peakKeyIndex();
    if (ki != null) this.delete(ki);
    return ki; 
  };

  /**
   * Delete the key-value pair with the highest priority
   */
  this.pollValue = () => {
    const value = this.peakValue();
    this.pollKeyIndex();
    return value;
  };

  /**
   * Update the value of the Key index to the new value
   */
  this.update = (ki, value) => replace(ki, value);

  /**
   * Strictly increases the value associated with 'ki' to 'value'
   */
  this.decrease = (ki, value) => replace(ki, value, 'decrease');

  /**
   * Strictly decreases the value associated with 'ki' to 'value'
   */
  this.increase = (ki, value) => replace(ki, value, 'increase');

  /**
   * Validate if this heap satisfies the heap invariant
   */
  this.isValidHeap = (i = 0) => {
    const upperBound = Math.min(curSize, child[i] + degree);
    for (let j = child[i]; j < upperBound; j++) {
      if (hasPriority(j, i)) return false;
      if (!this.isValidHeap(j)) return false;
    }
    return true;
  };

  this[Symbol.iterator] = function* () {
    for (let i of im) if (i !== -1) yield i;
  };

  this.toString = () => {
    const values = [];
    for (let i of this) values.push(i);
    return values.join(' ');
  }
}

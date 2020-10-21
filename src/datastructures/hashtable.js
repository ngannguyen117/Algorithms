/**
 * Hash Table implementation using Javascript (based on a William Fiset's Hash Table Java implementation)
 *
 * @author Ngan Nguyen, ngan.tx.nguyen@gmail.com
 *
 * Date: 10/8/2020
 *
 * Hash Table:
 *  - a data structure that provides mapping from keys to values using technique called hashing (with a hash function)
 *  - usage: track item frequencies (ie counting number of times a word appears in a given text)
 *  - The key-value pairs in a HT can be any types including objects. However, they keys need to be hashable (immutable).
 *  - We use hash function as a way to index into the underlining array to achieve look up and removal in O(1).
 *  - Complexity: Insertion, Removal, Search are average O(1) and worse O(n)
 *  - Hash function H(x):
 *    - maps a key x to a whole number in a fixed range
 *    - Properties:
 *      - H(x) has to be deterministic
 *      - Should be uniform (to minimize hash collision and achieve complexity of O(1))
 *      - If H(x) == H(y), MAYBE x == y. If H(x) != H(y), for SURE, x != y
 *    - To speed up x & y comparison, compare their hash values first, only when they're not equal that we need to compare x & y explicitly.
 *    - When x != y && H(x) == H(y), we have a collision which potentially worsen the complexity. How to handle hash collision:
 *      - Use one of many hash collision resolution techniques.
 *      - Most popular are Separate Chaining and Open Addressing
 *
 * Separate Chaining:
 *  - maintain a DS (usually a linked list) to hold all unique values hashed into a particular index
 *
 * Open Addressing:
 *  - store the object at another available spot in the array by offseting its original hashed value
 *  - various probing functions: linear probing, quadratic probing, double hashing
 */

import { SinglyLinkedList } from './linkedList';
import { hashCode, hashCode2 } from '../utils/hash-code';
import { isPrime } from '../utils/is-prime';

function Entry (key, value) {
  this.key = key;
  this.value = value;
  this.hash = hashCode(key);
  this.toString = () => `${this.key}: ${this.value}`;
}

const DEFAULT_CAPACITY = 7;
const DEFAULT_LOAD_FACTOR = 0.65;
const TOMBSTONE = 'TOMBSTONE';

const gcd = (a, b) => {
  if (!b) return a;
  return gcd(b, a % b);
};

const OpenAddressingScheme = Object.freeze({
  LINEAR_PROBING: 1,
  QUADRATIC_PROBING: 2,
  DOUBLE_HASHING: 3,
});

/**
 * Initialize specified methods for different probing scheme to work with Open Addressing colision resolution
 * 
 * In quadratic probing, we use the following probing function H(k, x) = hashCode(k) + f(x) mod 2^n. (f(x) = (x^2 + x) / 2)
 *
 * This probing function guarantees to find an empty cell (It generates all numbers in range [0, 2^n)
 * without repetition for the first 2^n numbers.
 * @param {OpenAddressingScheme} scheme Type of probing function
 */
const initializeScheme = scheme => {
  let probe, adjustCapacity;
  let setProbe = () => {};
  let increaseCapacity = capacity => 2 * capacity + 1;

  switch (scheme) {
    case OpenAddressingScheme.LINEAR_PROBING:
      const LINEAR_CONSTANT = 17;
      probe = x => LINEAR_CONSTANT * x;
      adjustCapacity = capacity => {
        while (gcd(LINEAR_CONSTANT, capacity) !== 1) capacity++;
        return capacity;
      };
      break;
    case OpenAddressingScheme.QUADRATIC_PROBING:
      probe = x => x * x + x >> 1;
      increaseCapacity = capacity => 1 << (32 - Math.clz32(capacity)); // get the next power of 2
      adjustCapacity = capacity => {
        const currentPowerOf2 = 1 << (31 - Math.clz32(capacity));
        return capacity === currentPowerOf2 ? currentPowerOf2 : increaseCapacity(capacity);
      };
      break;
    case OpenAddressingScheme.DOUBLE_HASHING:
      let secondIndex;
      setProbe = (key, index) => {
        secondIndex = index(hashCode2(key));
        if (secondIndex === 0) secondIndex = 1;
      };
      probe = x => secondIndex * x;
      adjustCapacity = capacity => {
        while (!isPrime(capacity)) capacity++;
        return capacity;
      }
      break;
  }
  return { probe, setProbe, increaseCapacity, adjustCapacity };
}

/**
 * Hash Table implementation using Open Addressing
 * @param {number} cap initial capacity
 * @param {number} loadFactor the max percentage of spots can be filled in the table before resizing
 * @param {OpenAddressingScheme} scheme type of probing function
 */
function HashTableOpenAddressing (cap, loadFactor, scheme) {
  // Validate capacity and loadFactor
  if (cap < 0) throw new Error('Illegal capacity');
  if (loadFactor <= 0 || loadFactor > 1) throw new Error('Illegal load factor');

  // initialize local variables & methods
  const { probe, setProbe, increaseCapacity, adjustCapacity } = initializeScheme(scheme);
  const maxLoadFactor = loadFactor ? loadFactor : DEFAULT_LOAD_FACTOR;
  let arr, size, threshold, capacity, modificationCount, usedSlots;
  const initializeTable = () => {
    capacity = cap ? Math.max(DEFAULT_CAPACITY, cap) : DEFAULT_CAPACITY;
    threshold = Math.floor(capacity * maxLoadFactor);
    arr = [];
    size = 0;
    usedSlots = 0;
    modificationCount = 0;
  };
  initializeTable();

  //---------------------------- HELPER METHODS -----------------------------
  const isInvalidKey = key => key == null || key === '';
  const index = hash => (hash & 0x7fffffff) % capacity;

  const seekEntry = key => {
    if (isInvalidKey(key)) return null;

    setProbe(key, index);
    const offset = index(hashCode(key));

    for (let i = offset, j = -1, x = 1; arr[i]; i = index(offset + probe(x++))) {
      if (arr[i].key === TOMBSTONE)  j = j === -1 ? i : j; // record the first deleted cell index to perform lazy relocation
      else if (arr[i].key === key) {
        if (j === -1) return arr[i];

        // Previously encounter a deleted slot. We move the entry in i to j so that
        // if we need to find this key again, we'll find it faster. (lazy relocation)
        arr[j] = arr[i];
        arr[i] = new Entry(TOMBSTONE);
        return arr[j];
      }
    }

    return null;
  };

  const resizeTable = () => {
    capacity = increaseCapacity(capacity);
    capacity = adjustCapacity(capacity);
    threshold = Math.floor(capacity * maxLoadFactor);

    // create a new table with new capacity and switch reference with the current table
    let temp = arr;
    arr = [];
    let oldArr = temp;

    // reset size and usedSlots since we'll perform insertion on all non-empty entries again
    usedSlots = 0;
    size = 0;

    for (let entry of oldArr)
      if (entry && entry.key !== TOMBSTONE) this.insert(entry.key, entry.value);

    oldArr = temp = null;
  };

  //---------------------------- PUBLIC METHODS -----------------------------
  this.size = () => size;
  this.isEmpty = () => size === 0;
  this.clear = initializeTable;

  this.hasKey = key => seekEntry(key) !== null;
  this.contains = key => this.hasKey(key);

  this.get = key => {
    const entry = seekEntry(key);
    return entry ? entry.value : null;
  };

  this.remove = key => {
    if (isInvalidKey(key)) return null;

    setProbe(key, index);
    const offset = index(hashCode(key));

    for (let i = offset, x = 1; arr[i]; i = index(offset + probe(x++)))
      if (arr[i].key === key) {
        const value = arr[i].value;
        arr[i] = new Entry(TOMBSTONE);
        size--;
        modificationCount++;
        return value;
      }

    return null;
  };

  this.insert = (key, value) => {
    if (isInvalidKey(key)) throw new Error('Invalid Key');
    if (usedSlots >= threshold) resizeTable();

    setProbe(key, index);
    const newEntry = new Entry(key, value)
    const offset = index(newEntry.hash);

    for (let i = offset, x = 1, j = -1; ; i = index(offset + probe(x++))) {
      // found an empty spot, insert new entry
      if (!arr[i]) {
        if (j === -1) {
          usedSlots++;
          arr[i] = newEntry;
        } else arr[j] = newEntry;

        size++;
        modificationCount++;
        return null;
      }

      // this slot is either not empty or it is a tombstone
      if (arr[i].key === TOMBSTONE) j = j === -1 ? i : j;
      else if (arr[i].key === key) {
        const oldValue = arr[i].value;

        arr[i].value = value;
        if (j !== -1) {
          const temp = arr[j];
          arr[j] = arr[i];
          arr[i] = temp;
        }

        modificationCount++;
        return oldValue;
      }
    }
  };

  this.add = (key, value) => this.insert(key, value);
  this.put = (key, value) => this.insert(key, value);

  this.keys = () => {
    const keys = [];
    for (let entry of arr)
       if (entry && entry.key !== TOMBSTONE) keys.push(entry.key);
    return keys;
  };

  this.values = () => {
    const values = [];
    for (let entry of arr)
       if (entry && entry.key !== TOMBSTONE) values.push(entry.value);
    return values;
  };

  this[Symbol.iterator] = function* () {
    const changeCount = modificationCount;
    for (let entry of arr)
      if (entry && entry.key !== TOMBSTONE) {
        if (changeCount !== modificationCount) throw new Error('Concurrent Modification');
        yield entry.key;
      }
  };

  this.toString = () => {
    let str = '{';
    let count = 0;
    for (let entry of arr)
      if (entry && entry.key !== TOMBSTONE)
        str = str.concat(`${entry.toString()}${++count < size ? ', ' : ''}`);
    return str.concat('}');
  };
}

export function HashTableLinearProbing (cap, loadFactor) {
  HashTableOpenAddressing.call(this, cap, loadFactor, OpenAddressingScheme.LINEAR_PROBING);
}

export function HashTableQuadraticProbing (cap, loadFactor) {
  HashTableOpenAddressing.call(this, cap, loadFactor, OpenAddressingScheme.QUADRATIC_PROBING);
}

export function HashTableDoubleHashing (cap, loadFactor) {
  HashTableOpenAddressing.call(this, cap, loadFactor, OpenAddressingScheme.DOUBLE_HASHING);
}


/**
 * Hash Table implementation using Separate Chaining
 * @param {number} cap initial capacity
 * @param {number} loadFactor the max percentage of spots can be filled in the table before resizing
 */
export function HashTableSeparateChaining (cap, loadFactor) {
  // Validate capacity and loadFactor values, if provided
  if (cap < 0) throw new Error('Illegal capacity');
  if (loadFactor <= 0 || loadFactor > 1) throw new Error('Illegal load factor');

  //----------------------- Define local variables -----------------------------
  const maxLoadFactor = loadFactor ? loadFactor : DEFAULT_LOAD_FACTOR;
  let capacity, threshold, size, arr, modificationCount;
  const initializeTable = () => {
    capacity = cap ? Math.max(cap, DEFAULT_CAPACITY) : DEFAULT_CAPACITY;
    threshold = Math.floor(capacity * maxLoadFactor);
    size = 0;
    arr = [...Array(capacity)]; // LinkedList[]
    modificationCount = 0;
  };
  initializeTable();

  //--------------------------- HELPER METHODS --------------------------------
  const index = hash => (hash & 0x7fffffff) % capacity; // get index of the provided hash value
  const isInvalidKey = key => (key == null || key === '');

  /**
   * Find an Entry with a particular key
   * @param {string | number} key
   * @param {null | number} ind the entry's index of the provided key
   * @returns {null | Entry} if found entry with such key, return the Entry itself
   */
  const seekEntry = (key, ind = null) => {
    if (!isInvalidKey(key)) {
      if (!ind) ind = index(hashCode(key));

      const list = arr[ind];
      if (!list) return null;
      for (let entry of list) if (entry.key === key) return entry;
    }

    return null;
  };

  /**
   * Resize the internal table (array) that holds a list of Entries
   */
  const resizeTable = () => {
    capacity *= 2;
    threshold = Math.floor(capacity * maxLoadFactor);
    let newArr = [...Array(capacity)];

    for (let i = 0; i < arr.length; i++)
      if (arr[i]) {
        for (let entry of arr[i]) {
          const ind = index(entry.hash);
          if (!newArr[ind]) newArr[ind] = new SinglyLinkedList();
          newArr[ind].add(entry);
        }

        arr[i].clear();
        arr[i] = null;
      }
    
    arr = newArr;
    newArr = null;
  };

  //--------------------------- PUBLIC METHODS --------------------------------
  this.size = () => size;
  this.isEmpty = () => size === 0;

  this.hasKey = key => seekEntry(key) !== null;
  this.contains = key => this.hasKey(key);

  this.clear = initializeTable;

  /**
   * Retrieve an entry with a particular key.
   * @param {number | string} key a key of an entry that we need to get
   * @returns {null | number | string} the entry's value or null if there's no such key
   */
  this.get = key => {
    const entry = seekEntry(key);
    return entry ? entry.value : null;
  };

  /**
   * Remove an entry with a particular key
   * @param {number | string} key key of the entry needs to be removed
   * @returns {null | number | string} the value of the entry removed if found
   */
  this.remove = key => {
    if (isInvalidKey(key)) return null;

    const ind = index(hashCode(key));
    const entry = seekEntry(key, ind);
    if (!entry) return null;

    arr[ind].removeValue(entry);
    size--;
    modificationCount++;
    return entry.value;
  };

  /**
   * Insert / add / put a new key-value pair into the table.
   * If the same key already exist, update it with new value.
   * @param {number | string} key a key needs to be inserted
   * @param {number | string} value a value needs to be inserted
   * @returns {null | string | number} if such key already exists, return the old value. Otherwise return null.
   */
  this.insert = (key, value) => {
    if (isInvalidKey(key)) throw new Error('Invalid Key');
    const newEntry = new Entry(key, value);
    const ind = index(newEntry.hash);
    modificationCount++;

    const existingEntry = seekEntry(key, ind);
    if (existingEntry) {
      const oldValue = existingEntry.value;
      existingEntry.value = newEntry.value;
      return oldValue;
    }

    if (!arr[ind]) arr[ind] = new SinglyLinkedList();
    arr[ind].add(newEntry);
    if (++size > threshold) resizeTable();
    return null;
  };
  this.add = (key, value) => this.insert(key, value);
  this.put = (key, value) => this.insert(key, value);

  /**
   * Get list of keys in the table
   */
  this.keys = () => {
    const keys = [];
    for (let list of arr)
      if (list) for (let entry of list) keys.push(entry.key);
    return keys;
  };

  /**
   * Get list of values in the table
   */
  this.values = () => {
    const values = [];
    for (let list of arr)
      if (list) for (let entry of list) values.push(entry.value);
    return values;
  };

  /**
   * String reprentation of this hash table
   */
  this[Symbol.iterator] = function* () {
    const changeCount = modificationCount;
    for (let list of arr)
      if (list) for (let entry of list) {
        if (changeCount !== modificationCount) throw new Error('Concurrent Modification');
        yield entry.key;
      }
  };

  /**
   * String reprentation of this hash table
   */
  this.toString = () => {
    let str = '{';
    let count = 0;
    for (let list of arr)
      if (list) for (let entry of list)
        str = str.concat(`${entry.toString()}${++count < size ? ', ' : ''}`);
    return str.concat('}');
  };
}
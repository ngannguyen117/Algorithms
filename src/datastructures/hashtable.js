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
import { highestOneBit } from '../utils/highest-one-bit';

function Entry(key, value) {
  this.key = key;
  this.value = value;
  this.hash = hashCode(key);
  this.toString = () => `${this.key}: ${this.value}`;
}

const gcd = (a, b) => {
  if (b === 0) return a;
  return gcd(b, a % b);
};

const normalizeIndex = (hash, capacity) => (hash & 0x7fffffff) % capacity;

const DEFAULT_CAPACITY = 7;
const DEFAULT_LOAD_FACTOR = 0.65;
const TOMSTONE = 'TOMSTONE';
const LINEAR_CONSTANT = 17; // Used in linear probing, can be any number. The table capacity will be adjusted so that gcd(capacity, LINEAR_CONSTANT) = 1

/**
 * Abstract class for Hash Tables using Open Addressing as hash collision resolution
 * @class HashTableOpenAddressing
 */
class HashTableOpenAddressing {
  #capacity = DEFAULT_CAPACITY;
  #maxLoadFactor = DEFAULT_LOAD_FACTOR;
  #table;
  #threshold;
  #usedSlots = 0; // number of used slots in the table (including slot marked as deleted)
  #size = 0; // number of unique keys currently inside the table
  #modificationCount = 0;

  // Abstract methods that dictate how the probing is to actually occur depending on the probing function used
  /**
   * Adjust the table's capacity after an increase in size
   * @param {number} capacity current table's capacity
   * @returns {number} adjusted capacity
   */
  #adjustCapacity;
  #setupProbing;
  #probe;
  #increaseCapacity;

  constructor(
    adjustCapacity,
    setupProbing,
    probe,
    increaseCapacity,
    capacity,
    maxLoadFactor
  ) {
    if (this.constructor === HashTableOpenAddressing)
      throw new Error('Abstract class cannot be instantiated');
    if (capacity < 0) throw new Error('Illegal capacity');
    if (maxLoadFactor <= 0 || maxLoadFactor > 1)
      throw new Error('Illegal load factor');

    // Initialize abstract methods
    this.#adjustCapacity = adjustCapacity;
    this.#setupProbing = setupProbing;
    this.#probe = probe;
    this.#increaseCapacity = increaseCapacity;

    // Initialize private properties
    if (capacity) this.#capacity = Math.max(this.#capacity, capacity);
    if (maxLoadFactor) this.#maxLoadFactor = maxLoadFactor;

    this.#capacity = this.#adjustCapacity(this.#capacity);
    this.#threshold = Math.floor(this.#capacity * this.#maxLoadFactor);
    this.#table = [...Array(this.#capacity)]; // Entry[]
  }

  //---------------------------- HELPER METHODS -----------------------------
  #isInvalidKey(key) {
    return key == null || key === '';
  }

  #resizeTable() {
    this.#capacity = this.#increaseCapacity(this.#capacity);
    this.#capacity = this.#adjustCapacity(this.#capacity);
    this.#threshold = Math.floor(this.#capacity * this.#maxLoadFactor);

    // create a new table with new capacity and switch reference with the current table
    let oldTable = [...Array(this.#capacity)];
    const temp = this.#table;
    this.#table = oldTable;
    oldTable = temp;

    // reset size and usedSlots since we'll perform insertion on all non-empty entries again
    this.#size = 0;
    this.#usedSlots = 0;

    for (let entry of oldTable)
      if (entry && entry.key !== TOMSTONE) this.insert(entry.key, entry.value);

    oldTable = [];
  }

  //---------------------------- PUBLIC METHODS -----------------------------
  clear() {
    this.#table = [];
    this.#size = 0;
    this.#usedSlots = 0;
    this.#modificationCount++;
  }

  size() {
    return this.#size;
  }

  isEmpty() {
    return this.#size === 0;
  }

  hasKey(key) {
    if (this.#isInvalidKey(key)) return false;

    this.#setupProbing(key, this.#capacity);
    const offset = normalizeIndex(hashCode(key), this.#capacity);

    let j = -1; // to track the index of the first tombstone occurence
    let x = 1;
    let i = offset;
    while (true) {
      if (!this.#table[i]) return false;

      if (this.#table[i].key === TOMSTONE) {
        // record the first deleted cell index to perform lazy relocation
        if (j === -1) j = i;
      } else if (this.#table[i].key === key) {
        if (j !== -1) {
          // Previously encounter a deleted slot. We move the entry in i to j so that
          // if we need to find this key again, we'll find it faster. (lazy relocation)
          this.#table[j] = this.#table[i];
          this.#table[i] = new Entry(TOMSTONE);
        }

        return true;
      }

      i = normalizeIndex(offset + this.#probe(x++), this.#capacity);
    }
  }

  contains(key) {
    return this.hasKey(key);
  }

  get(key) {
    if (this.#isInvalidKey(key)) return null;

    this.#setupProbing(key, this.#capacity);
    const offset = normalizeIndex(hashCode(key), this.#capacity);

    let j = -1; // to track the index of the first tombstone occurence
    let x = 1;
    let i = offset;
    while (true) {
      if (!this.#table[i]) return null;

      if (this.#table[i].key === TOMSTONE) {
        // record the first deleted cell index to perform lazy relocation
        if (j === -1) j = i;
      } else if (this.#table[i].key === key) {
        if (j === -1) return this.#table[i].value;

        this.#table[j] = this.#table[i];
        this.#table[i] = new Entry(TOMSTONE);
        return this.#table[j].value;
      }

      i = normalizeIndex(offset + this.#probe(x++), this.#capacity);
    }
  }

  insert(key, value) {
    if (this.#isInvalidKey(key)) throw new Error('Invalid Key');
    if (this.#usedSlots >= this.#threshold) this.#resizeTable();

    this.#setupProbing(key, this.#capacity);
    const offset = normalizeIndex(hashCode(key), this.#capacity);

    let j = -1; // to track the index of the first tombstone occurence
    let x = 1;
    let i = offset;

    while (true) {
      // empty slot
      if (!this.#table[i]) {
        // No tombstone found before index i
        if (j === -1) {
          this.#usedSlots++;
          this.#size++;
          this.#table[i] = new Entry(key, value);
        } else {
          this.#size++;
          this.#table[j] = new Entry(key, value);
        }

        this.#modificationCount++;
        return null;
      }

      // this slot is either not empty or it is a tombstone
      if (this.#table[i].key === TOMSTONE) {
        if (j === -1) j = i;
      } else if (this.#table[i].key === key) {
        // This slot contains the same key needed to be inserted, update the entry's value
        const oldValue = this.#table[i].value;
        if (j === -1) this.#table[i].value = value;
        else {
          this.#table[i] = this.#table[j];
          this.#table[j] = new Entry(key, value);
        }

        this.#modificationCount++;
        return oldValue;
      }

      i = normalizeIndex(offset + this.#probe(x++), this.#capacity);
    }
  }

  put(key, value) {
    return this.insert(key, value);
  }

  add(key, value) {
    return this.insert(key, value);
  }

  remove(key) {
    if (this.#isInvalidKey(key)) return null;

    this.#setupProbing(key, this.#capacity);
    const offset = normalizeIndex(hashCode(key), this.#capacity);

    let x = 1;
    let i = offset;

    while (true) {
      if (!this.#table[i]) return null;
      if (this.#table[i].key === key) {
        this.#size--;
        this.#modificationCount++;
        const value = this.#table[i].value;
        this.#table[i] = new Entry(TOMSTONE);
        return value;
      }

      i = normalizeIndex(offset + this.#probe(x++), this.#capacity);
    }
  }

  keys() {
    const keys = [];
    for (let entry of this.#table)
      if (entry && entry.key !== TOMSTONE) keys.push(entry.key);
    return keys;
  }

  values() {
    const values = [];
    for (let entry of this.#table)
      if (entry && entry.key !== TOMSTONE) values.push(entry.value);
    return values;
  }

  *[Symbol.iterator]() {
    const modificationCount = this.#modificationCount;
    for (let entry of this.#table) {
      if (modificationCount !== this.#modificationCount)
        throw new Error('Concurrent Modification');
      if (entry && entry.key !== TOMSTONE) yield entry.key;
    }
  }

  toString() {
    let str = '{';
    let count = 0;
    for (let entry of this.#table)
      if (entry && entry.key !== TOMSTONE)
        str = str.concat(
          `${entry.toString()}${++count < this.#size ? ', ' : ''}`
        );
    return str.concat('}');
  }
}

/**
 * An implementation of Hash Table using Open Addressing with Linear probing as collision resolution method
 * @class HashTableLinearProbing
 * @extends {HashTableOpenAddressing}
 */
export class HashTableLinearProbing extends HashTableOpenAddressing {
  constructor(cap, loadFactor) {
    const probe = x => LINEAR_CONSTANT * x;
    const setProbe = () => {};
    const incCap = capacity => 2 * capacity + 1;
    const adjCap = capacity => {
      while (gcd(LINEAR_CONSTANT, capacity) !== 1) capacity++;
      return capacity;
    };

    super(adjCap, setProbe, probe, incCap, cap, loadFactor);
  }
}

/**
 * An implementation of Hash Table using Open Addressing with Quadratic probing as collision resolution method.
 *
 * In this implementation, we use the following probing function H(k, x) = hashCode(k) + f(x) mod 2^n.
 * (f(x) = (x^2 + x) / 2)
 *
 * This probing function guarantees to find an empty cell (It generates all numbers in range [0, 2^n)
 * without repetition for the first 2^n numbers.
 * @class HashTableQuadraticProbing
 * @extends {HashTableOpenAddressing}
 */
export class HashTableQuadraticProbing extends HashTableOpenAddressing {
  constructor(cap, loadFactor) {
    const probe = x => (x * x + x) >> 1;
    const setProbe = () => {};
    const incCap = capacity => 1 << (32 - Math.clz32(capacity));
    const adjCap = capacity => {
      const pow2 = highestOneBit(capacity);
      return capacity === pow2 ? capacity : incCap(capacity);
    };

    super(adjCap, setProbe, probe, incCap, cap, loadFactor);
  }
}

/**
 * An implementation of Hash Table using Open Addressing with Double Hashing as collision resolution method.
 *
 * @class HashTableDoubleHashing
 * @extends {HashTableOpenAddressing}
 */
export class HashTableDoubleHashing extends HashTableOpenAddressing {
  #hash;

  constructor(cap, loadFactor) {
    const probe = function (x) {
      return this.#hash * x;
    };

    const setProbe = function (key, capacity) {
      this.#hash = normalizeIndex(hashCode2(key), capacity);
      if (this.#hash === 0) this.#hash = 1;
    };

    const incCap = capacity => 2 * capacity + 1;

    const adjCap = capacity => {
      while (!isPrime(capacity)) capacity++;
      return capacity;
    };

    super(adjCap, setProbe, probe, incCap, cap, loadFactor);
  }
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
  let capacity = cap ? Math.max(cap, DEFAULT_CAPACITY) : DEFAULT_CAPACITY;
  let threshold = Math.floor(capacity * maxLoadFactor);
  let arr = [...Array(capacity)]; // LinkedList[]
  let size = 0;
  let modificationCount = 0;

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

  this.clear = () => {
    arr = [];
    size = 0;
    modificationCount++;
  };

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
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
 */

import { SinglyLinkedList } from './linkedList';
import { hashCode } from '../utils/hash-code';

export function Entry(key, value) {
  this.key = key;
  this.value = value;
  this.hash = hashCode(typeof key === 'string' ? key : key.toString());
  this.toString = () => `${this.key}: ${this.value}`;
}

const DEFAULT_CAPACITY = 3;
const DEFAULT_LOAD_FACTOR = 0.75;

export function HashTableSeparateChaining(
  capacity = DEFAULT_CAPACITY,
  maxLoadFactor = DEFAULT_LOAD_FACTOR
) {
  if (capacity < 0) throw new Error('Illegal capacity');
  if (maxLoadFactor <= 0 || maxLoadFactor > 1)
    throw new Error('Illegal load factor');

  // Initialize local variables
  capacity = Math.max(DEFAULT_CAPACITY, capacity);
  let size = 0;
  let threshold = Math.floor(capacity * maxLoadFactor);
  let table = [...Array(capacity)]; // LinkedList<Entry>[]

  //---------------------------- HELPER METHODS ----------------------------
  const isInvalidKey = key => key == null || key === '';

  /**
   * Convert a hash value into an index.
   *
   * Essentially, this strips the negative sign and places the hash value into the domain [0, capacity)
   * @param {number} hash the hash value computed from a key
   */
  const normalizeIndex = hash => (hash & 0x7fffffff) % capacity;

  /**
   * Find an Entry with a particular key
   * @param {string | number} key
   * @param {null | number} ind the entry's index of the provided key
   * @returns {null | Entry} if found entry with such key, return the Entry itself
   */
  const seekEntry = (key, ind = null) => {
    if (!isInvalidKey(key)) {
      const index = ind ? ind : normalizeIndex(hashCode(key));
      const list = table[index];
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
    const newTable = [...Array(capacity)];

    for (let i = 0; i < table.length; i++)
      if (table[i]) {
        for (let entry of table[i]) {
          const index = normalizeIndex(entry.hash);
          if (!newTable[index]) newTable[index] = new SinglyLinkedList();
          newTable[index].add(entry);
        }

        // Avoid memory leak
        table[i].clear();
        table[i] = null;
      }

    table = newTable;
  };

  /**
   * Insert a new Entry to the table. If the same key already exist, update it with new value.
   * @param {Entry} entry a new entry to be inserted
   * @param {number} index the position in the table this entry will inserted at
   * @returns {null | string | number} if such key already exists, return the old value. Otherwise return null.
   */
  const insertEntry = (entry, index) => {
    if (!table[index]) table[index] = new SinglyLinkedList();

    // get the linked list that will hold this new entry
    const list = table[index];
    const existingEntry = seekEntry(entry.key, index);

    if (existingEntry) {
      const oldValue = existingEntry.value;
      existingEntry.value = entry.value;
      return oldValue;
    }

    list.add(entry);
    if (++size > threshold) resizeTable();
    return null;
  };

  /**
   * Remove an entry with a particular key
   * @param {number | string} key key of the entry needs to be removed
   * @param {number} index index position of the entry in the table
   * @returns {null | number | string} the value of the entry removed if found
   */
  const removeEntry = (key, index) => {
    const entry = seekEntry(key, index);
    if (entry) {
      const list = table[index];
      list.removeValue(entry);
      size--;
      return entry.value;
    }

    return null;
  };

  //---------------------------- PUBLIC METHODS ----------------------------
  this.size = () => size;
  this.isEmpty = () => size === 0;

  /**
   * Clear the content of the hash table
   */
  this.clear = () => {
    table = [...Array(capacity)];
    size = 0;
  };

  this.hasKey = key => seekEntry(key);
  this.contains = key => this.hasKey(key);

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
   * Insert / add / put a new key-value pair into the table
   * @param {number | string} key a key needs to be inserted
   * @param {number | string} value a value needs to be inserted
   * @returns {null | string | number} if such key already exists, return the old value. Otherwise return null.
   */
  this.insert = (key, value) => {
    if (isInvalidKey(key)) throw new Error('Invalid Key');

    const newEntry = new Entry(key, value);
    const index = normalizeIndex(newEntry.hash);
    return insertEntry(newEntry, index);
  };
  this.put = (key, value) => this.insert(key, value);
  this.add = (key, value) => this.insert(key, value);

  /**
   * Remove an entry with a particular key
   * @param {number | string} key key of the entry needs to be removed
   * @returns {null | number | string} the value of the entry removed if found
   */
  this.remove = key => {
    if (isInvalidKey(key)) return null;

    const index = normalizeIndex(hashCode(key));
    return removeEntry(key, index);
  };

  /**
   * Get list of keys in the table
   */
  this.keys = () => {
    const keys = [];
    for (let list of table)
      if (list) for (let entry of list) keys.push(entry.key);
    return keys;
  };

  /**
   * Get list of values in the table
   */
  this.values = () => {
    const values = [];
    for (let list of table)
      if (list) for (let entry of list) values.push(entry.value);
    return values;
  };

  /**
   * An iterator to iterate over the keys of the table
   */
  this[Symbol.iterator] = function* () {
    const expectedSize = size;

    for (let list of table)
      if (list)
        for (let entry of list) {
          if (expectedSize !== size) throw new Error('Concurrent Modification');
          yield entry.key;
        }
  };

  /**
   * String reprentation of this hash table
   */
  this.toString = () => {
    let str = '{';
    let count = 0;
    for (let list of table)
      if (list)
        for (let entry of list)
          str = str.concat(`${entry.toString()}${++count < size ? ', ' : ''}`);
    return str.concat('}');
  };
}

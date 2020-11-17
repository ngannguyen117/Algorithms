/**
 * BLOOM FILTER
 * 
 * The below explanation is from {@link https://www.youtube.com/watch?v=Bay3X9PAX5k}
 * 
 * Bloom Filter is a probabilistic data structure that is best to use for membership checking.
 * If the checking is negative (i.e. a is not in the list), it's 100% sure. However, if the
 * checking is positive, it is only about 90% sure that the element is in the list (false positive).
 * 
 * Time complexity for insertion and membership testing: O(k) (k is the number of hash functions)
 * 
 * Take a lot less storage than other data structure like hash table. B/c it takes a lot less storage,
 * we can save it in memory which means computations run on bloom filter takes a lot faster.
 * (When hash table becomes very large, we have to save it in the disk, which means the read/write
 * operations takes a lot more time)
 * 
 * Example usage:
 *  - Google BigTable, Apache HBase & Cassandra, and Postgresql use Bloom filters
 *    to reduce the disk lookups for non-existent rows or columns:
 *    - Let say we want to query a user with id 100
 *    - We do a membership check with boom filter first to see if user with id 100 exists
 *    - If the result is false, we don't need to waste resources to find it in the DB
 *  - Google Chrome web browser used to use a Bloom filter to identify malicious URLs:
 *    - Chrome stores a bloom filter that has a very big list of malicious urls, (BF gets updated with Chrome)
 *    - When user enter a url, the BF runs a membership check on this url to warn the user.
 *  - Quora implemented a shared bloom filter in the feed backend to filter out
 *    stories that people have seen before.
 *  - Medium uses BFs for recommending post to users by filtering post which have been seen by user.
 * 
 * Example:
 *   16 bit bloom filter (BF) 00000000 00000000 (basically just bit representation a number)
 *   2 hash functions used: h1, h2
 *   list = ['cat', 'dog', 'rat']
 *           2, 6 ; 4, 10; 3, 15 (results from running h1 & h2 on each element)
 *   
 *   Record the hash results to BF by set the results'-th bit to 1
 *   15 ---> 0
 *   10000100 01011100
 *   
 *   Let's assume the hash values on some elements: 'cow' - 1, 10; 'dog': 4, 10; 'hen': 2, 15
 *   - Check if 'cow' is in the list, the bits at position 1 & 10 are 0 & 1 => false 100%
 *   - Check if 'dog' is in the list, the bits at position 4 & 10 are 1 & 1 => true
 *   - Check if 'hen' is in the list, the bits at position 2 & 15 are 1 & 1, however, the 2nd bit
 *     is from 'cat' and 15th bit is from 'rat', and the result comes back as true even though
 *     'hen' is not in the list.
 */

import { hashCode, hashCode2 } from '../utils/hash-code';

/**
 * Bloom Filter Javascript Implementation based on William Fiset's Java implementation
 * (supports any hash function(s))
 * 
 * By default, this DS uses hash functions to add new element or check an element
 * membership with the 2 default hash functions.
 * - To use other hash functions, set the second parameter to true (useHashFns is true),
 * and provide an array of hash functions in the third parameter.
 * - If you have your own hashes values, and do not wish the DS to run hash functions,
 * set the second parameter to false (useHashFns is false) and don't provide a third param.
 * 
 * For the first parameter (bitArraySizes), it is best to use prime numbers for this array
 * because it lowers number of collisions which means the false positive rate will be lower.
 * 
 * Some prime values to use for bitArraySizes:
 * 1009, 1013, 1019, 10007, 10009, 10037, 100003, 100019, 100043, 1000003, 1000033,
 * 1000037, 10000019, 10000079, 10000103, 100000007, 100000009, 100000023,
 * 1000000007, 1000000009,1000000021, 1000000033
 * 
 * Date: 11/13/2020
 * 
 * @author Ngan Nguyen
 * 
 * @param {number[]} bitArraySizes An array of numbers that hold a size for each hash functions.
 *                                 The length should be the equal to the number of hash functions.
 *                                 If hashFns not provided, the length of this array has to be 2
 * @param {boolean} useHashFns Flag to indicate whether the algorithm should use default/provided hash
 *                             functions or hash values will be provided. By default, useHashFns is true.
 * @param {Function[]} hashFns An array of hash functions, if not provided, it'll use the 2 default func
 */
export function BloomFilter (bitArraySizes, useHashFns = true, hashFns) {
  //------------ Input validation & initialize default hashFns if not provided ----------
  if (!bitArraySizes || !Array.isArray(bitArraySizes))
    throw new Error('Invalid bitArraySizes');

  if (useHashFns) {
    if (!hashFns) hashFns = [hashCode, hashCode2];
    else if (!Array.isArray(hashFns)) throw new Error('Invalid hashFns input. Expected an array.');

    if (bitArraySizes.length !== hashFns.length)
      throw new Error('Inconsistent arrays length');
  }

  //---------------------------- initialize local variables ------------------------------
  const MOD64_MASK = 0x7F;  // Doing 'n & 0x7F' is the same as modding by 64, but faster
  const DIV64 = 6;          // Doing 'n >> 6' is the same as dividing by 64, but faster
  const numHashFns = bitArraySizes.length;

  // 2D n*m bit-arrays, n = numHashFns, m are the elements in the bitArraySizes array
  const bitArrays = Array(numHashFns);
  for (let i = 0; i < numHashFns; i++)
    bitArrays[i] = Array(bitArraySizes[i]).fill(0);

  //---------------------------------- Helper methods ------------------------------------ 
  /**
   * Check whether the hash values array's length is the same as the number of hash functions
   * @param {number[]} hashes An array of hash values
   */
  const validateHashesLength = hashes => {
    if (hashes.length !== numHashFns)
      throw new Error(`Expected ${numHashFns} hash values`);
  };

  /**
   * Retrieve hash value depending on the useHashFns value.
   * If useHashFns is true, use the i-th hash function to get the hash code.
   * Otherwise, hash value is the i-th element of the provided hash values array
   * 
   * @param {number} i index position to access either the input 'value' or the hashFns
   * @param {number[] | string | number} value Value or hash values of an element
   */
  const getHash = (i, value) => useHashFns ? hashFns[i](value) : value[i];

  /**
   * Process a hash value to find its block in the bitArrays and its set bit (MASK)
   * @param {number} bitArrInd Index position to access the bitArraySizes
   * @param {number} hash a hash value
   */
  const processHash = (bitArrInd, hash) => {
    hash = hash % bitArraySizes[bitArrInd];
    const block = hash >> DIV64;
    const MASK = 1 << (hash & MOD64_MASK);
    return { block, MASK };
  };

  //---------------------------------- Public methods ------------------------------------
  /**
   * Add a new element to the bloom filter
   * @param {number[] | string | number} value Value or hash values of an element
   */
  this.add = value => {
    if (!useHashFns) validateHashesLength(value);

    for (let i = 0; i < numHashFns; i++) {
      const { block, MASK } = processHash(i, getHash(i, value));
      bitArrays[i][block] |= MASK;
    }
  };

  /**
   * Check if an element is in the bloom filter.
   * @param {number[] | string | number} value Value or hash values of an element
   */
  this.contains = value => {
    if (!useHashFns) validateHashesLength(value);

    for (let i = 0; i < numHashFns; i++) {
      const { block, MASK } = processHash(i, getHash(i, value));
      if ((bitArrays[i][block] & MASK) !== MASK) return false;
    }

    return true;
  };
}

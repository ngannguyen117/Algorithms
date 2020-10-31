/**
 * Fenwick Tree implementation using Javascript (based on a William Fiset's Fenwick Tree Java implementation)
 *
 * @author Ngan Nguyen, ngan.tx.nguyen@gmail.com
 *
 * Date: 10/15/2020
 * 
 * Fenwick Tree:
 *  - data structure that supports sum range queries, point updates (or range updates and point queries) efficiently.
 *  - Example: sum from element #3 to element #8 of an array A
 *  - Complexity:
 *    - Construction: O(n)
 *    - Point Update: O(log(n))
 *    - Range Sum: O(log(n))
 *    - Range Update: O(log(n))
 *  - It is a 1-based array in which each cell stores the sum of itself and some other cells below it, depending on its index's LSB position (Least Significant Bit).
 *    - #12 in binary is 1100, position of the LSB is 3.
 *    - Index #12 is responsible for 2^(3 - 1) = 4 cells.
 *    - The cell at index #12 is the sum(arr[9-12]).
 *  - We can perform prefix sum up to a certain index. Ex to find prefix sum up to index 7
 *    - 7 - 0111, 2^0 = 1, arr[7] = sum(arr[7])
 *    - 6 - 0110, 2^1 = 2, arr[6] = sum(arr[5-6])
 *    - 4 - 0100, 2^2 = 4, arr[4] = sum(arr[1-4])
 *    - So prefix sum at index 7 = arr[7] + arr[6] + arr[4]
 *  - RANGE QUERIES (interval sum) between [i, j]: Example [11, 15]
 *    - We cascade down from the largest index by removing the LSB until the index hits 0
 *      - #13 - 1101, 1101 -    1 = 1100 => #12
 *      - #12 - 1100, 1100 -  100 = 1000 => #8
 *      - #8  - 1000, 1000 - 1000 = 0000 => #0
 *      - #0  - 0000 DONE
 *    - Compute prefix sum of [1 - 15] & sum of [1 - 11) (exclusive at index 11 because we want the value at 11 for the final interval sum)
 *      - sum of [1 - 15] = arr[15] + arr[14] + arr[12] + arr[8]
 *      - sum of [1 - 11) = arr[10] + arr[8]
 *    - Range sum is (arr[15] + arr[14] + arr[12] + arr[8]) - (arr[10] + arr[8])
 *  - POINT UPDATES:
 *    - We go up from the smallest index by adding 1 to the LSB until it hits the last number
 *      - #9  - 1001, 1001 +   1 =  1010 => #10
 *      - #10 - 1010, 1010 +  10 =  1100 => #12
 *      - #12 - 1100, 1100 + 100 = 10000 => #16
 *      - #16 - 10000 DONE
 *    - So if we want to update value at index #9, we will update value at indexes #9, #10, #12 & #16
 */

/**
 * Fenwick Tree implementation. The tree support sum range queries and point updates.
 * When doing queries and updates, refer to the index as 1-based index.
 * @param {number[] | number} values An array of number or size of the fenwick tree
 */
export function FenwickTree (values) {
  // Validate parameter
  if (!values || (!Array.isArray(values) && typeof values !== 'number'))
    throw new Error('An array or array size is required');
  if (Array.isArray(values) && values.length < 1)
    throw new Error('Requires non-empty array');
  if (typeof values === 'number' && values < 1)
    throw new Error('Array size has to be greater than 0');

  //---------------------------- HELPER METHODS ----------------------------
  /**
   * Returns the value of the least significant bit (LSB)
   * 
   * lsb(108) = lsb(0b1101100) =     0b100 = 4
   * 
   * lsb(104) = lsb(0b1101000) =    0b1000 = 8
   * 
   * lsb(96)  = lsb(0b1100000) =  0b100000 = 32
   * 
   * lsb(64)  = lsb(0b1000000) = 0b1000000 = 64
   * @param {number} i 
   */
  const lsb = i => i & -i;

  /**
   * Compute the prefix sum from [1, i]. O(log(n))
   * @param {number} i 
   */
  const prefixSum = i => {
    let total = 0;
    for (; i; i -= lsb(i)) total += tree[i]; // Equivalently, i &= ~lsb(i);
    return total;
  };

  const validateIndex = i => {
    if (i < 1 || i >= size) throw new Error('Index out of range');
  };

  //---------------------- Initialize local variables ----------------------
  let tree, size;
  if (Array.isArray(values)) {
    size = values.length + 1; // convert from 0-based to 1-based

    // construct the fenwick tree. O(n)
    tree = [0, ...values];
    for (let i = 1; i < size; i++) {
      const parentIndex = i + lsb(i);
      if (parentIndex < size) tree[parentIndex] += tree[i];
    }
  } else {
    size = values + 1;
    tree = [...Array(size)].fill(0);
  }

  //---------------------------- PUBLIC METHODS ----------------------------
  this.sum = (leftInd, rightInd) => {
    if (rightInd < leftInd) throw new Error('Make sure right index >= left Index');
    validateIndex(leftInd);
    validateIndex(rightInd);

    return prefixSum(rightInd) - prefixSum(leftInd - 1);
  };

  this.get = i => {
    validateIndex(i);
    return this.sum(i, i);
  };

  this.add = (i, value) => {
    validateIndex(i)
    for (; i < size; i += lsb(i)) tree[i] += value;
  };

  this.set = (i, value) => this.add(i, value - this.get(i));

  this.toString = () => tree.join(' ');
}

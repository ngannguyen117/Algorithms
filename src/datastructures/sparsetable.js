/**
 * Sparse Table implementation using Javascript (based on a William Fiset's Sparse Table Java implementation)
 *
 * @author Ngan Nguyen, ngan.tx.nguyen@gmail.com
 *
 * Date: 10/26/2020
 * 
 * Sparse Table:
 *  - a data structure used to efficiently compute range queries on static arrays
 *  - complexity:
 *    - Construction: O(log(n))
 *    - Range queries on general associative functions: O(log(n))
 *    - Range queries on overlap friendly functions: O(1)
 *    - space: n * log(n)
 * 
 * A function f(x, y) is associative if f(a, f(b, c)) = f(f(a, b), c). Ex f(x) = x + y => f(1, f(2, 3)) = f(f(1, 2), 3) = 6
 * A function f(x, y) is overlap friendly if f(f(a, b), f(b, c)) = f(a, f(b, c)). Ex min, max, gcd
 */

/**
 * Operation supported on this sparse table
 */
export const Operation = Object.freeze({
  MIN: 'find minimum value',
  MAX: 'find maximum value',
  MULT: 'multiply',
  GCD: 'find greatest common divisor',
});

/**
 * SparseTable implementation.
 * This sparse table doesn't support sum operation because we can achieve better
 * time complexity and use less space with a simple prefix sum array.
 * @param {number[]} array an array of values
 * @param {Operation} operation operation such as min, max, sum , multiply, gcd
 */
export function SparseTable (values, operation) {
  // Validate parameters
  if (!values || !operation) throw new Error('Requires an array of values and operation type');
  if (!Array.isArray(values) || values.length < 1) throw new Error('Invalid values input');

  //--------------------- Operation Function Declaration ----------------------
  const gcd = (a, b) => {
    if (!b) return Math.abs(a);
    return gcd(b, a % b);
  };

  //---------------------------- Initialize values ----------------------------
  const size = values.length; // number of elements in the original input array
  const sparseTable = []; // sparse table values
  const indexTable = []; // index table associated with values in the sparse table
  const log2 = [0, 0]; // Fast log base 2 logarithm lookup table for i, 1 <= i <= n

  for (let i = 2; i <= size; i++) log2[i] = Math.floor(Math.log2(i));
  for (let p = 0; p <= log2[size]; p++) {
    sparseTable.push([]);
    indexTable.push([]);
  }

  for (let i = 0; i < size; i++) {
    sparseTable[0][i] = values[i];
    indexTable[0][i] = i;
  }

  // build sparse table
  for (let p = 1; p <= log2[size]; p++)
    for (let i = 0; i + (1 << p) <= size; i++) {
      const leftValue = sparseTable[p - 1][i];
      const rightValue = sparseTable[p - 1][i + (1 << (p - 1))];

      switch (operation) {
        case Operation.MIN:
          sparseTable[p][i] = Math.min(leftValue, rightValue);
          // propagate index of the best value
          indexTable[p][i] = indexTable[p - 1][i];
          if (rightValue < leftValue) indexTable[p][i] = indexTable[p - 1][i + (1 << (p - 1))];
          break;
        case Operation.MAX:
          sparseTable[p][i] = Math.max(leftValue, rightValue);
          // propagate index of the best value
          indexTable[p][i] = indexTable[p - 1][i];
          if (rightValue > leftValue) indexTable[p][i] = indexTable[p - 1][i + (1 << (p - 1))];
          break;
        case Operation.MULT:
          sparseTable[p][i] = leftValue * rightValue;
          break;
        case Operation.GCD:
          sparseTable[p][i] = gcd(leftValue, rightValue);
          break;
      }
    }

  //---------------------------- HELPER METHODS ----------------------------
  const queryOverlapFriendlyFn = (left, right, fn) => {
    const length = right - left + 1;
    const p = log2[length]; // row index
    return fn(sparseTable[p][left], sparseTable[p][right - (1 << p) + 1]);
  };

  //---------------------------- PUBLIC METHODS ----------------------------
  /**
   * Query [left, right] for the operation set on this sparse table.
   * Operations Min, Max, GCD are overlap friendly functions. We can take advantage of this to compute the result in O(1).
   * Multiply function is associative but not overlap friendly so we have to split the interval into multiple intervals of power of 2 => O(log(n)).
   * @param {number} left left index, inclusive
   * @param {number} right right bound, inclusive
   */
  this.query = (left, right) => {
    switch (operation) {
      // Fast query types O(1)
      case Operation.MIN:
        return queryOverlapFriendlyFn(left, right, Math.min);
      case Operation.MAX:
        return queryOverlapFriendlyFn(left, right, Math.max);
      case Operation.GCD:
        return queryOverlapFriendlyFn(left, right, gcd);
      // Slow Query types O(log(n))
      case Operation.MULT:
        let result = 1;
        for (let p = log2[right - left + 1]; left <= right; p = log2[right - left + 1]){
          result *= sparseTable[p][left];
          left += (1 << p);
        }
        return result;
    }
  };

  /**
   * Index query [left, right] for operation Min or max to get which index (of the original array)
   * holds the maximum/minimum value for the query.
   * @param {number} left left bound
   * @param {number} right right bound
   */
  this.queryIndex = (left, right) => {
    const length = right - left + 1;
    const p = log2[length];
    const r = right - (1 << p) + 1;

    switch (operation) {
      case Operation.MIN:
        return sparseTable[p][left] <= sparseTable[p][r] ? indexTable[p][left] : indexTable[p][r];
      case Operation.MAX:
        return sparseTable[p][left] >= sparseTable[p][r] ? indexTable[p][left] : indexTable[p][r];
      default:
        throw new Error('The provided operation does not support index queries');
    }
  };
}

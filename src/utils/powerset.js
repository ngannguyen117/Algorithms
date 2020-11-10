/**
 * Generate a powerset of a set (the set of all subsets of a set)
 * using binary representation of a number.
 * 
 * O(n2^n)
 * 
 * example array [1,  2,  3], powersetSize = 2^3 = 8
 *            j   0   1   2
 * mask (1 << j) 001 010 100
 * 
 *      Counter i       Subset
 * (decimal - binary)
 *     0    -  000      []
 *     1    -  001      [1]
 *     2    -  010      [2]
 *     3    -  011      [1, 2]
 *     4    -  100      [3]
 *     5    -  101      [1, 3]
 *     6    -  110      [2, 3]
 *     7    -  111      [1, 2, 3]
 */
export const generatePowersetBinary = array => {
  const n = array.length;
  const powersetSize = 1 << n;
  const powerset = [];

  for (let i = 0; i < powersetSize; i++) { // run from 0b0000...0 to 0b1111...1
    const subset = [];
    // an element is added to the current subset if counter i
    // has the same set bit position with the current index j
    for (let j = 0; j < n; j++)
      if ((i & (1 << j)) > 0) subset.push(array[j]);

    powerset.push(subset);
  }

  return powerset;
};

/**
 * Generate a powerset of a set (the set of all subsets of a set) recursively
 * 
 * O(n2^n)
 * 
 * This use a little bit more space than the binary solution
 */
export const generatePowersetRecursive = array => {
  const helper = at => {
    if (at === n) {
      const subset = [];
      for (let i = 0; i < n; i++) if (used[i]) subset.push(array[i]);
      powerset.push(subset);
    } else {
      // Include this element
      used[at] = true;
      helper(at + 1);

      // Backtrack and don't include this element
      used[at] = false;
      helper(at + 1);
    }
  };

  const n = array.length;
  const used = Array(n).fill(false);
  const powerset = [];
  helper(0);

  return powerset;
};

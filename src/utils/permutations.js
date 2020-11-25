import { swap } from './swap';

/**
 * Generate all permutations of an array recursively and in place.
 * 
 * O(n!)
 */
export const generatePermutationRecursive = function* (array) {
  const helper = function* (at) {
    if (at === n) yield array;
    else for (let i = at; i < n; i++) {
      [array[i], array[at]] = [array[at], array[i]];
      yield *helper(at + 1);
      [array[i], array[at]] = [array[at], array[i]];
    }
  };

  const n = array.length;
  yield *helper(0);
};

/**
 * Generate permutations using Heap's Algorithm.
 * 
 * The idea is to generate each permutation from the previous permutation by choosing
 * a pair of elements to interchange, without disturbing the other n-2 elements.
 * 
 * Example of finding permutations for arr [A, B, C, D]
 * For any sub-array size, we want each element has to be placed at the last position once.
 * 
 * h(4):                                              Array [A, B, C, D] starts with D in the last position
 *  i=0: h(3):                                            Size 3 sub-arr [A, B, C] starts with C in the last position (1)
 *         i=0: h(2):                                       Size 2 sub-arr [A, B]
 *                i=0: h(1): YIELD [A, B, C, D]               B is in the last position already
 *                     swap(0,1) arr = [B, A, C, D]           So we swap A & B to make sure A is placed in the last position as well.
 *                i=1: h(1): YIELD [B, A, C, D]
 *                     swap(1,1) nothing changes          
 *              swap(0,2) arr = [C, A, B, D]              Size 3 sub-arr: Swap B & C so that B can be in the last position (2)
 *         i=1: h(2):                                       Size 2 Sub-arr [C, A]
 *                i=0: h(1): YIELD [C, A, B, D]
 *                     swap(0,1) arr = [A, C, B, D]
 *                i=1: h(1): YIELD [A, C, B, D]
 *                     swap(1,1) nothing changes
 *              swap(0,2) arr = [B, C, A, D]              Size 3 sub-arr: Swap A & B so A can be in the last position (3)
 *         i=2: h(2):
 *                i=0: h(1): YIELD [B, C, A, D]             Size 2 Sub-arr [B, C]
 *                     swap(0,1) arr = [C, B, A, D]
 *                i=1: h(1): YIELD [C, B, A, D]
 *                     swap(1,1) nothing changes
 *              swap(0,2) arr = [A, B, C, D]              End of a loop of an odd size sub-arr (size = 3), the array is the same as when it first started.
 *       swap(0, 3) arr = [D, B, C, A]                Arr Size 4: swap A & D so A can be in the last position
 *  i=1: h(3):
 *         i=0: h(2):
 *                i=0: h(1): YIELD [D, B, C, A]
 *                     swap(0,1) arr = [B, D, C, A]
 *                i=1: h(1): YIELD [B, D, C, A]
 *                     swap(1,1) nothing changes
 *              swap(0,2) arr = [C, D, B, A]
 *         i=1: h(2):
 *                i=0: h(1): YIELD [C, D, B, A]
 *                     swap(0,1) arr = [D, C, B, A]
 *                i=1: h(1): YIELD [D, C, B, A]
 *                     swap(1,1) nothing changes
 *              swap(0,2) arr = [B, C, D, A]
 *         i=2: h(2):
 *                i=0: h(1): YIELD [B, C, D, A]
 *                     swap(0,1) arr = [C, B, D, A]
 *                i=1: h(1): YIELD [C, B, D, A]
 *                     swap(1,1) nothing changes
 *              swap(0,2) arr = [D, B, C, A]
 *       swap(1, 3) arr = [D, A, C, B]                Arr Size 4: EVEN SIZE swap B & A so B can be in the last position
 */
export const generatePermutationHeapAlgoRecursive = function* (array) {
  const helper = function* (size) {
    if (size === 1) yield array;
    for (let i = 0; i < size; i++) {
      yield *helper(size - 1);

      // if size is odd, swap 0th i.e (first) and (size-1)th i.e (last) element
      if (size & 1) swap(array, 0, size - 1);
      else swap(array, i, size - 1);
    }
  };

  yield *helper(array.length);
};

/**
 * Generates NEXT ordered permutations in-place (skips repeated permutations) iteratively
 * with lexicographic order algorithm.
 * 
 * Step 1: Finding the right most element which is smaller than the element to its right.
 *         (i goes [n - 2 to 0], first i-th element such that arr[i] < arr[i + 1])
 * Step 1: Swap that element with the right most element which is larger than it.
 *         (j goes [n - 1 to i + 1], first j-th element that arr[i] < arr[j])
 * Step 3: Reverse elements from [i + 1 to n - 1]
 * 
 * O(n!)
 * 
 * Essentially, if you look at the values in the array, after all permutations computed,
 * the array will be sorted in descending order.
 * Ex, [A, B, C, D] = > [D, C, B, A] or [C, D, A, B] => [D, C, B, A]
 * 
 * For this algorithm to compute all permutations of random arrays or descending sorted
 * arrays, we need to sort the array in ascending order before passing it in. Otherwise,
 * it will only give us the NEXT ordered permutations (not the full list of permutation).
 */
export const generatePermutationIterative = function* (array) {
  const n = array.length;
  let ooo, i;
  while (true) {
    yield array;

    // Look for elem that's out of order (ooo) => need to be swapped
    ooo = -1;
    for (i = n - 2; i >= 0; i--) if (array[i] < array[i + 1]) {
      ooo = i;
      break;
    }
    if (ooo === -1) return;

    // Only swap with the elem that is greater than the ooo elem
    i = n - 1;
    while (array[ooo] >= array[i]) i--;
    swap(array, ooo++, i);

    // After swaping, reverse all elements to the right of the initial ooo
    i = n - 1;
    while (ooo < i) swap(array, ooo++, i--);
  }
};

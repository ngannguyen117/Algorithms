import { mergeSort } from '../sorting/mergesort';

/**
 * Recursively generate combinations of a sequence by choosing only k of n elements.
 * By default (unique = false), if there are repetition of elements in the sequence,
 * the combinations will also be repetitive.
 * 
 * To only produce unique combinations (in case of repetitive elements in the sequence),
 * set unique to true.
 * 
 * To find all combination of size k, we need to recurse until we have selected k elements
 * (i.e. r = 0). Otherwise if r != 0 then we need to select an element which is found
 * after the position of our last selected element.
 * 
 * O( n choose k )
 */
export const generateCombinationsRecursive = function* (arr, k, unique = false) {
  const helper = function* (at, r) {
    // Return early if there are more elements left to select than what is available.
    if (n - at < r) return;

    // We selected 'r' elements so we found a valid subset!
    if (r === 0) {
      const subset = [];
      for (let i = 0; i < n; i++) if (used[i]) subset.push(arr[i]);
      yield subset;
    } else {
      for (let i = at; i < n; i++) {
        // if unique is true, since the elements are sorted we can skip duplicate
        // elements to ensure the uniqueness of our output.
        if (unique && i > at && arr[i - 1] == arr[i]) continue;

        used[i] = true; // include this element
        yield *helper(i + 1, r - 1);

        used[i] = false; // backtrack, don't include this element
      }
    }
  };

  if (!arr) return;

  const n = arr.length;
  if (k < 0 || k > n) return;

  // Sort the sequence so we can easily skip duplicates.
  if (unique) arr = mergeSort(arr);

  const used = Array(n).fill(false);
  yield *helper(0, k);
};

/**
 * Iteratively generate all combinations of a sequence by choosing only k of n elements.
 * If there are repetition of elements in the sequence, the combinations will
 * also be repetitive.
 * 
 * O( n choose k )
 */
export const generateCombinationsIterative = function* (arr, k) {
  if (!arr) return;

  const n = arr.length;
  if (k < 0 || k > n) return;

  // initialize selection with 1...(k-1)
  const selection = Array(k);
  for (let i = 0; i < k; i++) selection[i] = i;

  const combination = Array(k);
  while (true) {
    for (let i = 0; i < k; i++) combination[i] = arr[selection[i]];
    yield combination;

    let i = k - 1;
    while (selection[i] === n - k + i) if (--i < 0) return;

    selection[i++]++;
    for (; i < k; i++) selection[i] = selection[i - 1] + 1;
  }
};

/**
 * Generate all the size k combinations of a sequence. Each element of the sequence
 * can be repeated in a combination at most x times.
 *
 * O(n+k-1 choose k) = O((n+k-1)!/(k!(n-1)!))
 * 
 * [1, 2, 3, 4], k = 3, x = 2
 * helper(0, 3):
 *    count = 0:  [0, 0, 0, 0]
 *                helper(1, 3):
 *                    count = 0:  [0, 0, 0, 0]
 *                                helper(2, 3):
 *                                    count = 0:  [0, 0, 0, 0]
 *                                                helper(3, 3):
 *                                                    count = 0:  [0, 0, 0, 0] helper(4, 3)
 *                                                    count = 1:  [0, 0, 0, 1] helper(4, 2)
 *                                                    count = 2:  [0, 0, 0, 2] helper(4, 1)
 *                                    count = 1:  [0, 0, 1, 2]
 *                                                helper(3, 2):
 *                                                    count = 0:  [0, 0, 1, 0] helper(4, 2)
 *                                                    count = 1:  [0, 0, 1, 1] helper(4, 1)
 *                                                    count = 2:  [0, 0, 1, 2] helper(4, 0) => YIELD [3, 4, 4]
 *                                    count = 2:  [0, 0, 2, 2]
 *                                                helper(3, 1):
 *                                                    count = 0:  [0, 0, 2, 0] helper(4, 1)
 *                                                    count = 1:  [0, 0, 2, 1] helper(4, 0) => YIELD [3, 3, 4]
 *                                                    count = 2:  [0, 0, 2, 2] helper(4, -1)
 *                    count = 1:  [0, 1, 2, 2]
 *                                helper(2, 3):
 *                                    count = 0:  [0, 1, 0, 2]
 *                                                helper(3, 3):
 *                                                    count = 0:  [0, 1, 0, 0] helper(4, 3)
 */
export const generateCombinationsWithRepetition = function* (arr, k, x) {
  const helper = function* (at, r) {
    if (at < n)
      // For this particular time at position 'at' try including it each of [0, x] times
      for (let itemCount = 0; itemCount <= x; itemCount++) {
        // Try including this element itemCount number of times (this is possibly more than once)
        usedCount[at] = itemCount;

        yield *helper(at + 1, r - itemCount);
      }
    else if (at === n) // reached the end
      if (r === 0) { // We selected 'k' elements total
          const subset = [];
          for (let i = 0; i < n; i++)
            for (let j = 0; j < usedCount[i]; j++) subset.push(arr[i]);
          yield subset;
        }
  };

  if (!arr) return;

  const n = arr.length;
  if (k < 0 || k > n) return;

  const usedCount = Array(n).fill(0);
  yield *helper(0, k);
};

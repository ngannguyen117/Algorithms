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

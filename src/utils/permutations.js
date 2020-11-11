/**
 * Generate all permutations of an array recursively
 * 
 * O(n!)
 */
export const generatePermutationRecursive = function* (array) {
  const helper = function* (at) {
    if (at === n) {
      const permutation = [];
      for (let i = 0; i < n; i++) permutation.push(array[picked[i]]);
      yield permutation;
    } else {
      for (let i = 0; i < n; i++)
        if (!used[i]) { // We can only select elements once
          // Select this element and track in picked which
          // element was chosen for this permutations
          used[i] = true;
          picked[i] = at;
          yield *helper(at + 1);

          // Backtrack (unselect element)
          used[i] = false;
        }
    }
  };

  if (!array) return;

  const n = array.length;
  const used = Array(n).fill(false);
  const picked = [];

  yield *helper(0);
};

/**
 * Generate permutations using Heap's Algorithm.
 * 
 * The idea is to generate each permutation from the previous permutation by choosing
 * a pair of elements to interchange, without disturbing the other n-2 elements.
 */
export const generatePermutationHeapAlgoRecursive = function* (array) {
  const swap = (i, j) => {
    const temp = array[i];
    array[i] = array[j];
    array[j] = temp;
  };

  const helper = function* (size) {
    if (size === 1) yield array;
    for (let i = 0; i < size; i++){
      yield *helper(size - 1);

      // if size is odd, swap 0th i.e (first) and (size-1)th i.e (last) element
      if ((size & 1) === 1) swap(0, size - 1);
      else swap(i, size - 1);
    }
  };

  yield *helper(array.length);
};

/**
 * Generates NEXT ordered permutations in-place (skips repeated permutations) iteratively
 * 
 * O(n!)
 * 
 * Essentially, if you look at the values in the array, after all permutations computed,
 * the array will be sorted in descending order.
 * Ex, [A, B, C, D] = > [D, C, B, A] or [C, D, A, B] => [D, C, B, A]
 * 
 * So the 'right' order that this algorithm looks at is elem[i] > elem[i + 1]
 * 
 * For this algorithm to compute all permutations of random arrays or descending sorted
 * arrays, we need to sort the array before passing it in. Otherwise, it will only give
 * us the NEXT ordered permutations (not the full list of permutation).
 */
export const generatePermutationIterative = function* (array) {
  const swap = (i, j) => {
    const temp = array[i];
    array[i] = array[j];
    array[j] = temp;
  };

  const n = array.length;
  let ooo, toSwap;
  while (true) {
    yield array;

    // Look for elem that's out of order (ooo) => need to be swapped
    ooo = -1;
    for (let i = n - 2; i >= 0; i--)
      if (array[i] < array[i + 1]) {
        ooo = i;
        break;
      }
    if (ooo === -1) return;

    // Only swap with the elem that is greater than the ooo elem
    toSwap = n - 1;
    while (array[ooo] >= array[toSwap]) toSwap--;
    swap(ooo++, toSwap);

    // After swaping, we want the elem from (ooo, n) to be sorted in Acsending order
    toSwap = n - 1;
    while (ooo < toSwap) swap(ooo++, toSwap--);
  }
};

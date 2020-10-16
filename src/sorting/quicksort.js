import { swap } from '../utils/swap';

/**
 * Quick sort implementation.
 * The idea of quicksort is that pick a random pivot and move elements around so that
 * elements on the left of the pivot is less than the pivot
 * and elements to the right of the pivot is greater than the pivot.
 * 
 * We repeatedly do that to the left sub-array and the right sub-array of the pivot until it's sorted.
 * 
 * Worse case O(n^2). Average case O(nlog(n)).
 */
export const quickSort = array => {
  if (!array) return;

  const partition = (lo, hi) => {
    const pivot = array[hi];
    let i = lo - 1;

    for (let j = lo; j < hi; j++)
      if (array[j] < pivot) swap(array, ++i, j)

    swap(array, ++i, hi);
    return i;
  };

  const sort = (lo, hi) => {
    if (lo < hi) {
      const splitPoint = partition(lo, hi);
      sort(lo, splitPoint - 1);
      sort(splitPoint + 1, hi);
    }
  };

  sort(0, array.length - 1);
};

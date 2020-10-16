import { swap } from '../utils/swap';

/**
 * Sort the array using bubble sort. The idea behind
 * bubble sort is to look for adjacent indexes which
 * are out of place and interchange their elements
 * until the entire array is sorted.
 * 
 * O(n^2). For increasing array, O(n)
 */
export const bubbleSort = array => {
  if (!array) return;

  let sorted = true;
  do {
    sorted = true;
    for (let i = 1; i < array.length; i++)
      if (array[i] < array[i - 1]) {
        swap(array, i, i - 1);
        sorted = false;
      }
  } while (!sorted);
};

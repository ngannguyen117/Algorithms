import { swap } from '../utils/swap';

/**
 * Sort the given array using insertion sort. The idea behind
 * insertion sort is that at the array is already sorted from
 * [0, i] and you want to add the element at position i+1, so
 * you 'insert' it at the appropriate location.
 * 
 * O(n^2). For increasing array, O(n)
 */
export const insertionSort = array => {
  if (!array) return;

  for (let i = 1; i < array.length; i++)
    for (let j = i; j > 0 && array[j] < array[j - 1]; j--)
      swap(array, j, j - 1);
};

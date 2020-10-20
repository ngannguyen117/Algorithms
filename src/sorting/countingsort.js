import { swap } from '../utils/swap';

/**
 * Counting sort implementation. This implementation is inplace and not a stable.
 * 
 * This sorting algorithm sorts element in an array by tracking the array's values frequency with the values as indexes.
 * 
 * Counting sort works best if the range between maxValue and minValue of the array is very small.
 * 
 * Time complexity: O(n + k) where n is the array length and k is the range between maxValue and minValue
 */
export const countingSort = array => {
  if (!array) return;

  // find max and min values of the array
  let maxValue = Number.NEGATIVE_INFINITY;
  let minValue = Number.POSITIVE_INFINITY;
  for (let i = 0; i < array.length; i++) {
    if (array[i] < minValue) minValue = array[i];
    if (array[i] > maxValue) maxValue = array[i];
  }

  if (maxValue === minValue) return;

  const size = maxValue - minValue + 1;
  const tempArr = [];

  // Track the frequency of each element
  for (let i = 0; i < array.length; i++) {
    const ind = array[i] - minValue;
    if (!tempArr[ind]) tempArr[ind] = 0;
    tempArr[ind]++;
  }

  // place each element in the correct position
  for (let i = 0, k = 0; i < size; i++)
    while (tempArr[i]-- > 0) array[k++] = i + minValue;
};

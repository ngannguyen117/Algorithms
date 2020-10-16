import { swap } from '../utils/swap';

/**
 * O(n^2)
 */
export const selectionSort = array => {
  if (!array) return;

  for (let i = 0; i < array.length; i++) {
    const swapIndex = i;
    // Find the index beyond i with a lower value than i and the lowest in [i + 1, array.length)
    for (let j = i + 1; j < array.length; j++)
      if (array[j] < array[swapIndex]) swapIndex = j;
    swap(array, i, swapIndex);
  }
};

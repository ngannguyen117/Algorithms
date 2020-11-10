/**
 * Swap 2 numbers without using a temporary variables
 */
export const swap = (array, i, j) => {
  if (array[i] === array[j]) return;

  // example array[i] = 1010, array[j] = 0101
  array[i] ^= array[j]; // 1111
  array[j] ^= array[i]; // 1010
  array[i] ^= array[j]; // 0101
};

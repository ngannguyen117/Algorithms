/**
 * Swapping values of elements at indexes i & j of array arr
 */
export const swap = (arr, i, j) => {
  const temp = arr[i];
  arr[i] = arr[j];
  arr[j] = temp;
};
/**
 * Counting sort implementation. This implementation is not inplace and is stable.
 * 
 * This sorting algorithm sorts element in an array by tracking the array's values frequency with the values as indexes.
 * 
 * Counting sort works best if the range between maxValue and minValue of the array is very small.
 * 
 * Time complexity: O(n + k) where n is the array length and k is the range between maxValue and minValue
 * Space comlexity: n + k
 */
export const countingSort = (array) => {
  if (!array) return;

  // find max and min values of the array
  const min = Math.min.apply(null, array);
  const max = Math.max.apply(null, array);

  if (max === min) return array;

  const size = max - min + 1;
  const frequency = Array(size).fill(0);

  // Track the frequency of each element
  for (let v of array) frequency[v - min]++;

  // find the end index for each element
  for (let i = 1; i < size; i++) frequency[i] += frequency[i - 1];

  // place each element in the correct position
  // start from last element of the original array
  const sortedArray = [];
  for (let i = array.length - 1; i >= 0; i--)
    sortedArray[--frequency[array[i] - min]] = array[i];

  return sortedArray;
};

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
  let maxValue = Number.NEGATIVE_INFINITY;
  let minValue = Number.POSITIVE_INFINITY;
  for (let i = 0; i < array.length; i++) {
    if (array[i] < minValue) minValue = array[i];
    if (array[i] > maxValue) maxValue = array[i];
  }

  if (maxValue === minValue) return array;

  const size = maxValue - minValue + 1;
  const frequency = [];
  for (let i = 0; i < size; i++) frequency.push(0);

  // Track the frequency of each element
  for (let v of array) frequency[v - minValue]++;

  // find the start index for each element
  for (let i = 1; i < size; i++) frequency[i] += frequency[i - 1];

  // place each element in the correct position
  const sortedArray = [];
  for (let v of array)
    sortedArray[frequency[v - minValue]++ - 1] = v;

  return sortedArray;
};

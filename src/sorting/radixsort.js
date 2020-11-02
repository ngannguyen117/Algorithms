const getNumberOfDigits = num => {
  let count = 1;
  for (num /= 10; num >= 1; num /= 10) count++;
  return count;
};

/**
 * Radix Sort implementation.
 * 
 * O(nd) where n is the array length and d is max element's the number of digit
 */
export const radixSort = array => {
  if (!array) return;

  const countingSort = placeValue => {
    const index = i => Math.floor(array[i] / placeValue) % range;
    const range = 10;
    const frequency = Array(range).fill(0);

    for (let i = 0; i < range; i++) frequency[index(i)]++;
    for (let i = 1; i < range; i++) frequency[i] += frequency[i - 1];

    const sortedArray = [];
    for (let i = array.length - 1; i >= 0; i--)
      sortedArray[frequency[index(i)]-- - 1] = array[i];

    array = sortedArray;
  };

  let numDigits = getNumberOfDigits(Math.max.apply(null, array));
  let placeValue = 1;
  while (numDigits-- > 0) {
    countingSort(placeValue);
    placeValue *= 10;
  }

  return array;
};

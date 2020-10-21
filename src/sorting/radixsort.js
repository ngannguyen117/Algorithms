const getNumberOfDigits = number => {
  let count = 0;
  if (count >= 0) count++;
  for (let i = number / 10; i >= 1; i /= 10) count++;
  return count;
};

/**
 * Radix Sort implementation.
 * 
 * O(nd) where n is the array length and d is the max number of digit an element has
 */
export const radixSort = array => {
  if (!array) return;

  const countingSort = placeValue => {
    const range = 10;
    const frequency = [];
    for (let i = 0; i < range; i++) frequency.push(0);

    for (let v of array) {
      const ind = Math.floor(v / placeValue) % range;
      frequency[ind]++;
    }

    for (let i = 1; i < range; i++) frequency[i] += frequency[i - 1];

    const sortedArray = [];
    for (let i = array.length - 1; i >= 0; i--) {
      const digit = Math.floor(array[i] / placeValue) % range;
      sortedArray[frequency[digit]-- - 1] = array[i];
    }

    array = sortedArray;
  };

  const maximum = Math.max.apply(null, array);
  let numberOfDigits = getNumberOfDigits(maximum);
  let placeValue = 1;
  while (numberOfDigits-- > 0) {
    countingSort(placeValue);
    placeValue *= 10;
  }

  return array;
};

import { selectionSort } from '../selectionsort';
import { insertionSort } from '../insertionsort';
import { bubbleSort } from '../bubblesort';
import { quickSort } from '../quicksort';
import { mergeSort } from '../mergesort';
import { heapSort } from '../heapsort';
import { bucketSort } from '../bucketsort';
import { countingSort } from '../countingsort';
import { radixSort } from '../radixsort';

const expectedSortedPositiveArray = [2, 3, 4, 6, 8, 10, 13];
const expectedSortedNegativeArray = [-13, -10, -8, -6, -4, -3, -2];
const expectedSortedMixedArray = [-8, -4, -3, 2, 6, 10, 13];

const testSorting = (sort, sortName) => {
  test(`Test ${sortName}`, () => {
    const positiveArray = [10, 4, 6, 8, 13, 2, 3];
    const negativeArray = [-10, -4, -6, -8, -13, -2, -3];
    const mixedArray = [10, -4, 6, -8, 13, 2, -3];

    expect(sort(positiveArray)).toStrictEqual(expectedSortedPositiveArray);
    expect(sort(negativeArray)).toStrictEqual(expectedSortedNegativeArray);
    expect(sort(mixedArray)).toStrictEqual(expectedSortedMixedArray);
    sort();
  });
};

const testInplaceSorting = (sort, sortName) => {
  test(`Test ${sortName}`, () => {
    const positiveArray = [10, 4, 6, 8, 13, 2, 3];
    const negativeArray = [-10, -4, -6, -8, -13, -2, -3];
    const mixedArray = [10, -4, 6, -8, 13, 2, -3];

    sort(positiveArray);
    expect(positiveArray).toStrictEqual(expectedSortedPositiveArray);

    sort(negativeArray);
    expect(negativeArray).toStrictEqual(expectedSortedNegativeArray);

    sort(mixedArray);
    expect(mixedArray).toStrictEqual(expectedSortedMixedArray);

    sort();
  });
};

testInplaceSorting(selectionSort, 'Selection Sort');
testInplaceSorting(insertionSort, 'Insertion Sort');
testInplaceSorting(bubbleSort, 'Bubble Sort');
testInplaceSorting(quickSort, 'Quick Sort');
testInplaceSorting(heapSort, 'Heap Sort');
testInplaceSorting(bucketSort, 'Bucket Sort');

testSorting(mergeSort, 'Merge Sort');
testSorting(countingSort, 'Counting Sort');

test('Test Radix Sort', () => {
  const positiveArray = [10, 4, 6, 8, 13, 2, 3];
  
  expect(radixSort(positiveArray)).toStrictEqual(expectedSortedPositiveArray);
  radixSort();
});
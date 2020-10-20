import { swap } from '../utils/swap';

/**
 * Heap sort implementation.
 * 
 * The idea of heap sort is to sort an array using a max heap.
 * 
 * After building a max heap with the array, we know arr[0] is
 * the largest element which should be at the end of the array.
 * So we swap it with the last element in the array.
 * Now the arr[n-1, n) is sorted.
 * 
 * We keep doing that for the unsorted sub-array [0, n-1) until
 * the unsorted sub-array has 0 element.
 * 
 * O(nlog(n))
 */
export const heapSort = array => {
  if (!array) return;
  const size = array.length;

  // move the largest element to top of the heap. O(log(n))
  const sink = (i, n) => {
    while (true) {
      const left = 2 * i + 1;
      const right = 2 * i + 2;
      let largest = i;

      if (right < n && array[right] > array[largest]) largest = right;
      if (left < n && array[left] > array[largest]) largest = left;

      if (largest === i) break;
      swap(array, i, largest);
      i = largest;
    }
  };

  // heapify (max heap) O(n)
  for (let i = Math.max(0, Math.floor(size / 2) - 1); i >= 0; i--)
    sink(i, size);

  // swap the largest element to the end of the array at index i
  // rebuild a max heap with element from 0 to i - 1
  for (let i = size - 1; i >= 0; i--){
    swap(array, 0, i);
    sink(0, i);
  }
};

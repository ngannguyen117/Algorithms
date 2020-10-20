/**
 * Merge sort implementation, a sorting technique based on divide and conquer algorithm.
 * 
 * The idea of merge sort is to break the list in to sublists, sort smaller sublists into
 * a larger one recursively.
 * 
 * O(nlog(n))
 */
export const mergeSort = array => {
  if (!array) return;

  // Merge 2 sorted arrays in to a larger sorted array
  const merge = (arr1, arr2) => {
    const n1 = arr1.length;
    const n2 = arr2.length;
    const arr = [];

    for (let i = 0, i1 = 0, i2 = 0; i < n1 + n2; i++)
      if (i1 === n1) arr.push(arr2[i2++]);
      else if (i2 === n2) arr.push(arr1[i1++]);
      else arr.push(arr1[i1] < arr2[i2] ? arr1[i1++] : arr2[i2++]);

    return arr;
  };

  const sort = arr => {
    const size = arr.length;
    if (size <= 1) return arr;

    // Split the array into 2 sub arrays and recursively sort them
    const mid = Math.floor(size / 2);
    const leftArr = sort(arr.slice(0, mid));
    const rightArr = sort(arr.slice(mid, size));

    return merge(leftArr, rightArr);
  };

  return sort(array);
};

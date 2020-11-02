import { SinglyLinkedList } from '../datastructures/linkedList';

/**
 * Bucket sort implementation.
 * 
 * The sort works by distributing the elements we want to sort into several
 * individually sorted buckets. By doing this, we can reduce the number of
 * comparisons between the elements and help cut the sorting time.
 * 
 * Average n + k, Worse O(nlog(n))
 */
export const bucketSort = array => {
  if (!array) return;

  const min = Math.min.apply(null, array);
  const max = Math.max.apply(null, array);

  if (max === min) return;

  const numBuckets = Math.ceil(Math.sqrt(max - min + 1));
  const buckets = [];

  // Place elements in to a bucket
  for (let i = 0; i < array.length; i++) {
    const ind = Math.floor((array[i] - min) / numBuckets);
    if (!buckets[ind]) buckets[ind] = new SinglyLinkedList();
    buckets[ind].add(array[i]);
  }

  // Sort buckets and place them into the final answer
  for (let i = 0, j = 0; i < numBuckets; i++)
    if (buckets[i]) {
      buckets[i].sort();
      for (let elem of buckets[i]) array[j++] = elem;
    }
};

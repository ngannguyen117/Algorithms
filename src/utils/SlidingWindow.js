import { DoublyLinkedList } from '../datastructures/linkedList';

export const SlidingWindowType = Object.freeze({
  MAXIMUM: 0,
  MINIMUM: 1,
});

/**
 * Sliding Window is a problem-solving technique that involves lists/arrays.
 * These problems are easy to solve using a brute force approach in O(n^2) or O(n^3).
 * Using the 'sliding window' technique, we can reduce the time complexity to O(n).
 * 
 * Which problems use a sliding window paradigm?
 *  - The problem will involve a data structure that is ordered and iterable like an array or a string
 *  - You are looking for some subrange in that array/string (longest or shortest sequence)
 * 
 * @param {number[]} values The underlying array/collection that this window slides on
 * @param {SlidingWindowType} type 
 */
export function SlidingWindow (values, type = SlidingWindowType.MAXIMUM) {
  if (!values || !Array.isArray(values)) throw new Error('An array of values is required');

  let lo = 0;
  let hi = 0;
  const deque = new DoublyLinkedList();

  const compare = (a, b) => type === SlidingWindowType.MAXIMUM ? a < b : a > b;

  /**
   * Advances the front of the window by one unit
   */
  this.advance = () => {
    if (hi >= values.length) return;

    // Remove all the worse values in the back of the deque
    while (!deque.isEmpty() && compare(values[deque.peakLast()], values[hi]))
      deque.removeLast();

    // Add the next index to the back of the deque
    deque.addLast(hi);

    // Increase the window size
    hi++;
  };

  /**
   * Decrease the back of the window by 1 unit
   */
  this.shrink = () => {
    if (lo >= hi) return;

    // Decrease window size by pushing it forward
    lo++;

    // Remove elements in the front of the queue whom are no longer
    // valid in the reduced window.
    while (!deque.isEmpty() && deque.peakFirst() < lo) deque.removeFirst();
  };

  /**
   * Get the maximum/minimum value depending on the type
   */
  this.getValue = () => {
    if (lo < hi && lo < values.length) return values[deque.peakFirst()];
  };
}

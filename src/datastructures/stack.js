/**
 * Stack implementation using Javascript (based on a William Fiset's Stack Java implementation)
 *
 * @author Ngan Nguyen, ngan.tx.nguyen@gmail.com
 *
 * Date: 09/30/2020
 *
 * Stack:
 *  - A one-ended linear data structure which models real-world stack by having two primary operations (push & pop) and a reference to the top of the stack.
 *  - Elements in a stack always are removed/added on top of the pile. This behavior is called LIFO, Last In First Out.
 *  - Usage:
 *    - Undo mechanisms in text editors
 *    - Compiler syntax checking for matching brakets and braces
 *    - Model a pile of books/plates
 *    - Support recursion behind the scene by keeping track of the previous calls
 *    - DFS on graphs
 *  - Complexity (by using a LinkedList):
 *    - Push: O(1)
 *    - Pop: O(1)
 *    - Peak: O(1)
 *    - Search: O(n)
 *    - Size: O(1)
 */

import { SinglyLinkedList } from './linkedList';

/**
 * Stack implemented using SinglyLinkedList.
 * New elements will be added/remove using addFirst/removeFirst because it takes O(1) to do those operations while it would take O(n) to do it at the end of the list.
 * @param {string | number | null} firstElement (optional) provide a value to create the stack with a first element
 */
export function ListStack(firstElement = null) {
  const list = new SinglyLinkedList();

  this.size = () => list.size();
  this.isEmpty = () => list.size() === 0;

  /**
   * Push new value to the front of the stack. O(1)
   * @param {string | number} value
   */
  this.push = value => list.addFirst(value);

  /**
   * Remove and return the top element in the stack. O(1)
   * @returns {string | number} stack's top element
   */
  this.pop = () => {
    if (this.isEmpty()) throw new Error('Stack empty');

    return list.removeFirst();
  };

  /**
   * Get the stack's top element without removing it. O(1)
   * @returns {string | number} stack's top element
   */
  this.peak = () => {
    if (this.isEmpty()) throw new Error('Stack empty');

    return list.peakFirst();
  };

  if (firstElement) this.push(firstElement);

  this[Symbol.iterator] = list[Symbol.iterator];
}

ListStack.prototype.toString = function () {
  const values = [];
  for (let node of this[Symbol.iterator]()) values.push(node.data);
  return values.reverse().join(' ');
};

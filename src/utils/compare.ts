/**
 * A comparator generator for string | number input.
 * It takes one argument to determine if the comparison is in ascending or
 * descending order and returns a comparator function.
 *
 * By default, it is in ascending order.
 * @param {1 | -1} order 1 for ascending order, -1 for descending order
 * @returns {(a, b) => -1 | 0 | 1} Comparator function
 */
export const compare = (order = 1) => (a, b) => {
  let result = 1;
  if (a < b) result = -1;
  else if (a === b) result = 0;

  return result * order;
};

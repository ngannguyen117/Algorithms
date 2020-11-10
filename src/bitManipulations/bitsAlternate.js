/**
 * Check whether a positive integer has an alternate pattern in its binary representation
 * 
 * O(1)
 * 
 * Step 1: n ^= n >> 1. If n has an alternate pattern, then n ^ (n >> 1) operation will produce a number having set bits only
 * Step 2: Check whether all the bits in the result above are set or not.
 */
export const AreBitsAlternate = number => {
  number ^= number >> 1;
  return ((number + 1) & number) === 0;
};

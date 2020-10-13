/**
 * A Javascript implementation of Java Integer.highestOneBit
 * @param {number} i the number that we want to get its 2^highest bit
 */
export const highestOneBit = i => {
  i |= i >> 1;
  i |= i >> 2;
  i |= i >> 4;
  i |= i >> 8;
  i |= i >> 16;
  return i - (i >>> 1);
};

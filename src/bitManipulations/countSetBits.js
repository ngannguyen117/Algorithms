/**
 * Returns the number of set bits (bit = 1) of a number using lookup table. O(1)
 * 
 * How to find set bits with a lookup table {@link https://www.techiedelight.com/count-set-bits-using-lookup-table/}
 * How to generate the lookup table {@link https://stackoverflow.com/a/63979407}
 * 
 * 
 * A number usually takes 4 bytes (4 * 8 = 32 bits) for storage. Maximum number it can store is (2^32) - 1.
 * A lookup table for (2^32) - 1 numbers is infeasable.
 * So we create an 8-bit (1 byte) lookup table instead. The size of this table is 256 (0 - 255) because 1 byte
 * with all its bits set is 255 (0b11111111 or 0xff), and all bits unset is 0.
 * We break the input integer into 4 8-bit chunks (0-7, 8-15, 16-23, 24-32) to query from the 8-bit table.
 * 
 * How to set up lookup table
 * Example, we're given #4 (0b100).
 *  - to generate #8:
 *      - left shift #4 once (== 4 * 2), => 0b1000.
 *      - Both 4 and 8 has the same number of set bits.
 *  - to generate #9:
 *      - left shift #4 once then add 1 (== 4 * 2 + 1), => 0b1001.
 *      - Number of set bits in 9 = 1 + Number of set bits in 4
 */
export const countSetBits = number => {
  // Create an 8-bit lookup table
  const lookup = [0];
  for (let i = 1; i < 256; i++) lookup[i] = (i & 1) + lookup[i >> 2];

  // count the number of set bits
  let count = 0;
  for (let i = 0; i < 4; i++) {
    count += lookup[number & 0xff];
    number >>= 8;
  }

  return count;
};

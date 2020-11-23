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
  const lookup = Array(256).fill(0);
  for (let i = 1; i < 256; i++) lookup[i] = (i & 1) + lookup[i >> 1];

  // count the number of set bits
  let count = 0;
  for (let i = 0; i < 4; i++) {
    count += lookup[number & 0xff];
    number >>= 8;
  }

  return count;
};


/**
 * Given a positive integer n, count the total number of set bits in binary
 * representation of all numbers from 1 to n.
 * 
 * O(logn)
 * 
 * There are 2 cases:
 *  - Case 1:
 *    - All bits in n are set (ex 0b1, 0b11, 0b111)
 *    - n is in the form n = 2^b - 1 where b is the position of the left most set bit of n in 1-base
 *    - If n = 3 (0b11), b is 2; If n = 7 (0b111), b is 3
 *    - Total bits of all numbers from 1 to n is b x 2^(b -1)
 *  - Case 2:
 *    - There're unset bits in n (ex 0b110, 0b1000)
 *    - Let m be the next left most set bit after b
 *    - If n = 6 (Ob110), b = 3, m = 2; If n = 8 0b1000, b = 4, m = 3
 *    - Let newN = n - (1 << m)
 *    - Total bits of all numbers from 1 to n is newN + 1 + m x (1 << (m - 1)) + countSetBits1ToN(newN)
 * 
 *                0  |   0 0   |
 *                0  |   0 1   } m * (1 << (m - 1)) = 2 * (1 << 1)
 *                0  |   1 0   | ~ case 1 for #3 (0b11)
 *                0  |   1 1   |
 *                ---|------
 *                1  |   0 0
 *                1  |   0 1
 *                1  |   1 0
 *  n - (1 << m) + 1     countSetBits1ToN(newN)
 *  6 - (1 << 2) + 1     countSetBits1ToN(2)
 */
export const countSetBits1ToN = n => {
  if (n === 0) return 0;

  // get position of the left most set bit in 1-base
  const b = Math.floor(Math.log2(n)) + 1;
  if (n === (1 << b) - 1) return b * (1 << (b - 1));

  const m = b - 1; // next left most set bit
  n = n - (1 << m);
  return n + 1 + countSetBits1ToN(n) + m * (1 << (m - 1));
};

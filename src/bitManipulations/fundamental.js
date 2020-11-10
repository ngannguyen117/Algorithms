/**
 * Fundamental Bit Manipulation Operations
 * 
 * Time Complexity: O(1)
 * 
 * Date: 11/06/2020
 * 
 * @author Ngan Nguyen, ngan.tx.nguyen@gmail.com
 */

/**
 * Check if a number is a power of 2
 * 
 *    00010000 (16)       00001111 (15)
 *  & 00001111 (15)     & 00001110 (14)
 * -----------         -----------
 *    00000000            00001110
 */
export const isPowerOfTwo = x => x > 0 && (x & (x - 1)) === 0;

/**
 * Check if a number is even
 * 
 *    00010000 (16)       00001111 (15)
 *  & 00000001          & 00000001
 * -----------         -----------
 *    00000000            00000001
 */
export const isEven = x => (x & 1) === 0;

/**
 * Set the i-th bit of number to 1 (1-base)
 * 
 * i = 3
 * 1 << 3 = 2^3 = 6 = 0b100
 * 
 *    00010000 (16)       00001111 (15)
 *  | 00000100          | 00000100
 * -----------         -----------
 *    00010100            00001111
 */
export const setBit = (number, i) => number | (1 << (i - 1));

/**
 * Check the i-th bit of number is set to 1 (1-base)
 * 
 * i = 3
 * 1 << 3 = 2^3 = 6 = 0b100
 * 
 *    00010000 (16)       00001111 (15)
 *  & 00000100          & 00000100
 * -----------         -----------
 *    00000000            00000100
 */
export const isBitSet = (number, i) => (number & (1 << (i - 1))) !== 0;

/**
 * Set the i-th bit of number to 0
 * 
 * i = 3
 * 1 << 3 = 2^3 = 6 = 0b00000100 => ~(1 << 3) = 0b11111011
 * 
 *    00010000 (16)       00001111 (15)
 *  & 11111011          & 11111011
 * -----------         -----------
 *    00010000            00001011
 */
export const clearBit = (number, i) => number & ~(1 << (i - 1));

/**
 * Toggle the i-th bit of number from 0 to 1 and vice versa
 * 
 * i = 3
 * 1 << 3 = 2^3 = 6 = 0b100
 * 
 *    00010000 (16)       00001111 (15)
 *  ^ 00000100          ^ 00000100
 * -----------         -----------
 *    00010100            00001011
 */
export const toggleBit = (number, i) => number ^ (1 << (i - 1));

/**
 * Returns a number with the first n-bits set to 1 (a mask of first n-bits set to 1)
 * 
 * n = 4 => 1 << 4 is 2^4 => in binary 00010000
 * 
 *    00010000 (16)
 *  -        1
 * ----------- 
 *    00001111 (15) - the first 4 bits are set to 1
 */
export const setAll = n => (1 << n) - 1;

/**
 * Check if all bits in a number are set to 1
 * 
 *    00010000            11111111
 *  & 00010001         & 100000000
 * -----------         -----------
 *    00010001           000000000
 */
export const areAllBitsSet = n => ((n + 1) & n) === 0;

/**
 * Returns the number of leading zero bits in the 32-bit binary representation of a number.
 */
export const countLeadingZeros = number => Math.clz32(number);

/**
 * Returns the number of trailing zero of a number.
 * 
 * Example 0b100
 *                                100
 *  |             1000000000000000000 (0b100 << 16)
 * ----------------------------------
 *                1000000000000000100
 *  |     100000000000000010000000000 (0b100 << 8)
 * ----------------------------------
 *        100000001000000010000000100
 *  | 1000000010000000100000001000000 (0b100 << 4)
 * ----------------------------------
 *    1000100010001000100010001000100
 *  | 0010001000100010001000100010000 (0b100 << 2)
 * ----------------------------------
 *    1010101010101010101010101010100
 *  | 0101010101010101010101010101000 (0b100 << 1)
 * ----------------------------------
 *    1111111111111111111111111111100
 * 
 * ~number = 0000000000000000000000000000011
 * leading 0s is 30
 * 32 bits - 30 = 2 trailing zeros
 */
export const countTrailingZeros = number => { // 100
  // fill 1s to all higher bits of this number
  number |= number << 16;
  number |= number << 8;
  number |= number << 4;
  number |= number << 2;
  number |= number << 1;

  // inverse bits of the new number filled with leading 1s => 0s
  return 32 - Math.clz32(~number) | 0; // `|0` ensures integer coercion
};

/**
 * Convert binary number to decimal
 * 
 * The input does not include 0b
 */
export const binaryToDecimal = binaryNumber => parseInt(binaryNumber, 2);

/**
 * Invert actual bits of a non-negative number
 * (Leading 0’s are not being considered, that's why we cannot use bitwise NOT ~ operator to flip the number)
 */
export const flipActualBits = number => {
  const numBits = Math.floor(Math.log2(number)) + 1; // = 32 - Math.clz32(number)
  const mask = (1 << numBits) - 1;

  return number ^ mask;
};

/**
 * Find the position (1-based) of the right most set bit of a number
 * 
 * For example, number 12 - 0b1100, the right most set bit is 3
 * 
 * Step 1: Negate the number. In two's complement of -num, all bits of num are reverted except the first '1' from right to left (0100)
 * Step 2: Do a bit-wise & with original number, this will return number with the required one only (0100)
 * Step 3: Take the log2 of the result in step 2, you will get the position in 0-base
 * Step 4: Convert the position to 1-base.
 */
export const positionOfRightMostSetBit = num => Math.log2(num & -num) + 1;

/**
 * Find the position of the right most different bit of 2 numbers
 * 
 * 1011 vs 1001 => 2nd bit
 * 110100 vs 100 => 5th bit
 */
export const positionOfRightMostDiffBit = (a, b) => positionOfRightMostSetBit(a ^ b);

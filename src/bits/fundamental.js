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
 * Set the i-th bit of number to 1
 * 
 * i = 3
 * 1 << 3 = 2^3 = 6 = 0b100
 * 
 *    00010000 (16)       00001111 (15)
 *  | 00000100          | 00000100
 * -----------         -----------
 *    00010100            00001111
 */
export const setBit = (number, i) => number | (1 << i);

/**
 * Check the i-th bit of number is set to 1
 * 
 * i = 3
 * 1 << 3 = 2^3 = 6 = 0b100
 * 
 *    00010000 (16)       00001111 (15)
 *  & 00000100          & 00000100
 * -----------         -----------
 *    00000000            00000100
 */
export const isBitSet = (number, i) => (number & (1 << i)) === 0;

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
export const clearBit = (number, i) => number & ~(1 << i);

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
export const toggleBit = (number, i) => number ^ (1 << i);

/**
 * Returns a number with the first n-bits set to 1
 * 
 * n = 4 => 1 << 4 is 2^4 => in binary 00010000
 * 
 *    00010000 (16)
 *  -        1
 * ----------- 
 *    00001111 (15) - the first 4 bits are set to 1
 */
export const setAll = n => (1 << n) - 1;

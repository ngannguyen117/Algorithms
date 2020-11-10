/**
 * Given a positive integer n, count the number of positive integer i (0 <= i <= n) such that n + i = n ^ i.
 * 
 * n = 7 - 0b111
 * 111 ^ 000 = 111, 111 + 0 = 111     -- i = 0
 * 111 ^ 001 = 110, 111 + 1 = 1000    -- i = 1
 * ...
 * 
 * n = 12 - 0b1100
 * 1100 ^ 0000 = 1100, 1100 + 0000 = 1100   -- i = 0
 * 1100 ^ 0001 = 1101, 1100 + 0001 = 1101   -- i = 1
 * 1100 ^ 0010 = 1110, 1100 + 0010 = 1110   -- i = 2
 * 1100 ^ 0011 = 1111, 1100 + 0011 = 1111   -- i = 3
 * 1100 ^ 0100 = 1000, 1100 + 0100 = 10000  -- i = 4
 * ...
 * 
 * From the examples, n + i = n ^ i only when n & i = 0.
 * That also means i can only be those numbers such that theirs binary
 * representations set where n's unset bits are. For example, when n = 1100,
 * i can only be 0000, 0001, 0010, or 0011 where the first 2 bits of n are 0.
 * 
 * The number of possible i is the number of unset bits' permutations.
 */
export const countNumberOfSumEqualsXOR = num => {
  let numberOfUnsetBits = 0;
  for (; num > 0 && (num & 1) === 0; num >>= 1) numberOfUnsetBits++;
  return 1 << numberOfUnsetBits;
};

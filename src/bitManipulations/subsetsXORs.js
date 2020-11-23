// If the set is {1,2,3}. All subsets are [{}, {1}, {2}, {3}, {1, 2}, {1, 3}, {2, 3}, {1, 2, 3}].

/**
 * Find XOR of the XORs’ of all subsets.
 * 
 * Notes:
 *  - x ^ 0 = x
 *  - x ^ x = 0
 * 
 * Example: find XOR of the XORs' of all subsets of {1, 2, 3}
 * 
 * Subsets       [{},  {1},  {2},  {3},  {1, 2}, {1, 3}, {2, 3}, {1, 2, 3}]
 * Result     =   0  ^  1  ^  2  ^  3  ^  1^2  ^  1^3  ^  2^3  ^  1^2^3
 *            =   0  ^  1^1^1^1  ^  2^2^2^2  ^  3^3^3^3
 *            =   0  ^  0  ^  0  ^  0
 *            =   0
 * 
 * When a set's size > 1, the number of times an element appears in the set of all subsets is always even.
 * In the above example, element 1 (or 2 or 3) apears a total of 4 times in the set of all subsets.
 * Because a number XOR itself results in 0, with an even number of occurences, the XOR result is always 0.
 * 
 * When a set's size = 1, the XOR result will be equal to the only element in the set.
 */
export const computeXorOfSubsetsXors = arr => arr.length === 1 ? arr[0] : 0;

/**
 * Find sum of all the values that comes from XORing all the elements of the subsets
 * 
 * Example input: {1, 5, 6}
 * Subsets: [{},  {1},  {5},  {6},  {1, 5}, {1, 6}, {5, 6}, {1, 5, 6}]
 * Result =  0  +  1  +  5  +  6  +  1^5  +  1^6  +  5^6  +  1^5^6
 *        =  0  +  1  +  5  +  6  +   4   +   7   +   3   +  2
 *        = 000 + 001 + 101 + 110 +  100  +  111  +  011  + 010
 *        = 0b11100
 *        = 28 (decimal)
 * 
 * n = arr.length (in the above example, n = 3)
 * m = position of the most significant bit of arr's largest element (in the above example, m = 3)
 * i is within [0, m - 1] (used to indicate the place value of binary numbers)
 * 
 * Only if the i-th bit is set (= 1) that it contributes to the sum.
 * If, any element in the input array has the i-th bit set, that i-th bit will contribute to the sum
 * 2^(n-1) times (half of 2^n subsets, 2^(n-1) = (2^n)/2) because an element always appears 2^(n-1)
 * times in the subsets.
 * 
 * If 2 or more elements have the same i-th bit set, we still only count that i-th bit once
 * because when XORing, the result is always either set or unset.
 * 
 * With bitwise OR operation on all elements of the input array, we'd know which i-th bit is set. Based
 * on that info, we can get the sum of all subsets' XORs.
 * 
 * 1 | 5 | 6 = 001 | 101 | 110 = 111
 * 
 *               => 2th bit is set, 1th bit is 1, 0th bit is 1
 * result = 2^(3 - 1) * (2^2 +          2^1 +         2^0)
 *        = 2^(3 - 1) * 0b111
 *        = 4 * 7
 *        = 28
 */
export const computeSumOfSubsetsXors = arr => {
  const or = arr.reduce((acc, value) => acc | value);

  return or * (1 << (arr.length - 1));
};

/**
 * Find the most significant set bit of a 32-bit integer number.
 * For example, the input number is 10 - 0b1010, the MSB number is 0b1000
 * 
 * O(1)
 */
export const findMostSignificantSetBitOfNumber1 = num => { // num = 100010001 (273)
  // set all bits after MSB to 1
  num |= num >> 1;  // 100010001 | 010001000 = 110011001
  num |= num >> 2;  // 110011001 | 001100110 = 111111111
  num |= num >> 4;  
  num |= num >> 8;
  num |= num >> 16; // 111111111

  num += 1 // increment by 1 so that there's only 1 set bit: 1000000000
  return num >> 1; // 100000000
};

export const findMostSignificantSetBitOfNumber2 = num => {
  const msb = Math.floor(Math.log2(num)); // = 31 - Math.clz32(num)
  return 1 << msb;
};

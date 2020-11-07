/**
 * Calculate XOR of all numbers from 1 to n
 * 
 * n = 7 => 1 ^ 2 ^ 3 ^ 4 ^ 5 ^ 6 = 7
 * 
 * Number Binary-Repr  XOR-from-1-to-n
 * 1         1           [0001]   1 % 4 = 1 => xor is 1
 * 2        10           [0011]   2 % 4 = 2 => xor is 2 + 1 = 3
 * 3        11           [0000]   3 % 4 = 3 => xor is 0
 * 4       100           [0100]   4 % 4 = 0 => xor is 4
 * 5       101           [0001]
 * 6       110           [0111]
 * 7       111           [0000]   <----- We get 0
 * 8      1000           [1000]   <----- Equals to n
 * 9      1001           [0001]
 * 10     1010           [1011]
 * 11     1011           [0000]   <------ We get 0
 * 12     1100           [1100]   <------ Equals to n
 */
export const computeXOR1ToN = n => {
  // Modulus operator are expensive on most computers so we use & operator to be more efficient
  switch (n & 3) { // = n % 4
    case 0: return n;
    case 1: return 1;
    case 2: return n + 1;
    case 3: return 0;
  }
};
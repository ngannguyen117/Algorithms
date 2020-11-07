# Javascript bitwise operators:

- **& (AND)**: It’s only true if both are true.
  - returns a 1 in each bit position for which the corresponding bits of both operands are 1s
  - 101 & 011 = 001
- **| (OR)**: It’s true if any of the inputs is true
  - returns a 1 in each bit position for which the corresponding bits of either or both operands are 1s
  - 101 | 011 = 111
- **^ (XOR)**: It’s true in case of odd numbers
  - returns a 1 in each bit position for which the corresponding bits of either but not both operands are 1s
  - 101 ^ 011 = 110
- **~ (NOT)**
  - inverts the bits of its operand
  - ~00000101 = 11111010
- **<< (Left shift)**
  - shifts the first operand the specified number of bits to the left. Excess bits shifted off to the left are discarded. Zero bits are shifted in from the right.
  - a << b is equivalent to a \* 2^b
  - 00000101 << 2 = 00010100, 11111111 << 2 = 11111100
- **>> (Arithmetic right shift)**
  - shifts the first operand the specified number of bits to the right. Excess bits shifted off to the right are discarded. Copies of the leftmost bit are shifted in from the left. Since the new leftmost bit has the same value as the previous leftmost bit, the sign bit (the leftmost bit) does not change. Hence the name "sign-propagating"
  - a >> b is equivalent to a / 2^b
  - 00000101 >> 2 = 00000001
- **>>> (Unsigned or logical right shift)**
  - (zero-fill right shift) shifts the first operand the specified number of bits to the right. Excess bits shifted off to the right are discarded. Zero bits are shifted in from the left. The sign bit becomes 0, so the result is always non-negative. Unlike the other bitwise operators, zero-fill right shift returns an unsigned 32-bit integer.
  - 00000101 >>> 2 = 00000001
  - -00000000000000000000000000000101 >>> 2 = 00111111111111111111111111111110

# Bit facts:

- x & 0000s = 0
- x & 1111s = x
- x & x = x

- x | 0000s = x
- x | 1111s = 1
- x | x = x

- x ^ 0 = x
- x ^ x = 0
- x ^ 1111s = ~x

- x & (n - 1) is equivalent to (x % n), but faster

# Tips

- To write a binary number, simply prefix `0b` to the number. `0b1111` is binary representation of 15 in decimal
- To convert a binary number to decimal, use `parseInt()` with radix = 2. `parseInt(1111, 2)` = 15
- To view the binary representation of a number, use `decimal..toString(2)`. `15..toString(2)` => 1111

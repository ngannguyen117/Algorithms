import {
  isPowerOfTwo,
  isEven,
  setBit,
  isBitSet,
  clearBit,
  toggleBit,
  setAll,
  areAllBitsSet,
  countLeadingZeros,
  countTrailingZeros,
  binaryToDecimal,
  flipActualBits,
  positionOfRightMostSetBit,
  positionOfRightMostDiffBit,
} from '../fundamental';

describe('Test fundamental bit manipulation operations', () => {
  test('Check if a number is a power of two', () => {
    expect(isPowerOfTwo(16)).toBeTruthy();
    expect(isPowerOfTwo(8)).toBeTruthy();
    expect(isPowerOfTwo(32)).toBeTruthy();
    expect(isPowerOfTwo(1)).toBeTruthy();
    expect(isPowerOfTwo(5)).toBeFalsy();
    expect(isPowerOfTwo(15)).toBeFalsy();
    expect(isPowerOfTwo(10)).toBeFalsy();
  });

  test('Check if a number is even', () => {
    expect(isEven(2)).toBeTruthy();
    expect(isEven(4)).toBeTruthy();
    expect(isEven(10)).toBeTruthy();
    expect(isEven(36)).toBeTruthy();
    expect(isEven(3)).toBeFalsy();
    expect(isEven(7)).toBeFalsy();
    expect(isEven(25)).toBeFalsy();
  });

  test('Set i-th bit of a number to 1 (1-base)', () => {
    expect(setBit(2, 1)).toBe(3);
    expect(setBit(8, 3)).toBe(12);
    expect(setBit(8, 1)).toBe(9);
  });

  test('Check if i-th bit of a number is set', () => {
    expect(isBitSet(2, 1)).toBeFalsy();
    expect(isBitSet(2, 2)).toBeTruthy();
    expect(isBitSet(8, 4)).toBeTruthy();
    expect(isBitSet(9, 1)).toBeTruthy();
    expect(isBitSet(9, 3)).toBeFalsy();
  });

  test('Clear i-th bit of a number', () => {
    expect(clearBit(15, 3)).toBe(11);
    expect(clearBit(16, 3)).toBe(16);
    expect(clearBit(16, 5)).toBe(0);
  });

  test('Toggle the i-th bit of a number', () => {
    expect(toggleBit(15, 3)).toBe(11);
    expect(toggleBit(15, 4)).toBe(7);
    expect(toggleBit(16, 3)).toBe(20);
  });

  test('Set all the first nth bits', () => {
    expect(setAll(4)).toBe(15);
    expect(setAll(3)).toBe(7);
  });

  test('Check if all bits in a number are set', () => {
    expect(areAllBitsSet(8)).toBeFalsy();
    expect(areAllBitsSet(2)).toBeFalsy();
    expect(areAllBitsSet(7)).toBeTruthy();
    expect(areAllBitsSet(15)).toBeTruthy();
  });

  test('Count number of leading zeros', () => {
    expect(countLeadingZeros(15)).toBe(28);
    expect(countLeadingZeros(32)).toBe(26);
  });

  test('Count number of trailing zeros', () => {
    expect(countTrailingZeros(15)).toBe(0);
    expect(countTrailingZeros(32)).toBe(5);
  });

  test('Convert a binary number to decimal number', () => {
    expect(binaryToDecimal(101)).toBe(5);
    expect(binaryToDecimal(1010)).toBe(10);
    expect(binaryToDecimal(1111)).toBe(15);
    expect(binaryToDecimal(10010)).toBe(18);
  });

  test('Flip actual bits of a number', () => {
    expect(flipActualBits(10)).toBe(5);
    expect(flipActualBits(7)).toBe(0);
    expect(flipActualBits(6)).toBe(1);
  });

  test('Get position of the right most set bit', () => {
    expect(positionOfRightMostSetBit(12)).toBe(3);
    expect(positionOfRightMostSetBit(18)).toBe(2);
  });

  test('Get position of the right most different bit between 2 numbers', () => {
    expect(positionOfRightMostDiffBit(11, 9)).toBe(2);
    expect(positionOfRightMostDiffBit(4, 52)).toBe(5);
  });
});

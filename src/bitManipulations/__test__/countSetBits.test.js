import { countSetBits, countSetBits1ToN } from '../countSetBits';

describe('Test count number of set bits', () => {
  test('Test count number of set bits of a number', () => {
    expect(countSetBits(8)).toBe(1); // 1000
    expect(countSetBits(9)).toBe(2); // 1001
    expect(countSetBits(273)).toBe(3); // 100010001
    expect(countSetBits(7)).toBe(3); // 111
  });

  test('Test count number of set bits of all numbers from 1 to n', () => {
    expect(countSetBits1ToN(1)).toBe(1);
    expect(countSetBits1ToN(3)).toBe(4);
    expect(countSetBits1ToN(7)).toBe(12);

    expect(countSetBits1ToN(2)).toBe(2);
    expect(countSetBits1ToN(4)).toBe(5);
    expect(countSetBits1ToN(5)).toBe(7);
    expect(countSetBits1ToN(6)).toBe(9);
    expect(countSetBits1ToN(8)).toBe(13);
    expect(countSetBits1ToN(9)).toBe(15);
  });
});

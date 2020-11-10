import {
  findMostSignificantSetBitOfNumber1,
  findMostSignificantSetBitOfNumber2,
} from '../mostSignificantSetBit';

test('Test finding the value that holds the most significant set bit of a number', () => {
  expect(findMostSignificantSetBitOfNumber1(10)).toBe(8);
  expect(findMostSignificantSetBitOfNumber1(273)).toBe(256);

  expect(findMostSignificantSetBitOfNumber2(10)).toBe(8);
  expect(findMostSignificantSetBitOfNumber2(273)).toBe(256);
});

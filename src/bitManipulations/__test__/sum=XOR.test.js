import { countNumberOfSumEqualsXOR } from '../sum=XOR';

test('Test counting how many number i from 0 <= i <= num that has i + num = i ^ num', () => {
  expect(countNumberOfSumEqualsXOR(7)).toBe(1);
  expect(countNumberOfSumEqualsXOR(8)).toBe(8);
  expect(countNumberOfSumEqualsXOR(12)).toBe(4);
  expect(countNumberOfSumEqualsXOR(44)).toBe(8);
});

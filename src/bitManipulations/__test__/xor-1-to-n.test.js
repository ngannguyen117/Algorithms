import { computeXOR1ToN } from '../xor-1-to-n';

test('Test computing XOR of all numbers from 1 to n', () => {
  expect(computeXOR1ToN(12)).toBe(12);
  expect(computeXOR1ToN(11)).toBe(0);
  expect(computeXOR1ToN(10)).toBe(11);
  expect(computeXOR1ToN(9)).toBe(1);
});

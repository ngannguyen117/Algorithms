import { areBitsAlternate } from '../bitsAlternate';

test('Test checking if bits in a number are alternating', () => {
  expect(areBitsAlternate(21)).toBeTruthy();
  expect(areBitsAlternate(5)).toBeTruthy();
  expect(areBitsAlternate(2)).toBeTruthy();
  expect(areBitsAlternate(273)).toBeFalsy();
  expect(areBitsAlternate(7)).toBeFalsy();
});

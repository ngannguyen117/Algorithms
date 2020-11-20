import { findNumberOfLeastCyclicRotations } from '../lexicographicallyMinimalStringRotation';

test('Test finding the minimal lexicographical string rotations using Booths algorithm', () => {
  expect(findNumberOfLeastCyclicRotations('abcde')).toBe(0);
  expect(findNumberOfLeastCyclicRotations('cdeab')).toBe(3);
});

import {
  generatePowersetBinary,
  generatePowersetRecursive,
} from '../powerset';

describe('Test generating powerset', () => {
  test(`Test generating powerset from a set by Binary representation`, () => {
    expect(generatePowersetBinary([1])).toStrictEqual([[], [1]]);
    expect(generatePowersetBinary([1, 2])).toStrictEqual([[], [1], [2], [1, 2]]);
    expect(generatePowersetBinary([1, 2, 3])).toStrictEqual([[], [1], [2], [1, 2], [3], [1, 3], [2, 3], [1, 2, 3]]);
  });

  test(`Test generating powerset from a set by recursion`, () => {
    expect(generatePowersetRecursive([1])).toStrictEqual([[1], []]);
    expect(generatePowersetRecursive([1, 2])).toStrictEqual([[1, 2], [1], [2], []]);
    expect(generatePowersetRecursive([1, 2, 3])).toStrictEqual([[1, 2, 3], [1, 2], [1, 3], [1], [2, 3], [2], [3], []]);
  });
});

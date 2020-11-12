import {
  generateCombinationsRecursive,
} from '../combinations';

describe('Test generating combinations by choosing r from n elements', () => {
  test('Test generating all combinations recursively', () => {
    const arr = [1, 2, 3, 4, 5];
    const combinations = [
      [1, 2, 3], [1, 2, 4], [1, 2, 5], [1, 3, 4], [1, 3, 5],
      [1, 4, 5], [2, 3, 4], [2, 3, 5], [2, 4, 5], [3, 4, 5]
    ];
    const iter = generateCombinationsRecursive(arr, 3);
    let i = 0;
    for (let subset of iter) expect(subset).toStrictEqual(combinations[i++]);
    expect(i).toBe(10);
  });
});

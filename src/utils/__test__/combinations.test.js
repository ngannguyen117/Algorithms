import {
  generateCombinationsRecursive,
  generateCombinationsIterative,
  generateCombinationsWithRepetition,
} from '../combinations';

describe('Test generating combinations by choosing r from n elements', () => {
  const generateAllCombinations = (generator, method) => {
    const numbers = [1, 2, 3, 4, 5];
    const numberCombinations = [
      [1, 2, 3], [1, 2, 4], [1, 2, 5], [1, 3, 4], [1, 3, 5],
      [1, 4, 5], [2, 3, 4], [2, 3, 5], [2, 4, 5], [3, 4, 5]
    ];

    const strs = ['red', 'purple', 'green', 'yellow', 'blue', 'pink'];
    const strCombinations = [
      ['red', 'purple', 'green'], ['red', 'purple', 'yellow'], ['red', 'purple', 'blue'],
      ['red', 'purple', 'pink'], ['red', 'green', 'yellow'], ['red', 'green', 'blue'],
      ['red', 'green', 'pink'], ['red', 'yellow', 'blue'], ['red', 'yellow', 'pink'],
      ['red', 'blue', 'pink'], ['purple', 'green', 'yellow'], ['purple', 'green', 'blue'],
      ['purple', 'green', 'pink'], ['purple', 'yellow', 'blue'], ['purple', 'yellow', 'pink'],
      ['purple', 'blue', 'pink'], ['green', 'yellow', 'blue'], ['green', 'yellow', 'pink'],
      ['green', 'blue', 'pink'], ['yellow', 'blue', 'pink']
    ];

    test('Provide invalid inputs should do nothing', () => {
      let iter = generator();
      let i = 0;
      for (let subset of iter) i++;
      expect(i).toBe(0);

      iter = generator(numbers, -1);
      i = 0;
      for (let subset of iter) i++;
      expect(i).toBe(0);

      iter = generator(numbers, 10);
      i = 0;
      for (let subset of iter) i++;
      expect(i).toBe(0);
    });

    test(`Test generating all combinations ${method}`, () => {
      let iter = generator(numbers, 3);
      let i = 0;
      for (let subset of iter) expect(subset).toStrictEqual(numberCombinations[i++]);
      expect(i).toBe(10);

      iter = generator(strs, 3);
      i = 0;
      for (let subset of iter) expect(subset).toStrictEqual(strCombinations[i++]);
      expect(i).toBe(20);
    });
  };
  
  generateAllCombinations(generateCombinationsRecursive, 'recursively');
  generateAllCombinations(generateCombinationsIterative, 'iteratively');

  test('Generate unique combinations', () => {
    const set1 = [2, 3, 3, 2, 3];
    const set1Combinations = [[2,2], [2,3], [3,3]];

    const set2 = [1, 2, 2, 2, 3, 3, 4, 4];
    const set2Combinations = [
      [1, 2, 2], [1, 2, 3], [1, 2, 4], [1, 3, 3], [1, 3, 4], [1, 4, 4], [2, 2, 2],
      [2, 2, 3], [2, 2, 4], [2, 3, 3], [2, 3, 4], [2, 4, 4], [3, 3, 4], [3, 4, 4]
    ];

    let iter = generateCombinationsRecursive(set1, 2, true);
    let i = 0;
    for (let subset of iter) expect(subset).toStrictEqual(set1Combinations[i++]);
    expect(i).toBe(3);

    iter = generateCombinationsRecursive(set2, 3, true);
    i = 0;
    for (let subset of iter) expect(subset).toStrictEqual(set2Combinations[i++]);
    expect(i).toBe(14);
  });

  test('Generate combinations with element repetitons up to x times', () => {
    const set = [1, 2, 3, 4];
    const combinations = [
      [3, 4, 4], [3, 3, 4], [2, 4, 4], [2, 3, 4], [2, 3, 3], [2, 2, 4],
      [2, 2, 3], [1, 4, 4], [1, 3, 4], [1, 3, 3], [1, 2, 4], [1, 2, 3],
      [1, 2, 2], [1, 1, 4], [1, 1, 3], [1, 1, 2]
    ];

    const iter = generateCombinationsWithRepetition(set, 3, 2);
    let i = 0;
    for (let subset of iter) expect(subset).toStrictEqual(combinations[i++]);
    expect(i).toBe(16);
  });
});

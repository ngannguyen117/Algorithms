import {
  generateCombinationsRecursive,
  generateCombinationsIterative,
} from '../combinations';

describe('Test generating combinations by choosing r from n elements', () => {
  const arr = [1, 2, 3, 4, 5];
  const combinations = [
    [1, 2, 3], [1, 2, 4], [1, 2, 5], [1, 3, 4], [1, 3, 5],
    [1, 4, 5], [2, 3, 4], [2, 3, 5], [2, 4, 5], [3, 4, 5]
  ];

  const generateAllCombinations = (generator, method) => {
    test('Provide invalid inputs should do nothing', () => {
      let iter = generator();
      let i = 0;
      for (let subset of iter) i++;
      expect(i).toBe(0);

      iter = generator(arr, -1);
      i = 0;
      for (let subset of iter) i++;
      expect(i).toBe(0);

      iter = generator(arr, 10);
      i = 0;
      for (let subset of iter) i++;
      expect(i).toBe(0);
    });

    test(`Test generating all combinations ${method}`, () => {
      const iter = generator(arr, 3);
      let i = 0;
      for (let subset of iter) expect(subset).toStrictEqual(combinations[i++]);
      expect(i).toBe(10);
    });
  };
  
  generateAllCombinations(generateCombinationsRecursive, 'recursively');
  generateAllCombinations(generateCombinationsIterative, 'iteratively');
});

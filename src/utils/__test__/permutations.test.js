import {
  generatePermutationIterative,
  generatePermutationRecursive,
  generatePermutationHeapAlgoRecursive,
} from '../permutations';
import { mergeSort } from '../../sorting/mergesort';

describe('Test generating permutations of a sequence', () => {
  const PERMUTATIONS_SIZE = 24;
  const letterPermutations = [
    ['A', 'B', 'C', 'D'], ['A', 'B', 'D', 'C'], ['A', 'C', 'B', 'D'],
    ['A', 'C', 'D', 'B'], ['A', 'D', 'B', 'C'], ['A', 'D', 'C', 'B'],
    ['B', 'A', 'C', 'D'], ['B', 'A', 'D', 'C'], ['B', 'C', 'A', 'D'],
    ['B', 'C', 'D', 'A'], ['B', 'D', 'A', 'C'], ['B', 'D', 'C', 'A'],
    ['C', 'A', 'B', 'D'], ['C', 'A', 'D', 'B'], ['C', 'B', 'A', 'D'],
    ['C', 'B', 'D', 'A'], ['C', 'D', 'A', 'B'], ['C', 'D', 'B', 'A'],
    ['D', 'A', 'B', 'C'], ['D', 'A', 'C', 'B'], ['D', 'B', 'A', 'C'],
    ['D', 'B', 'C', 'A'], ['D', 'C', 'A', 'B'], ['D', 'C', 'B', 'A']
  ];
  const numberPermutations = [
    [1, 1, 2, 3], [1, 1, 3, 2], [1, 2, 1, 3], [1, 2, 3, 1],
    [1, 3, 1, 2], [1, 3, 2, 1], [2, 1, 1, 3], [2, 1, 3, 1],
    [2, 3, 1, 1], [3, 1, 1, 2], [3, 1, 2, 1], [3, 2, 1, 1]
  ];

  const recursive = generator => {
    test('Generate permutations recursively', () => {
      let arr = ['A', 'B', 'C', 'D'];
      let iter = generator(arr);
      let i = 0;
      for (let perm of iter) {
        i++;
        letterPermutations.includes(perm);
      }
      expect(i).toBe(PERMUTATIONS_SIZE);

      arr = ['C', 'D', 'A', 'B'];
      iter = generator(arr);
      i = 0;
      for (let perm of iter) {
        i++;
        letterPermutations.includes(perm);
      }
      expect(i).toBe(PERMUTATIONS_SIZE);

      arr = [1, 1, 2, 3];
      iter = generator(arr);
      i = 0;
      for (let perm of iter) {
        i++;
        numberPermutations.includes(perm);
      }
      expect(i).toBe(PERMUTATIONS_SIZE);
    });
  };

  recursive(generatePermutationRecursive);
  recursive(generatePermutationHeapAlgoRecursive);

  test('Generate permutations iteratively', () => {
    let arr = [1, 1, 2, 3];
    let iter = generatePermutationIterative(arr);
    let i = 0;
    for (let perm of iter) expect(perm).toStrictEqual(numberPermutations[i++]);

    arr = ['A', 'B', 'C', 'D'];
    iter = generatePermutationIterative(arr);
    i = 0;
    for (let perm of iter) expect(perm).toStrictEqual(letterPermutations[i++]);

    arr = ['C', 'D', 'A', 'B'];
    arr = mergeSort(arr);
    iter = generatePermutationIterative(arr);
    i = 0
    for (let perm of iter) expect(perm).toStrictEqual(letterPermutations[i++]);
  });
});

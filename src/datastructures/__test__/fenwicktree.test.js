import { FenwickTree } from '../fenwicktree';

describe('Test for Fenwick Tree - Range queries and Point updates', () => {
  let ft;

  describe('Fenwick Tree creation', () => {
    test('Illegal tree creation with invalid argument', () => {
      expect(() => new FenwickTree()).toThrow('An array or array size is required');
      expect(() => new FenwickTree('hello')).toThrow('An array or array size is required');
      expect(() => new FenwickTree(0)).toThrow('An array or array size is required');

      expect(() => new FenwickTree([])).toThrow('Requires non-empty array');
      expect(() => new FenwickTree(-14)).toThrow('Array size has to be greater than 0');
    });

    test('Legal tree creation with valid argument', () => {
      expect(() => new FenwickTree([3])).not.toThrow('Requires non-empty array');
      expect(() => new FenwickTree([2, -4, 9])).not.toThrow('Requires non-empty array');
      expect(() => new FenwickTree(1)).not.toThrow('Array size has to be greater than 0');
      expect(() => new FenwickTree(5)).not.toThrow('Array size has to be greater than 0');
    });
  });

  const testNonEmptyTree = () => {
    test('Calling sum with leftIndex > rightIndex should throw an error', () => {
      expect(() => ft.sum(10, 4)).toThrow('Make sure right index >= left Index');
    });

    test('Calling sum, get, add, set with invalid index should throw an error', () => {
      expect(() => ft.sum(-1, 10)).toThrow('Index out of range');
      expect(() => ft.sum(1, 50)).toThrow('Index out of range');
      expect(() => ft.sum(-3, 50)).toThrow('Index out of range');

      expect(() => ft.get(-3)).toThrow('Index out of range');
      expect(() => ft.get(22)).toThrow('Index out of range');
      expect(() => ft.add(15)).toThrow('Index out of range');
      expect(() => ft.set(-5)).toThrow('Index out of range');
    });

    test('Calling get(index) should return the value at that position', () => {
      expect(ft.get(1)).toBe(3);
      expect(ft.get(12)).toBe(-8);
      expect(ft.get(8)).toBe(-8);
    });

    test('Calling add(index) should update value at this position. In the tree, all cells responsible for it will be updated with the addition', () => {
      expect(ft.get(6)).toBe(11);
      ft.add(6, 3); // cells reponsible for index #6 are #8 and #16 but #16 is out of bound
      expect(ft.get(6)).toBe(14);
      expect(ft.toString()).toBe('0 3 7 -2 12 3 17 5 26 -9 -7 4 -11');

      expect(ft.get(9)).toBe(-9);
      ft.add(9, 3); // cells reponsible for index #9 are #10 and #12
      expect(ft.get(9)).toBe(-6);
      expect(ft.toString()).toBe('0 3 7 -2 12 3 17 5 26 -6 -4 4 -8');
    });

    test('Calling set(index) should update value at this position. In the tree, all cells responsible for it will be updated with the addition', () => {
      expect(ft.get(6)).toBe(11);
      ft.set(6, 6); // cells reponsible for index #6 are #8 and #16 but #16 is out of bound
      expect(ft.get(6)).toBe(6);
      expect(ft.toString()).toBe('0 3 7 -2 12 3 9 5 18 -9 -7 4 -11');

      expect(ft.get(9)).toBe(-9);
      ft.set(9, 6); // cells reponsible for index #9 are #10 and #12
      expect(ft.get(9)).toBe(6);
      expect(ft.toString()).toBe('0 3 7 -2 12 3 9 5 18 6 8 4 4');
    });


    test('Calling sum(left, right) should return the correct sum', () => {
      expect(ft.sum(2, 5)).toBe(12);
      expect(ft.sum(4, 10)).toBe(11);
    });
  };

  describe('Test Fenwick Tree with an array as the initial argument', () => {
    beforeEach(() => {
      ft = new FenwickTree([3, 4, -2, 7, 3, 11, 5, -8, -9, 2, 4, -8]);
      expect(ft.toString()).toBe('0 3 7 -2 12 3 14 5 23 -9 -7 4 -11');
    });

    testNonEmptyTree();
  });

  describe('Test Fenwick Tree with an array SIZE as the initial argument', () => {
    beforeEach(() => {
      ft = new FenwickTree(12);
      ft.add(1, 3);
      ft.add(2, 4);
      ft.add(3, -2);
      ft.add(4, 7);
      ft.add(5, 3);
      ft.add(6, 11);
      ft.add(7, 5);
      ft.add(8, -8);
      ft.add(9, -9);
      ft.add(10, 2);
      ft.add(11, 4);
      ft.add(12, -8);
      expect(ft.toString()).toBe('0 3 7 -2 12 3 14 5 23 -9 -7 4 -11');
    });

    testNonEmptyTree();
  });
});
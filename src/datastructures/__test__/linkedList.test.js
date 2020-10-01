import { DoublyLinkedList, SinglyLinkedList } from '../linkedList';

const linkedListTest = (List, listName) => {
  describe(`Testing on ${listName}`, () => {
    let list;

    afterEach(() => {
      list.clear();
      list = undefined;
    });

    describe('Test methods on empty list', () => {
      beforeEach(() => {
        list = new List();
      });

      test('List is empty with size = 0', () => {
        expect(list.size()).toBe(0);
        expect(list.isEmpty()).toBe(true);
      });

      test('Calling peak first/last on empty list returns null', () => {
        expect(list.peakFirst()).toBeNull();
        expect(list.peakLast()).toBeNull();
      });

      test('Calling removing first/last on empty list returns undefined', () => {
        expect(list.removeFirst()).toBeUndefined();
        expect(list.removeLast()).toBeUndefined();
      });

      test('Calling clear() on an empty list should simply do nothing or return undefined', () => {
        expect(list.clear()).toBeUndefined();
      });

      test('Calling removeAt on an empty list will result in an exception', () => {
        expect(() => list.removeAt(-1)).toThrow('Index out of range');
        expect(() => list.removeAt(0)).toThrow('Index out of range');
        expect(() => list.removeAt(1)).toThrow('Index out of range');
      });

      test('Calling removeFirstNodeWithValue or removeAllNodesWithValue on an empty list will return false', () => {
        expect(list.removeFirstNodeWithValue()).toBeFalsy();
        expect(list.removeAllNodesWithValue()).toBeFalsy();
      });
    });

    describe('Test adding methods on list', () => {
      beforeEach(() => {
        list = new List();
        list.add(1);
        expect(list.size()).toBe(1);
        expect(list.toString()).toBe('1');
      });

      test('Calling addFirst puts the new element at the beginning of the list', () => {
        list.addFirst(0);
        expect(list.size()).toBe(2);
        expect(list.toString()).toBe('0 1');

        expect(() => list.insert(0)).not.toThrow('Duplicate values');
      });

      test('Calling addLast or add puts new element at the end of the list', () => {
        list.addLast(2);
        expect(list.size()).toBe(2);
        expect(list.toString()).toBe('1 2');

        list.add(3);
        expect(list.size()).toBe(3);
        expect(list.toString()).toBe('1 2 3');

        expect(() => list.insert(2)).not.toThrow('Duplicate values');
      });

      test('Calling insert (with index) should put new element at that index, or throws an Error if index is out of bound', () => {
        list.add(3);
        expect(list.size()).toBe(2);
        expect(list.toString()).toBe('1 3');

        expect(() => list.insert(0, -1)).toThrow('Index out of range');
        expect(() => list.insert(0, 4)).toThrow('Index out of range');

        list.insert(2, 1);
        expect(list.size()).toBe(3);
        expect(list.toString()).toBe('1 2 3');

        list.insert(0, 0);
        expect(list.size()).toBe(4);
        expect(list.toString()).toBe('0 1 2 3');

        list.insert(4, 4);
        expect(list.size()).toBe(5);
        expect(list.toString()).toBe('0 1 2 3 4');

        expect(() => list.insert(2)).not.toThrow('Duplicate values');
      });
    });

    describe('Test other methods on non-empty list', () => {
      beforeEach(() => {
        list = new List();
        list.add(1);
        list.add(5);
        list.add(9);
        list.addLast(10);
        list.addFirst(0);
        list.insert(2, 2);
        expect(list.size()).toBe(6);
        expect(list.toString()).toBe('0 1 2 5 9 10');
      });

      test('Removing methods should remove the correct element from the list', () => {
        let value = list.removeFirst();
        expect(value).toBe(0);
        expect(list.size()).toBe(5);
        expect(list.toString()).toBe('1 2 5 9 10');

        value = list.removeLast();
        expect(value).toBe(10);
        expect(list.size()).toBe(4);
        expect(list.toString()).toBe('1 2 5 9');

        expect(() => list.removeAt(-1)).toThrow('Index out of range');
        expect(() => list.removeAt(4)).toThrow('Index out of range');

        // remove at the first index
        value = list.removeAt(0);
        expect(value).toBe(1);
        expect(list.size()).toBe(3);
        expect(list.toString()).toBe('2 5 9');

        // add 1 back
        list.addFirst(1);
        expect(list.size()).toBe(4);
        expect(list.toString()).toBe('1 2 5 9');

        // remove at the last index
        value = list.removeAt(3);
        expect(value).toBe(9);
        expect(list.size()).toBe(3);
        expect(list.toString()).toBe('1 2 5');

        // add 9 back
        list.addLast(9);
        expect(list.size()).toBe(4);
        expect(list.toString()).toBe('1 2 5 9');

        // remove at an index in the middle
        value = list.removeAt(1);
        expect(value).toBe(2);
        expect(list.size()).toBe(3);
        expect(list.toString()).toBe('1 5 9');

        // test removeLast and removeFirst when there's only 1 element in the list
        list.removeLast();
        list.removeFirst();
        expect(list.size()).toBe(1);
        expect(list.toString()).toBe('5');
        value = list.removeFirst();
        expect(value).toBe(5);
        expect(list.size()).toBe(0);
        expect(list.isEmpty()).toBeTruthy();

        list.add(1);
        value = list.removeLast();
        expect(value).toBe(1);
        expect(list.size()).toBe(0);
        expect(list.isEmpty()).toBeTruthy();
      });

      test('Calling removeFirstNodeWithValue and removeAllNodesWithValue returns true if the node(s) found and removed, or false if not found', () => {
        // Initial values 0 1 2 5 9 10
        let result = list.removeFirstNodeWithValue(22);
        expect(result).toBeFalsy();
        expect(list.size()).toBe(6);

        result = list.removeFirstNodeWithValue(0);
        expect(result).toBeTruthy();
        expect(list.size()).toBe(5);
        expect(list.toString()).toBe('1 2 5 9 10');

        result = list.removeFirstNodeWithValue(2);
        expect(result).toBeTruthy();
        expect(list.size()).toBe(4);
        expect(list.toString()).toBe('1 5 9 10');

        // Add duplicates values
        list.insert(1, 2);
        list.addFirst(9);
        list.addLast(9);
        expect(list.toString()).toBe('9 1 5 1 9 10 9');

        result = list.removeFirstNodeWithValue(1);
        expect(result).toBeTruthy();
        expect(list.size()).toBe(6);
        expect(list.toString()).toBe('9 5 1 9 10 9');

        result = list.removeAllNodesWithValue(2);
        expect(result).toBeFalsy();
        expect(list.size()).toBe(6);
        expect(list.toString()).toBe('9 5 1 9 10 9');

        result = list.removeAllNodesWithValue(1);
        expect(result).toBeTruthy();
        expect(list.size()).toBe(5);
        expect(list.toString()).toBe('9 5 9 10 9');

        result = list.removeAllNodesWithValue(9);
        expect(result).toBeTruthy();
        expect(list.size()).toBe(2);
        expect(list.toString()).toBe('5 10');
      });

      test('Peaking first/last should return the appropriate value', () => {
        expect(list.peakFirst()).toBe(0);
        expect(list.peakLast()).toBe(10);

        list.add(11);
        expect(list.toString()).toBe('0 1 2 5 9 10 11');
        expect(list.peakLast()).toBe(11);
        list.addFirst(-1);
        expect(list.toString()).toBe('-1 0 1 2 5 9 10 11');
        expect(list.peakFirst()).toBe(-1);

        list.removeFirst();
        expect(list.toString()).toBe('0 1 2 5 9 10 11');
        expect(list.peakFirst()).toBe(0);

        list.removeLast();
        expect(list.toString()).toBe('0 1 2 5 9 10');
        expect(list.peakLast()).toBe(10);
      });

      test('Clearing the list should remove all elements from the list', () => {
        list.clear();
        expect(list.isEmpty()).toBeTruthy();
        expect(list.size()).toBe(0);
      });

      test('IndexOf method should return the correct index of the value in the list, or -1 if it does not exist', () => {
        expect(list.indexOf(3)).toBe(-1);
        expect(list.indexOf(1)).toBe(1);
        expect(list.indexOf(9)).toBe(4);
      });

      test('Contains method should return true if the value exist, otherwise false', () => {
        expect(list.contains(3)).toBeFalsy();
        expect(list.contains(10)).toBeTruthy();
      });
    });
  });
};

linkedListTest(DoublyLinkedList, 'DoublyLinkedList');
linkedListTest(SinglyLinkedList, 'SinglyLinkedList');

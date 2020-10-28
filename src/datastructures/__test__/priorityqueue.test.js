import { BinaryHeap, IndexedDHeap } from '../priorityqueue';
import { compare } from '../../utils/compare';

const testPriorityQueue = (PQ, pqName, desc = false) => {
  describe(`Test ${pqName} as ${desc ? 'Max' : 'Min'} Priority Queue`, () => {
    let pq;

    afterEach(() => {
      pq.clear();
    });

    describe(`Test on empty ${pqName}`, () => {
      beforeEach(() => {
        pq = desc ? new PQ(compare(-1)) : new PQ();
      });

      test('size() should be 0, isEmpty() should be true', () => {
        expect(pq.size()).toBe(0);
        expect(pq.isEmpty()).toBeTruthy();
      });

      test('removeAt(), peak(), poll() should return null', () => {
        expect(() => pq.removeAt(4)).toThrow('Index out of range');
        expect(() => pq.removeAt(0)).toThrow('Index out of range');

        expect(pq.peak()).toBeNull();
        expect(pq.poll()).toBeNull();
      });

      test('remove(), contains() should return false', () => {
        expect(pq.remove(2)).toBeFalsy();
        expect(pq.remove('Two')).toBeFalsy();

        expect(pq.contains(2)).toBeFalsy();
        expect(pq.contains(0)).toBeFalsy();
      });

      test('isValidHeap() should return true', () => {
        expect(pq.isValidHeap()).toBeTruthy();
      });

      test('heapify() should not throw any errors', () => {
        expect(pq.heapify()).toBeUndefined();
      });

      test('add() missing argument should throw error', () => {
        expect(() => pq.add()).toThrow('Parameter Missing or Invalid');
      });

      test('add(value) should add new values to the PQ at the right position', () => {
        pq.add(4);
        let str = '4';
        expect(pq.size()).toBe(1);
        expect(pq.toString()).toBe(str);

        pq.add(2);
        str = desc ? '4 2' : '2 4';
        expect(pq.size()).toBe(2);
        expect(pq.peak()).toBe(desc ? 4 : 2);
        expect(pq.toString()).toBe(str);

        pq.add(3);
        str = desc ? '4 2 3' : '2 4 3';
        expect(pq.size()).toBe(3);
        expect(pq.peak()).toBe(desc ? 4 : 2);
        expect(pq.toString()).toBe(str);

        pq.add(10);
        str = desc ? '10 4 3 2' : '2 4 3 10';
        expect(pq.toString()).toBe(str);

        pq.add(7);
        str = desc ? '10 7 3 2 4' : '2 4 3 10 7';
        expect(pq.toString()).toBe(str);

        pq.add(3);
        str = desc ? '10 7 3 2 4 3' : '2 4 3 10 7 3';
        expect(pq.toString()).toBe(str);

        pq.add(5);
        str = desc ? '10 7 5 2 4 3 3' : '2 4 3 10 7 3 5';
        expect(pq.toString()).toBe(str);

        pq.add(2);
        str = desc ? '10 7 5 2 4 3 3 2' : '2 2 3 4 7 3 5 10';
        expect(pq.size()).toBe(8);
        expect(pq.peak()).toBe(desc ? 10 : 2);
        expect(pq.toString()).toBe(str);

        expect(pq.isValidHeap()).toBeTruthy();
      });

      test('addBulk() should throw an error if the argument is empty, not an array or empty array', () => {
        expect(() => pq.addBulk()).toThrow('Parameter Missing or Invalid');
        expect(() => pq.addBulk('str')).toThrow('Parameter Missing or Invalid');
        expect(() => pq.addBulk([])).toThrow('Parameter Missing or Invalid');
      });

      test('addBulk should add all elements in the arguments to the heap (but does not satisfy heap invariant), or throw errors if there is no argument', () => {
        pq.addBulk([7, 3, 2, 4, 5, 2, 10, 3]);
        expect(pq.size()).toBe(8);
        expect(pq.isValidHeap()).toBeFalsy();
      });

      test('heapify() should not throw any error on empty heap', () => {
        expect(pq.heapify()).toBeUndefined();
      });
    });

    describe(`Test on non-empty ${pqName}`, () => {
      let str = desc ? '10 7 5 2 4 3 3 2' : '2 2 3 4 7 3 5 10';

      afterEach(() => {
        str = desc ? '10 7 5 2 4 3 3 2' : '2 2 3 4 7 3 5 10';
      });

      beforeEach(() => {
        pq = desc ? new PQ(compare(-1)) : new PQ();

        pq.add(4);
        pq.add(2);
        pq.add(3);
        pq.add(10);
        pq.add(7);
        pq.add(3);
        pq.add(5);
        pq.add(2);

        expect(pq.size()).toBe(8);
        expect(pq.peak()).toBe(desc ? 10 : 2);
        expect(pq.toString()).toBe(str);

        expect(pq.isValidHeap()).toBeTruthy();
      });

      test('pq[Symbol.iterator]() should iterate through the heap level by level, left to right', () => {
        const iter = pq[Symbol.iterator]();
        expect(iter.next().value).toBe(desc ? 10 : 2);
        expect(iter.next().value).toBe(desc ? 7 : 2);
        expect(iter.next().value).toBe(desc ? 5 : 3);
        expect(iter.next().value).toBe(desc ? 2 : 4);
      });

      test('heapify() will not rearrange the heap if it is already valid', () => {
        pq.heapify();
        expect(pq.toString()).toBe(str);
      });

      test('contains() should return true if there is such an element, otherwise false', () => {
        expect(pq.contains(10)).toBeTruthy();
        expect(pq.contains(0)).toBeFalsy();
      });

      test('poll() should remove the element with the highest priority', () => {
        expect(pq.poll()).toBe(desc ? 10 : 2);
        expect(pq.size()).toBe(7);
        str = desc ? '7 4 5 2 2 3 3' : '2 4 3 10 7 3 5';
        expect(pq.toString()).toBe(str);
        expect(pq.isValidHeap()).toBeTruthy();

        expect(pq.poll()).toBe(desc ? 7 : 2);
        expect(pq.size()).toBe(6);
        str = desc ? '5 4 3 2 2 3' : '3 4 3 10 7 5';
        expect(pq.toString()).toBe(str);
        expect(pq.isValidHeap()).toBeTruthy();
      });

      test('peak() should return the element with the highest priority', () => {
        expect(pq.peak()).toBe(desc ? 10 : 2);

        pq.poll();
        expect(pq.size()).toBe(7);
        expect(pq.peak()).toBe(desc ? 7 : 2);
        expect(pq.isValidHeap()).toBeTruthy();

        pq.poll();
        expect(pq.size()).toBe(6);
        expect(pq.peak()).toBe(desc ? 5 : 3);
        expect(pq.isValidHeap()).toBeTruthy();
      });

      test('remove() should remove the element and still maintain heap invariant', () => {
        expect(pq.contains(3)).toBeTruthy();
        expect(pq.remove(3)).toBeTruthy();
        expect(pq.size()).toBe(7);

        str = desc ? '10 7 5 2 4 2 3' : '2 2 3 4 7 10 5';
        expect(pq.toString()).toBe(str);

        expect(pq.remove()).toBeFalsy();
      });

      test('removeAt() should remove the element at the specific index and still maintain heap invariant', () => {
        expect(pq.removeAt(2)).toBe(desc ? 5 : 3);
        expect(pq.size()).toBe(7);
        str = desc ? '10 7 3 2 4 2 3' : '2 2 3 4 7 10 5';
        expect(pq.toString()).toBe(str);

        // remove the element at the last index
        const lastElem = desc ? 3 : 5;
        expect(pq.removeAt(6)).toBe(lastElem);
        expect(pq.size()).toBe(6);
        str = desc ? '10 7 3 2 4 2' : '2 2 3 4 7 10';
        expect(pq.toString()).toBe(str);
      });

      test('removeAt() with index < 0 or index >= heap size should throw an error', () => {
        expect(() => pq.removeAt(-1)).toThrow('Index out of range');
        expect(() => pq.removeAt(8)).toThrow('Index out of range');
      });

      test('addBulk should add new elements at the end of the heap. Heap becomes invalid.', () => {
        pq.addBulk([0, 30, 8]);
        str += ' 0 30 8';
        expect(pq.toString()).toBe(str);
        expect(pq.size()).toBe(11);
        expect(pq.isValidHeap()).toBeFalsy();
      });

      test('heapify() should rearrange the elements in the heap for it to be valid', () => {
        pq.addBulk([0, 30]);
        str += ' 0 30';
        expect(pq.toString()).toBe(str);
        expect(pq.size()).toBe(10);
        expect(pq.isValidHeap()).toBeFalsy();

        pq.heapify();
        expect(pq.isValidHeap()).toBeTruthy();
      });
    });
  });
};

testPriorityQueue(BinaryHeap, 'BinaryHeap');
testPriorityQueue(BinaryHeap, 'BinaryHeap', true);

describe('Test IndexedDHeap as Indexed Priority Queue', () => {
  test('Invalid IndexedDHeap creation', () => {
    expect(() => new IndexedDHeap()).toThrow('Invalid degree value');
    expect(() => new IndexedDHeap(0)).toThrow('Invalid size value');
    expect(() => new IndexedDHeap(0, 0)).toThrow('Invalid size value');
  });

  describe('Test Min IndexedDHeap with degree = 2', () => {
    const names = ['Anna', 'Bella', 'Carly', 'Dylan', 'Emily', 'Fred', 'George', 'Henry', 'Issac', 'James', 'Kelly', 'Laura', 'Mary'];
    const values = [3, 15, 11, 17, 7, 9, 2, 1, 6, 5, 16, 4, 2];
    let ipq;

    test('Do testing on empty IPQ', () => {
      ipq = new IndexedDHeap(2, 15);
    
      expect(ipq.size()).toBe(0);
      expect(ipq.isEmpty()).toBeTruthy();
      expect(ipq.isValidHeap()).toBeTruthy();
      expect(ipq.toString()).toBe('');
      expect(ipq.peakKeyIndex()).toBeNull();
      expect(ipq.pollKeyIndex()).toBeNull();
      expect(ipq.peakValue()).toBeNull();
      expect(ipq.pollValue()).toBeNull();
      expect(ipq.contains(3)).toBeFalsy();
      expect(ipq.valueOf(3)).toBeNull();

      expect(() => ipq.contains(15)).toThrow('Key Index out of range');
      expect(() => ipq.valueOf(15)).toThrow('Key Index out of range');
      expect(() => ipq.delete(2)).toThrow('Key Index does not exist');
      expect(() => ipq.update(2)).toThrow('Key Index does not exist');
      expect(() => ipq.increase(2)).toThrow('Key Index does not exist');
      expect(() => ipq.decrease(0)).toThrow('Key Index does not exist');
    });

    test('Do testing on non-empty IPQ', () => {
      ipq = new IndexedDHeap(2, 15);
      for (let i = 0; i < 13; i++) ipq.insert(i, values[i]);
      expect(ipq.size()).toBe(13);
      expect(ipq.isValidHeap()).toBeTruthy();

      expect(ipq.contains(3)).toBeTruthy();
      expect(ipq.valueOf(3)).toBe(17);
      expect(ipq.peakKeyIndex()).toBe(7);
      expect(ipq.peakValue()).toBe(1);
      expect(values[7]).toBe(1);
      expect(ipq.toString()).toBe('7 6 12 8 9 0 5 3 4 1 10 2 11');
      expect(ipq.contains(14)).toBeFalsy();

      // insert null value
      expect(() => ipq.insert(13)).toThrow('Invalid Value');
      expect(() => ipq.insert(11, 3)).toThrow('Duplicate Key Index');

      // Poll the root node
      expect(ipq.pollKeyIndex()).toBe(7);
      expect(ipq.peakKeyIndex()).toBe(6);
      expect(ipq.peakValue()).toBe(2);
      expect(ipq.size()).toBe(12);
      expect(ipq.toString()).toBe('6 11 12 8 9 0 5 3 4 1 10 2');
      expect(() => ipq.delete(7)).toThrow('Key Index does not exist');

      // Delete a random node
      ipq.delete(11);
      expect(ipq.toString()).toBe('6 9 12 8 2 0 5 3 4 1 10');

      // update value
      expect(ipq.update(2, 1)).toBe(11);
      expect(ipq.valueOf(2)).toBe(1);
      expect(ipq.peakKeyIndex()).toBe(2);
      expect(ipq.peakValue()).toBe(1);
      expect(ipq.toString()).toBe('2 6 12 8 9 0 5 3 4 1 10');

      // Decrease key
      ipq.decrease(5, 15);
      expect(ipq.valueOf(5)).toBe(9);
      ipq.decrease(5, 0);
      expect(ipq.valueOf(5)).toBe(0);
      expect(ipq.peakKeyIndex()).toBe(5);
      expect(ipq.peakValue()).toBe(0);

      // Increase key
      ipq.increase(5, -5);
      expect(ipq.valueOf(5)).toBe(0);
      ipq.increase(5, 9);
      expect(ipq.valueOf(5)).toBe(9);
      expect(ipq.peakKeyIndex()).not.toBe(5);
      expect(ipq.peakValue()).not.toBe(0);
    });
  });
});

import { BinaryHeap, compare } from '../priorityqueue';

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
        expect(pq.removeAt(4)).toBeNull();
        expect(pq.removeAt(0)).toBeNull();

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

      test('heapify() should reorder the input array to satisfy the heap inraviant', () => {
        pq.heapify([7, 3, 2, 4, 5, 2, 10, 3]);
        console.log(pq.toString());
        expect(pq.isValidHeap()).toBeTruthy();
      });

      test('heapify() should throw an error if the argument is empty, not an array or empty array', () => {
        expect(() => pq.heapify()).toThrow('Parameter Missing or Invalid');
        expect(() => pq.heapify('str')).toThrow('Parameter Missing or Invalid');
        expect(() => pq.heapify([])).toThrow('Parameter Missing or Invalid');
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

      test('heapify() should erase the old elements', () => {
        pq.heapify([7, 3, 2, 4, 5, 2, 10, 3]);
        expect(pq.toString()).not.toBe(str);
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
      });

      test('removeAt() should remove the element at the specific index and staill maintain heap invariant', () => {
        expect(pq.removeAt(2)).toBe(desc ? 5 : 3);
        expect(pq.size()).toBe(7);

        str = desc ? '10 7 3 2 4 2 3' : '2 2 3 4 7 10 5';
        expect(pq.toString()).toBe(str);
      });
    });
  });
};

testPriorityQueue(BinaryHeap, 'BinaryHeap');
testPriorityQueue(BinaryHeap, 'BinaryHeap', true);

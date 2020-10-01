import { Queue } from '../queue';

describe('Testing Queue implemented using SinglyLinkedList', () => {
  let queue;

  describe('Test on empty queue', () => {
    beforeEach(() => {
      queue = new Queue();
    });

    test(`Queue's length should be 0, and isEmpty should be true`, () => {
      expect(queue.size()).toBe(0);
      expect(queue.isEmpty()).toBeTruthy();
    });

    test('Peak and Enqueuing on empty queue should throw an exception', () => {
      expect(() => queue.dequeue()).toThrow('Queue Empty');
      expect(() => queue.peak()).toThrow('Queue Empty');
    });

    test('Initialize a new queue with an element should include it in the queue', () => {
      queue = new Queue(1);
      const firstElement = queue.peak();
      expect(firstElement).toBe(1);
      expect(queue.size()).toBe(1);
      expect(queue.toString()).toBe('1');
    });

    test('New elements being enqueued onto the queue should always be at the back', () => {
      queue.enqueue(1);
      let frontElement = queue.peak();
      expect(frontElement).toBe(1);
      expect(queue.size()).toBe(1);
      expect(queue.toString()).toBe('1');

      queue.enqueue(2);
      frontElement = queue.peak();
      expect(frontElement).toBe(1);
      expect(queue.size()).toBe(2);
      expect(queue.toString()).toBe('1 2');

      queue.enqueue(3);
      frontElement = queue.peak();
      expect(frontElement).toBe(1);
      expect(queue.size()).toBe(3);
      expect(queue.toString()).toBe('1 2 3');
    });
  });

  describe('Test on non-empty queue', () => {
    beforeEach(() => {
      queue = new Queue();
      queue.enqueue(1);
      queue.enqueue(2);
      queue.enqueue(3);
      expect(queue.size()).toBe(3);
      expect(queue.toString()).toBe('1 2 3');
    });

    test('Peak returns the front element of the queue and does not modify the queue.', () => {
      const top = queue.peak();
      expect(top).toBe(1);
      expect(queue.size()).toBe(3);
      expect(queue.toString()).toBe('1 2 3');
    });

    test('Dequeue returns the front element and removes that element from the queue.', () => {
      let top = queue.dequeue();
      expect(top).toBe(1);
      expect(queue.size()).toBe(2);
      expect(queue.toString()).toBe('2 3');

      top = queue.peak();
      expect(top).toBe(2);
      expect(queue.size()).toBe(2);
      expect(queue.toString()).toBe('2 3');
    });

    test('Dequeue all elements from the queue', () => {
      let top = queue.dequeue();
      expect(top).toBe(1);
      expect(queue.size()).toBe(2);
      expect(queue.toString()).toBe('2 3');

      top = queue.dequeue();
      expect(top).toBe(2);
      expect(queue.size()).toBe(1);
      expect(queue.toString()).toBe('3');

      top = queue.dequeue();
      expect(top).toBe(3);
      expect(queue.size()).toBe(0);
      expect(queue.toString()).toBe('');

      expect(() => queue.dequeue()).toThrow('Queue Empty');
    });
  });
});

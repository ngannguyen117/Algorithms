import { ListStack, ArrayStack } from '../stack';

const testStack = (Stack, stackName) => {
  describe(`Testing ${stackName}`, () => {
    let stack;

    describe('Test empty stack', () => {
      beforeEach(() => {
        stack = new Stack();
      });

      test(`Stack's length should be 0, and isEmpty should be true`, () => {
        expect(stack.size()).toBe(0);
        expect(stack.isEmpty()).toBeTruthy();
      });

      test('Pop and peak on empty stack should throw an exception', () => {
        expect(() => stack.pop()).toThrow('Stack empty');
        expect(() => stack.peak()).toThrow('Stack empty');
      });

      test('Initialize a new stack with an element should include it in the stack', () => {
        stack = new Stack('One');
        const firstElement = stack.peak();
        expect(firstElement).toBe('One');
        expect(stack.toString()).toBe('One');
      });

      test('New elements being pushed onto the stack should always be at the top', () => {
        stack.push('first');
        let topElement = stack.peak();
        expect(topElement).toBe('first');
        expect(stack.toString()).toBe('first');

        stack.push('second');
        topElement = stack.peak();
        expect(topElement).toBe('second');
        expect(stack.toString()).toBe('first second');
      });
    });

    describe('Test non-empty stack', () => {
      beforeEach(() => {
        stack = new Stack();
        stack.push('first');
        stack.push('second');
        stack.push('third');
        expect(stack.size()).toBe(3);
        expect(stack.toString()).toBe('first second third');
      });

      test('Peak returns the top element on the stack and does not modify the stack.', () => {
        const top = stack.peak();
        expect(top).toBe('third');
        expect(stack.size()).toBe(3);
        expect(stack.toString()).toBe('first second third');
      });

      test('Pop returns the top element on the stack and removes that element from the stack.', () => {
        let top = stack.pop();
        expect(top).toBe('third');
        expect(stack.size()).toBe(2);
        expect(stack.toString()).toBe('first second');

        top = stack.peak();
        expect(top).toBe('second');
        expect(stack.size()).toBe(2);
        expect(stack.toString()).toBe('first second');
      });
    });
  });
};

testStack(ListStack, 'Stack implementation using SinglyLinkedList');
testStack(ArrayStack, 'Stack implementation using Javascript built-in Array');

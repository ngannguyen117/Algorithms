import {
  makeRangeIter,
  makeRangeGenerator,
  fibonacci,
  gen2,
} from '../iterators';

describe('Testing behaviour of Iterators & generator functions', () => {
  test('Value from each iteration should be multiple of 2, the returned value from iterator termination should be 5, the number of iterations', () => {
    const iter = makeRangeIter(0, 10, 2);

    let result = iter.next();
    let value = 0;
    while (!result.done) {
      expect(result.value).toBe(value);
      value += 2;
      result = iter.next();
    }
    expect(result.value).toBe(5);
  });

  test('Generator should have the same result as the above iterator', () => {
    const generator = makeRangeGenerator(0, 10, 2);

    let result = generator.next();
    let value = 0;
    while (!result.done) {
      expect(result.value).toBe(value);
      value += 2;
      result = generator.next();
    }
    expect(result.value).toBe(5);
  });

  test('Should returns the correct fibonacci sequence and resets whenever we pass true to next()', () => {
    const fib = fibonacci();

    expect(fib.next().value).toBe(0);
    expect(fib.next().value).toBe(1);
    expect(fib.next().value).toBe(1);
    expect(fib.next().value).toBe(2);
    expect(fib.next(true).value).toBe(0);
  });

  test('Yield* will get the yielded values from the calling function', () => {
    const iterator = gen2(7, 8);
    expect(iterator.next().value).toBe(0);
    expect(iterator.next().value).toBe(1);
    expect(iterator.next().value).toBe(2);
    expect(iterator.next().value).toBe(3);
    expect(iterator.next().value).toBe('4');
    expect(iterator.next().value).toBe('5');
    expect(iterator.next().value).toBe('6');
    expect(iterator.next().value).toBe(7);
    expect(iterator.next().value).toBe(8);
    expect(iterator.next().value).toBe(9);
    expect(iterator.next().value).toBe(10);
    expect(iterator.next().value).toBe('Returned from gen1');
  });

  test('Access values from gen2 generator function as iterables will only give us the yielded values, not the returned value defined in the function', () => {
    const iter = gen2(7, 8);
    const values = [0, 1, 2, 3, '4', '5', '6', 7, 8, 9, 10];
    let i = 0;
    for (const item of iter) expect(item).toBe(values[i++]);

    const terminatedIter = iter.next();
    expect(terminatedIter.done).toBe(true);
    expect(terminatedIter.value).not.toBe('Returned from gen1');
  });

  test('When the iterator is an iterable object, we can iterate once', () => {
    const iter = gen2(7, 8);

    // The same iterator object is called when we call iter[Symbol.iterator]()
    expect(iter[Symbol.iterator]() === iter).toBe(true); // the iterator is an iterable object
    expect(iter[Symbol.iterator]().next().value).toBe(0);
    expect(iter[Symbol.iterator]().next().value).toBe(1);
  });

  test('When redefine the @@iterator method of the iterator (currently as an iterable object), we can iterate many times', () => {
    const iter = gen2(7, 8);
    expect(iter[Symbol.iterator]() === iter).toBe(true); // the current iterator is an iterable object

    // Reassign the @@iterator method to be a generator function
    iter[Symbol.iterator] = gen2;
    expect(iter[Symbol.iterator]() === iter).toBe(false);

    // a new iterator object is created everytime we call iter[Symbol.iterator]()
    expect(iter[Symbol.iterator]().next().value).toBe(0);
    expect(iter[Symbol.iterator]().next().value).toBe(0);
    expect(iter[Symbol.iterator]().next().value).toBe(0);

    // NOTE: the iter variable doesn't change, it is still an iterable object, only the definition of Symbol.iterator method has changed
    expect(iter.next().value).toBe(0);
    expect(iter.next().value).toBe(1);
  });
});

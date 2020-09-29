/**
 * An iterator is an object that defines a sequence, and possibly returns a value upon termination.
 * Each iterator can be consumed once.
 */
export function makeRangeIter(start = 0, end = Infinity, step = 1) {
  let nextValue = start;
  let iterationCount = 0;

  const iterator = {
    next: () => {
      let result;
      if (nextValue < end) {
        result = { value: nextValue, done: false };
        nextValue += step;
        iterationCount++;
        return result;
      }
      return { value: iterationCount, done: true };
    },
  };

  return iterator;
}

/**
 * Generator function creates a special iterator called generator.
 * Generator function allows us to define an iterative algorithm that does not execute continuously.
 * It stops at each yield keyword.
 * Whatever after the yield keyword will be included automatically in the returned value property of the iterator
 */
export function* makeRangeGenerator(start = 0, end = Infinity, step = 1) {
  let iterationCount = 0;
  for (let i = start; i < end; i += step) {
    yield i;
    iterationCount++;
  }
  return iterationCount;
}

/**
 * A generator can also receive an argument passed through next().
 * This value will be the returned value of the yield expression for the current iteration
 */
export function* fibonacci() {
  let current = 0;
  let next = 1;

  while (true) {
    const reset = yield current;

    [current, next] = [next, next + current];
    if (reset) {
      current = 0;
      next = 1;
    }
  }
}

/**
 * The yield* expression is used to delegate to another generator or iterable object.
 *
 * The yield* expression iterates over the operand and yields each value returned by it.
 *
 * The value of yield* expression itself is the value returned by that iterator when it's closed (i.e., when done is true).
 */
function* gen1() {
  yield* [1, 2, 3];
  yield '4';
  yield* '56';
  yield* Array.from(arguments);
  return 'Returned from gen1';
}

export function* gen2() {
  yield 0;
  const returnedValue = yield* gen1(...arguments);
  yield* [9, 10];
  return returnedValue;
}

import { SlidingWindow, SlidingWindowType } from '../SlidingWindow';

describe('Test sliding window problem solving technique', () => {
  const values = [1, 2, 1, 3, 0, 4];

  test('Illegal Sliding Window creation throws error', () => {
    expect(() => new SlidingWindow()).toThrow('An array of values is required');
    expect(() => new SlidingWindow(5)).toThrow('An array of values is required');
    expect(() => new SlidingWindow('text')).toThrow('An array of values is required');
  });

  test('Test Maximum Sliding Window', () => {
    const window = new SlidingWindow(values, SlidingWindowType.MAXIMUM);
                // Index   0  1  2  3  4  5
                      //  [1, 2, 1, 3, 0, 4]    lo    hi    deque
      //  Initial values  []                    0     0     []
    window.advance(); //  [1]                   0     1     [0]
    expect(window.getValue()).toBe(1);
    window.advance(); //  [1, 2]                0     2     [1]
    expect(window.getValue()).toBe(2);
    window.advance(); //  [1, 2, 1]             0     3     [1, 2]
    expect(window.getValue()).toBe(2);

    window.shrink();  //     [2, 1]             1     3     [1, 2]
    expect(window.getValue()).toBe(2);
    window.shrink();  //        [1]             2     3     [2]
    expect(window.getValue()).toBe(1);
    window.shrink();  //          []            3     3     []
    expect(window.getValue()).toBeUndefined();
    // Cannot shrink anymore
    window.shrink();  //          []            3     3     []
    expect(window.getValue()).toBeUndefined();

    window.advance(); //           [3]          3     4     [3]
    expect(window.getValue()).toBe(3);
    window.advance(); //           [3, 0]       3     5     [3, 4]
    expect(window.getValue()).toBe(3);
    window.advance(); //           [3, 0, 4]    3     6     [5]
    expect(window.getValue()).toBe(4);
    // Cannot advance anymore
    window.advance(); //           [3, 0, 4]    3     6     [5]
    expect(window.getValue()).toBe(4);

    window.shrink();  //              [0, 4]    4     6     [5]
    expect(window.getValue()).toBe(4);
    window.shrink();  //                 [4]    5     6     [5]
    expect(window.getValue()).toBe(4);
    window.shrink();  //                  []    6     6     []
    expect(window.getValue()).toBeUndefined();
    // Cannot shrink anymore
    window.shrink();  //                  []    6     6     []
    expect(window.getValue()).toBeUndefined();
  });

  test('Test Minimum Sliding Window', () => {
    const window = new SlidingWindow(values, SlidingWindowType.MINIMUM);
                // Index   0  1  2  3  4  5
                      //  [1, 2, 1, 3, 0, 4]    lo    hi    deque
      //  Initial values  []                    0     0     []
    window.advance(); //  [1]                   0     1     [0]
    expect(window.getValue()).toBe(1);
    window.advance(); //  [1, 2]                0     2     [0, 1]
    expect(window.getValue()).toBe(1);
    window.advance(); //  [1, 2, 1]             0     3     [0, 2]
    expect(window.getValue()).toBe(1);

    window.shrink();  //     [2, 1]             1     3     [2]
    expect(window.getValue()).toBe(1);
    window.shrink();  //        [1]             2     3     [2]
    expect(window.getValue()).toBe(1);
    window.shrink();  //          []            3     3     []
    expect(window.getValue()).toBeUndefined();
    // Cannot shrink anymore
    window.shrink();  //          []            3     3     []
    expect(window.getValue()).toBeUndefined();

    window.advance(); //           [3]          3     4     [3]
    expect(window.getValue()).toBe(3);
    window.advance(); //           [3, 0]       3     5     [4]
    expect(window.getValue()).toBe(0);
    window.advance(); //           [3, 0, 4]    3     6     [4, 5]
    expect(window.getValue()).toBe(0);
    // Cannot advance anymore
    window.advance(); //           [3, 0, 4]    3     6     [4, 5]
    expect(window.getValue()).toBe(0);

    window.shrink();  //              [0, 4]    4     6     [4, 5]
    expect(window.getValue()).toBe(0);
    window.shrink();  //                 [4]    5     6     [5]
    expect(window.getValue()).toBe(4);
    window.shrink();  //                  []    6     6     []
    expect(window.getValue()).toBeUndefined();
    // Cannot shrink anymore
    window.shrink();  //                  []    6     6     []
    expect(window.getValue()).toBeUndefined();
  });
});

import { swap } from '../swap';

test('Test swap function using XOR', () => {
  const arr = [1, 2, 3, 4, 5];
  swap(arr, 3, 1);
  expect(arr).toStrictEqual([1, 4, 3, 2, 5]);

  swap(arr, 0, 0);
  expect(arr).toStrictEqual([1, 4, 3, 2, 5]);

  swap(arr, 0, 4);
  expect(arr).toStrictEqual([5, 4, 3, 2, 1]);
});

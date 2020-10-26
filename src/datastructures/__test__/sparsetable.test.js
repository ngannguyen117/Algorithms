import { SparseTable, Operation } from '../sparsetable';

describe('Test sparse table', () => {
  let st;
  const arr = [4, 2, 3, 7, 1, 5, 3, 3, 9, 6, 7, -1, 4];

  test('Invalid SparseTable creations should throw errors', () => {
    expect(() => new SparseTable()).toThrow('Requires an array of values and operation type');
    expect(() => new SparseTable(arr)).toThrow('Requires an array of values and operation type');
    expect(() => new SparseTable(9, Operation.MULT)).toThrow('Invalid values input');
    expect(() => new SparseTable([], Operation.MULT)).toThrow('Invalid values input');
  });

  test('Min sparse table', () => {
    st = new SparseTable(arr, Operation.MIN);
    expect(st.query(1, 11)).toBe(-1);
    expect(st.query(2, 7)).toBe(1);
    expect(st.query(0, 3)).toBe(2);
    expect(st.query(5, 8)).toBe(3);
    expect(st.query(0, 0)).toBe(4);

    expect(st.queryIndex(1, 11)).toBe(11);
    expect(st.queryIndex(2, 7)).toBe(4);
    expect(st.queryIndex(0, 3)).toBe(1);
    expect(st.queryIndex(5, 8)).toBe(6);
    expect(st.queryIndex(0, 0)).toBe(0);
  });

  test('Max sparse table', () => {
    st = new SparseTable(arr, Operation.MAX);
    expect(st.query(1, 11)).toBe(9);
    expect(st.query(2, 7)).toBe(7);
    expect(st.query(0, 3)).toBe(7);
    expect(st.query(5, 8)).toBe(9);
    expect(st.query(0, 0)).toBe(4);

    expect(st.queryIndex(1, 11)).toBe(8);
    expect(st.queryIndex(2, 7)).toBe(3);
    expect(st.queryIndex(0, 3)).toBe(3);
    expect(st.queryIndex(5, 8)).toBe(8);
    expect(st.queryIndex(0, 0)).toBe(0);
  });

  test('GCD sparse table', () => {
    st = new SparseTable(arr, Operation.GCD);
    expect(st.query(1, 11)).toBe(1);
    expect(st.query(2, 7)).toBe(1);
    expect(st.query(0, 3)).toBe(1);
    expect(st.query(6, 8)).toBe(3);
    expect(st.query(0, 0)).toBe(4);

    expect(() => st.queryIndex(1, 11)).toThrow('The provided operation does not support index queries')
  });

  test('MULT sparse table', () => {
    st = new SparseTable(arr, Operation.MULT);
    expect(st.query(1, 11)).toBe(-714420);
    expect(st.query(2, 7)).toBe(945);
    expect(st.query(0, 3)).toBe(168);
    expect(st.query(6, 8)).toBe(81);
    expect(st.query(0, 0)).toBe(4);

    expect(() => st.queryIndex(1, 11)).toThrow('The provided operation does not support index queries')
  });
});

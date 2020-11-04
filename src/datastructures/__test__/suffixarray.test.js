import { SuffixArray } from '../suffixarray';

describe('Test Suffix Array', () => {
  let sa;

  afterEach(() => {
    sa = null;
  });

  test('Illegal creation should throw error', () => {
    expect(() => new SuffixArray()).toThrow('Text input is required');
  });

  test('Legal creation should give us a suffix array and a LCP array', () => {
    let sa = new SuffixArray('banana');
    expect(sa.getSuffixArray()).toStrictEqual([5, 3, 1, 0, 4, 2]);
    expect(sa.getLCPArray()).toStrictEqual([0, 1, 3, 0, 0, 2]);

    sa = new SuffixArray('ABBABAABAA');
    expect(sa.getLCPArray()).toStrictEqual([0, 1, 2, 1, 4, 2, 0, 3, 2, 1]);

    sa = new SuffixArray('ABABABAABB');
    expect(sa.getLCPArray()).toStrictEqual([0, 1, 3, 5, 2, 0, 1, 2, 4, 1]);
  });

  test('Test LCP with a string of unique characters', () => {
    const ASCII_LETTERS = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
    sa = new SuffixArray(ASCII_LETTERS);
    const lcp = sa.getLCPArray();
    for (let i = 0; i < ASCII_LETTERS.length; i++)
      expect(lcp[i]).toBe(0);
  });

  test('Test LCP with a same-character string', () => {
    const UNIQUE_CHARS = 'KKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKK';
    sa = new SuffixArray(UNIQUE_CHARS);
    const lcp = sa.getLCPArray();
    for (let i = 0; i < UNIQUE_CHARS.length; i++)
      expect(lcp[i]).toBe(i);
  });
});
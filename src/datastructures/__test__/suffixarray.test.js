import { SuffixArray } from '../suffixarray';

describe('Test Suffix Array', () => {
  test('Illegal creation should throw error', () => {
    expect(() => new SuffixArray()).toThrow('Text input is required');
  });

  test('Legal creation should give us a suffix array and a LCP array', () => {
    const sa = new SuffixArray('banana');
    expect(sa.getSuffixArray()).toStrictEqual([5, 3, 1, 0, 4, 2]);
  });

  test('Test SA with coded text as input', () => {
    const sa = new SuffixArray([98, 97, 110, 97, 110, 97]); // 'banana'
    expect(sa.getSuffixArray()).toStrictEqual([5, 3, 1, 0, 4, 2]);
  });
});

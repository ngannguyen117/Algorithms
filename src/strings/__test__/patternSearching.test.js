import {
  searchPatternSA,
  searchPatternKMP,
} from '../patternSearching';

describe('Test all Pattern Searching Algorithms', () => {
  const test0 = [];
  const test1 = ['abababa'];
  const test2 = ['abababa', ''];
  const test3 = ['abababa', 'aba'];
  const test4 = ['abc', 'abcdef'];
  const test5 = ['P@TTerNabcdefP@TTerNP@TTerNabcdefabcdefabcdefabcdefP@TTerN', 'P@TTerN'];

  test('Test Pattern Searching using Suffix Array', () => {
    expect(searchPatternSA(...test0)).toBe(-1);
    expect(searchPatternSA(...test1)).toBe(-1);
    expect(searchPatternSA(...test2)).toBe(0);
    expect(searchPatternSA(...test3)).not.toBe(-1);
    expect(searchPatternSA(...test4)).toBe(-1);
    expect(searchPatternSA(...test5)).not.toBe(-1);
  });

  test('Test Pattern Searching using KMP algorithm', () => {
    expect(searchPatternKMP(...test0)).toStrictEqual([]);
    expect(searchPatternKMP(...test1)).toStrictEqual([]);
    expect(searchPatternKMP(...test2)).toStrictEqual([0]);
    expect(searchPatternKMP(...test3)).toStrictEqual([0, 2, 4]);
    expect(searchPatternKMP(...test4)).toStrictEqual([]);
    expect(searchPatternKMP(...test5)).toStrictEqual([0, 13, 20, 51]);
  });
});

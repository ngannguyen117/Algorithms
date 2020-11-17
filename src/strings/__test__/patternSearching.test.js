import { searchPatternSA } from '../patternSearching';

describe('Test all Pattern Searching Algorithms', () => {
  const test1 = ['abababa'];
  const test2 = ['abababa', ''];
  const test3 = ['abababa', 'aba'];
  const test4 = ['abc', 'abcdef'];
  const test5 = ['P@TTerNabcdefP@TTerNP@TTerNabcdefabcdefabcdefabcdefP@TTerN', 'P@TTerN'];

  test('Test Pattern Searching with Suffix Array', () => {
    expect(searchPatternSA(...test1)).toBe(-1);
    expect(searchPatternSA(...test2)).toBe(0);
    expect(searchPatternSA(...test3)).not.toBe(-1);
    expect(searchPatternSA(...test4)).toBe(-1);
    expect(searchPatternSA(...test5)).not.toBe(-1);
  });
});

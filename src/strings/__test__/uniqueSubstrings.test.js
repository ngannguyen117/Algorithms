import {
  findUniqueSubstrings1,
  findUniqueSubstrings2,
  countNumberOfUniqueSubstrings
} from '../uniqueSubstrings';

test('Finding unique substrings', () => {
  const str1 = 'AZAZA';
  const substrs1 = ['A', 'AZ', 'AZA', 'AZAZ', 'AZAZA', 'Z', 'ZA', 'ZAZ', 'ZAZA'];
  const str2 = 'abcd';
  const substrs2 = ['a', 'ab', 'abc', 'abcd', 'b', 'bc','bcd', 'c', 'cd', 'd'];
  const str3 = 'aaaa';
  const substrs3 = ['a', 'aa', 'aaa', 'aaaa'];

  expect(findUniqueSubstrings1(str1)).toStrictEqual(substrs1);
  expect(findUniqueSubstrings1(str2)).toStrictEqual(substrs2);
  expect(findUniqueSubstrings1(str3)).toStrictEqual(substrs3);
  expect(findUniqueSubstrings2(str1)).toStrictEqual(substrs1);
  expect(findUniqueSubstrings2(str2)).toStrictEqual(substrs2);
  expect(findUniqueSubstrings2(str3)).toStrictEqual(substrs3);
  expect(countNumberOfUniqueSubstrings(str1)).toBe(substrs1.length);
  expect(countNumberOfUniqueSubstrings(str2)).toBe(substrs2.length);
  expect(countNumberOfUniqueSubstrings(str3)).toBe(substrs3.length);
});

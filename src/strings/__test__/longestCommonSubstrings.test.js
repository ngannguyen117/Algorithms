import { findLongestCommonSubstrings } from '../longestCommonSubstrings';

test('Test finding longest common substrings in k number of strings', () => {
  expect(() => findLongestCommonSubstrings()).toThrow('Invalid string arrays');
  expect(() => findLongestCommonSubstrings(3)).toThrow('Invalid string arrays');
  expect(() => findLongestCommonSubstrings(['sv'])).toThrow('Invalid string arrays');

  expect(() => findLongestCommonSubstrings(['sv', 'vs'])).toThrow('Invalid k value, k >= 2 && k <= strings.length');
  expect(() => findLongestCommonSubstrings(['sv', 'vs'], 1)).toThrow('Invalid k value, k >= 2 && k <= strings.length');
  expect(() => findLongestCommonSubstrings(['sv', 'vs'], 5)).toThrow('Invalid k value, k >= 2 && k <= strings.length');

  let substrings = findLongestCommonSubstrings(['abcde', 'habcab', 'ghabcdf'], 2);
  expect(substrings).toStrictEqual(['ab']);

  substrings = findLongestCommonSubstrings(['AABC', 'BCDC', 'BCDE', 'CDED'], 3);
  expect(substrings).toStrictEqual([]);

  substrings = findLongestCommonSubstrings(['AABC', 'BCDC', 'BCDE', 'CDED'], 2);
  expect(substrings).toStrictEqual(['BCD', 'CDE']);
});

import {
  findPalindromicSubstrings,
  findLongestPalindromicSubstrings,
} from '../palindromicSubstrings';

describe('Test related to palindromic substrings using Manachers algorithm', () => {
  const str1 = 'abbaabba';
  const expectedPalindromes1 = ['a', 'aa', 'abba', 'abbaabba', 'b', 'baab', 'bb', 'bbaabb'];
  const str2 = 'babad';
  const expectedPalindromes2 = ['b', 'a', 'bab', 'aba', 'd'];

  const palindromicSubstrings = (fn, str, expectedResult) => {
    const palindromes = fn(str);
    expect(palindromes.length).toBe(expectedResult.length);
    for (let p of palindromes) expect(expectedResult.includes(p)).toBeTruthy();
  };

  test('Find all palindromic substrings of a string', () => {
    palindromicSubstrings(findPalindromicSubstrings, str1, expectedPalindromes1);
    palindromicSubstrings(findPalindromicSubstrings, str2, expectedPalindromes2);
  });

  test('Find the longest palindromic substrings of a string', () => {
    palindromicSubstrings(findLongestPalindromicSubstrings, str1, ['abbaabba']);
    palindromicSubstrings(findLongestPalindromicSubstrings, str2, ['bab', 'aba']);
  });
});

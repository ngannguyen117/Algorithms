import { findLongestRepeatedSubstrings } from '../longestRepeatedSubstring';

test('Test finding longest repeated substring', () => {
  let substrings = findLongestRepeatedSubstrings('ABC$BCA$CAB');
  expect(substrings).toStrictEqual(['AB', 'BC', 'CA']);

  substrings = findLongestRepeatedSubstrings('abcde');
  expect(substrings).toStrictEqual([]);

  substrings = findLongestRepeatedSubstrings('aaaaa'); // 5a
  expect(substrings).toStrictEqual(['aaaa']); // 4a
});

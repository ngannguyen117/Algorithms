/**
 * Manacher's algorithm finds the length of the longest palindrome centered
 * at a specific index. O(n).
 * 
 * Since even length palindromes have a center in between 2 characters, we
 * expand the string to insert those centers. For example, the string 'abba'
 * becomes '^#a#b#b#a#$' where the '#' represents the center of an even 
 * length string, and '^' & '$' mark the start and end of the string respectively.
 * 
 * @returns {number[]} A radius array of palindromes centered at each
 *                     character in the expanded string.
 *                     'abba' => [0, 0, 1, 0, 1, 4, 1, 0, 1, 0, 0]
 */
const manachers = str => {
  // Insert special characters to the string
  const n = str.length * 2 + 3;
  const chars = Array(n);
  chars[0] = '^';
  chars[n - 2] = '#';
  chars[n - 1] = '$';

  for (let i = 0; i < str.length; i++) {
    chars[i * 2 + 1] = '#';
    chars[i * 2 + 2] = str[i];
  }

  // Run manacher's algorithm
  const radius = Array(n).fill(0);
  for (let i = 1, center = 0, right = 0; i < n - 1; i++) {
    const mirrorIndex = center * 2 - i;

    radius[i] = right > i ? Math.min(right - i, radius[mirrorIndex]) : 0;
    while (chars[i - 1 - radius[i]] === chars[i + 1 + radius[i]])
      radius[i]++;

    if (i + radius[i] > right) {
      center = i;
      right = i + radius[i];
    }
  }

  return radius;
};

export const findPalindromicSubstrings = str => {
  const radius = manachers(str);
  const palindromes = new Set();

  for (let i = 2, r = radius[i]; i < radius.length - 2; r = radius[++i])
    if (r > 0)
      if (i % 2) // even palindrome
        while (r > 1) {
          const index = (i - 1) / 2 - r / 2;
          palindromes.add(str.slice(index, index + r));
          r -= 2;
        }
      else // odd palindrome
        while (r > 0) {
          const index = (i - 2) / 2 - (r - 1) / 2;
          palindromes.add(str.slice(index, index + r));
          r -= 2;
        }

  return Array.from(palindromes);
};

/**
 * Find the longest palindromic substrings using Manacher's algorithm
 */
export const findLongestPalindromicSubstrings = str => {
  const radius = manachers(str);
  let palindromes = [];
  let maxLen = 0;

  for (let i = 2, index = 2, r = radius[i]; i < radius.length - 2; r = radius[++i])
    if (r > 0 && r >= maxLen) {
      if (r > maxLen) {
        maxLen = r;
        palindromes = [];
      }

      index = i % 2 ? (i - 1) / 2 - r / 2 : (i - 2) / 2 - (r - 1) / 2;
      palindromes.push(str.slice(index, index + r));
    }

  return palindromes;
};

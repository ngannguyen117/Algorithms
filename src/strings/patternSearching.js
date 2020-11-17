import { SuffixArray } from '../datastructures/suffixarray';

/**
 * Determine if a pattern/substring exists in a text by doing a binary
 * search on the text's Suffix Array.
 * Should only use this algorithm if the text is short.
 * This algorithm returns the start index of only 1 occurence.
 * 
 * Time complexity: O(nlogn) SA construction & O(mlogn) individual query
 * 
 * @param {string} text A string 
 * @param {string} pattern pattern/substring
 */
export const searchPatternSA = (text, pattern) => {
  if (text == null || pattern == null) return -1;
  if (pattern === '') return 0;

  const n = text.length;
  const m = pattern.length;
  if (m > n) return -1;

  const sa = new SuffixArray(text).getSuffixArray();
  let start = 0;
  let end = n - 1;
  let suffixStr = '';

  // Do binary search
  while (start <= end) {
    const mid = start + ((end - start) >>> 1);
    const suffixIndex = sa[mid];
    const suffixLen = n - suffixIndex;

    // Extract part of the suffix we need to compare
    const len = suffixLen < m ? suffixLen : m;
    suffixStr = text.slice(suffixIndex, suffixIndex + len);

    if (suffixStr === pattern) return suffixIndex;
    if (suffixStr < pattern) start = mid + 1;
    else end = mid - 1;
  }

  return -1;
};

/**
 * Find all occurences' start index of matching pattern in the text (including 
 * overlapping matching) using KMP (Knuth-Morris-Pratt algorithm).
 * Should use this algorithm if the text string is very large.
 * 
 * KMP explanation {@link https://www.youtube.com/watch?v=GTJr8OvyEVQ}
 * 
 * Time complexity: O(n)
 * Space complexity: O(m)
 * 
 * @param {string} text A string 
 * @param {string} pattern pattern/substring
 */
export const searchPatternKMP = (text, pattern) => {
  /**
   * For each index i, compute the longest match between the prefix
   * starting at 0 and the suffix starting at i
   */
  const computeLongestMatch = () => {
    const arr = Array(m).fill(0);

    for (let i = 1, len = 0; i < m;)
      if (pattern[i] === pattern[len]) arr[i++] = ++len;
      else if (len > 0) len = arr[len - 1];
      else i++;

    return arr;
  };

  if (text == null || pattern == null) return [];
  if (pattern === '') return [0];

  const n = text.length;
  const m = pattern.length;
  if (m > n) return [];

  const matches = [];
  const longestMatch = computeLongestMatch();
  let i = 0;
  let j = 0;

  while (i < n) {
    if (text[i] === pattern[j]) {
      i++;
      j++;
    } else if (j === 0) i++;
    else j = longestMatch[j - 1];

    if (j === m) {
      matches.push(i - m);
      j = longestMatch[j - 1];
    }
  }

  return matches;
};

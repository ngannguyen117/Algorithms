import { SuffixArray } from '../datastructures/suffixarray';

/**
 * Determine if a pattern/substring exists in a text by doing a binary
 * search on the text's Suffix Array.
 * Should only use this algorithm if the text is short.
 * This algorithm returns the start index of only 1 occurence.
 * 
 * Time complexity: O(nlogn) for SA construction & O(mlogn) for individual
 * query (m is pattern's length, n is text's length)
 * 
 * @param {string} text A string 
 * @param {string} pattern pattern/substring
 */
export const searchPatternSA = (text, pattern) => {
  if (pattern == null) return -1;
  if (pattern === '') return 0;

  const sa = new SuffixArray(text).getSuffixArray();
  const size = text.length;
  const substrLen = pattern.length;
  let start = 0;
  let end = size - 1;
  let suffixStr = '';

  // Do binary search
  while (start <= end) {
    const mid = start + ((end - start) >>> 1);
    const suffixIndex = sa[mid];
    const suffixLen = size - suffixIndex;

    // Extract part of the suffix we need to compare
    const len = suffixLen < substrLen ? suffixLen : substrLen;
    suffixStr = text.slice(suffixIndex, suffixIndex + len);

    if (suffixStr === pattern) return suffixIndex;
    if (suffixStr < pattern) start = mid + 1;
    else end = mid - 1;
  }

  return -1;
};

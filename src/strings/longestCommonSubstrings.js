import { SuffixArray } from '../datastructures/suffixarray';
import { constructLCPArray } from './longestCommonPrefixArray';
import { SlidingWindow } from '../utils/SlidingWindow';

/**
 * Find the longest common substrings of k number of strings
 * 
 * O(nlogn) (n is the total length of all the strings)
 * 
 * @param {string[]} strings An array of strings
 * @param {number} k number of strings to be compared at a time
 */
export const findLongestCommonSubstrings = (strings, k) => {
  if (!strings || !Array.isArray(strings) || strings.length < 2)
    throw new Error('Invalid string arrays');
  
  if (k == null || k < 2 || k > strings.length)
    throw new Error('Invalid k value, k >= 2 && k <= strings.length');

  let numSentinels = strings.length;
  let textLength = 0;
  for (let string of strings) textLength += string.length;
  textLength += numSentinels;

  // Builds a reverse color index map. The reverse color map tells you which
  // color a character is at a given index in the new text.
  let highestAsciiValue = Number.MIN_VALUE;
  let lowestAsciiValue = Number.MAX_VALUE;
  const imap = Array(textLength);
  for (let i = 0, k = 0; i < strings.length; i++) {
    const string = strings[i];
    for (let j = 0; j < string.length; j++){
      const asciiCode = string.charCodeAt(j);
      if (asciiCode < lowestAsciiValue) lowestAsciiValue = asciiCode;
      if (asciiCode > highestAsciiValue) highestAsciiValue = asciiCode;
      imap[k++] = i;
    }

    // Record that the sentinel belongs to string i
    imap[k++] = i;
  }

  // compute shift
  const shift = numSentinels - lowestAsciiValue;

  // Build coded text containing the shifted values and the sentinels
  // All sentinels values will be in the range [0, numSentinels)
  // All text values will be in the range [numSentinels, numSentinels + highestAsciiValue - lowestAsciiValue]
  const codedText = Array(textLength);
  for (let i = 0, k = 0, sentinel = 0; i < strings.length; i++) {
    const string = strings[i];
    for (let j = 0; j < string.length; j++)
      codedText[k++] = string.charCodeAt(j) + shift;

    codedText[k++] = sentinel++;
  }

  // Build Suffix Array & LCP array
  const sa = new SuffixArray(codedText).getSuffixArray();
  const lcp = constructLCPArray(codedText, sa);

  const window = new SlidingWindow(lcp); // Minimum Sliding Window
  const colorTrackingSet = new Set();
  let lo = numSentinels + 1; // lo and hi starts at second suffix in sa
  let hi = numSentinels + 1;
  let substringsIndexes = [];
  let maxLen = 0;

  // The suffixes starts with the sentinels will be at the top of the lcp array
  // We will just skips lcp of these suffixes and the first real suffix because
  // its lcp isn't result from comparing with any other suffixes.
  for (let i = 0; i <= numSentinels; i++) {
    window.advance();
    window.shrink();
  }

  // Because the lcp of the second suffix is from comparing the second suffix
  // with the first one, we need to include the color of the first suffix
  colorTrackingSet.add(imap[numSentinels]);

  // use the sliding window to go through lcp array to find the longest common substrings
  while (lo !== textLength - 1) {
    if (hi === textLength - 1 || colorTrackingSet.size === k) {
      colorTrackingSet.delete(imap[lo++]);
      window.shrink();
    } else {
      colorTrackingSet.add(imap[hi++]);
      window.advance();
    }

    if (colorTrackingSet.size === k) {
      const minCommonLength = window.getValue();
      if (minCommonLength > maxLen) {
        maxLen = minCommonLength;
        substringsIndexes = [];
      }
      if (minCommonLength === maxLen) substringsIndexes.push(sa[lo]);
    }
  }

  // no common substrings found
  if (maxLen === 0) return [];

  // Retrieve common substrings
  const substrings = [];
  for (let i of substringsIndexes) {
    let str = '';
    for (let j = i; j < i + maxLen; j++)
      str = str.concat(String.fromCharCode(codedText[j] - shift));
    substrings.push(str);
  }

  return substrings;
};

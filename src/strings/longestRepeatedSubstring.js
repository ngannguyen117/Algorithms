import { SuffixArray } from '../datastructures/suffixarray';
import { constructLCPArray } from './longestCommonPrefixArray';
import { convertStringToAsciiCodes } from '../utils/convertStringToAsciiCodes';

/**
 * Find the longest repeated substring(s) that occurs in a string.
 * We are only interested in substrings that appear at least twice,
 * so this method returns an empty set if this is not the case.
 * There can be multiple repeated substrings of the same length.
 * 
 * Time complexity: O(nlogn), bounded by suffix array construction
 */
export const findLongestRepeatedSubstrings = text => {
  const codedText = convertStringToAsciiCodes(text);
  const sa = new SuffixArray(codedText).getSuffixArray();
  const lcp = constructLCPArray(codedText, sa);
  let substrings = [];
  let maxLen = 0;

  for (let i = 0; i < text.length; i++)
    if (lcp[i] > 0 && lcp[i] >= maxLen) {
      // found longer lcp so clear shorter substrings
      if (lcp[i] > maxLen) substrings = [];
      maxLen = lcp[i];
      substrings.push(text.slice(sa[i], sa[i] + maxLen));
    }

  return substrings;
};

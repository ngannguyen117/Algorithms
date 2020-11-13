import { SuffixArray } from '../datastructures/suffixarray';
/**
 * Find the longest repeated substring(s) that occurs in a string.
 * We are only interested in substrings that appear at least twice,
 * so this method returns an empty set if this is not the case.
 * There can be multiple repeated substrings of the same length.
 * 
 * Time complexity: O(nlogn), bounded by suffix array construction
 */
export const findLongestRepeatedSubstrings = text => {
  const SA = new SuffixArray(text);
  const sa = SA.getSuffixArray();
  const lcp = SA.getLCPArray();
  let substrings = [];
  let maxLen = 0;
  console.log(sa, lcp)
  for (let i = 0; i < text.length; i++)
    if (lcp[i] > 0 && lcp[i] >= maxLen) {
      // found longer lcp so clear shorter substrings
      if (lcp[i] > maxLen) substrings = [];
      maxLen = lcp[i];
      substrings.push(text.slice(sa[i], sa[i] + maxLen));
    }

  return substrings;
};

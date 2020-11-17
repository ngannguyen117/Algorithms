import { SuffixArray } from '../datastructures/suffixarray';
import { constructLCPArray } from './longestCommonPrefixArray';
import { convertStringToAsciiCodes } from '../utils/convertStringToAsciiCodes';

/**
 * Find the list of unique substrings.
 * This algorithm first find SA and LCP arrays then goes through the
 * LCP array to generate substrings. O(nlogn + n^2)
 * 
 * If the text has a lot of repeting characters. The LCP array helps
 * cut down time in generating unique substrings because it skips over
 * common characters between suffixes.
 * => O(nlogn) because generating substrings could take linear time
 */
export const findUniqueSubstrings1 = text => {
  const codedText = convertStringToAsciiCodes(text);
  const sa = new SuffixArray(codedText).getSuffixArray();
  const lcp = constructLCPArray(codedText, sa);

  const substrs = [];
  for (let i = 0; i < text.length; i++) {
    const str = text.slice(sa[i]);
    for (let end = lcp[i] + 1; end <= str.length; end++)
      substrs.push(str.slice(0, end));
  }

  return substrs;
};

/**
 * Find unique substrings by generating all substrings and use a set
 * to only store unique values.
 * 
 * O(n^2)
 */
export const findUniqueSubstrings2 = text => {
  const substrs = new Set();
  for (let i = 0; i < text.length; i++)
    for (let j = 1; j <= text.length - i; j++)
      substrs.add(text.slice(i, j + i));
  return [...substrs];
};

/**
 * Find the number of unique substrings without generating the list
 * of unique substrings.
 * 
 * By using Suffix Array and LCP array
 * Time complexity is O(nlogn),
 * Space complexity O(n)
 */
export const countNumberOfUniqueSubstrings = str => {
  const codedText = convertStringToAsciiCodes(str);
  const sa = new SuffixArray(codedText).getSuffixArray();
  const lcp = constructLCPArray(codedText, sa);

  const numDuplicates = lcp.reduce((acc, val) => acc + val);
  const numSubstrs = (str.length * (str.length + 1)) / 2;
  return numSubstrs - numDuplicates;
};

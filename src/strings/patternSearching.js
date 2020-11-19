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
export const patternSearchSA = (text, pattern) => {
  if (text == null || pattern == null || pattern === '') return -1;

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
 * Time complexity: O(n + m)
 * Space complexity: O(m)
 * 
 * Example:
 *  - text: a b x a b c a b c a b y
 *  - pattern:          a b c a b y
 *  - longestMatch:    [0,0,0,1,2,0]
 * 
 *  - a b x a b c a b c a b y     i = 2
 *  - a b c a b y                 j = 2
 *        |--> mismatch, longestMatch[j - 1 = 1] is 0 => assign j = 0
 * 
 *  - a b x a b c a b c a b y     i = 2
 *  -     a b c a b y             j = 0
 *        |--> mismatch, j == 0 => assign i += 1 => i = 3
 * 
 *  - a b x a b c a b c a b y     i = 8
 *  -       a b c a b y           j = 5
 *                    |--> mismatch, longestMatch[4] is 2 => j = 2
 * 
 *  - a b x a b c a b c a b y     i = 12
 *  -             a b c a b y     j = 6
 *                            |-> j === m => found a match at index 6
 * 
 * @param {string} text A string 
 * @param {string} pattern pattern/substring
 */
export const patternSearchKMP = (text, pattern) => {
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

  if (text == null || pattern == null || pattern === '') return [];

  const n = text.length;
  const m = pattern.length;
  if (m > n) return [];

  const occurences = [];
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
      occurences.push(i - m);
      j = longestMatch[j - 1];
    }
  }

  return occurences;
};

/**
 * Find all occurences' start index of matching pattern in the text (including 
 * overlapping matching) using Boyer-Moore algorithm.
 * 
 * Boyer-Moore explanation
 *  - Basic {@link https://www.youtube.com/watch?v=4Xyhb72LCX4, https://www.youtube.com/watch?v=lkL6RkQvpMM}
 *  - Put it together {@link https://www.youtube.com/watch?v=Wj606N0IAsw}
 *  - Pseudocode {@link https://www.inf.hs-flensburg.de/lang/algorithmen/pattern/bmen.htm}
 * 
 * Time complexity:
 *  - O(m) if there are only a constant number of matches of the pattern in the text
 *  - O(nm) in general
 *  - O(n/m) if the alphabet is large compared to the length of the pattern (a shift
 *    by m is possible due to the bad character heuristics).
 * 
 * @param {string} text A string 
 * @param {string} pattern pattern/substring
 */
export const patternSearchBoyerMoore = (text, pattern) => {
  /**
   * Boyer-Moore preprocessing for bad character heuristics and good Suffix heuristics
   * 
   * suffixMatch[i] = j (j > i) means suffix starting at j is the prefix of the suffix starting at i
   * Ex of pattern abbabab
   *              0 1 2 3 4 5 6 7
   *  Pattern:    a b b a b a b
   *  suffixMatch: 5 6 4 5 6 7 7 8
   * 
   * suffixMatch[4] = 6 : suffix at index 6 'b' is the prefix 'b' of the suffix at index 4 'bab'
   * suffixMatch[2] = 4 : suffix[2] = 'babab' has prefix 'bab' that matches the suffix at index 4 'bab'
   * suffixMatch[0] = 5 : suffix[0] = 'abbabab' has prefix 'ab' that matches suffix[5] = 'ab'
   */
  const preprocess = () => {
    // Bad character rule: Generate the right most occurence index for
    // each character in the pattern
    for (let i = 0; i < m; i++) rightMostOccurence[pattern.charCodeAt(i)] = i;

    // Good Suffix rule: Generate a shift distance table
    const suffixMatch = Array(m + 1).fill(0);

    // Case 1: Exact match of good suffix exists somewhere in the pattern ('bab' in 'babab')
    i = m, j = m + 1, suffixMatch[i] = j;
    while (i > 0) {
      while (j <= m && pattern[i - 1] !== pattern[j - 1]) {
        if (shiftDistance[j] === 0) shiftDistance[j] = j - i;
        j = suffixMatch[j];
      }

      suffixMatch[--i] = --j;
    }

    // Case 2: Partial of good suffix exists as a prefix of the pattern ('ab' in 'abbabab')
    j = suffixMatch[0];
    for (i = 0; i <= m; i++) {
      if (shiftDistance[i] === 0) shiftDistance[i] = j;
      if (i === j) j = suffixMatch[j];
    }
  };

  if (text == null || pattern == null || pattern === '') return [];

  const n = text.length;
  const m = pattern.length;
  if (m > n) return [];

  const rightMostOccurence = Array(256).fill(-1); // Max alphabet size is 256
  const shiftDistance = Array(m + 1).fill(0);
  let i, j;
  preprocess();

  const occurences = [];
  for (i = 0, j = m - 1; i <= n - m; j = m - 1) {
    while (j >= 0 && pattern[j] === text[i + j]) j--;

    if (j < 0) {
      // found 1 match
      occurences.push(i);
      i += shiftDistance[0];
    } else {
      // encounter a mismatch, get the max possible shifts from the good suffix & bad char heuristics
      i += Math.max(shiftDistance[j + 1], j - rightMostOccurence[text.charCodeAt(i + j)]);
    }
  }

  return occurences;
};

/**
 * Find all occurences' start index of matching pattern in the text (including 
 * overlapping matching) using Z algorithm.
 * 
 * Time Complexity: O(n + m)
 * Space Complexity: O(n + m)
 * 
 * Explanation {@link https://www.youtube.com/watch?v=CpZh4eF8QBw}
 * 
 * Example: text 'xabcabzabc', pattern: 'abc'
 * 
 *                    0 1 2 3 4 5 6 7 8 9 10 11 12 13
 * combined string:   a b c $ x a b c a b z  a  b  c
 * Z array:           0 0 0 0 0 3 0 0 2 0 0  3  0  0
 *                              |-> match    |-> match
 * 
 * @param {string} text A string 
 * @param {string} pattern pattern/substring
 */
export const patternSearchZAlgorithm = (text, pattern) => {
  if (text == null || pattern == null || pattern === '') return [];

  const n = text.length;
  const m = pattern.length;
  if (m > n) return [];

  // Compute Z array on the combined string using Z algorithm
  const str = pattern.concat('$').concat(text);
  const len = n + m + 1;
  const Z = Array(len).fill(0);
  
  for (let i = 1, left = 0, right = 0; i < len; i++)
    if (i > right) {
      left = right = i;
      while (right < len && str[right] === str[right - left]) right++;
      Z[i] = right - left;
      right--;
    } else {
      const k = i - left; // operate inside the box

      if (Z[k] <= right - i) Z[i] = Z[k];
      else {
        left = i;
        while (right < len && str[right] === str[right - left]) right++;
        Z[i] = right - left;
        right--;
      }
    }

  // Go through the Z array to find which substrings matches the pattern
  const occurences = [];
  for (let i = m + 1; i < len; i++)
    if (Z[i] === m) occurences.push(i - m - 1);

  return occurences;
};

/**
 * Find all occurences' start index of matching pattern in the text (including 
 * overlapping matching) using Rabin Karp algorithm (rolling hash).
 * 
 * Time Complexity O(nm) (depending on hash functions)
 * Space Complexity O(1)
 * 
 * Explanation {@link https://www.youtube.com/watch?v=H4VrKHVG5qI}
 * 
 * The implementation from William Fiset {@link https://github.com/williamfiset/Algorithms/blob/master/src/main/java/com/williamfiset/algorithms/strings/RabinKarp.java}
 * ensures the hash values are unique (no collision) so when 2 hashes are equal,
 * we know for sure the pattern and substring are actually the same. So there's
 * no need to compare the 2 strings character by character, which improves the
 * time complexity to O(n + m).
 * 
 * @param {string} text A string
 * @param {string} pattern pattern/substring
 */
export const patternSearchRabinKarp = (text, pattern, prime = 100003) => {
  //--------------------- HELPER funtions ------------------------
  const computeHash = str => {
    let hash = 0;
    for (let i = 0; i < str.length; i++)
      hash += str.charCodeAt(i) * Math.pow(prime, i);
    return hash;
  };

  const recomputeTextHash = (leftInd, rightInd) => {
    textHash -= text.charCodeAt(leftInd);
    textHash /= prime;
    textHash += text.charCodeAt(rightInd) * Math.pow(prime, m - 1);
  };

  const equalsToPattern = i => {
    for (let j = 0; j < m; j++, i++)
      if (pattern[j] !== text[i]) return false;
    return true;
  };

  //---------------------- Validate input ------------------------
  if (text == null || pattern == null || pattern === '') return [];

  const n = text.length;
  const m = pattern.length;
  if (m > n) return [];

  // Compute the initial hash values
  const patternHash = computeHash(pattern);
  let textHash = computeHash(text.slice(0, m));

  // Compare patternHash with textHash
  const occurences = [];
  for (let i = 0; i <= n - m; recomputeTextHash(i, i + m), i++)
    if (patternHash === textHash && equalsToPattern(i))
      occurences.push(i);

  return occurences;
};

/**
 * Suffix Array (SA) Implementation based on William Fiset's Java implementation.
 * 
 * SA: an array which contains the sorted suffixes of a string.
 * (To save space, we store the starting index of each suffix in the SA instead of the suffix strings.)
 * 
 * Complexity: O(nlog(n))
 * 
 * Example of how the algorithm works:
 *  {@link https://www.geeksforgeeks.org/suffix-array-set-2-a-nlognlogn-algorithm/}
 * 
 * @author Ngan Nguyen, ngan.tx.nguyen@gmail.com
 * 
 * Date: 11/03/2020
 * 
 * @param {string | number[]} text text input that we need to build a SA for
 */
export function SuffixArray (text) {
  // Validate input
  if (!text) throw new Error('Text input is required');

  //-------------------------- Initialize local variables ------------------------------
  const size = text.length;
  const sa = []; // sorted suffix array which stores the starting index of the text's suffixes

  //------------ construct suffix array using prefix doubling and Radix sort --------------
  let rank = []; // rank of suffixes. Suffixes are sorted based on these values
  let alphabetSize = 256; // number of values in ascii table
  let c = Array(alphabetSize).fill(0);
  const temp = [];
  let i, r;

  // the initial rank of each suffix is its first character's ascii value, if codedText isn't provided
  if (Array.isArray(text)) rank = [...text];
  else for (i = 0; i < size; i++) rank[i] = text.charCodeAt(i);

  // use the initial ranking to sort the suffix array once
  for (i = 0; i < size; i++) c[rank[i]]++;
  for (i = 1; i < alphabetSize; i++) c[i] += c[i - 1];
  for (i = size - 1; i >= 0; --i) sa[--c[rank[i]]] = i;

  for (let p = 1; p < size; p <<= 1) {
    c = Array(alphabetSize).fill(0);

    // sorting the SA by the rank of each suffix's p-th character
    // temp array at this point holds the temporary sorted SA
    for (r = 0, i = size - p; i < size; i++) temp[r++] = i;
    for (i = 0; i < size; i++) if (sa[i] >= p) temp[r++] = sa[i] - p;

    // sort the SA by the the rank of each suffix's first character
    for (i = 0; i < size; i++) c[rank[i]]++;
    for (i = 1; i < alphabetSize; i++) c[i] += c[i - 1];
    for (i = size - 1; i >= 0; --i) sa[--c[rank[temp[i]]]] = temp[i];

    // compute new ranks, use temp array to hold values for the new ranks
    for (temp[sa[0]] = r = 0, i = 1; i < size; i++) {
      if (!(rank[sa[i - 1]] == rank[sa[i]]
          && sa[i - 1] + p < size
          && sa[i] + p < size
          && rank[sa[i - 1] + p] == rank[sa[i] + p])) r++;
      temp[sa[i]] = r;
    }
    rank = [...temp];

    if (r == size - 1) break;
    alphabetSize = r + 1; // to decrease the size of c array
  }

  //----------------------------------- Public Methods ----------------------------------
  /**
   * Get the suffix array
   * @returns {number[]} sorted suffixes' starting index
   */
  this.getSuffixArray = () => sa;
}

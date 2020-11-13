/**
 * Suffix Array (SA) Implementation along with constructing Longest Common Prefix (LCP) for the SA
 * based on William Fiset's Java implementation.
 * 
 * SA: an array which contains the sorted suffixes of a string.
 * (To save space, we store the starting index of each suffix in the SA instead of the suffix strings.)
 * 
 * LCP: an array in which every index tracks how many characters two sorted adjacient suffixes have in common
 * (lcp[1] holds common chars from sa[0] and sa[1]. That's why lcp[0] = 0)
 * 
 * Complexity:
 *  - SA construction: O(nlog(n))
 *  - LCP construction: O(n) (Kasai algorithm)
 * 
 * Example of how the algorithm works:
 *  - SA construction {@link https://www.geeksforgeeks.org/suffix-array-set-2-a-nlognlogn-algorithm/}
 *  - LCP construction {@link https://youtu.be/53VIWj8ksyI}
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
  let codedText = [];
  const lcp = [0];
  const sa = []; // sorted suffix array which stores the starting index of the text's suffixes

  //------------ construct suffix array using prefix doubling and Radix sort --------------
  let rank = []; // rank of suffixes. Suffixes are sorted based on these values
  let alphabetSize = 256; // number of values in ascii table
  let c = Array(alphabetSize).fill(0);
  const temp = [];
  let i, r;

  // the initial rank of each suffix is its first character's ascii value, if codedText isn't provided
  if (Array.isArray(text)) {
    codedText = [...text];
    rank = [...text];
  } else {
    for (i = 0; i < size; i++) rank[i] = codedText[i] = text.charCodeAt(i);
  }

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

  //------------------------ construct Longest Common Prefix Array -----------------------
  // Si: suffix string that starts at index i
  // inv[i] = j: Si has rank j in lexicographic order (or Si is at position j in SA)
  // sa[j] = i:  j-th lowest suffix in lexicographic order is Si
  const inverse = [];
  for (let i = 0; i < size; i++) inverse[sa[i]] = i;

  for (let i = 0, len = 0; i < size; i++)
    if (inverse[i] > 0) {
      const k = sa[inverse[i] - 1]; // starting index of the previous suffix in the SA

      // count number of common characters between the 2 suffixes
      while (
        i + len < size &&
        k + len < size &&
        codedText[i + len] === codedText[k + len]
      ) len++;

      lcp[inverse[i]] = len;

      // Since we're processing the longest to the shortest suffixes, we'd get the max
      // number of common characters first. So the number of common chars can only get
      // smaller after each iteration.
      if (len > 0) len--;
    }

  //----------------------------------- Public Methods ----------------------------------
  this.getSuffixArray = () => sa;
  this.getLCPArray = () => lcp;
}
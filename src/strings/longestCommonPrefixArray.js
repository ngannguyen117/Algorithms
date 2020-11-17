/**
 * Construct the Longest Common Prefix Array (LCP array)
 * 
 * LCP: an array in which every index tracks how many characters two sorted adjacient suffixes have in common
 * (lcp[1] holds common chars from sa[0] and sa[1]. That's why lcp[0] = 0)
 * 
 * O(n) (Kasai algorithm)
 * 
 * Example of how the algorithm works {@link https://youtu.be/53VIWj8ksyI}
 * 
 * @param {number[]} codedText An array of Ascii codes (converted from a string)
 * @param {number[]} sa A suffix array (sorted suffixes' starting index)
 * @returns [number[]] A LCP array
 */
export const constructLCPArray = (codedText, sa) => {
  const size = codedText.length;
  const lcp = [0];

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

  return lcp;
};

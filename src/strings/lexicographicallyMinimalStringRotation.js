/**
 * Finds the lexicographically smallest string rotations using
 * Booth's algorithm.
 * 
 * Performimg Booth's algorithm returns the earliest index of the
 * lexicographically smallest string rotation.
 * Note that comparisons are done using ASCII values, so mixing
 * lowercase and uppercase letters may give you unexpected results
 * 
 * O(n)
 */
export const findNumberOfLeastCyclicRotations = str => {
  str = str.concat(str); // Concatenate string to itself to avoid modular arithmetic
  const f = Array(str.length).fill(-1); // Failure function
  let k = 0; // Least rotation of string found so far

  for (let j = 1; j < str.length; j++) {
    const sj = str.charCodeAt(j);
    let i = f[j - k - 1];

    while (i !== -1 && sj !== str.charCodeAt(k + i + 1)) {
      if (sj < str.charCodeAt(k + i + 1)) k = j - i - 1;
      i = f[i];
    }

    if (sj !== str.charCodeAt(k + i + 1)) {
      if (sj < str.charCodeAt(k)) k = j;
      f[j - k] = -1;
    } else f[j - k] = i + 1;
  }

  return k;
};

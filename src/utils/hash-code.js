/**
 * A a simple but high quality 53-bit hash. It's quite fast, provides very good hash distribution,
 * and has significantly lower collision rates compared to any 32-bit hash. Similar to Murmur hash,
 * it uses a combination of multiplication and Xorshift to generate the hash, but not as thorough.
 *
 * Note about the big magic mumbers:
 *  - According to bryc, they are borrowed from other algorithms (L'Ecuyer, Knuth, MurmurHas)
 *  - They were found through probabilistic testing/research
 *  - They help increase the quality of the hash result
 *
 * bryc's answer can be found at {@link https://stackoverflow.com/a/52171480}
 *
 * @param {string} str a string value to be hashed
 * @param {number} seed a variable to alternate streams of the same input
 */
export const hashCode = (str, seed = 0) => {
  let h1 = 0xdeadbeef ^ seed;
  let h2 = 0x41c6ce57 ^ seed;

  for (let i = 0, ch; i < str.length; i++) {
    ch = str.charCodeAt(i);
    h1 = Math.imul(h1 ^ ch, 2654435761);
    h2 = Math.imul(h2 ^ ch, 1597334677);
  }

  h1 =
    Math.imul(h1 ^ (h1 >>> 16), 2246822507) ^
    Math.imul(h2 ^ (h2 >>> 13), 3266489909);

  h2 =
    Math.imul(h2 ^ (h2 >>> 16), 2246822507) ^
    Math.imul(h1 ^ (h1 >>> 13), 3266489909);

  return 4294967296 * (2097151 & h2) + (h1 >>> 0);
};

/**
 * A simpler string hash function
 * @param {string} str a string value to be hashed
 */
export const hashCode2 = str => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0; // convert to 32 bit integer
  }
  return hash;
};

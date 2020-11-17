import { constructLCPArray } from '../longestCommonPrefixArray';
import { SuffixArray } from '../../datastructures/suffixarray';
import { convertStringToAsciiCodes } from '../../utils/convertStringToAsciiCodes';

describe('Test longest common prefix array', () => {
  test('Valid input should give us an LCP array', () => {
    let codedText = [98, 97, 110, 97, 110, 97]; // 'banana'
    let sa = new SuffixArray(codedText).getSuffixArray();
    expect(constructLCPArray(codedText, sa)).toStrictEqual([0, 1, 3, 0, 0, 2]);

    codedText = [65, 66, 66, 65, 66, 65, 65, 66, 65, 65]; // 'ABBABAABAA'
    sa = new SuffixArray(codedText).getSuffixArray();
    expect(constructLCPArray(codedText, sa)).toStrictEqual([0, 1, 2, 1, 4, 2, 0, 3, 2, 1]);

    codedText = [65, 66, 65, 66, 65, 66, 65, 65, 66, 66]; // 'ABABABAABB'
    sa = new SuffixArray(codedText).getSuffixArray();
    expect(constructLCPArray(codedText, sa)).toStrictEqual([0, 1, 3, 5, 2, 0, 1, 2, 4, 1]);
  });

  test('Test LCP with a string of unique characters', () => {
    const ASCII_LETTERS = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const codedText = convertStringToAsciiCodes(ASCII_LETTERS);
    
    const sa = new SuffixArray(codedText).getSuffixArray();
    const lcp = constructLCPArray(codedText, sa);
    for (let i = 0; i < ASCII_LETTERS.length; i++)
      expect(lcp[i]).toBe(0);
  });

  test('Test LCP with a same-character string', () => {
    const UNIQUE_CHARS = 'KKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKK';
    const codedText = convertStringToAsciiCodes(UNIQUE_CHARS);
    
    const sa = new SuffixArray(codedText).getSuffixArray();
    const lcp = constructLCPArray(codedText, sa);
    for (let i = 0; i < UNIQUE_CHARS.length; i++)
      expect(lcp[i]).toBe(i);
  });
});

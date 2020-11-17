/**
 * Convert a string to an array of ascii codes
 * @param {string} text A string needed to be converted to Ascii codes
 */
export const convertStringToAsciiCodes = text => {
  const codedText = [];
  for (let i = 0; i < text.length; i++)
    codedText[i] = text.charCodeAt(i);
  return codedText;
};

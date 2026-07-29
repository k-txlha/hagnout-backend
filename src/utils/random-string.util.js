/**
 * Generates a random string of the specified length using characters
 * from the provided charset.
 *
 * @param {number} length - The desired length of the random string.
 * @param {string} charset - The set of characters to pick from.
 * @returns {string} A randomly generated string.
 */
const generateRandomString = (length, charset) => {
  let result = "";
  for (let i = length; i > 0; --i) {
    result += charset[Math.floor(Math.random() * charset.length)];
  }
  return result;
};

export default generateRandomString;

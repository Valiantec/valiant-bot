const ID_SEPARATOR = /[,;]/;

/**
 * Gets the first word from the supplied string
 * @param {string} text
 * @returns {string}
 */
const getFirstWord = text => {
  if (!text) {
    return '';
  }
  text = text.trimStart();
  const endIndex = text.indexOf(' ');
  return endIndex == -1 ? text : text.substring(0, endIndex);
};

/**
 * Removes the first word from the supplied string and returns the remaining text
 * @param {string} text
 * @returns {string} The remaining text
 */
const removeFirstWord = text => {
  if (!text) {
    return '';
  }
  text = text.trim();
  const startIndex = text.indexOf(' ') + 1;
  return startIndex != 0 ? text.substring(startIndex).trim() : '';
};

/**
 *
 * @param {string} ids
 * @returns {string[]}
 */
const multiIDStringToList = ids => {
  return ids.split(ID_SEPARATOR).map(id => id.trim());
};

module.exports = {
  getFirstWord,
  removeFirstWord,
  multiIDStringToList
};

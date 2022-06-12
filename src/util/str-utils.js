module.exports = {
    /**
     * Gets the first word from the supplied string
     * @param {string} text
     * @returns {string}
     */
     getFirstWord: (text) => {
        if (!text) {
            return '';
        }
        text = text.trimStart();
        const endIndex = text.indexOf(' ');
        return text.substring(0, endIndex == -1 ? text.length : endIndex);
    },

    /**
     * Removes the first word from the supplied string and returns the remaining text
     * @param {string} text
     * @returns {string} The remaining text
     */
    removeFirstWord: (text) => {
        if (!text) {
            return '';
        }
        text = text.trim();
        const startIndex = text.indexOf(' ') + 1;
        return startIndex != 0 ? text.substr(startIndex) : '';
    },
}
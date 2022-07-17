const fs = require('fs');

const DEFAULT_LOCALE = 'en';

const translations = fs
    .readdirSync(__dirname)
    .filter(file => file.endsWith('.json'))
    .map(file => require('./' + file));

function getTranslation(key, locale) {
    const dictionary = translations[locale];
    return dictionary && dictionary[key];
}

module.exports = {
    getString: (key, locale = null) =>
        (locale && getTranslation(key, locale)) ||
        translations[DEFAULT_LOCALE][key]
};

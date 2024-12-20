const path = require('path');

module.exports = {
    i18n: {
        defaultLocale: 'en',
        locales: ['en', 'nl', 'fr', 'es'],
    },
    localePath: path.resolve('./public/locales'),
};

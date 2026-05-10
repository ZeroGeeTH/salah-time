const tagLocalizations = {
  en: {
    'sports': 'Sports',
    'news': 'News',
    'technology': 'Technology',
    'health': 'Health',
    'entertainment': 'Entertainment'
  },
  es: {
    'sports': 'Deportes',
    'news': 'Noticias',
    'technology': 'Tecnología',
    'health': 'Salud',
    'entertainment': 'Entretenimiento'
  },
  fr: {
    'sports': 'Sport',
    'news': 'Actualités',
    'technology': 'Technologie',
    'health': 'Santé',
    'entertainment': 'Divertissement'
  }
};

/**
 * Localizes a tag based on the provided language
 * @param {string} tag - The tag identifier (e.g. 'sports')
 * @param {string} lang - Language code ('en', 'es', 'fr', ...)
 * @returns {string} Localized tag or the original tag if not found.
 */
function localizeTag(tag, lang = 'en') {
  const l = lang.split('-')[0];
  const localized = tagLocalizations[l] && tagLocalizations[l][tag];
  return localized || tag;
}

module.exports = { localizeTag };
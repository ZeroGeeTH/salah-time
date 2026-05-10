function validateAndNormalizeTitleJSON(input) {
  if (typeof input !== 'object' || input === null) {
    throw new Error('Input must be an object');
  }

  // Required field: title (string)
  if (!('title' in input)) {
    throw new Error('Missing required field: title');
  }

  let title = input.title;

  if (typeof title !== 'string') {
    throw new Error('The title field must be a string');
  }

  // Trim whitespace and normalize case (capitalize first letter, lowercase the rest)
  title = title.trim();
  if (title.length === 0) {
    throw new Error('Title may not be empty');
  }
  title = title.charAt(0).toUpperCase() + title.slice(1).toLowerCase();

  return { title };
}

module.exports = validateAndNormalizeTitleJSON;

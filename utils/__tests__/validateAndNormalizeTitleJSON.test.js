const validateAndNormalizeTitleJSON = require('../validateAndNormalizeTitleJSON');

describe('validateAndNormalizeTitleJSON', () => {
  it('should validate and normalize a valid title', () => {
    const input = { title: '   my Sample TITLE   ' };
    const result = validateAndNormalizeTitleJSON(input);
    expect(result).toEqual({ title: 'My sample title' });
  });

  it('should throw if input is not an object', () => {
    expect(() => validateAndNormalizeTitleJSON(null)).toThrow('Input must be an object');
    expect(() => validateAndNormalizeTitleJSON('string')).toThrow('Input must be an object');
  });

  it('should throw if title is missing', () => {
    expect(() => validateAndNormalizeTitleJSON({})).toThrow('Missing required field: title');
  });

  it('should throw if title is not a string', () => {
    expect(() => validateAndNormalizeTitleJSON({ title: 42 })).toThrow('The title field must be a string');
    expect(() => validateAndNormalizeTitleJSON({ title: {} })).toThrow('The title field must be a string');
  });

  it('should throw if title is empty or whitespace', () => {
    expect(() => validateAndNormalizeTitleJSON({ title: '   ' })).toThrow('Title may not be empty');
    expect(() => validateAndNormalizeTitleJSON({ title: '' })).toThrow('Title may not be empty');
  });

  it('should only include title in output object', () => {
    const input = { title: 'hello', extraneous: 'data' };
    const result = validateAndNormalizeTitleJSON(input);
    expect(result).toEqual({ title: 'Hello' });
    expect(Object.keys(result)).toEqual(['title']);
  });
});

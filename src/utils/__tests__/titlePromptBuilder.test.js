const titlePromptBuilder = require('../titlePromptBuilder');

describe('titlePromptBuilder', () => {
  it('generates prompt for only subject', () => {
    const result = titlePromptBuilder({ subject: 'AI assistant for code suggestions' });
    expect(result).toBe('Suggest a concise and clear title for the following subject: "AI assistant for code suggestions".');
  });

  it('generates prompt with subject and constraints', () => {
    const result = titlePromptBuilder({ subject: 'AI assistant', constraints: ['No more than 5 words', 'Should be catchy'] });
    expect(result).toBe(
      'Suggest a concise and clear title for the following subject: "AI assistant". Constraints:\n1. No more than 5 words\n2. Should be catchy'
    );
  });

  it('generates prompt with no arguments', () => {
    const result = titlePromptBuilder();
    expect(result).toBe('Suggest a concise and clear title.');
  });
});

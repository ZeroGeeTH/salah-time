function titlePromptBuilder({ subject = '', constraints = [] } = {}) {
  let prompt = 'Suggest a concise and clear title';
  if (subject) {
    prompt += ` for the following subject: "${subject}".`;
  } else {
    prompt += '.';
  }

  if (constraints && constraints.length > 0) {
    prompt += ' Constraints:';
    constraints.forEach((c, i) => {
      prompt += `\n${i + 1}. ${c}`;
    });
  }
  return prompt;
}

module.exports = titlePromptBuilder;

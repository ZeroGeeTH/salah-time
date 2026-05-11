// Architect follow-up generation prompt logic

export type FollowUpPromptContext = {
  previousInteraction: string;
  userMessage: string;
  recentArchitectNotes?: string[];
  relatedPreviousPrompts?: string[];
}

export function buildFollowUpPrompt(context: FollowUpPromptContext): string {
  let prompt = `You are the Architect AI assistant. Your job is to suggest the next helpful follow-up a user could ask based on the current conversation.\n`;
  prompt += `Previous interaction: ${context.previousInteraction}\n`;
  prompt += `User message: ${context.userMessage}\n`;

  if (context.recentArchitectNotes && context.recentArchitectNotes.length > 0) {
    prompt += `Recent Architect notes: ${context.recentArchitectNotes.join(' | ')}\n`;
  }
  if (context.relatedPreviousPrompts && context.relatedPreviousPrompts.length > 0) {
    prompt += `Related past prompts: ${context.relatedPreviousPrompts.join(' | ')}\n`;
  }

  prompt += `\nSuggest a helpful follow-up question or clarification for the user, focusing on assisting them to move forward with their flow or design.`;
  return prompt;
}

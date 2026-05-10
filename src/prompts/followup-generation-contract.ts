// Dedicated contract for follow-up generation prompt

export interface FollowupGenerationPrompt {
  context: string;
  previousQuestion: string;
  conversationHistory?: string[];
  userId?: string;
  additionalInstructions?: string;
}

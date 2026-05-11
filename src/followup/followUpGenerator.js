// Follow-up generator - dummy implementation, implement logic as needed
export async function generateFollowUp(result, context) {
  // For now, just return a generic prompt
  return {
    message: 'Would you like to run a follow-up task?',
    suggestions: ['Yes', 'No'],
    contextInfo: result.info || null
  };
}

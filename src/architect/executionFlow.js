import { executeStep } from './executeStep';
import { generateFollowUp } from '../followup/followUpGenerator';

export async function runExecutionFlow(context) {
  let result;
  try {
    // Run the main step
    result = await executeStep(context);
    // Check the result and decide if we need a follow-up
    if (result && result.needsFollowUp) {
      // Generate follow-up actions or prompts
      const followUp = await generateFollowUp(result, context);
      result.followUp = followUp;
    }
  } catch (error) {
    return {
      success: false,
      error: error.message || error.toString(),
    };
  }
  return {
    success: true,
    result,
  };
}

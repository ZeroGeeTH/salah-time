import { FollowUpPromptHandlerWithFallback, StaticPromptHandler } from '../src/follow_up_prompt_handler';

describe('FollowUpPromptHandlerWithFallback', () => {
  it('returns result from mainHandler if non-null and non-empty', async () => {
    const main = new StaticPromptHandler('Main response');
    const fallback = new StaticPromptHandler('Fallback response');
    const handler = new FollowUpPromptHandlerWithFallback(main, fallback);
    const result = await handler.handle('Some prompt');
    expect(result).toBe('Main response');
  });

  it('returns result from fallbackHandler if mainHandler is null', async () => {
    const main = new StaticPromptHandler(null);
    const fallback = new StaticPromptHandler('Fallback response');
    const handler = new FollowUpPromptHandlerWithFallback(main, fallback);
    const result = await handler.handle('Prompt');
    expect(result).toBe('Fallback response');
  });

  it('returns result from fallbackHandler if mainHandler returns an empty string', async () => {
    const main = new StaticPromptHandler('');
    const fallback = new StaticPromptHandler('Used Fallback');
    const handler = new FollowUpPromptHandlerWithFallback(main, fallback);
    const result = await handler.handle('Test');
    expect(result).toBe('Used Fallback');
  });

  it('returns null if both handlers return null', async () => {
    const main = new StaticPromptHandler(null);
    const fallback = new StaticPromptHandler(null);
    const handler = new FollowUpPromptHandlerWithFallback(main, fallback);
    const result = await handler.handle('No handlers');
    expect(result).toBeNull();
  });
});

export interface PromptHandler {
  handle(prompt: string): Promise<string | null>;
}

export class FollowUpPromptHandlerWithFallback implements PromptHandler {
  private mainHandler: PromptHandler;
  private fallbackHandler: PromptHandler;

  constructor(mainHandler: PromptHandler, fallbackHandler: PromptHandler) {
    this.mainHandler = mainHandler;
    this.fallbackHandler = fallbackHandler;
  }

  async handle(prompt: string): Promise<string | null> {
    let result: string | null = await this.mainHandler.handle(prompt);
    if (result !== null && result.trim() !== "") {
      return result;
    }
    return this.fallbackHandler.handle(prompt);
  }
}

// Simple example handlers for testing/demo:
export class StaticPromptHandler implements PromptHandler {
  private response: string | null;
  constructor(response: string | null) {
    this.response = response;
  }
  async handle(prompt: string): Promise<string | null> {
    return this.response;
  }
}

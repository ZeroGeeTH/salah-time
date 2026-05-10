/**
 * Contract (interface) for the chat-tagging module.
 * Defines methods and types for tagging chat messages.
 */

export type ChatTag = {
  id: string;
  name: string;
  description?: string;
};

export interface AddTagToMessageInput {
  messageId: string;
  tagId: string;
}

export interface RemoveTagFromMessageInput {
  messageId: string;
  tagId: string;
}

export interface GetTagsForMessageInput {
  messageId: string;
}

export interface IChatTaggingModule {
  /**
   * Lists all available chat tags.
   */
  listTags(): Promise<ChatTag[]>;

  /**
   * Adds an existing tag to a chat message.
   */
  addTagToMessage(input: AddTagToMessageInput): Promise<void>;

  /**
   * Removes a tag from a chat message.
   */
  removeTagFromMessage(input: RemoveTagFromMessageInput): Promise<void>;

  /**
   * Gets all tags for a given chat message.
   */
  getTagsForMessage(input: GetTagsForMessageInput): Promise<ChatTag[]>;
}

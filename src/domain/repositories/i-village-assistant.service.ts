import type {
  AssistantGenerateInput,
  AssistantResponse,
} from '../entities/assistant-conversation.entity.js'

export interface IVillageAssistantService {
  /**
   * Generates a grounded conversational response along with recommended action links.
   */
  generateResponse(input: AssistantGenerateInput): Promise<AssistantResponse>

  /**
   * Streams text chunks of the assistant response for interactive UX.
   */
  generateStream(input: AssistantGenerateInput): AsyncIterable<string>
}

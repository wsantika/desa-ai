export type ChatMessageRole = 'user' | 'assistant' | 'system'

export interface ChatMessage {
  role: ChatMessageRole
  content: string
}

export type ActionLinkType =
  | 'SERVICE_FORM'
  | 'COMPLAINT_FORM'
  | 'TRACKING'
  | 'INFO'

export interface ActionLink {
  label: string
  url: string
  type: ActionLinkType
  badge?: string
}

export interface GroundingSource {
  documentId: string
  documentTitle: string
  category: string
  excerpt: string
  similarityScore: number
}

export interface AssistantResponse {
  replyText: string
  actionLinks: ActionLink[]
  groundingSources: GroundingSource[]
}

export interface AssistantGenerateInput {
  query: string
  groundingContext: string
  groundingSources: GroundingSource[]
  conversationHistory?: ChatMessage[]
}

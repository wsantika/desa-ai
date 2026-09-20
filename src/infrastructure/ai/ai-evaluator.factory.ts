import type { IAIEvaluatorService } from '../../domain/repositories/i-ai-evaluator.service.js'
import { GeminiAIEvaluatorService } from './gemini-ai-evaluator.service.js'
import { MockAIEvaluatorService } from './mock-ai-evaluator.service.js'

export interface CreateAIEvaluatorOptions {
  apiKey?: string
  modelName?: string
  preferMock?: boolean
}

/**
 * Factory for creating complaint AI evaluator service instances.
 * Defaults to GeminiAIEvaluatorService if an API key is available,
 * otherwise safely falls back to MockAIEvaluatorService.
 */
export function createAIEvaluatorService(
  options?: CreateAIEvaluatorOptions,
): IAIEvaluatorService {
  if (options?.preferMock) {
    return new MockAIEvaluatorService()
  }

  const apiKey = options?.apiKey || process.env.GEMINI_API_KEY

  if (apiKey && apiKey.trim().length > 0) {
    return new GeminiAIEvaluatorService({
      apiKey: apiKey.trim(),
      modelName: options?.modelName || 'gemini-2.5-flash',
    })
  }

  return new MockAIEvaluatorService()
}

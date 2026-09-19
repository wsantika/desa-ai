export interface IEmbeddingService {
  /**
   * Generates a dense vector embedding for a single text input.
   */
  generateEmbedding(text: string): Promise<number[]>

  /**
   * Generates dense vector embeddings for multiple text inputs in batch.
   */
  generateBatchEmbeddings(texts: string[]): Promise<number[][]>
}

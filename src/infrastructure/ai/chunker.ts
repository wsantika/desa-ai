export interface ChunkerOptions {
  maxChunkSize?: number
  chunkOverlap?: number
  separator?: string
}

const DEFAULT_MAX_CHUNK_SIZE = 450
const DEFAULT_CHUNK_OVERLAP = 50

/**
 * Splits markdown/plain-text document into semantic chunks suitable for RAG embedding.
 * Prioritizes splitting on markdown headings (#), paragraphs (\n\n), bullet points, and sentences.
 */
export function chunkDocumentText(
  text: string,
  options?: ChunkerOptions,
): string[] {
  const maxChunkSize = options?.maxChunkSize ?? DEFAULT_MAX_CHUNK_SIZE
  const chunkOverlap = options?.chunkOverlap ?? DEFAULT_CHUNK_OVERLAP

  if (!text || text.trim().length === 0) {
    return []
  }

  const cleanText = text.replace(/\r\n/g, '\n').trim()

  if (cleanText.length <= maxChunkSize) {
    return [cleanText]
  }

  // 1. Break text by markdown sections / paragraphs first
  const rawSections = cleanText.split(/(?=\n#{1,3}\s)|\n\n+/)
  const sections: string[] = []

  for (const raw of rawSections) {
    const trimmed = raw.trim()
    if (!trimmed) continue

    if (trimmed.length <= maxChunkSize) {
      sections.push(trimmed)
    } else {
      // If a single paragraph is too long, split by sentences or newlines
      const sentences = trimmed.split(/(?<=[.!?。])\s+|\n/)
      let currentSub = ''

      for (const sentence of sentences) {
        const sTrimmed = sentence.trim()
        if (!sTrimmed) continue

        if ((currentSub + ' ' + sTrimmed).trim().length <= maxChunkSize) {
          currentSub = (currentSub + ' ' + sTrimmed).trim()
        } else {
          if (currentSub) sections.push(currentSub)
          currentSub = sTrimmed
        }
      }
      if (currentSub) sections.push(currentSub)
    }
  }

  // 2. Combine small sections into chunks with overlap
  const finalChunks: string[] = []
  let currentChunk = ''

  for (const sec of sections) {
    if (!currentChunk) {
      currentChunk = sec
      continue
    }

    const prospectiveLength = currentChunk.length + 1 + sec.length

    if (prospectiveLength <= maxChunkSize) {
      currentChunk += '\n\n' + sec
    } else {
      finalChunks.push(currentChunk.trim())

      // Create overlap from the tail of currentChunk
      if (chunkOverlap > 0 && currentChunk.length > chunkOverlap) {
        const overlapSlice = currentChunk.slice(-chunkOverlap).trim()
        currentChunk = overlapSlice ? overlapSlice + ' ' + sec : sec
      } else {
        currentChunk = sec
      }
    }
  }

  if (currentChunk.trim()) {
    finalChunks.push(currentChunk.trim())
  }

  return finalChunks.filter((c) => c.length > 0)
}

import { prisma } from '../db/prisma.js'
import type { PrismaClient } from '../db/prisma.js'
import type {
  KnowledgeCategory,
  KnowledgeDocumentEntity,
} from '../../domain/entities/knowledge.entity.js'
import type {
  CreateKnowledgeDocumentInput,
  IKnowledgeRepository,
  KnowledgeChunkWithDocument,
} from '../../domain/repositories/i-knowledge.repository.js'

export class PrismaKnowledgeRepository implements IKnowledgeRepository {
  constructor(private readonly client: PrismaClient = prisma) {}

  async findById(id: string): Promise<KnowledgeDocumentEntity | null> {
    const doc = await this.client.knowledgeDocument.findUnique({
      where: { id },
      include: {
        chunks: {
          orderBy: { chunkIndex: 'asc' },
        },
      },
    })

    if (!doc) return null
    return this.toDomainEntity(doc)
  }

  async listDocuments(filter?: {
    category?: KnowledgeCategory
    isPublished?: boolean
  }): Promise<KnowledgeDocumentEntity[]> {
    const docs = await this.client.knowledgeDocument.findMany({
      where: {
        ...(filter?.category ? { category: filter.category } : {}),
        ...(filter?.isPublished !== undefined
          ? { isPublished: filter.isPublished }
          : {}),
      },
      include: {
        chunks: {
          orderBy: { chunkIndex: 'asc' },
        },
      },
      orderBy: { createdAt: 'desc' },
    })

    return docs.map((d) => this.toDomainEntity(d))
  }

  async saveDocumentWithChunks(
    input: CreateKnowledgeDocumentInput,
  ): Promise<KnowledgeDocumentEntity> {
    return this.client.$transaction(async (tx) => {
      let docId = input.id

      if (docId) {
        // Upsert if ID is provided
        const updated = await tx.knowledgeDocument.upsert({
          where: { id: docId },
          update: {
            title: input.title,
            category: input.category,
            sourceUrl: input.sourceUrl ?? null,
            contentText: input.contentText,
            metadata: input.metadata
              ? JSON.parse(JSON.stringify(input.metadata))
              : undefined,
            isPublished: input.isPublished ?? true,
          },
          create: {
            id: docId,
            title: input.title,
            category: input.category,
            sourceUrl: input.sourceUrl ?? null,
            contentText: input.contentText,
            metadata: input.metadata
              ? JSON.parse(JSON.stringify(input.metadata))
              : undefined,
            isPublished: input.isPublished ?? true,
          },
        })
        docId = updated.id
      } else {
        const created = await tx.knowledgeDocument.create({
          data: {
            title: input.title,
            category: input.category,
            sourceUrl: input.sourceUrl ?? null,
            contentText: input.contentText,
            metadata: input.metadata
              ? JSON.parse(JSON.stringify(input.metadata))
              : undefined,
            isPublished: input.isPublished ?? true,
          },
        })
        docId = created.id
      }

      // Replace chunks for the document
      await tx.knowledgeChunk.deleteMany({
        where: { documentId: docId },
      })

      if (input.chunks && input.chunks.length > 0) {
        await tx.knowledgeChunk.createMany({
          data: input.chunks.map((c) => ({
            documentId: docId,
            chunkIndex: c.chunkIndex,
            chunkContent: c.chunkContent,
            embedding: c.embedding ?? [],
          })),
        })
      }

      const refreshed = await tx.knowledgeDocument.findUniqueOrThrow({
        where: { id: docId },
        include: {
          chunks: {
            orderBy: { chunkIndex: 'asc' },
          },
        },
      })

      return this.toDomainEntity(refreshed)
    })
  }

  async getAllChunksWithEmbeddings(): Promise<KnowledgeChunkWithDocument[]> {
    const chunks = await this.client.knowledgeChunk.findMany({
      include: {
        document: {
          select: {
            id: true,
            title: true,
            category: true,
            metadata: true,
            isPublished: true,
          },
        },
      },
      where: {
        document: {
          isPublished: true,
        },
      },
      orderBy: { chunkIndex: 'asc' },
    })

    return chunks.map((c) => ({
      id: c.id,
      documentId: c.documentId,
      chunkIndex: c.chunkIndex,
      chunkContent: c.chunkContent,
      embedding: c.embedding,
      createdAt: c.createdAt,
      document: {
        id: c.document.id,
        title: c.document.title,
        category: c.document.category,
        metadata: c.document.metadata,
      },
    }))
  }

  async deleteDocument(id: string): Promise<void> {
    await this.client.knowledgeDocument.delete({
      where: { id },
    })
  }

  private toDomainEntity(raw: {
    id: string
    title: string
    category: string
    sourceUrl: string | null
    contentText: string
    metadata: unknown
    isPublished: boolean
    createdAt: Date
    updatedAt: Date
    chunks?: Array<{
      id: string
      documentId: string
      chunkIndex: number
      chunkContent: string
      embedding: number[]
      createdAt: Date
    }>
  }): KnowledgeDocumentEntity {
    return {
      id: raw.id,
      title: raw.title,
      category: raw.category as KnowledgeCategory,
      sourceUrl: raw.sourceUrl,
      contentText: raw.contentText,
      metadata:
        raw.metadata && typeof raw.metadata === 'object'
          ? (raw.metadata as Record<string, unknown>)
          : null,
      isPublished: raw.isPublished,
      createdAt: raw.createdAt,
      updatedAt: raw.updatedAt,
      chunks: raw.chunks
        ? raw.chunks.map((c) => ({
            id: c.id,
            documentId: c.documentId,
            chunkIndex: c.chunkIndex,
            chunkContent: c.chunkContent,
            embedding: c.embedding,
            createdAt: c.createdAt,
          }))
        : undefined,
    }
  }
}

import { prisma } from '../src/infrastructure/db/prisma.js'
import { GeminiEmbeddingService } from '../src/infrastructure/ai/gemini-embedding.service.js'
import { chunkDocumentText } from '../src/infrastructure/ai/chunker.js'

async function syncEmbeddings() {
  console.log('\n🧠 ========================================================')
  console.log('   SYNC VECTOR EMBEDDINGS FOR VILLAGE KNOWLEDGE BASE')
  console.log('========================================================\n')

  const apiKey = process.env.GEMINI_API_KEY
  if (!apiKey) {
    console.warn('⚠️  GEMINI_API_KEY tidak ditemukan, menggunakan fallback vector embedding.')
  }

  const embeddingService = new GeminiEmbeddingService({ apiKey })
  const docs = await prisma.knowledgeDocument.findMany()

  console.log(`📚 Menemukan ${docs.length} dokumen dalam basis data...`)

  for (const doc of docs) {
    console.log(`\n🔹 Memproses: [${doc.category}] ${doc.title}`)

    // 1. Chunk text
    const chunks = chunkDocumentText(doc.contentText, {
      maxChunkSize: 400,
      chunkOverlap: 50,
    })

    console.log(`   ✂️  Dihasilkan ${chunks.length} potongan semantik (chunks).`)
    console.log(`   🔮 Mengenerate vector embeddings...`)

    // 2. Generate embeddings
    const embeddings = await embeddingService.generateBatchEmbeddings(chunks)

    // 3. Clear old chunks and insert new embedded chunks
    await prisma.knowledgeChunk.deleteMany({
      where: { documentId: doc.id },
    })

    await prisma.knowledgeChunk.createMany({
      data: chunks.map((chunkContent, idx) => ({
        documentId: doc.id,
        chunkIndex: idx + 1,
        chunkContent,
        embedding: embeddings[idx] || [],
      })),
    })

    console.log(`   ✅ Selesai mengindeks dokumen: ${doc.id}`)
  }

  console.log('\n========================================================')
  console.log('🎉 Sinkronisasi seluruh vector embeddings selesai!')
  console.log('========================================================\n')
}

syncEmbeddings()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect()
  })

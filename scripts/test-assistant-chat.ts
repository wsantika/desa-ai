import { PrismaKnowledgeRepository } from '../src/infrastructure/repositories/prisma-knowledge.repository.js'
import { GeminiEmbeddingService } from '../src/infrastructure/ai/gemini-embedding.service.js'
import { GeminiAssistantService } from '../src/infrastructure/ai/gemini-assistant.service.js'
import { SearchKnowledgeUseCase } from '../src/application/use-cases/search-knowledge.use-case.js'
import { AskVillageAssistantUseCase } from '../src/application/use-cases/ask-village-assistant.use-case.js'

async function runAssistantDemo() {
  console.log('\n🤖 ========================================================')
  console.log('   DESAAI VILLAGE ASSISTANT CONVERSATIONAL SERVICE DEMO')
  console.log('========================================================\n')

  const apiKey = process.env.GEMINI_API_KEY
  if (!apiKey) {
    console.warn('⚠️  GEMINI_API_KEY tidak ditemukan, menggunakan mode fallback offline.')
  }

  const knowledgeRepo = new PrismaKnowledgeRepository()
  const embeddingService = new GeminiEmbeddingService({ apiKey })
  const searchUseCase = new SearchKnowledgeUseCase(knowledgeRepo, embeddingService)
  const assistantService = new GeminiAssistantService({ apiKey })

  const assistantUseCase = new AskVillageAssistantUseCase(
    searchUseCase,
    assistantService,
  )

  const customQuery = process.argv.slice(2).join(' ')
  const queries = customQuery
    ? [customQuery]
    : [
        'Halo bli Made, syarat dan alur pembuatan surat keterangan domisili apa saja ya?',
        'Berapa biaya pengurusan surat di desa dan jam berapa kantor desa buka hari kerja?',
        'Bagaimana aturan pemilahan sampah di desa mandara dan kapan jadwal angkutnya?',
      ]

  for (let i = 0; i < queries.length; i++) {
    const q = queries[i]
    console.log('--------------------------------------------------------')
    console.log(`[Percakapan ${i + 1}/${queries.length}]`)
    console.log(`👤 Warga : "${q}"`)
    console.log(`⏳ Asisten sedang mencari dokumen SOP dan merangkai jawaban...\n`)

    const start = Date.now()
    const response = await assistantUseCase.execute({ query: q })
    const timeMs = Date.now() - start

    console.log(`🤖 Made Mandara (${timeMs} ms):`)
    console.log(`${response.replyText}\n`)

    if (response.actionLinks.length > 0) {
      console.log(`🔗 Rekomendasi Tombol / Formulir Terkait:`)
      response.actionLinks.forEach((link) => {
        console.log(`   👉 [${link.label}] ➜ URL: ${link.url} (${link.badge || link.type})`)
      })
      console.log('')
    }

    if (response.groundingSources.length > 0) {
      console.log(`📚 Dokumen RAG yang Dijadikan Sumber Rujukan:`)
      response.groundingSources.forEach((src, idx) => {
        console.log(`   [${idx + 1}] ${src.documentTitle} (Relevansi: ${(src.similarityScore * 100).toFixed(1)}%)`)
      })
      console.log('')
    }
  }

  console.log('========================================================')
  console.log('✅ Demonstrasi percakapan Village Assistant selesai!')
  console.log('========================================================\n')
}

runAssistantDemo()
  .catch(console.error)

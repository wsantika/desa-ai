import { PrismaKnowledgeRepository } from '../src/infrastructure/repositories/prisma-knowledge.repository.js'
import { GeminiEmbeddingService } from '../src/infrastructure/ai/gemini-embedding.service.js'
import { SearchKnowledgeUseCase } from '../src/application/use-cases/search-knowledge.use-case.js'

async function runRAGDemo() {
  console.log('\n🔎 ========================================================')
  console.log('   DESAAI RAG PIPELINE & SEMANTIC SEARCH DEMO')
  console.log('========================================================\n')

  const apiKey = process.env.GEMINI_API_KEY
  if (!apiKey) {
    console.warn('⚠️  GEMINI_API_KEY tidak ditemukan, menggunakan fallback vector.')
  }

  const repo = new PrismaKnowledgeRepository()
  const embedding = new GeminiEmbeddingService({ apiKey })
  const searchUseCase = new SearchKnowledgeUseCase(repo, embedding)

  // Custom CLI argument or preset queries
  const customQuery = process.argv.slice(2).join(' ')

  const queries = customQuery
    ? [customQuery]
    : [
        'Bagaimana alur dan syarat permohonan surat keterangan domisili atau SKU?',
        'Kapan jadwal pengangkutan sampah residu di lingkungan desa dan sanksinya?',
        'Jam berapa kantor desa mandara buka hari kerja dan di mana alamatnya?',
      ]

  for (let i = 0; i < queries.length; i++) {
    const q = queries[i]
    console.log(`--------------------------------------------------------`)
    console.log(`[Pertanyaan ${i + 1}/${queries.length}] Warga: "${q}"`)
    console.log(`Mencari potongan dokumen SOP desa yang relevan...`)

    const start = Date.now()
    const results = await searchUseCase.execute({
      query: q,
      topK: 2,
      minSimilarityThreshold: 0.25,
    })
    const timeMs = Date.now() - start

    console.log(`\n📚 Ditemukan ${results.length} potongan dokumen relevan (${timeMs} ms):`)

    if (results.length === 0) {
      console.log('   (Tidak ditemukan dokumen dengan relevansi memadai)')
    } else {
      results.forEach((r, idx) => {
        const scorePct = (r.similarityScore * 100).toFixed(1)
        console.log(`\n   [Hasil #${idx + 1}] Relevansi: ${scorePct}%`)
        console.log(`   📄 Dokumen : ${r.documentTitle} [${r.category}]`)
        console.log(`   📝 Kutipan : "${r.chunkContent}"`)
      })
    }
    console.log('')
  }

  console.log('========================================================')
  console.log('✅ Demonstrasi pencarian RAG selesai!')
  console.log('========================================================\n')
}

runRAGDemo().catch(console.error)

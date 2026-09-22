import { GeminiAIEvaluatorService } from '../src/infrastructure/ai/gemini-ai-evaluator.service.js'

async function runDemo() {
  console.log('\n🚀 ========================================================')
  console.log('   DESAAI COMPLAINT INTELLIGENCE & TRIAGE ENGINE DEMO')
  console.log('========================================================\n')

  const apiKey = process.env.GEMINI_API_KEY
  if (!apiKey) {
    console.error('❌ Error: GEMINI_API_KEY tidak ditemukan di environment!')
    console.error('   Pastikan menjalankan dengan: node --env-file=.env.local --import tsx scripts/test-complaint-ai.ts\n')
    process.exit(1)
  }

  const evaluator = new GeminiAIEvaluatorService({
    apiKey,
    modelName: 'gemini-2.5-flash',
  })

  // Custom user input from CLI arguments if provided:
  // e.g.: node --env-file=.env.local --import tsx scripts/test-complaint-ai.ts "Judul" "Deskripsi" "Lokasi"
  const args = process.argv.slice(2)
  if (args.length >= 2) {
    const [customTitle, customDesc, customLoc] = args
    console.log(`📌 Menguji Laporan Kustom dari Argumen CLI:`)
    console.log(`   Judul    : "${customTitle}"`)
    console.log(`   Deskripsi: "${customDesc}"`)
    console.log(`   Lokasi   : "${customLoc || 'Tidak dispesifikasikan'}"`)
    console.log('   Sedang memproses dengan Gemini AI...\n')

    const start = Date.now()
    const res = await evaluator.evaluateComplaint(customTitle, customDesc, customLoc)
    const timeMs = Date.now() - start

    printResult(res, timeMs)
    return
  }

  // Pre-configured realistic test cases:
  const testCases = [
    {
      label: 'Skenario 1: Kriteria Penerimaan Issue #8 (Infrastruktur & High)',
      title: 'Lampu jalan padam',
      description: 'Lampu jalan di Banjar Kaja mati sudah 3 hari, jalanan gelap gulita dan rawan bahaya malam hari.',
      location: 'Banjar Kaja, Jl. Kenanga RT 02',
    },
    {
      label: 'Skenario 2: Darurat Bencana / Emergency',
      title: 'Jembatan ambruk tergerus banjir',
      description: 'Jembatan penghubung utama antar banjar amblas terputus total diterjang luapan sungai bandang, akses lumpuh.',
      location: 'Banjar Kelod, Perbatasan Sungai Tukad',
    },
    {
      label: 'Skenario 3: Lingkungan & Kebersihan',
      title: 'Tumpukan sampah liar dan bau busuk',
      description: 'Banyak sampah residu dibuang sembarangan di bantaran got saluran irigasi, air meluap dan bau menyengat.',
      location: 'Banjar Tengah, Belakang Balai Banjar',
    },
    {
      label: 'Skenario 4: Keamanan & Ketertiban',
      title: 'Percobaan pencurian malam hari',
      description: 'Ada oknum mencurigakan mencoba membobol gembok pos kamling dan sepeda motor warga tadi subuh.',
      location: 'Banjar Kangin, Pos Ronda 01',
    },
    {
      label: 'Skenario 5: Bantuan Sosial & Pelayanan',
      title: 'Keluhan verifikasi data penerima BLT Desa',
      description: 'Warga lansia kurang mampu di sebelah rumah belum masuk daftar penerima BLT dana desa tahap ini.',
      location: 'Banjar Kaja, Gang Melati',
    },
  ]

  for (let i = 0; i < testCases.length; i++) {
    const tc = testCases[i]
    console.log(`--------------------------------------------------------`)
    console.log(`[Kasus ${i + 1}/5] ${tc.label}`)
    console.log(`Judul    : "${tc.title}"`)
    console.log(`Deskripsi: "${tc.description}"`)
    console.log(`Lokasi   : "${tc.location}"`)
    console.log(`Menganalisis...`)

    const start = Date.now()
    const result = await evaluator.evaluateComplaint(
      tc.title,
      tc.description,
      tc.location,
    )
    const timeMs = Date.now() - start

    printResult(result, timeMs)
  }

  console.log('========================================================')
  console.log('✅ Seluruh skenario pengujian berhasil dievaluasi!')
  console.log('========================================================\n')
}

function printResult(
  result: {
    category: string
    priority: string
    confidenceScore: number
    summary: string
    recommendedAction: string
  },
  timeMs: number,
) {
  const priorityEmoji =
    result.priority === 'EMERGENCY'
      ? '🚨 [EMERGENCY]'
      : result.priority === 'HIGH'
        ? '⚠️  [HIGH]'
        : result.priority === 'MEDIUM'
          ? '⚡ [MEDIUM]'
          : 'ℹ️  [LOW]'

  console.log(`\n📊 Hasil AI Triage (${timeMs} ms):`)
  console.log(`   🏷️  Kategori          : ${result.category}`)
  console.log(`   🎯 Prioritas         : ${priorityEmoji}`)
  console.log(`   📈 Keyakinan (Score) : ${(result.confidenceScore * 100).toFixed(0)}%`)
  console.log(`   📝 Ringkasan 1 Baris : "${result.summary}"`)
  console.log(`   💡 Tindakan Taktis   : "${result.recommendedAction}"\n`)
}

runDemo().catch(console.error)

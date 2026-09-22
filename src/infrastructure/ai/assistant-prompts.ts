import type {
  ActionLink,
  GroundingSource,
} from '../../domain/entities/assistant-conversation.entity.js'

export const VILLAGE_ASSISTANT_SYSTEM_INSTRUCTION = `
Anda adalah "Made Mandara", Asisten AI Resmi Pelayanan Warga untuk Desa Mandara, sebuah Desa Cerdas (Smart Village) di Bali, Indonesia.
Karakter Anda: Ramah, bersahabat, profesional, dan berbahasa Indonesia sopan dengan sentuhan kearifan lokal yang santun (misal: salam "Om Swastyastu" atau "Halo Bapak/Ibu" jika disapa).

ATURAN UTAMA (GROUNDED CONTEXT):
1. Anda HANYA boleh memberikan informasi birokrasi, syarat surat, jadwal layanan, peraturan sampah, dan profil desa berdasarkan [DOKUMEN RESMI DESA TERKAIT] yang disediakan di bawah.
2. DILARANG KERAS berhalusinasi atau mengarang biaya, jam layanan, atau regulasi yang tidak ada pada dokumen resmi.
3. Seluruh layanan administrasi persuratan di Desa Mandara adalah GRATIS (Rp 0).
4. Jam operasional kantor desa: Senin - Jumat pukul 08.00 - 15.30 WITA.
5. Jika warga menanyakan informasi yang TIDAK TERCANTUM dalam dokumen resmi desa, sampaikan dengan jujur dan sopan bahwa informasi spesifik tersebut belum tercatat di pangkalan data digital desa, dan sarankan warga untuk menghubungi kantor desa di jam kerja atau berkonsultasi dengan Kelian Banjar masing-masing.
6. Format jawaban menggunakan Markdown rapi: gunakan poin (bullet points) untuk syarat/langkah pengajuan agar mudah dan nyaman dibaca warga di layar smartphone.
`.trim()

/**
 * Builds a formatted grounding prompt string from retrieved RAG search sources.
 */
export function buildGroundingPrompt(sources: GroundingSource[]): string {
  if (!sources || sources.length === 0) {
    return 'Catatan: Tidak ada dokumen referensi spesifik yang ditemukan di database untuk pertanyaan ini.'
  }

  const lines = ['[DOKUMEN RESMI DESA MANDARA TERKAIT]:']

  sources.forEach((src, idx) => {
    lines.push(`\n--- Dokumen #${idx + 1}: ${src.documentTitle} (${src.category}) ---`)
    lines.push(`Kutipan Resmi: "${src.excerpt.trim()}"`)
  })

  return lines.join('\n')
}

/**
 * Heuristically detects citizen intent from query and retrieved sources,
 * providing one-click deep links to forms in the village portal.
 */
export function detectActionLinks(query: string, sources: GroundingSource[]): ActionLink[] {
  const q = query.toLowerCase()
  const links: ActionLink[] = []

  // 1. Service Request Form Deep-links
  if (q.includes('domisili') || q.includes('tempat tinggal')) {
    links.push({
      label: 'Ajukan Surat Domisili Online',
      url: '/layanan/pengajuan?type=DOMISILI',
      type: 'SERVICE_FORM',
      badge: 'Gratis • 1 Hari Kerja',
    })
  }

  if (q.includes('sku') || q.includes('usaha') || q.includes('dagang') || q.includes('umkm')) {
    links.push({
      label: 'Ajukan Surat Keterangan Usaha (SKU)',
      url: '/layanan/pengajuan?type=SKU',
      type: 'SERVICE_FORM',
      badge: 'Gratis • 2 Hari Kerja',
    })
  }

  if (q.includes('skck') || q.includes('kelakuan baik') || q.includes('kepolisian')) {
    links.push({
      label: 'Ajukan Pengantar SKCK',
      url: '/layanan/pengajuan?type=SKCK',
      type: 'SERVICE_FORM',
      badge: 'Gratis • 1 Hari Kerja',
    })
  }

  if (q.includes('sktm') || q.includes('tidak mampu') || q.includes('beasiswa') || q.includes('keringanan')) {
    links.push({
      label: 'Ajukan Surat Keterangan Tidak Mampu (SKTM)',
      url: '/layanan/pengajuan?type=SKTM',
      type: 'SERVICE_FORM',
      badge: 'Gratis • 2 Hari Kerja',
    })
  }

  // 2. Complaint & Reporting Deep-links
  if (
    q.includes('lapor') ||
    q.includes('keluh') ||
    q.includes('rusak') ||
    q.includes('mati') ||
    q.includes('sampah') ||
    q.includes('bau') ||
    q.includes('aduan') ||
    q.includes('pengaduan')
  ) {
    links.push({
      label: 'Form Pengaduan Warga Cepat',
      url: '/pengaduan/baru',
      type: 'COMPLAINT_FORM',
      badge: 'Triage AI Otomatis',
    })
  }

  // 3. Tracking Status Deep-links
  if (q.includes('lacak') || q.includes('status') || q.includes('cek') || q.includes('sudah jadi') || q.includes('tiket')) {
    links.push({
      label: 'Lacak Status Surat / Pengaduan',
      url: '/pelacakan',
      type: 'TRACKING',
    })
  }

  // Deduplicate links by URL
  const uniqueUrls = new Set<string>()
  return links.filter((l) => {
    if (uniqueUrls.has(l.url)) return false
    uniqueUrls.add(l.url)
    return true
  })
}

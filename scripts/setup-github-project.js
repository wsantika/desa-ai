// scripts/setup-github-project.js
import { execSync } from 'child_process'

const REPO = 'wsantika/desa-ai'
const token = execSync('gh auth token').toString().trim()

if (!token) {
  console.error('Error: GitHub CLI token not found. Please run gh auth login.')
  process.exit(1)
}

const headers = {
  Accept: 'application/vnd.github+json',
  Authorization: `Bearer ${token}`,
  'User-Agent': 'DesaAI-Setup-Script',
  'X-GitHub-Api-Version': '2022-11-28',
}

async function api(endpoint, method = 'GET', data = null) {
  const url = `https://api.github.com/repos/${REPO}${endpoint}`
  const options = {
    method,
    headers: {
      ...headers,
      ...(data ? { 'Content-Type': 'application/json' } : {}),
    },
  }
  if (data) options.body = JSON.stringify(data)

  const res = await fetch(url, options)
  const body = await res.json()
  if (!res.ok) {
    throw new Error(`GitHub API Error [${res.status}]: ${JSON.stringify(body)}`)
  }
  return body
}

// 1. LABELS DEFINITION
const labels = [
  // Phases
  { name: 'phase:1-foundation', color: '0E8A16', description: 'Phase 1: Setup, Docs, Docker & CI/CD' },
  { name: 'phase:2-data-backend', color: '1D76DB', description: 'Phase 2: Database Schema & Backend Core' },
  { name: 'phase:3-ai-rag', color: '5319E7', description: 'Phase 3: AI Classifier & RAG Knowledge Base' },
  { name: 'phase:4-citizen-ui', color: 'D93F0B', description: 'Phase 4: Citizen Platform Web & PWA' },
  { name: 'phase:5-gov-dashboard', color: 'B60205', description: 'Phase 5: Government Dashboard & Village Analytics' },
  { name: 'phase:6-demo-polish', color: 'FBCA04', description: 'Phase 6: Seed Data, Testing & Pitch Deck' },

  // Types
  { name: 'type:feat', color: '0052CC', description: 'Fitur baru / New feature' },
  { name: 'type:fix', color: 'D73A4A', description: 'Perbaikan bug / Bug fix' },
  { name: 'type:docs', color: '0075CA', description: 'Dokumentasi & spesifikasi' },
  { name: 'type:infra', color: 'F9D0C4', description: 'Docker, CI/CD, deployment' },
  { name: 'type:arch', color: 'BFD4F2', description: 'Clean architecture & refactoring' },
  { name: 'type:test', color: 'C2E0C6', description: 'Testing & QA verification' },

  // Scopes
  { name: 'scope:ai', color: '7057FF', description: 'AI Assistant & Intelligent Triage' },
  { name: 'scope:rag', color: '6F42C1', description: 'Vector Embeddings & Knowledge Base' },
  { name: 'scope:complaint', color: 'E99695', description: 'Modul Pengaduan Warga' },
  { name: 'scope:service', color: 'FEF2C0', description: 'Modul Pengajuan Layanan Surat' },
  { name: 'scope:analytics', color: 'BFDADC', description: 'Statistik & Analitik Desa' },
  { name: 'scope:db', color: '006B75', description: 'Prisma ORM & PostgreSQL' },
  { name: 'scope:auth', color: 'D4C5F9', description: 'Autentikasi & Role-Based Access' },

  // Priorities
  { name: 'priority:critical', color: 'B60205', description: 'Kritis / Wajib untuk MVP Hackathon' },
  { name: 'priority:high', color: 'D93F0B', description: 'Prioritas tinggi' },
  { name: 'priority:medium', color: 'FBCA04', description: 'Prioritas sedang' },
  { name: 'priority:low', color: 'C5DEF5', description: 'Prioritas rendah / Nice-to-have' },
]

// 2. MILESTONES DEFINITION
const milestones = [
  {
    title: 'Phase 1: Project Setup, Documentation & Foundation',
    description: 'Setup awal repositori, arsitektur Clean Architecture, dokumen teknis (PRD, ERD, Use Case, Activity), Docker multi-platform, dan CI/CD GitHub Actions.',
    due_on: '2026-09-25T23:59:59Z',
  },
  {
    title: 'Phase 2: Data Model & Backend Core Architecture',
    description: 'Implementasi skema basis data Prisma PostgreSQL lengkap (ServiceRequest, Complaint, Banjar, KnowledgeBase), Domain Repositories, dan Application Use Cases.',
    due_on: '2026-10-05T23:59:59Z',
  },
  {
    title: 'Phase 3: AI Engine & RAG Knowledge Pipeline',
    description: 'Pembangunan AI Village Assistant RAG berbasis dokumen SOP resmi desa, serta AI Complaint Intelligence untuk klasifikasi otomatis dan penentuan skor urgensi.',
    due_on: '2026-10-15T23:59:59Z',
  },
  {
    title: 'Phase 4: Citizen Platform UI (PWA & Self-Service)',
    description: 'Antarmuka sisi warga (mobile-first / PWA): Konsultasi AI Assistant desa, formulir pengajuan surat mandiri, formulir pengaduan cerdas, dan pelacakan tiket status.',
    due_on: '2026-10-25T23:59:59Z',
  },
  {
    title: 'Phase 5: Government Dashboard & Village Analytics',
    description: 'Pusat kendali perangkat desa: Triage board pengaduan AI, verifikasi berkas permohonan surat, analitik tren sebaran masalah desa, dan manajemen Knowledge Base.',
    due_on: '2026-11-05T23:59:59Z',
  },
  {
    title: 'Phase 6: Seed Data, Testing & Hackathon Pitch Polish',
    description: 'Penyusunan seed data realistis desa di Bali, uji coba end-to-end closed-loop citizen-to-government, rekaman video demonstrasi, dan persiapan pitching juri.',
    due_on: '2026-11-15T23:59:59Z',
  },
]

// 3. ISSUES DEFINITION
const issues = [
  // --- PHASE 1 ---
  {
    title: '[Phase 1] Dokumentasi Lengkap: PRD, Clean Architecture, ERD, Use Case & Activity Diagram',
    milestone: 'Phase 1: Project Setup, Documentation & Foundation',
    labels: ['phase:1-foundation', 'type:docs', 'priority:critical'],
    body: `## 📌 Deskripsi Tugas
Membuat dokumen teknis terpadu sebagai pedoman pengembangan sistem DesaAI untuk APTIKOM Hackathon 2026.

## 🎯 Lingkup Pekerjaan
- [x] Product Requirements Document (\`docs/PRD.md\`)
- [x] Clean Architecture Guide & Layer Rules (\`docs/CLEAN_ARCHITECTURE.md\`)
- [x] Use Case Diagram & Activity Diagrams (\`docs/ARCHITECTURE_AND_DIAGRAMS.md\`)
- [x] Database Schema & ERD Mermaid (\`docs/DATABASE_SCHEMA.md\`)
- [x] GitFlow & Conventional Commits Guide (\`docs/GITFLOW_AND_CONVENTIONS.md\`)
- [x] Infrastructure & Docker Cross-Platform Guide (\`docs/INFRASTRUCTURE_AND_DOCKER.md\`)
- [x] Indeks Dokumentasi (\`docs/README.md\`)

## ✅ Kriteria Penerimaan (Acceptance Criteria)
- Seluruh dokumen tersimpan di folder \`docs/\` dengan format GitHub Flavored Markdown dan Mermaid diagram.
- Mencakup alur *closed-loop* antara Warga (*Citizen*) dan Perangkat Desa (*Government*).`,
  },
  {
    title: '[Phase 1] Setup Lingkungan Docker Compose Lintas Platform (Windows & macOS)',
    milestone: 'Phase 1: Project Setup, Documentation & Foundation',
    labels: ['phase:1-foundation', 'type:infra', 'priority:high'],
    body: `## 📌 Deskripsi Tugas
Menyediakan konfigurasi container Docker agar seluruh anggota tim pengembang di Windows dan macOS dapat menjalankan aplikasi dan database PostgreSQL tanpa kendala perbedaan sistem operasi.

## 🎯 Lingkup Pekerjaan
- [x] Buat multi-stage \`Dockerfile\` (Node.js 22 Alpine, dev & production runner).
- [x] Buat \`docker-compose.yml\` mengorkestrasi service \`app\` (port 3000) dan \`db\` (PostgreSQL 16, port 5432) dengan healthcheck.
- [x] Buat file \`.dockerignore\` dan \`.env.example\`.
- [x] Konfigurasi Vite server host ke \`0.0.0.0\` untuk akses jaringan container.

## ✅ Kriteria Penerimaan
- Perintah \`docker compose up -d\` berjalan mulus di Windows dan macOS Apple Silicon/Intel.
- Data PostgreSQL persisten tersimpan di volume \`desa_ai_pgdata\`.`,
  },
  {
    title: '[Phase 1] Setup Pipeline CI/CD GitHub Actions & Konvensi Percabangan GitFlow',
    milestone: 'Phase 1: Project Setup, Documentation & Foundation',
    labels: ['phase:1-foundation', 'type:infra', 'priority:critical'],
    body: `## 📌 Deskripsi Tugas
Mengonfigurasi otomasi CI/CD untuk menegakkan aturan percabangan GitFlow (hanya branch \`dev\` yang menerima PR fitur), validasi Conventional Commits, dan uji kualitas kode otomatis.

## 🎯 Lingkup Pekerjaan
- [x] Setup GitHub Actions workflow (\`.github/workflows/ci.yml\`).
- [x] Validasi PR target branch (mencegah branch \`feat/*\` dimerge langsung ke \`master\`).
- [x] Setup Commitlint (\`commitlint.config.js\`) dan Git Hooks Husky (\`.husky/commit-msg\` & \`.husky/pre-commit\`).
- [x] Konfigurasi \`.npmrc\` dengan \`legacy-peer-deps=true\` untuk mencegah kegagalan \`npm ci\` di lingkungan CI.
- [x] Otomasi linting (\`npm run lint\`) dan build kompilasi (\`npm run build\`) pada setiap PR.

## ✅ Kriteria Penerimaan
- Pull request ke \`master\` dari branch selain \`dev\` otomatis gagal (FAIL).
- Pesan commit yang tidak sesuai format Conventional Commits otomatis ditolak.`,
  },
  {
    title: '[Phase 1] Scaffolding Struktur Folder Clean Architecture (Domain & Application)',
    milestone: 'Phase 1: Project Setup, Documentation & Foundation',
    labels: ['phase:1-foundation', 'type:arch', 'priority:high'],
    body: `## 📌 Deskripsi Tugas
Membuat struktur dasar folder Clean Architecture di direktori \`src/\` untuk memisahkan domain enterprise dari dependensi framework dan UI.

## 🎯 Lingkup Pekerjaan
- [x] Struktur layer: \`src/domain/\`, \`src/application/\`, \`src/infrastructure/\`.
- [x] Entitas Domain: \`complaint.entity.ts\`, \`service-request.entity.ts\`.
- [x] Interface Repository: \`i-complaint.repository.ts\`, \`i-ai-evaluator.service.ts\`.
- [x] DTO & Validasi Zod: \`complaint.dto.ts\`.
- [x] Use Case pertama: \`submit-complaint.use-case.ts\`.
- [x] Mock adapter: \`mock-ai-evaluator.service.ts\`.

## ✅ Kriteria Penerimaan
- Domain entities bebas dari dependensi luar (Zero External Dependencies).
- Kode terverifikasi lulus \`npm run lint\` dan \`npm run build\`.`,
  },

  // --- PHASE 2 ---
  {
    title: '[Phase 2] Implementasi Skema Basis Data Prisma PostgreSQL Lengkap Sesuai ERD',
    milestone: 'Phase 2: Data Model & Backend Core Architecture',
    labels: ['phase:2-data-backend', 'type:feat', 'scope:db', 'priority:critical'],
    body: `## 📌 Deskripsi Tugas
Merancang dan mengimplementasikan seluruh model relasional pada \`prisma/schema.prisma\` berdasarkan dokumen ERD DesaAI.

## 🎯 Lingkup Pekerjaan
- [ ] Model \`User\` dengan Enum Role (\`CITIZEN\`, \`VILLAGE_OFFICER\`, \`ADMIN\`).
- [ ] Model \`CitizenProfile\` (NIK, Nama Lengkap, Alamat, Relasi Banjar).
- [ ] Model \`Banjar\` (Master data wilayah desa).
- [ ] Model \`ServiceType\` (Surat Domisili, SKU, SKCK, SKTM).
- [ ] Model \`ServiceRequest\` & \`ServiceAttachment\` dengan status enum (\`PENDING\`, \`IN_REVIEW\`, \`REVISION\`, \`APPROVED\`, \`REJECTED\`).
- [ ] Model \`Complaint\` & \`ComplaintAIEvaluation\` dengan status enum (\`OPEN\`, \`IN_PROGRESS\`, \`RESOLVED\`, \`REJECTED\`) dan level urgensi (\`LOW\`, \`MEDIUM\`, \`HIGH\`, \`EMERGENCY\`).
- [ ] Model \`KnowledgeDocument\` & \`KnowledgeChunk\` untuk penyimpanan dokumen SOP dan vektor embedding.

## ✅ Kriteria Penerimaan
- Perintah \`npm run db:push\` sukses mengeksekusi migrasi ke database PostgreSQL.
- \`npm run db:generate\` menghasilkan tipe Prisma Client yang valid.`,
  },
  {
    title: '[Phase 2] Implementasi Prisma Repositories & Data Access Adapters',
    milestone: 'Phase 2: Data Model & Backend Core Architecture',
    labels: ['phase:2-data-backend', 'type:feat', 'scope:db', 'scope:service', 'priority:high'],
    body: `## 📌 Deskripsi Tugas
Mengimplementasikan interface repository domain menggunakan Prisma ORM di direktori \`src/infrastructure/repositories/\`.

## 🎯 Lingkup Pekerjaan
- [ ] \`PrismaComplaintRepository\` mengimplementasikan \`IComplaintRepository\`.
- [ ] \`PrismaServiceRequestRepository\` mengimplementasikan \`IServiceRequestRepository\`.
- [ ] Helper transaksi basis data untuk pembaruan status tiket dan riwayat log.
- [ ] Unit/Integration test dasar untuk operasi CRUD repository.

## ✅ Kriteria Penerimaan
- Query data mematuhi interface contracts dari Domain Layer.
- Data tersimpan dan terambil dengan akurat sesuai relasi relasional.`,
  },
  {
    title: '[Phase 2] Setup Database Seeding Awal untuk Master Data Desa',
    milestone: 'Phase 2: Data Model & Backend Core Architecture',
    labels: ['phase:2-data-backend', 'type:feat', 'scope:db', 'priority:medium'],
    body: `## 📌 Deskripsi Tugas
Membuat skrip seeding (\`prisma/seed.ts\`) untuk mengisi data awal master wilayah, jenis layanan, akun demo, dan dokumen SOP desa.

## 🎯 Lingkup Pekerjaan
- [ ] Data master Banjar (contoh: Banjar Kaja, Banjar Kelod, Banjar Tengah).
- [ ] Data katalog layanan surat (Surat Domisili, SKU, Pengantar SKCK, SKTM) beserta syarat berkas.
- [ ] Akun pengguna demo (Warga, Petugas Desa, Administrator).
- [ ] Contoh dokumen peraturan desa / SOP pelayanan awal.

## ✅ Kriteria Penerimaan
- Perintah \`npm run db:seed\` sukses mengeksekusi pengisian data tanpa error duplikasi.`,
  },

  // --- PHASE 3 ---
  {
    title: '[Phase 3] Integrasi AI Complaint Intelligence: Klasifikasi Otomatis & Triage Urgensi',
    milestone: 'Phase 3: AI Engine & RAG Knowledge Pipeline',
    labels: ['phase:3-ai-rag', 'type:feat', 'scope:ai', 'scope:complaint', 'priority:critical'],
    body: `## 📌 Deskripsi Tugas
Membangun engine kecerdasan buatan untuk menganalisis teks laporan keluhan warga secara otomatis dan menghasilkan data terstruktur (Structured Output).

## 🎯 Lingkup Pekerjaan
- [ ] Implementasi adapter LLM (Google Gemini / OpenAI via API) di \`src/infrastructure/ai/\`.
- [ ] Prompt engineering terstruktur untuk mengekstraksi:
  - \`category\`: Infrastruktur, Kebersihan, Keamanan, Pelayanan Publik, Bantuan Sosial.
  - \`priority\`: LOW, MEDIUM, HIGH, EMERGENCY.
  - \`summary\`: Ringkasan 1 kalimat eksekutif untuk perangkat desa.
  - \`recommendedAction\`: Saran langkah taktis penanganan.
- [ ] Fallback parser JSON yang aman dari error formatting LLM.

## ✅ Kriteria Penerimaan
- Input laporan seperti *"Lampu jalan di Banjar X mati 3 hari"* otomatis menghasilkan kategori \`INFRASTRUKTUR\`, prioritas \`HIGH\`, dan ringkasan yang tepat dalam waktu <3 detik.`,
  },
  {
    title: '[Phase 3] Pembangunan RAG Pipeline & Ingestion Dokumen SOP Desa',
    milestone: 'Phase 3: AI Engine & RAG Knowledge Pipeline',
    labels: ['phase:3-ai-rag', 'type:feat', 'scope:rag', 'scope:ai', 'priority:critical'],
    body: `## 📌 Deskripsi Tugas
Membangun pipeline Retrieval-Augmented Generation (RAG) untuk membaca dan mengindeks dokumen SOP resmi desa agar AI menjawab secara akurat tanpa halusinasi.

## 🎯 Lingkup Pekerjaan
- [ ] Modul chunking teks dokumen SOP dan Perdes (\`src/infrastructure/ai/chunker.ts\`).
- [ ] Generator embedding vektor (misal: Gemini text-embedding / OpenAI text-embedding-3-small).
- [ ] Mekanisme similarity search (Cosine similarity via database / pgvector).
- [ ] API endpoint untuk ingestion dokumen teks/markdown baru ke basis data RAG.

## ✅ Kriteria Penerimaan
- Sistem mampu menemukan potongan dokumen SOP yang relevan berdasarkan pertanyaan bahasa alami warga.`,
  },
  {
    title: '[Phase 3] Implementasi AI Village Assistant Conversational Service',
    milestone: 'Phase 3: AI Engine & RAG Knowledge Pipeline',
    labels: ['phase:3-ai-rag', 'type:feat', 'scope:ai', 'scope:rag', 'priority:high'],
    body: `## 📌 Deskripsi Tugas
Menghubungkan hasil pencarian RAG ke dalam agen percakapan AI Village Assistant untuk melayani tanya-jawab warga.

## 🎯 Lingkup Pekerjaan
- [ ] Use case \`AskVillageAssistantUseCase\`.
- [ ] Sistem prompt yang membatasi AI hanya menjawab berdasarkan *context ground* resmi desa.
- [ ] Kemampuan AI memberikan tautan langsung ke formulir layanan terkait jika warga bermaksud mengajukan surat.
- [ ] Dukungan streaming respons chat untuk UX interaktif yang responsif.

## ✅ Kriteria Penerimaan
- Asisten mampu menjawab pertanyaan syarat pembuatan surat domisili dengan akurat dan menyertakan panduan langkah pengajuan.`,
  },

  // --- PHASE 4 ---
  {
    title: '[Phase 4] Desain & Layout Citizen Platform (Mobile-First / PWA)',
    milestone: 'Phase 4: Citizen Platform UI (PWA & Self-Service)',
    labels: ['phase:4-citizen-ui', 'type:feat', 'priority:high'],
    body: `## 📌 Deskripsi Tugas
Membangun antarmuka pengguna sisi masyarakat desa yang ringan, intuitif, ramah lansia/warga umum, dan mendukung Progressive Web App (PWA).

## 🎯 Lingkup Pekerjaan
- [ ] Layout mobile-first dengan navigasi bawah (Bottom Navigation Bar) yang bersih.
- [ ] Halaman Beranda Warga: Banner informasi desa, menu cepat layanan surat, tombol lapor pengaduan, dan akses asisten AI.
- [ ] Manifest PWA & Service Worker konfigurasi (*Add to Home Screen*).
- [ ] Tampilan responsif di smartphone, tablet, maupun layar desktop.

## ✅ Kriteria Penerimaan
- Antarmuka mudah digunakan di layar ponsel dengan waktu render awal yang cepat.`,
  },
  {
    title: '[Phase 4] Antarmuka Chat AI Village Assistant Interaktif untuk Warga',
    milestone: 'Phase 4: Citizen Platform UI (PWA & Self-Service)',
    labels: ['phase:4-citizen-ui', 'type:feat', 'scope:ai', 'priority:high'],
    body: `## 📌 Deskripsi Tugas
Membangun komponen ruang obrolan (Chat Room) antara warga dan AI Village Assistant.

## 🎯 Lingkup Pekerjaan
- [ ] UI chat bubble dengan indikator pengetikan (*typing indicator*).
- [ ] Tombol pintasan pertanyaan populer (Quick prompts: *"Syarat Surat Domisili"*, *"Jam Layanan Kantor Desa"*, *"Cara Dapat Bansos"*).
- [ ] Dukungan Markdown rendering (daftar syarat, huruf tebal, tautan tombol form).
- [ ] Riwayat percakapan sesi lokal.

## ✅ Kriteria Penerimaan
- Warga dapat berinteraksi tanya-jawab dengan lancar dan menerima jawaban terformat rapi.`,
  },
  {
    title: '[Phase 4] Formulir Pengajuan Layanan Surat Mandiri & Pelacakan Nomor Tiket (REQ-xxx)',
    milestone: 'Phase 4: Citizen Platform UI (PWA & Self-Service)',
    labels: ['phase:4-citizen-ui', 'type:feat', 'scope:service', 'priority:critical'],
    body: `## 📌 Deskripsi Tugas
Membangun halaman katalog layanan surat desa dan formulir permohonan digital mandiri.

## 🎯 Lingkup Pekerjaan
- [ ] Katalog pilihan surat (Surat Domisili, SKU, SKCK, SKTM).
- [ ] Formulir input data: NIK, Nama, Banjar, Tujuan Pembuatan, dan Unggah Foto Berkas (KTP/KK).
- [ ] Halaman konfirmasi sukses dengan kode tiket unik (format: \`REQ-YYYYMM-XXXX\`).
- [ ] Halaman pelacakan status permohonan surat secara transparan (*Pending*, *Diproses*, *Disetujui*, *Perlu Revisi*).

## ✅ Kriteria Penerimaan
- Warga dapat mengirim permohonan surat dan mengecek status secara mandiri menggunakan nomor tiket.`,
  },
  {
    title: '[Phase 4] Formulir Pengaduan Cerdas Warga & Tracking Status Tindak Lanjut (CMP-xxx)',
    milestone: 'Phase 4: Citizen Platform UI (PWA & Self-Service)',
    labels: ['phase:4-citizen-ui', 'type:feat', 'scope:complaint', 'priority:critical'],
    body: `## 📌 Deskripsi Tugas
Membangun formulir lapor keluhan warga yang langsung terhubung dengan engine klasifikasi AI.

## 🎯 Lingkup Pekerjaan
- [ ] Form pengaduan cepat: Judul, deskripsi bebas, pemilihan Banjar, patokan lokasi fisik, dan unggah foto bukti.
- [ ] Indikator proses evaluasi AI saat pengiriman laporan.
- [ ] Pemberian nomor tiket pengaduan (\`CMP-YYYYMM-XXXX\`).
- [ ] Halaman riwayat dan pelacakan status penanganan laporan beserta catatan dari petugas lapangan.

## ✅ Kriteria Penerimaan
- Laporan warga berhasil masuk ke sistem dan mendapatkan feedback nomor tiket secara seketika.`,
  },

  // --- PHASE 5 ---
  {
    title: '[Phase 5] Desain Layout Government Dashboard Terintegrasi',
    milestone: 'Phase 5: Government Dashboard & Village Analytics',
    labels: ['phase:5-gov-dashboard', 'type:feat', 'priority:high'],
    body: `## 📌 Deskripsi Tugas
Membangun antarmuka dashboard kerja perangkat desa berbasis desktop/tablet untuk mengelola administrasi desa.

## 🎯 Lingkup Pekerjaan
- [ ] Sidebar navigasi: Triage Pengaduan, Permohonan Layanan, Analitik Desa, Manajemen Knowledge Base.
- [ ] Kartu ringkasan metrik utama (Total Laporan Masuk, Laporan Selesai, Pengajuan Pending, Indeks Respon).
- [ ] Badge notifikasi untuk laporan berstatus \`EMERGENCY\` atau \`HIGH\`.
- [ ] Tampilan modern dan profesional untuk presentasi hackathon.

## ✅ Kriteria Penerimaan
- Dashboard tampil proporsional di resolusi desktop/laptop penguji dan mudah dinavigasi.`,
  },
  {
    title: '[Phase 5] Meja Kerja Triage Pengaduan Masuk (AI-Assisted Triage Desk)',
    milestone: 'Phase 5: Government Dashboard & Village Analytics',
    labels: ['phase:5-gov-dashboard', 'type:feat', 'scope:complaint', 'scope:ai', 'priority:critical'],
    body: `## 📌 Deskripsi Tugas
Membangun antarmuka pemilahan dan disposisi pengaduan warga yang memanfaatkan hasil analisis AI.

## 🎯 Lingkup Pekerjaan
- [ ] Tabel/Board pengaduan dengan filter kategori, wilayah Banjar, dan tingkat prioritas AI.
- [ ] Modal detail laporan: Menampilkan teks pengadu, ringkasan AI, saran tindakan, foto bukti, dan peta/lokasi.
- [ ] Aksi petugas: Ubah status (\`In Progress\`, \`Resolved\`, \`Rejected\`), unggah foto bukti perbaikan, dan input catatan warga.

## ✅ Kriteria Penerimaan
- Perangkat desa dapat memprioritaskan penanganan laporan darurat dengan bantuan label AI.`,
  },
  {
    title: '[Phase 5] Meja Kerja Verifikasi & Approval Permohonan Surat Layanan',
    milestone: 'Phase 5: Government Dashboard & Village Analytics',
    labels: ['phase:5-gov-dashboard', 'type:feat', 'scope:service', 'priority:critical'],
    body: `## 📌 Deskripsi Tugas
Membangun meja kerja verifikasi permohonan surat masuk bagi staf pelayanan desa.

## 🎯 Lingkup Pekerjaan
- [ ] Antrean berkas masuk terurut berdasarkan tanggal pengajuan.
- [ ] Pemeriksaan kelengkapan berkas KTP/KK pemohon.
- [ ] Aksi verifikasi: Setujui (*Approve*), Minta Revisi Berkas (*dengan catatan kekurangan*), atau Tolak (*Reject*).
- [ ] Generasi draf keterangan surat siap cetak/unduh PDF.

## ✅ Kriteria Penerimaan
- Perubahan status di dashboard staf seketika ter-update pada status pelacakan di sisi warga.`,
  },
  {
    title: '[Phase 5] Dashboard Visualisasi Analitik Tren Desa & Sebaran Wilayah Banjar',
    milestone: 'Phase 5: Government Dashboard & Village Analytics',
    labels: ['phase:5-gov-dashboard', 'type:feat', 'scope:analytics', 'priority:high'],
    body: `## 📌 Deskripsi Tugas
Membangun grafik statistik interaktif untuk membantu kepala desa dan perangkat desa melihat pola permasalahan desa.

## 🎯 Lingkup Pekerjaan
- [ ] Grafik batang distribusi pengaduan per wilayah Banjar/Dusun.
- [ ] Diagram donat sebaran kategori masalah (Infrastruktur, Kebersihan, Keamanan, dll.).
- [ ] Metrik rata-rata waktu penyelesaian (*Average Time to Resolution*).
- [ ] Ringkasan eksekutif berbasis data untuk perencanaan musrenbangdes.

## ✅ Kriteria Penerimaan
- Data statistik teragregasi secara dinamis dari database dan divisualisasikan dengan grafik yang jelas.`,
  },
  {
    title: '[Phase 5] Antarmuka Manajemen Knowledge Base Desa untuk Administrator',
    milestone: 'Phase 5: Government Dashboard & Village Analytics',
    labels: ['phase:5-gov-dashboard', 'type:feat', 'scope:rag', 'priority:medium'],
    body: `## 📌 Deskripsi Tugas
Menyediakan halaman khusus administrator untuk mengelola dokumen acuan yang menjadi sumber jawaban AI Village Assistant.

## 🎯 Lingkup Pekerjaan
- [ ] Form input/unggah dokumen SOP, Perdes, atau panduan layanan baru.
- [ ] Editor teks markdown untuk penyesuaian isi aturan desa secara cepat.
- [ ] Tombol sinkronisasi/re-indexing dokumen ke dalam vektor RAG.
- [ ] Daftar dokumen aktif yang sedang digunakan oleh model AI.

## ✅ Kriteria Penerimaan
- Administrator dapat memperbarui SOP layanan dan AI langsung memberikan jawaban sesuai perubahan dokumen terbaru.`,
  },

  // --- PHASE 6 ---
  {
    title: '[Phase 6] Penyusunan Dataset Dummy Realistis (Konteks Desa di Bali/Indonesia)',
    milestone: 'Phase 6: Seed Data, Testing & Hackathon Pitch Polish',
    labels: ['phase:6-demo-polish', 'type:test', 'priority:high'],
    body: `## 📌 Deskripsi Tugas
Menyusun skenario data tiruan (*mock data*) yang nyata dan hidup untuk kebutuhan demonstrasi di hadapan juri.

## 🎯 Lingkup Pekerjaan
- [ ] Nama-nama Banjar lokal khas Bali (Banjar Kaja, Banjar Kelod, Banjar Tengah, Banjar Kangin, Banjar Kauh).
- [ ] 10+ contoh permohonan surat masuk dengan variasi status.
- [ ] 15+ kasus pengaduan nyata (lampu penerangan mati di tikungan, jalan berlubang, pohon tumbang, sampah di saluran irigasi subak).
- [ ] Dokumen SOP desa riil untuk RAG.

## ✅ Kriteria Penerimaan
- Seluruh halaman dashboard dan portal warga terisi dengan data realistis tanpa tampilan kosong (*empty state*).`,
  },
  {
    title: '[Phase 6] Pengujian Alur Tertutup (Closed-Loop Workflow Testing) Citizen-to-Government',
    milestone: 'Phase 6: Seed Data, Testing & Hackathon Pitch Polish',
    labels: ['phase:6-demo-polish', 'type:test', 'priority:critical'],
    body: `## 📌 Deskripsi Tugas
Melakukan gladi resik pengujian alur lengkap dari warga melapor hingga selesai ditindaklanjuti oleh perangkat desa.

## 🎯 Skenario Uji
1. **Skenario Layanan**: Warga tanya syarat domisili ke AI -> AI jawab & arahkan ke form -> Warga submit -> Petugas terima di dashboard -> Petugas approve -> Warga lihat status selesai.
2. **Skenario Pengaduan**: Warga input keluhan lampu jalan mati -> AI klasifikasi otomatis (Infrastruktur, High Priority) -> Muncul di Triage Board perangkat desa -> Petugas ubah status ke In Progress lalu Resolved -> Status warga ter-update.

## ✅ Kriteria Penerimaan
- Tidak ada crash atau error jaringan saat simulasi kedua skenario utama tersebut.`,
  },
  {
    title: '[Phase 6] Persiapan Demo Pitching, Video Walkthrough & Presentasi APTIKOM Hackathon 2026',
    milestone: 'Phase 6: Seed Data, Testing & Hackathon Pitch Polish',
    labels: ['phase:6-demo-polish', 'type:docs', 'priority:critical'],
    body: `## 📌 Deskripsi Tugas
Menyiapkan materi presentasi final untuk dewan juri APTIKOM Hackathon 2026 kategori Smart Village Technology.

## 🎯 Lingkup Pekerjaan
- [ ] Slide presentasi PowerPoint / Canva yang memukau (Problem, Solution, Architecture, AI Innovation, Business Impact).
- [ ] Rekaman video demo prototype/MVP (durasi 3-5 menit).
- [ ] Script pitching pembagian giliran bicara tim (Benedito, Kadek Wahyu, Renald).
- [ ] Antisipasi tanya-jawab teknis dewan juri (RAG hallucination prevention, data privacy NIK, offline capability).

## ✅ Kriteria Penerimaan
- Seluruh artefak pitch deck dan video siap disubmit ke portal APTIKOM Hackathon.`,
  },
]

async function run() {
  console.log(`🚀 Starting GitHub Project Setup for ${REPO}...\n`)

  // A. Create/Update Labels
  console.log('📦 Step 1: Configuring Labels...')
  const existingLabels = await api('/labels?per_page=100')
  const existingLabelNames = new Set(existingLabels.map((l) => l.name))

  for (const label of labels) {
    try {
      if (existingLabelNames.has(label.name)) {
        await api(`/labels/${encodeURIComponent(label.name)}`, 'PATCH', {
          color: label.color,
          description: label.description,
        })
        console.log(`  ✓ Updated label: ${label.name}`)
      } else {
        await api('/labels', 'POST', label)
        console.log(`  + Created label: ${label.name}`)
      }
    } catch (err) {
      console.error(`  ✗ Error with label ${label.name}:`, err.message)
    }
  }

  // B. Create Milestones
  console.log('\n🚩 Step 2: Configuring Milestones...')
  const existingMilestones = await api('/milestones?state=all')
  const milestoneMap = new Map() // title -> number

  for (const m of existingMilestones) {
    milestoneMap.set(m.title, m.number)
  }

  for (const m of milestones) {
    try {
      if (milestoneMap.has(m.title)) {
        console.log(`  ✓ Milestone already exists: ${m.title} (#${milestoneMap.get(m.title)})`)
      } else {
        const created = await api('/milestones', 'POST', m)
        milestoneMap.set(created.title, created.number)
        console.log(`  + Created milestone: ${created.title} (#${created.number})`)
      }
    } catch (err) {
      console.error(`  ✗ Error with milestone ${m.title}:`, err.message)
    }
  }

  // C. Create Issues
  console.log('\n📝 Step 3: Creating Issues...')
  const existingIssues = await api('/issues?state=all&per_page=100')
  const existingIssueTitles = new Set(existingIssues.map((i) => i.title))

  for (const issue of issues) {
    try {
      if (existingIssueTitles.has(issue.title)) {
        console.log(`  ✓ Issue already exists: ${issue.title}`)
        continue
      }

      const milestoneNumber = milestoneMap.get(issue.milestone)
      const payload = {
        title: issue.title,
        body: issue.body,
        labels: issue.labels,
        milestone: milestoneNumber,
      }

      const created = await api('/issues', 'POST', payload)
      console.log(`  + Created issue #${created.number}: ${issue.title}`)
    } catch (err) {
      console.error(`  ✗ Error creating issue "${issue.title}":`, err.message)
    }
  }

  console.log('\n🎉 All Milestones, Labels, and Issues have been successfully uploaded to GitHub!')
}

run().catch((err) => {
  console.error('Fatal execution error:', err)
  process.exit(1)
})

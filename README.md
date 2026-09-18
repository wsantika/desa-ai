# 🏛️ DesaAI — AI-Powered Operating System for Smart Villages

<div align="center">

[![CI Pipeline](https://github.com/wsantika/desa-ai/actions/workflows/ci.yml/badge.svg)](https://github.com/wsantika/desa-ai/actions/workflows/ci.yml)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue.svg)](https://www.typescriptlang.org/)
[![TanStack Start](https://img.shields.io/badge/Framework-TanStack%20Start-FF4154.svg)](https://tanstack.com/start)
[![React 19](https://img.shields.io/badge/React-19-61DAFB.svg)](https://react.dev/)
[![Tailwind CSS v4](https://img.shields.io/badge/Tailwind-v4.1-38B2AC.svg)](https://tailwindcss.com/)
[![Prisma ORM](https://img.shields.io/badge/ORM-Prisma%207-2D3748.svg)](https://www.prisma.io/)
[![Docker](https://img.shields.io/badge/Docker-Ready-2496ED.svg)](https://www.docker.com/)

**Karya Inovasi Teknologi Desa untuk APTIKOM Hackathon 2026**  
*Kategori: Smart Village Technology*

</div>

---

## 📌 Tentang DesaAI

Transformasi digital desa di Indonesia selama ini kerap hanya berfokus pada keberadaan situs web profil desa statis yang pasif. Ketika warga memerlukan informasi surat atau ingin mengadukan kerusakan fasilitas umum, prosesnya masih terfragmentasi melalui antrean fisik atau grup pesan singkat tanpa kepastian tindak lanjut.

**DesaAI** hadir sebagai **AI-Powered Operating System** terpadu yang menjembatani masyarakat desa (*Citizen*) dengan pemerintah desa (*Government*) melalui siklus pelayanan tertutup (*closed-loop workflow*):

1. **Bukan Sekadar Chatbot**: AI dihubungkan langsung ke *pipeline* pelayanan administrasi dan pelaporan keluhan nyata.
2. **Knowledge Base Terverifikasi (RAG)**: Seluruh jawaban panduan birokrasi mengacu pada dokumen resmi desa (Perdes, SOP layanan, dan profil desa) guna mengeliminasi halusinasi model.
3. **AI Complaint Intelligence**: Laporan keluhan warga secara otomatis dianalisis, dikelompokkan kategorinya (Infrastruktur, Kebersihan, Keamanan, dll.), dan ditentukan tingkat urgensinya (*Emergency*, *High*, *Medium*, *Low*) untuk mempermudah *triage* staf desa.
4. **Digital Service Request**: Pengajuan surat administrasi mandiri secara digital dengan nomor tiket pelacakan transparan.
5. **Government Dashboard & Village Analytics**: Dashboard kerja perangkat desa untuk verifikasi berkas, disposisi laporan, serta visualisasi data tren masalah desa berbasis bukti (*evidence-based policy*).

---

## 🚀 Fitur Utama

```
                      ┌────────────────────────────────────────┐
                      │        DesaAI Ecosystem (Web/PWA)      │
                      └───────────────────┬────────────────────┘
                                          │
                  ┌───────────────────────┴───────────────────────┐
                  ▼                                               ▼
     ┌────────────────────────┐                      ┌────────────────────────┐
     │  Citizen Platform      │                      │  Government Dashboard  │
     │  (Warga Desa)          │                      │  (Perangkat Desa)      │
     ├────────────────────────┤                      ├────────────────────────┤
     │ • AI Village Assistant │                      │ • Triage & Disposisi   │
     │   (RAG Grounded SOP)   │                      │ • Verifikasi Surat     │
     │ • Pengajuan Surat      │                      │ • Update Progres Tiket │
     │ • Tracking No. Tiket   │                      │ • Analitik Tren Desa   │
     │ • Lapor Pengaduan      │                      │ • Knowledge Base Admin │
     └────────────┬───────────┘                      └────────────▲───────────┘
                  │                                               │
                  └─────────────► [AI Core Engine] ───────────────┘
                                  - RAG Retrieval
                                  - Intent Classification
                                  - Severity Triage
```

### 1. 🤖 AI Village Assistant (RAG Grounded)
Warga dapat berkonsultasi menggunakan bahasa sehari-hari mengenai syarat pengurusan berkas, jam buka kantor desa, dan prosedur administrasi. Jawaban divalidasi langsung dari basis data dokumen resmi desa.

### 2. 📝 Digital Service Request (Pengajuan Surat Mandiri)
Permohonan surat (Surat Keterangan Domisili, SKU, Pengantar SKCK, SKTM) dapat diajukan secara online dengan upload berkas pendukung dan menerima nomor pelacakan unik (`REQ-xxx`).

### 3. 🚨 AI Complaint Intelligence (Pengaduan Cerdas)
Warga melaporkan keluhan fasilitas (contoh: *"Lampu jalan di Banjar X mati sejak 3 hari"*). Sistem mengekstrak lokasi, mendeteksi kategori masalah, menghitung skor urgensi, dan membuat ringkasan eksekutif secara instan untuk perangkat desa.

### 4. 📊 Government Dashboard & Village Analytics
Perangkat desa memiliki pusat kendali terintegrasi untuk menyetujui permohonan surat, memperbarui status pengaduan warga, serta melihat analitik sebaran masalah per Banjar/Dusun.

---

## 🛠️ Tech Stack Modern

- **Frontend & Fullstack Framework**: [TanStack Start](https://tanstack.com/start) (React 19 + TypeScript + Vite)
- **Styling & UI**: [Tailwind CSS v4](https://tailwindcss.com/) + [Lucide Icons](https://lucide.dev/)
- **Database & ORM**: PostgreSQL 16 + [Prisma ORM 7](https://www.prisma.io/)
- **AI & RAG Engine**: [@tanstack/ai](https://tanstack.com/ai) + Google Gemini API / LLM Embeddings
- **Containerization**: [Docker & Docker Compose](https://www.docker.com/) (Multi-platform: Windows & macOS ARM/x86)
- **CI/CD & QA**: GitHub Actions, ESLint, Commitlint, Husky Git Hooks

---

## 💻 Panduan Menjalankan Proyek (Quickstart)

Proyek ini telah dikonfigurasi agar berjalan mulus di sistem operasi **Windows** maupun **macOS** (termasuk Apple Silicon M1/M2/M3/M4).

### Opsi 1: Menggunakan Docker Compose (Direkomendasikan)
Menjalankan seluruh ekosistem (Aplikasi Web + Basis Data PostgreSQL) dalam kontainer:

```bash
# 1. Clone repositori
git clone https://github.com/wsantika/desa-ai.git
cd desa-ai

# 2. Siapkan file konfigurasi environment
cp .env.example .env.local

# 3. Jalankan Docker Compose
docker compose up -d --build

# 4. Buka aplikasi di browser
# Web: http://localhost:3000
```

### Opsi 2: Pengembangan Lokal (Hybrid Mode)
Menjalankan database di Docker dan frontend/backend di host laptop untuk kecepatan Vite HMR maksimal:

```bash
# 1. Jalankan container database saja
docker compose up -d db

# 2. Salin environment dan generate Prisma client
cp .env.example .env.local
npm run db:generate

# 3. Sinkronisasikan skema database
npm run db:push

# 4. Jalankan server pengembangan
npm run dev
```

---

## 🌿 Standar GitFlow & Kolaborasi Tim

Untuk menjaga stabilitas kode menjelang kompetisi hackathon, repositori ini menerapkan aturan percabangan ketat yang divalidasi otomatis oleh **GitHub Actions CI**:

### Struktur Branch
- **`master`** : Cabang produksi stabil. Dilarang push langsung. Hanya menerima PR dari branch `dev`.
- **`dev`** : Cabang integrasi utama pengembangan.
- **`feat/*`**, **`fix/*`**, **`chore/*`** : Dibuat dari `dev` dan **WAJIB membuka PR ke target branch `dev`**.

> [!CAUTION]
> GitHub Actions CI akan **otomatis membatalkan (FAIL)** Pull Request yang mencoba menggabungkan branch `feat/*` langsung ke `master`.

### Format Conventional Commits
Setiap pesan commit dan judul Pull Request wajib mengikuti konvensi:
```text
<type>(<scope>): <pesan dalam huruf kecil>
```

*Contoh yang benar:*
- `feat(complaint): implement ai classification prompt`
- `fix(rag): handle empty query response gracefully`
- `docs(prd): update kpi evaluation criteria`

---

## 📚 Indeks Dokumentasi Lengkap

Dokumentasi arsitektur dan teknis mendalam tersedia di direktori [`docs/`](file:///D:/Project/desa-ai/docs/README.md):
- 📄 [Product Requirements Document (PRD)](file:///D:/Project/desa-ai/docs/PRD.md)
- 🧅 [Clean Architecture & Design Principles](file:///D:/Project/desa-ai/docs/CLEAN_ARCHITECTURE.md)
- 📐 [Arsitektur Sistem, Use Case & Activity Diagram](file:///D:/Project/desa-ai/docs/ARCHITECTURE_AND_DIAGRAMS.md)
- 🗄️ [Database Schema & ERD](file:///D:/Project/desa-ai/docs/DATABASE_SCHEMA.md)
- 🔀 [GitFlow, Branching Rules & Conventional Commits](file:///D:/Project/desa-ai/docs/GITFLOW_AND_CONVENTIONS.md)
- 🐳 [Infrastruktur Docker & Setup Windows/macOS](file:///D:/Project/desa-ai/docs/INFRASTRUCTURE_AND_DOCKER.md)

---

## 👨‍💻 Tim Pengembang (Undiknas Denpasar)

Karya ini dikembangkan oleh **Tim Desa AI** dari **Universitas Pendidikan Nasional (Undiknas) Denpasar**:
1. **Benedito Nidio Da Rosa Maia Tilman**
2. **Kadek Wahyu Santika Putra**
3. **Renald Kevin Azzaky**

*APTIKOM Hackathon 2026 — Smart Village Technology*

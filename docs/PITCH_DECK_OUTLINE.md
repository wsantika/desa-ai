# Pitch Deck Presentation Outline
## DesaAI: AI-Powered Operating System for Smart Villages

**Kompetisi**: APTIKOM Hackathon 2026  
**Kategori**: Smart Village Technology  
**Institusi**: Universitas Pendidikan Nasional (Undiknas) Denpasar, Bali  
**Tim Pengembang**:  
1. Benedito Nidio Da Rosa Maia Tilman (Team Leader)  
2. Kadek Wahyu Santika Putra (Lead Fullstack & AI Engineer)  
3. Renald Kevin Azzaky (Government Operations & UX Specialist)  

---

### Slide 1: Cover & Judul Inovasi
- **Judul Utama**: DesaAI
- **Tagline**: AI-Powered Operating System for Smart Villages: Menghubungkan Pelayanan Mandiri Warga, Pengaduan Cerdas Berbasis AI, dan Dashboard Pemerintah Desa
- **Konteks Implementasi**: Desa Tegal Tugu, Kecamatan Gianyar, Kabupaten Gianyar, Bali
- **Elemen Visual**: Mockup tampilan mobile PWA warga berdampingan dengan tampilan desktop Government Dashboard terpadu.

---

### Slide 2: Akar Permasalahan Tata Kelola Desa di Indonesia
- **3 Masalah Utama**:
  1. **Informasi Birokrasi Terfragmentasi**: Warga harus datang tatap muka berkali-kali ke kantor desa hanya untuk menanyakan berkas persyaratan surat.
  2. **Pengaduan Warga Tenggelam**: Aduan jalan rusak, sampah subak, atau lampu padam disampaikan lewat pesan grup WhatsApp tanpa ada tiket pelacakan resmi.
  3. **Beban Kerja Berlebih Perangkat Desa**: Staf desa kewalahan memilah mana laporan gawat darurat dan mana keluhan berkala tanpa sistem analitik terpusat.
- **Poin Kritis**: Sebagian besar inisiatif Smart Village selama ini hanya berfokus membuat *website profil desa* statis yang pasif dan cepat ditinggalkan warga.

---

### Slide 3: Solusi Kami: Closed-Loop Operating System
- **Konsep Utama**: Bukan sekadar chatbot tanya-jawab biasa, melainkan sistem operasi dua arah (*two-way closed loop*) yang menghubungkan warga dengan aparatur desa.
- **Tiga Pilar Solusi**:
  1. **Citizen Portal (Mobile-First PWA)**: Layanan mandiri surat, pengaduan fasilitas, dan asisten AI resmi.
  2. **AI Intelligence Engine**: Grounded RAG dokumen desa dan AI Triage evaluasi keluhan warga secara otomatis.
  3. **Government Workspace**: Pusat kendali verifikasi surat, meja triage aduan, dan briefing perencanaan anggaran Musrenbangdes.

---

### Slide 4: Pengalaman Warga (Citizen Experience)
- **Akses Cepat Tanpa Antre**:
  - Konsultasi persyaratan surat ke Asisten AI **Made Tegal Tugu** berbasis dokumen regulasi desa.
  - Pengajuan 4 jenis surat utama (Domisili, SKU, SKCK, SKTM) bebas biaya (Rp 0).
  - Pelacakan transparan status surat real-time menggunakan kode tiket unik `REQ-YYYYMM-XXXX`.
  - Pelaporan keluhan fasilitas lingkungan dengan bukti foto dan lokasi fisik banjar.

---

### Slide 5: Inovasi Teknologi AI Engine & Anti-Halusinasi
- **Grounded Retrieval-Augmented Generation (RAG)**:
  - Vector embeddings dense 768-dimensi menggunakan Google Gemini.
  - Pencarian semantik dengan cosine similarity threshold di atas dokumen Perdes No. 03/2025 dan SOP resmi desa.
  - Pencegahan halusinasi: Jawaban AI 100% bersumber dari dokumen hukum desa resmi yang terdaftar.
  - Dual-mode resiliency: Dilengkapi mesin fallback deterministik ketika terjadi kendala jaringan atau kuota API.

---

### Slide 6: AI Complaint Intelligence & Automated Triage
- **Klasifikasi Aduan Otomatis**:
  - Ekstraksi entitas lokasi banjar (Banjar Kaja, Kelod, Tengah, Kangin, Kauh).
  - Kategorisasi cerdas ke 6 pos dinas (Infrastruktur, Kebersihan, Keamanan, Pelayanan Publik, Bansos, Lainnya).
  - Penetapan prioritas risiko (Emergency, High, Medium, Low) dengan skor keyakinan (*confidence score*).
  - Rekomendasi tindakan taktis (*recommended action*) langsung tersaji bagi kepala seksi terkait.

---

### Slide 7: Government Unified Workspace
- **Meja Kerja Terpadu Aparatur Desa**:
  - **Meja Verifikasi Layanan**: Pemeriksaan berkas digital, penolakan revisi terarah, dan pengesahan surat ber-QR Code legalitas.
  - **Meja Triage Pengaduan**: Papan kanban responsif untuk penugasan tim lapangan dan pemantauan SLA (Target < 24 Jam darurat, < 48 Jam umum).
  - **Knowledge Base Manager**: Pengelolaan dokumen regulasi desa yang langsung mengindeks ulang vektor embedding AI.

---

### Slide 8: Village Trend Visualizer & Rekomendasi Musrenbangdes
- **Pengambilan Kebijakan Berbasis Data (Evidence-Based Policy)**:
  - Metrik waktu penyelesaian rata-rata (ATTR: Average Time to Resolution).
  - Peta sebaran keluhan per banjar untuk deteksi dini ketimpangan fasilitas antar-lingkungan.
  - Rekomendasi prioritas program kerja otomatis untuk musyawarah perencanaan pembangunan desa (Musrenbangdes / APBDes).

---

### Slide 9: Arsitektur Sistem & Standar Keamanan Data Pribadi
- **Modern Fullstack Stack**:
  - Framework: TanStack Start (Fullstack React 19 SSR, TanStack Router type-safe).
  - Database: PostgreSQL 16 dengan ekstensi pgvector via Prisma ORM.
  - Styling: Tailwind CSS v4 dengan kepatuhan antislop dan desain responsif mobile.
- **Perlindungan Data Pribadi (UU PDP)**:
  - Masking otomatis nomor NIK warga (`517101******0003`) pada antarmuka pelacakan publik.
  - Role-based access control (RBAC): Pemisahan ketat hak akses Citizen, Village Officer, dan Admin.

---

### Slide 10: Hasil Pengujian & Kesiapan Prototype
- **Kesiapan MVP 100% Teruji**:
  - Dataset realistis: 5 Banjar Adat & Dinas di Gianyar Bali, 12 permohonan surat, 18 kasus aduan riil.
  - 114 Unit & Integration Tests: 100% PASS mencakup pengujian alur tertutup (*closed-loop workflow*).
  - Zero Lint Errors dan build produksi siap rilis.

---

### Slide 11: Profil Tim Pengembang
- **Universitas Pendidikan Nasional (Undiknas) Denpasar**:
  - **Benedito Nidio Da Rosa Maia Tilman**: Product Manager & System Architect.
  - **Kadek Wahyu Santika Putra**: Lead Fullstack Developer & AI Implementation.
  - **Renald Kevin Azzaky**: Government UX Designer & Data Analyst.

---

### Slide 12: Visi Jangka Panjang & Rencana Hilirisasi
- **Tahap Pasca-Hackathon**:
  - Integrasi WhatsApp Gateway dua arah bagi warga yang belum terbiasa dengan web portal.
  - Sinkronisasi API SIAK Ditjen Dukcapil untuk validasi NIK otomatis tingkat kecamatan/kabupaten.
  - Replikasi model DesaAI ke seluruh desa dinas dan adat di Provinsi Bali dan Indonesia.
- **Penutup**: *"Desa Cerdas Dimulai dari Pelayanan yang Tanggap, Akuntabel, dan Memberdayakan Warga."*

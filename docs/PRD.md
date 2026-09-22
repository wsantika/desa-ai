# Product Requirements Document (PRD)
## DesaAI — AI-Powered Operating System for Smart Villages

**Kompetisi**: APTIKOM Hackathon 2026  
**Kategori**: Smart Village Technology  
**Tim Pengembang**:
1. Benedito Nidio Da Rosa Maia Tilman
2. Kadek Wahyu Santika Putra
3. Renald Kevin Azzaky  
**Institusi**: Universitas Pendidikan Nasional (Undiknas) Denpasar  
**Versi Dokumen**: 1.0.0  
**Status**: Approved for Development  

---

## 1. Pendahuluan & Latar Belakang

### 1.1 Konteks Masalah
Transformasi digital di tingkat desa sering kali terhambat oleh pendekatan yang hanya berfokus pada "membuat website profil desa". Di lapangan, permasalahan nyata yang dihadapi masyarakat dan perangkat desa meliputi:
- **Informasi Birokrasi Terfragmentasi**: Warga kesulitan mengetahui syarat administrasi (surat domisili, surat keterangan usaha/SKU, pengantar SKCK) sehingga sering bolak-balik ke kantor desa hanya untuk bertanya.
- **Pengaduan Tidak Terstruktur**: Warga menyampaikan keluhan (jalan rusak, lampu penerangan mati, tumpukan sampah, saluran air tersumbat) melalui saluran informal seperti WhatsApp pribadi perangkat desa atau media sosial tanpa ada nomor tiket/pelacakan yang jelas.
- **Beban Kerja Perangkat Desa**: Staf kantor desa kewalahan memilah mana pengaduan darurat (*urgent*) dan mana pengaduan berkala, serta tidak memiliki rekapitulasi data analitik tren masalah di desa mereka.
- **AI yang Hanya Gimmick**: Sebagian besar implementasi AI hanya berupa chatbot generik yang rentan halusinasi dan tidak terhubung ke alur birokrasi nyata.

### 1.2 Visi Produk
**DesaAI** bukan sekadar chatbot, melainkan *AI-Powered Operating System* yang menghubungkan warga (*Citizen*) dengan pemerintah desa (*Government*) dalam satu ekosistem tertutup (*closed-loop workflow*):
1. **Grounded AI**: Menggunakan Retrieval-Augmented Generation (RAG) berbasis dokumen resmi desa (Perdes, SOP layanan, profil desa).
2. **AI Complaint Intelligence**: Otomatisasi pengelompokan kategori dan pembobotan prioritas laporan warga.
3. **Digital Service Request**: Layanan administrasi mandiri dengan nomor registrasi transparan.
4. **Government Dashboard & Analytics**: Dashboard kerja perangkat desa untuk *triage*, disposisi, dan visualisasi tren masalah desa.

---

## 2. Tujuan Produk & Sukses Metrik

### 2.1 Tujuan Utama
1. Menyediakan **satu pintu digital** terpadu untuk warga desa (akses via Web / PWA mobile-friendly).
2. Memangkas waktu tunggu informasi persyaratan administrasi desa dari hitungan jam/hari menjadi hitungan detik melalui AI Village Assistant.
3. Mengotomatisasi klasifikasi pengaduan warga dengan akurasi tinggi menggunakan model AI terstruktur.
4. Memberikan transparansi status penanganan pengaduan dan surat kepada warga secara *real-time*.
5. Menyediakan rekam data analitik berbasis wilayah (Banjar/Dusun) untuk perencanaan APBDes yang berbasis bukti (*evidence-based policy*).

### 2.2 Key Performance Indicators (KPI) untuk Hackathon MVP
- **Response Accuracy**: AI Village Assistant menjawab >90% pertanyaan seputar SOP desa secara akurat sesuai dokumen RAG tanpa halusinasi.
- **Classification Speed**: AI memproses pengaduan warga menjadi kategori & tingkat prioritas dalam waktu <3 detik.
- **End-to-End Workflow**: Alur pengajuan surat dan pengaduan dari sisi warga dapat dilihat, diperbarui, dan diselesaikan di dashboard perangkat desa secara *real-time*.
- **Demo Readiness**: Sistem memiliki data dummy realistis (konteks Banjar/Desa di Bali/Indonesia) dan dapat disimulasikan secara lancar di hadapan dewan juri.

---

## 3. Persona Pengguna (*User Personas*)

### Persona 1: Warga Desa (I Wayan Sukadana, 34 Tahun)
- **Karakter**: Petani & wirausaha lokal, terbiasa menggunakan smartphone (WhatsApp/browser).
- **Pain Points**: Tidak tahu berkas apa yang harus dibawa saat mengurus Surat Izin Usaha, sering mendapati lampu jalan di dekat rumahnya mati tapi bingung lapor ke mana.
- **Needs**: Akses web yang ringan di smartphone, bahasa santai/natural, formulir pengajuan simpel tanpa istilah birokrasi rumit, serta adanya notifikasi status tindak lanjut.

### Persona 2: Perangkat / Staf Kantor Desa (Ni Made Ayu, 28 Tahun)
- **Karakter**: Kepala Seksi Pelayanan di Kantor Desa.
- **Pain Points**: Setiap hari menjawab pertanyaan berulang tentang syarat surat; pesan WhatsApp pribadi penuh laporan warga yang tercecer.
- **Needs**: Dashboard terpusat di PC kantor desa, tabel tiket pengajuan & pengaduan yang rapi, filter prioritas darurat, serta kemudahan mengubah status berkas (Diterima, Diproses, Selesai, Ditolak).

### Persona 3: Kepala Desa / Administrator (I Ketut Budiarta, 50 Tahun)
- **Karakter**: Pengambil keputusan kebijakan desa.
- **Pain Points**: Sulit melihat rekapitulasi data: banjar mana yang infrastrukturnya paling sering rusak, apa kendala pelayanan bulan ini.
- **Needs**: Ringkasan analitik eksekutif, grafik pengaduan per kategori, dan metrik kecepatan penanganan staf desa.

---

## 4. Ruang Lingkup Fitur (*Feature Scope*)

### 4.1 Modul Citizen Platform (Untuk Warga)
1. **AI Village Assistant (Chatbot RAG)**:
   - Chat interaktif berbahasa Indonesia (dan kontekstual lokal).
   - Menjawab pertanyaan SOP administrasi, jam layanan, persyaratan KTP/KK/Surat Pengantar, informasi bansos.
   - Grounded context: Jika pertanyaan di luar kewenangan desa, AI dengan sopan mengarahkan warga ke instansi terkait.
2. **Digital Service Request (Layanan Mandiri)**:
   - Katalog jenis surat:
     - Surat Keterangan Domisili
     - Surat Keterangan Usaha (SKU)
     - Surat Pengantar SKCK
     - Surat Keterangan Tidak Mampu (SKTM)
   - Form input digital (Nama, NIK, Banjar/Dusun, Alasan Pengajuan, Lampiran berkas pendukung).
   - Generasi **Kode Tiket Pelacakan** (misal: `REQ-202609-001`).
   - Halaman pelacakan status permohonan (*Pending, In Review, Ready for Pickup / Approved, Rejected*).
3. **Citizen Complaint System (Pengaduan Warga)**:
   - Formulir lapor cepat: Judul, deskripsi keluhan bebas, pemilihan Banjar/Lokasi spesifik, unggah foto bukti.
   - Feedback langsung dari sistem berupa kode tiket (`CMP-202609-042`).
   - Riwayat dan tracking status pengaduan (*Open, In Progress, Resolved*).

### 4.2 Modul AI & Intelligence Layer
1. **RAG Knowledge Base Engine**:
   - Ingestion dokumen SOP desa (Markdown/Text/PDF).
   - Semantic retrieval untuk menyuplai konteks resmi ke prompt LLM.
2. **AI Complaint Classifier & Priority Triage**:
   - Menganalisis teks laporan pengaduan secara *zero-shot / few-shot structured output*.
   - Mengekstrak:
     - `category`: *Infrastruktur*, *Kebersihan & Lingkungan*, *Keamanan & Ketertiban*, *Pelayanan Publik*, *Bantuan Sosial*.
     - `priority`: *LOW*, *MEDIUM*, *HIGH*, *EMERGENCY*.
     - `summary`: Ringkasan 1 kalimat untuk tampilan dashboard staf desa.
     - `recommended_action`: Rekomendasi langkah taktis untuk dinas/staf desa terkait.

### 4.3 Modul Government Dashboard (Untuk Perangkat Desa)
1. **Overview & Triage Center**:
   - Ringkasan kartu statistik: Total Laporan Masuk, Laporan Selesai, Pengajuan Surat Pending, Indeks Kepuasan.
   - Notifikasi khusus untuk laporan berstatus *HIGH* atau *EMERGENCY*.
2. **Manajemen Pengajuan Layanan (Service Requests Desk)**:
   - Daftar permohonan surat masuk.
   - Modal detail verifikasi data warga.
   - Aksi: Setujui (Approve), Minta Revisi Berkas, Tolak (dengan catatan alasan).
3. **Manajemen Pengaduan (Complaint Desk)**:
   - Tabel pengaduan dengan filter kategori, banjar, dan prioritas AI.
   - Tindak lanjut: Update status ke *In Progress* atau *Resolved*, beri catatan petugas lapangan.
4. **Village Analytics & Heatmap**:
   - Grafik distribusi pengaduan per Banjar/Dusun.
   - Tren pengaduan paling sering muncul bulan ini.
   - Rata-rata waktu penyelesaian (*Time-to-Resolution*).
5. **Knowledge Base Manager**:
   - Manajemen dokumen referensi desa (tambah dokumen SOP baru, ubah jam pelayanan, update regulasi).

---

## 5. Kebutuhan Non-Fungsional (*Non-Functional Requirements*)
- **Cross-Platform Dev**: Wajib berjalan konsisten di lingkungan pengembang Windows maupun macOS menggunakan containerization (**Docker & Docker Compose**).
- **Responsive & PWA Ready**: Antarmuka sisi warga harus ringan, mobile-first, dan dapat disimpan di layar utama smartphone (*Add to Home Screen*).
- **Keamanan & Privasi Data**: Data NIK dan data diri warga dilindungi, autentikasi berbasis peran (*Role-Based Access Control*: Citizen, Village Officer, Admin).
- **Code Quality & CI/CD**: Menjaga standar kode tinggi dengan GitHub Actions CI (Automated Linting, Type Check, Build Validation, dan validasi Conventional Commits).

---

## 6. Rencana Rilis & Timeline Hackathon

| Fase | Target Luaran |
| :--- | :--- |
| **Fase 1: Setup & Fondasi** | Dokumentasi (PRD, ERD, Use Case, Activity), Docker compose multi-OS, GitHub Actions CI, GitFlow & Commitlint. |
| **Fase 2: Data Model & Backend Core** | Skema Prisma lengkap, integrasi PostgreSQL, service RAG & AI Complaint Engine. |
| **Fase 3: Citizen UI (PWA)** | Halaman Beranda Warga, AI Assistant Chatbot, Formulir Layanan & Pengaduan, Tracking Tiket. |
| **Fase 4: Government Dashboard** | Dashboard Admin, Triage Laporan, Approval Berkas, Analitik Data Desa, Knowledge Base Admin. |
| **Fase 5: Demo Polish & Presentasi** | Seed data realistis, video pitching, pengujian respons AI, dan gladi demo APTIKOM Hackathon 2026. |

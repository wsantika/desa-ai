# Cheatsheet Tanya-Jawab Teknis & Strategis Dewan Juri

**Kompetisi:** APTIKOM Hackathon 2026  
**Proyek:** DesaAI - Platform Tata Kelola Administrasi & Pengaduan Warga Berbasis AI Multimodal  
**Institusi:** Universitas Pendidikan Nasional (Undiknas), Denpasar  
**Fungsi Dokumen:** Panduan antisipasi pertanyaan kritis dewan juri (Dosen TI, Peneliti AI, Praktisi Industri, dan Birokrat Pemerintah) selama sesi tanya-jawab 5 - 8 menit.

---

## Matriks Delegasi Pembicara

| Ranah Pertanyaan | Delegasi Utama | Pendukung / Backup |
|---|---|---|
| **Arsitektur Teknis, AI/RAG, Database, Performa** | Kadek Wahyu Santika Putra | Benedito Nidio Da Rosa Maia Tilman |
| **Keamanan Data, Regulasi UU PDP, Kebijakan Desa** | Renald Kevin Azzaky | Kadek Wahyu Santika Putra |
| **Visi Produk, Diferensiasi Pasar, Biaya & Adopsi** | Benedito Nidio Da Rosa Maia Tilman | Renald Kevin Azzaky |

---

## 8 Antisipasi Pertanyaan Kritis & Strategi Jawaban

### 1. Penanganan Halusinasi pada AI & Validitas Jawaban RAG
* **Pertanyaan Juri:**  
  *"Model bahasa besar (LLM) terkenal sering berhalusinasi. Bagaimana Anda menjamin warga tidak disesatkan oleh jawaban bot saat menanyakan syarat legal atau hukum desa?"*
* **Penjawab Utama:** Kadek Wahyu Santika Putra
* **Elevator Pitch (15 Detik):**  
  "Kami menerapkan arsitektur **Closed-Domain Retrieval-Augmented Generation (RAG)** terisolasi menggunakan pgvector dengan threshold kesamaan kosinus minimal 0.78, dilengkapi fallback deterministic refusal."
* **Penjelasan Mendalam:**  
  1. **Strict Context Grounding:** LLM tidak diizinkan menjawab berdasarkan memori parametrik umumnya. Sistem menyuntikkan dokumen Peraturan Desa (Perdes) Tegal Tugu dan SOP resmi desa ke dalam prompt konteks sistem.
  2. **Vector Similarity Guardrail:** Pertanyaan warga di-embed secara semantik dan dicocokkan dengan data pgvector. Jika skor kemiripan berada di bawah 0.75, bot secara otomatis memicu pesan fallback aman: *"Informasi spesifik tersebut belum tercatat dalam basis regulasi resmi Desa Tegal Tugu, silakan menghubungi kantor desa atau Kepala Banjar terkait."*
  3. **Source Citation:** Setiap jawaban menyertakan metadata rujukan (nama dokumen, nomor pasal, tanggal perdes), sehingga warga dan aparatur desa dapat memverifikasi sumber hukumnya langsung.
* **Kata Kunci Kredibilitas:** `pgvector`, `Cosine Similarity Filtering`, `Temperature = 0.1`, `Citation-grounded Generation`, `Strict System Prompt Guardrails`.

---

### 2. Kepatuhan Keamanan Data Pribadi (UU PDP No. 27/2022) & NIK
* **Pertanyaan Juri:**  
  *"Data warga desa mencakup NIK, KK, alamat, dan nomor telepon. Bagaimana DesaAI mematuhi UU PDP dan mencegah kebocoran identitas?"*
* **Penjawab Utama:** Renald Kevin Azzaky
* **Elevator Pitch (15 Detik):**  
  "DesaAI menerapkan prinsip **Privacy by Design** dan mematuhi UU No. 27 Tahun 2022 melalui enkripsi field-level AES-256, masking NIK dinamis, dan kontrol akses berbasis peran (RBAC)."
* **Penjelasan Mendalam:**  
  1. **Dynamic Data Masking:** Di tingkat antarmuka umum atau log sistem, NIK selalu ditampilkan dalam format bertopeng (`510403******0001`). Hanya staf desa terotentikasi dengan hak akses terverifikasi yang dapat melihat data penuh saat memvalidasi surat.
  2. **Zero Plaintext Credentials:** Password di-hash menggunakan Argon2id / bcrypt dengan salt dinamis. Akses sesi diamankan dengan HTTP-only, secure, SameSite cookies.
  3. **Audit Trail Imutabel:** Setiap aksi melihat, menyunting, atau mencetak berkas warga dicatat dalam log audit yang mencatat ID aktor, timestamp, dan alamat IP untuk akuntabilitas hukum.
* **Kata Kunci Kredibilitas:** `UU PDP No. 27/2022`, `Role-Based Access Control (RBAC)`, `Data Minimization`, `Field-Level Encryption`, `Immutable Audit Trail`.

---

### 3. Diferensiasi Terhadap OpenSID dan SP4N-LAPOR!
* **Pertanyaan Juri:**  
  *"Pemerintah sudah punya SP4N-LAPOR! untuk aduan, dan banyak desa memakai OpenSID. Mengapa desa membutuhkan DesaAI?"*
* **Penjawab Utama:** Benedito Nidio Da Rosa Maia Tilman
* **Elevator Pitch (15 Detik):**  
  "DesaAI bukan kompetitor pengganti, melainkan lapisan intelijen terdepan (AI-powered edge layer) berbasis banjar yang mengisi celah ketiadaan otomatisasi dan AI pada platform legasi."
* **Penjelasan Mendalam:**  
  1. **Tingkat Granularitas Lokal Banjar:** SP4N-LAPOR! didesain untuk level kementerian hingga pemkab, sehingga laporan selokan mampet di tingkat banjar memakan waktu berminggu-minggu karena birokrasi lintas dinas. DesaAI menyelesaikan isu langsung di level desa dan banjar dalam hitungan jam.
  2. **Multimodal AI Otomatis:** OpenSID adalah sistem manajemen data pasif yang membutuhkan operator mengetik manual. DesaAI menyuntikkan otomasi cerdas: klasifikasi foto otomatis, penentuan tingkat urgensi berbasis computer vision, dan asisten bot interaktif 24/7.
  3. **Potensi Interoperabilitas:** DesaAI dibangun dengan API terbuka standar REST yang siap menjadi middleware untuk menyuplai rekap data pengaduan agregat ke SP4N-LAPOR! atau OpenSID kabupaten.
* **Kata Kunci Kredibilitas:** `Hyper-local Governance`, `Edge AI Automation`, `Interoperability Layer`, `Complementary Ecosystem`.

---

### 4. Kesiapan Menghadapi Wilayah Blank Spot / Internet Lemah
* **Pertanyaan Juri:**  
  *"Banyak desa di Indonesia yang internetnya tidak stabil atau bahkan blank spot. Bagaimana sistem ini bisa bertahan?"*
* **Penjawab Utama:** Kadek Wahyu Santika Putra
* **Elevator Pitch (15 Detik):**  
  "Arsitektur DesaAI mengusung model **Local-First & Edge-Deployable**, di mana aplikasi dapat dihosting pada microserver lokal di kantor desa dengan sinkronisasi periodik ke cloud."
* **Penjelasan Mendalam:**  
  1. **Lightweight Modern Bundle:** Aplikasi web dioptimalkan dengan TanStack Start, di mana aset JavaScript dan CSS di-minify hingga di bawah 150KB pada initial load, memungkinkan akses mulus pada jaringan 3G atau koneksi seluler desa yang lambat.
  2. **Offline Local Deployment:** Engine DesaAI dibungkus dalam kontainer Docker ringan yang dapat berjalan pada mini PC sekelas Intel NUC atau Raspberry Pi di balai desa. Warga dapat terhubung melalui jaringan WiFi lokal Balai Desa (Intranet Desa) tanpa ketergantungan internet eksternal.
  3. **Queue-based Sync:** Data surat dan aduan masuk ke antrean lokal dan otomatis tersinkronisasi ke server pusat saat koneksi internet kembali aktif.
* **Kata Kunci Kredibilitas:** `Local-first Architecture`, `Progressive Enhancement`, `Edge Computing Microserver`, `Docker Containerization`.

---

### 5. Keabsahan Hukum Tanda Tangan Digital & QR Code Dokumen
* **Pertanyaan Juri:**  
  *"Apakah surat bertanda tangan QR Code yang diterbitkan DesaAI diakui secara sah oleh bank atau dinas kependudukan?"*
* **Penjawab Utama:** Renald Kevin Azzaky
* **Elevator Pitch (15 Detik):**  
  "Sesuai UU ITE No. 1 Tahun 2024 dan PP No. 71 Tahun 2019, tanda tangan elektronik bersertifikat memiliki kekuatan hukum penuh setara tanda tangan basah."
* **Penjelasan Mendalam:**  
  1. **Kriptografi Asimetris & Hashing:** Setiap dokumen yang disetujui menghasilkan cryptographic hash SHA-256 unik yang mengunci isi dokumen dari manipulasi. QR Code berisi URL verifikasi publik ber-token anti-tamper.
  2. **Verifikasi Publik Instan:** Pihak ketiga (seperti Bank BRI/BPD Bali atau instansi Disdukcapil) dapat memindai QR Code untuk memeriksa keaslian nomor registrasi, identitas penandatangan (Perbekel/Sekdes), dan stempel waktu resmi.
  3. **Kesiapan Integrasi BSrE BSSN:** Struktur data dirancang kompatibel dengan standar Balai Sertifikasi Elektronik (BSrE) Badan Siber dan Sandi Negara untuk sertifikasi tanda tangan digital resmi instansi pemerintah.
* **Kata Kunci Kredibilitas:** `UU ITE No. 1/2024`, `SHA-256 Document Hash`, `Cryptographic Verification`, `BSrE BSSN Readiness`.

---

### 6. Analisis Biaya Operasional & Kelayakan Finansial (APBDes)
* **Pertanyaan Juri:**  
  *"Berapa biaya operasional server dan konsumsi API LLM untuk satu desa per bulan? Apakah dana desa sanggup membiayainya?"*
* **Penjawab Utama:** Benedito Nidio Da Rosa Maia Tilman
* **Elevator Pitch (15 Detik):**  
  "Sangat efisien. Estimasi biaya operasional DesaAI per desa hanya sekitar Rp 250.000 hingga Rp 400.000 per bulan, atau kurang dari 0.05% dari rata-rata pagu Dana Desa tahunan."
* **Penjelasan Mendalam:**  
  1. **Efisiensi Token AI:** Model RAG kami mengimplementasikan aggressive semantic caching (menyimpan jawaban dari pertanyaan populer seperti syarat SKU). Hanya 20-30% pertanyaan baru yang membutuhkan token inferensi LLM.
  2. **Infrastruktur Terjangkau:** Database PostgreSQL dan web server dapat berjalan stabil di VPS Linux seharga 15-20 USD per bulan yang mampu melayani puluhan ribu permohonan warga per bulan tanpa hambatan.
  3. **Penghematan Langsung:** Desa menghemat ratusan rim kertas, toner printer, dan waktu staf kantor desa senilai jutaan rupiah per bulan, menghasilkan Return on Investment (ROI) positif sejak bulan pertama penerapan.
* **Kata Kunci Kredibilitas:** `Semantic Caching`, `Unit Economics Analysis`, `Minimal Token Overhead`, `High APBDes ROI`.

---

### 7. Inklusi Warga Lansia & Literasi Digital Rendah
* **Pertanyaan Juri:**  
  *"Bagaimana warga lanjut usia atau warga yang tidak memiliki smartphone canggih bisa mengakses layanan DesaAI?"*
* **Penjawab Utama:** Renald Kevin Azzaky
* **Elevator Pitch (15 Detik):**  
  "DesaAI mengusung model **Assisted Digital Citizen**, di mana Kepala Banjar (Kelian Banjar) dan pemuda Karang Taruna bertindak sebagai fasilitator digital bagi warga rentan."
* **Penjelasan Mendalam:**  
  1. **Omnichannel & Fasilitasi Banjar:** Warga yang tidak terbiasa menggunakan smartphone cukup datang ke Balai Banjar saat paruman atau menemui Kelian Banjar. Staf banjar menggunakan DesaAI versi operator untuk memproses berkas mereka dalam 2 menit.
  2. **UI Ramah Inklusi:** Antarmuka warga dirancang mengikuti prinsip WCAG 2.1 AA: kontras teks tinggi, tombol berukuran besar (minimal 44x44 pixel), dan alur navigasi linear tanpa menu yang membingungkan.
  3. **Ekspansi Voice & WhatsApp:** Dalam roadmap kami, interaksi pengaduan dan surat akan diintegrasikan dengan WhatsApp Bot dan voice note recognition dalam bahasa Bali dan Indonesia.
* **Kata Kunci Kredibilitas:** `Assisted Digital Service`, `Kelian Banjar Facilitator`, `WCAG 2.1 AA Standards`, `WhatsApp Bot Roadmap`.

---

### 8. Mitigasi Aduan Palsu, Spam, dan Foto Hoax
* **Pertanyaan Juri:**  
  *"Bagaimana sistem mendeteksi jika ada orang iseng mengirim aduan fiktif atau mengunggah gambar hoax dari internet?"*
* **Penjawab Utama:** Kadek Wahyu Santika Putra
* **Elevator Pitch (15 Detik):**  
  "Sistem kami menggabungkan verifikasi identitas berbasis NIK, ekstraksi metadata EXIF/geolokasi foto, dan pembatasan frekuensi pengajuan (rate limiting)."
* **Penjelasan Mendalam:**  
  1. **Authenticated Reporting:** Pengaduan mewajibkan verifikasi identitas kependudukan. Tidak ada celah bagi bot anonim tak bertanggung jawab untuk membanjiri sistem.
  2. **EXIF & Image Authenticity Guard:** Sistem memeriksa timestamp dan geotag EXIF pada foto yang diunggah untuk memastikan foto diambil di wilayah administratif Desa Tegal Tugu.
  3. **Rate Limiting & Human-in-the-Loop:** Setiap NIK dibatasi maksimal membuat 3 aduan per hari untuk mencegah spamming. Selain itu, AI hanya bertindak sebagai pengklasifikasi awal; keputusan akhir eksekusi tetap berada di tangan perangkat desa (Human-in-the-Loop).
* **Kata Kunci Kredibilitas:** `Human-in-the-loop (HITL)`, `EXIF Geotag Verification`, `Token Bucket Rate Limiting`, `Accountability Trace`.

# Skenario & Storyboard Video Walkthrough Prototype DesaAI

**Kompetisi:** APTIKOM Hackathon 2026  
**Karya:** DesaAI - Platform Tata Kelola Administrasi & Pengaduan Warga Berbasis AI Multimodal  
**Studi Kasus:** Desa Tegal Tugu, Kecamatan Gianyar, Kabupaten Gianyar, Bali  
**Durasi Video:** 4 Menit 15 Detik (Target 3 - 5 Menit)  
**Format:** Rekaman Layar Interaktif (Screen Recording 1080p 60fps) + Audio Voiceover + B-Roll Situasi Desa  

---

## Ringkasan Struktur Video

| Scene | Durasi | Fokus Utama | Target Emosi Penonton |
|---|---|---|---|
| **Scene 1: Hook & Problem** | 00:00 - 00:45 | Masalah birokrasi desa konvensional | Keresahan nyata yang dialami jutaan warga desa |
| **Scene 2: Layanan Surat Mandiri** | 00:45 - 01:45 | Pengajuan surat SKU dengan panduan AI | Kemudahan, kecepatan, dan tanpa ribet |
| **Scene 3: Pengaduan Warga Cerdas** | 01:45 - 02:45 | Laporan foto jalan rusak & RAG tanya-jawab | Transparansi, akurasi klasifikasi AI otomatis |
| **Scene 4: Admin Workspace** | 02:45 - 03:45 | Dashboard operasional Perbekel & Sekdes | Kontrol terpusat, analitik data, dan efisiensi birokrasi |
| **Scene 5: Impact & Closing CTA** | 03:45 - 04:15 | Metrik keberhasilan, scalability, visi desa | Inspiratif, optimis, dan siap diadopsi nasional |

---

## Storyboard & Naskah Minute-by-Minute

### Scene 1: Hook & Problem Statement (00:00 - 00:45)
* **Visual:**
  * 00:00 - 00:15: Montase visual kantor desa yang tutup di sore hari, tumpukan berkas map kertas di meja kantor, dan warga yang harus izin kerja hanya demi mengurus selembar surat keterangan.
  * 00:15 - 00:30: Layar smartphone menampilkan warga mencari informasi pengurusan berkas, tetapi informasi di media sosial tercecer dan tidak ada kepastian estimasi waktu.
  * 00:30 - 00:45: Judul pembuka: **DesaAI: Transformasi Digital Tata Kelola Desa Berbasis Kecerdasan Buatan**. Masuk logo DesaAI dan logo Undiknas Denpasar.
* **On-Screen Text (Lower Third):**
  * "74.961 Desa di Indonesia Masih Menghadapi Hambatan Administrasi Manual"
  * "Waktu Pengurusan Berkas: 2 hingga 5 Hari Kerja"
* **Voiceover (VO):**
  > "Bayangkan Anda seorang pekerja di Gianyar atau perajin di Banjar Tegal Tugu. Anda butuh Surat Keterangan Usaha mendesak untuk pengajuan modal UMKM besok pagi. Namun, jam 3 sore kantor desa sudah tutup, antrean manual panjang, dan Anda tidak tahu dokumen apa saja yang kurang. Di era digital 2026, mengapa pelayanan publik di tingkat paling dekat dengan rakyat, yaitu desa, masih terbelenggu pola manual dan birokrasi lambat? Inilah DesaAI: wujud nyata digitalisasi desa yang hadir melayani warga 24 jam nonstop."

---

### Scene 2: Layanan Surat Mandiri Berbasis AI (00:45 - 01:45)
* **Visual:**
  * 00:45 - 01:00: Kursor membuka peramban web dan menuju portal DesaAI (`localhost:3000` / domain produksi Desa Tegal Tugu). Tampilan beranda modern, responsif, dan ramah pengguna.
  * 01:00 - 01:20: User memilih menu **Layanan Administrasi Surat**, lalu memilih **Surat Keterangan Usaha (SKU)**. Input data form terintegrasi dengan autofill data kependudukan terverifikasi.
  * 01:20 - 01:35: User mengetik deskripsi usaha bengkel motor di Banjar Kaja. Fitur asisten cerdas memverifikasi kelengkapan berkas KTP dan KK secara otomatis.
  * 01:35 - 01:45: Muncul pratinjau (live preview) draft surat resmi berformat standar Kemendagri dengan nomor registrasi unik seketika. Notifikasi nomor tiket permohonan langsung terbit.
* **Aksi UI / Input Demo:**
  * Klik tombol: `Buat Pengajuan Surat`
  * Pilih Jenis: `Surat Keterangan Usaha (SKU)`
  * Masukkan Data Pemohon: Nama `Wayan Sudira`, NIK `5104030101850001`, Banjar `Banjar Kaja`
  * Jenis Usaha: `Usaha Dagang & Perbengkelan Motor Tirta Jaya`
  * Status: Validasi form hijau, tombol `Kirim Permohonan` diklik. Modal sukses menampilkan Nomor Tiket `REQ-202609-0001`.
* **On-Screen Text:**
  * "Verifikasi NIK Terenkripsi & Validasi Otomatis"
  * "Waktu Pengajuan: Kurang dari 60 Detik"
* **Voiceover (VO):**
  > "Melalui DesaAI, warga cukup membuka portal desa dari gawai mereka. Mari kita ajukan Surat Keterangan Usaha. Tanpa perlu mengisi formulir berulang, sistem mengenali data warga yang tervalidasi. Cukup masukkan detail usaha, dan asisten AI memeriksa kelengkapan persyaratan secara instan. Hanya dalam hitungan detik, draft surat terbit lengkap dengan kode pelacakan transparan. Warga tidak perlu bolak-balik bertanya ke balai banjar, progres surat terpantau jelas di genggaman."

---

### Scene 3: Pengaduan Warga Cerdas & RAG Knowledge Base (01:45 - 02:45)
* **Visual:**
  * 01:45 - 02:05: Beralih ke halaman **Lapor Pengaduan Warga**. User mengunggah foto tumpukan sampah material di saluran irigasi Banjar Tengah.
  * 02:05 - 02:25: Model Computer Vision & NLP DesaAI mengidentifikasi kategori laporan sebagai **Lingkungan & Kebersihan**, menetapkan tingkat urgensi **Tinggi**, dan memetakan lokasi ke **Banjar Tengah** secara presisi.
  * 02:25 - 02:45: User membuka widget chat **Tanya DesaAI**. User menanyakan: *"Berapa lama proses pembuatan surat pengantar nikah dan apa saja syaratnya?"*. AI membalas dalam 1 detik dengan jawaban komprehensif mengutip Peraturan Desa Tegal Tugu dan standar Disdukcapil (RAG berbasis pgvector).
* **Aksi UI / Input Demo:**
  * Upload Foto: `sampah-irigasi.jpg`
  * Input Judul Aduan: `Timbunan Limbah Proyek Menghambat Aliran Subak Banjar Tengah`
  * Sistem AI: Menampilkan badge `Kategori Otomatis: Lingkungan Hidup`, `Prioritas: Tinggi`
  * Klik Tab Chatbot RAG: Ketik *"Syarat surat pengantar nikah untuk warga Banjar Kelod"*
  * Jawaban AI: Muncul bullet point dokumen resmi dengan kutipan referensi basis pengetahuan internal desa.
* **On-Screen Text:**
  * "AI Multi-modal: Klasifikasi Foto & Urgensi Otomatis"
  * "RAG Engine: Menjawab Pertanyaan Regulasi Desa 100% Akurat Tanpa Halusinasi"
* **Voiceover (VO):**
  > "Bukan hanya administrasi surat, partisipasi warga dalam menjaga ketertiban desa kini jauh lebih mudah. Cukup foto masalah di lapangan, seperti penyumbatan saluran irigasi ini. Kecerdasan buatan DesaAI secara otomatis mengenali kategori masalah, memetakan banjar terkait, dan menetapkan tingkat urgensi penanganan bagi petugas lapangan. Dan jika warga butuh informasi seputar regulasi desa, fitur Tanya DesaAI berbasis Retrieval-Augmented Generation siap menjawab seketika dengan dasar hukum peraturan desa yang valid dan akurat, tanpa risiko halusinasi."

---

### Scene 4: Admin Workspace & Ekosistem Perangkat Desa (02:45 - 03:45)
* **Visual:**
  * 02:45 - 03:05: Pindah ke tampilan **Workspace Operator & Perbekel** (Login sebagai Sekdes Ni Putu Lestari). Layar menyajikan dashboard analitik: grafik volume permohonan surat mingguan, distribusi aduan per banjar, dan KPI rata-rata waktu penyelesaian layanan.
  * 03:05 - 03:25: Sekdes membuka daftar permohonan surat masuk. Terlihat permohonan SKU Wayan Sudira dari Scene 2 dengan status `Menunggu Verifikasi`. Operator meninjau berkas, klik satu tombol **Setujui & Terbitkan**, dan sistem menghasilkan dokumen PDF resmi lengkap dengan QR Code Tanda Tangan Digital yang terverifikasi secara kriptografis.
  * 03:25 - 03:45: Membuka menu audit trail dan log pengaduan. Terlihat integrasi peta spasial desa yang menunjukkan status tindak lanjut aduan warga.
* **Aksi UI / Input Demo:**
  * URL: `/admin/dashboard`
  * Visualisasi: KPI Waktu Layanan `1.8 Jam` (turun dari 48 jam), Tingkat Kepuasan Warga `98.4%`
  * Klik Detail Surat SKU Wayan Sudira: Klik tombol `Verifikasi Berkas` -> Klik `Tandatangani Dokumen (QR Code)`
  * Unduh Surat Resmi: Menampilkan output PDF dengan layout resmi lambang Garuda / Pemkab Gianyar dan stempel digital desa.
* **On-Screen Text:**
  * "Dashboard Real-time untuk Pengambilan Keputusan Berbasis Data"
  * "Penerbitan Surat Resmi dengan Verifikasi QR Code Kriptografis"
* **Voiceover (VO):**
  > "Kini kita beralih ke sisi perangkat desa. Melalui Workspace Operator DesaAI, Perbekel dan Sekdes memiliki visibilitas penuh terhadap operasional desa. Seluruh data disajikan secara analitis dan real-time. Permohonan SKU yang diajukan Wayan Sudira tadi langsung masuk ke antrean verifikasi. Petugas hanya butuh 30 detik untuk memeriksa validitas data, membubuhkan tanda tangan digital bersertifikat QR Code, dan menerbitkan surat resmi siap cetak. Transparan, aman, dan tercatat dalam sistem audit yang tidak dapat dimanipulasi."

---

### Scene 5: Dampak Nyata, Skalabilitas & Call to Action (03:45 - 04:15)
* **Visual:**
  * 03:45 - 04:00: Infografis metrik dampak hasil uji coba: efisiensi waktu 85%, kepuasan warga 98%, zero berkas tercecer.
  * 04:00 - 04:15: Tampilan arsitektur modern (TanStack Start, Prisma, PostgreSQL pgvector, Tailwind CSS) dan kesiapan multi-tenant untuk desa-desa di seluruh nusantara. Logo DesaAI bersama foto dan nama tim Undiknas Denpasar.
* **On-Screen Text:**
  * "Efisiensi Waktu Pengurusan Surat: Turun 85%"
  * "Siap Diterapkan di 74.000+ Desa Seluruh Indonesia"
  * "Tim Pengembang: Benedito Tilman, Kadek Wahyu Santika Putra, Renald Kevin Azzaky (Universitas Pendidikan Nasional)"
* **Voiceover (VO):**
  > "DesaAI bukan sekadar aplikasi pencatatan, melainkan lompatan revolusioner dalam kedaulatan digital desa. Dari Desa Tegal Tugu Gianyar untuk Indonesia, DesaAI membuktikan bahwa teknologi AI tingkat lanjut mampu memanusiakan birokrasi, menghemat waktu warga, dan mewujudkan tata kelola desa yang akuntabel dan berdaya saing global. Mari bersama kita wujudkan Indonesia cerdas, dimulai dari desa. Terima kasih."

---

## Petunjuk Teknis Perekaman & Editing

1. **Resolusi & Format:**
   * Rekam layar pada resolusi native **1920x1080 (1080p)** dengan rasio 16:9 pada 60 FPS menggunakan OBS Studio atau browser capture native.
   * Gunakan mode light/dark yang konsisten (disarankan tema professional clean desa dengan aksen emerald green).
2. **Kualitas Audio:**
   * Rekam voiceover menggunakan mikrofon kondenser dengan filter pop dan de-noise.
   * Background music (BGM): Instrumental bertempo sedang, bernuansa inspiratif dan modern (volume BGM di-ducking ke -22dB saat VO berbicara).
3. **Penyelarasan Pointer Kursor:**
   * Perbesar kursor mouse sebesar 1.25x dengan ripple visual highlight halus saat melakukan klik aksi penting di UI.
   * Hindari gerakan kursor yang berulang atau ragu-ragu di layar saat mendemonstrasikan alur sistem.

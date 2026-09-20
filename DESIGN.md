# Panduan Desain Sistem & Antarmuka Desa Tegal Tugu (DesaAI)

Dokumen ini mendefinisikan identitas, gaya visual, tipografi, palet warna, dan parameter desain untuk antarmuka publik dan dashboard administrasi Pemerintah Desa Tegal Tugu, Gianyar.

---

## 1. Identitas & Karakter (Identity & Personality)

- **Instansi / Wilayah**: Pemerintah Desa Tegal Tugu, Kecamatan Gianyar, Kabupaten Gianyar, Bali.
- **Karakter Desain**:
  - **Bermartabat & Terpercaya**: Memberikan kesan pelayanan publik resmi yang akuntabel, transparan, dan berwibawa.
  - **Hangat & Membumi**: Merefleksikan kearifan lokal Bali dan kedekatan aparatur banjar dengan warga desa.
  - **Inklusif & Ramah Warga**: Mudah diakses oleh generasi muda hingga lansia dengan kontras warna yang tinggi dan ukuran teks yang nyaman dibaca di layar HP.
  - **Bebas AI-Slop**: Tidak menggunakan tren visual berlebihan (seperti gradien ungu-neon, efek kaca blur berlebihan, atau hiasan tanpa fungsi nyata).

---

## 2. Parameter Dials (R-37)

- **ENERGY: 2 / 5**
  - Tenang, teratur, dan profesional. Fokus pada kejelasan informasi dan kemudahan tindakan warga.
- **RHYTHM: 3 / 5**
  - Variasi ritme yang terukur antara kartu ringkasan, formulir interaktif, dan linimasa pelacakan tanpa pengulangan layout monoton.
- **MOTION: 2 / 5**
  - Transisi halus (150ms - 250ms) pada interaksi tombol, pergantian tab, dan indikator proses. Tidak ada animasi mengambang atau pantulan tanpa fungsi.

---

## 3. Tipografi (Typography)

1. **Display & Judul Utama (Headings)**:
   - Font: `Fraunces` (Google Fonts, Optical Size 9..144, SemiBold 600 / Bold 700).
   - Penggunaan: Judul pahlawan (hero), nama instansi kop desa, dan tajuk kartu utama. Memberikan sentuhan humanis dan kehangatan tradisi cetak resmi.
2. **Body, Label, & Kontrol Antarmuka**:
   - Font: `Manrope` (Google Fonts, Regular 400, Medium 500, SemiBold 600, Bold 700).
   - Penggunaan: Paragraf penjelasan, formulir input, tombol aksi, navigasi bottom bar, dan tabel data. Menjamin keterbacaan tinggi di segala ukuran layar.
3. **Kode Tiket & Identitas Arsip**:
   - Font: `ui-monospace`, `SFMono-Regular`, `Menlo`, `Monaco`, monospace.
   - Penggunaan: Kode tiket (`CMP-YYYYMM-XXXX`, `REQ-YYYYMM-XXXX`), NIK yang disamarkan, dan stempel digital dokumen.

---

## 4. Palet Warna (Color Palette)

### Tema Terang (Light Mode - Alami & Bersih)
- **Sea Ink (Teks & Elemen Kontras Tinggi)**: `#173a40` (rasio kontras > 7:1 terhadap latar).
- **Sea Ink Soft (Teks Sekunder & Panduan)**: `#416166` (rasio kontras > 4.5:1 WCAG AA).
- **Palm / Botanical Emerald (Aksen Utama)**: `#2f6a4a` (tombol tindakan, status aktif, lencana desa).
- **Lagoon Deep (Aksen Penunjang)**: `#328f97` (sorotan interaktif dan tautan).
- **Sand & Foam (Latar Belakang & Shell)**: `#e7f0e8` / `#f3faf5` (latar ramah di mata, tidak putih menyilaukan).
- **Line / Pembatas**: `rgba(23, 58, 64, 0.14)` (garis tipis struktural, bukan dekorasi tebal).

### Tema Gelap (Dark Mode - Rendah Emisi & Nyaman di Malam Hari)
- **Sea Ink Light**: `#d7ece8`
- **Sea Ink Soft**: `#afcdc8`
- **Palm Dark**: `#6ec89a`
- **Lagoon Dark**: `#8de5db`
- **Background Base**: `#0a1418`
- **Surface Card**: `rgba(16, 30, 34, 0.8)`

### Warna Semantik (Status Tindak Lanjut & Pelayanan)
- **Sukses / Disetujui / Selesai**: Emerald (`#15803d` / `#22c55e`).
- **Peringatan / Sedang Diproses**: Amber (`#b45309` / `#f59e0b`).
- **Kedaruratan / Ditolak**: Rose (`#be123c` / `#f43f5e`).
- **Informasi / Menunggu**: Blue (`#1d4ed8` / `#3b82f6`).

---

## 5. Prinsip Antislop & Aksesibilitas (Rules & Standards)

1. **Larangan Tanda Em Dash (R-02)**:
   - Hindari karakter em dash (`—`) pada teks antarmuka dan copywriting warga. Gunakan koma, titik dua, tanda kurung, atau titik.
2. **Keterbacaan & Kontras (R-25 / WCAG AA)**:
   - Seluruh teks wajib memiliki rasio kontras minimal 4.5:1 terhadap latarnya. Hindari abu-abu pudar di atas abu-abu.
3. **Desain Ramah Ponsel (Mobile-First / R-03)**:
   - Target sentuh minimal 44x44px untuk seluruh tombol dan input.
   - Tidak ada overflow horizontal di layar 360px ke atas.
   - Kompatibel dengan Safe Area Inset notch iPhone & tombol sistem Android.
4. **Kelengkapan Fungsional (C-2 & R-26)**:
   - Tidak menampilkan tombol, tab, atau menu mati yang tidak dapat diklik atau tidak memiliki fungsi nyata.
   - Setiap status data selalu memiliki varian: *loading*, *empty state*, dan *error recovery*.
5. **Kejujuran Data & Bukti (C-5, R-17, R-18)**:
   - Tidak menggunakan testimoni fiktif atau angka statistik palsu. Data yang disajikan berasal dari database riil desa.

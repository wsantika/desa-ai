# Panduan Desain Sistem & Antarmuka Desa Tegal Tugu (DesaAI)

Dokumen ini mendefinisikan identitas, gaya visual, tipografi, palet warna, dan parameter desain untuk antarmuka publik dan dashboard administrasi Pemerintah Desa Tegal Tugu, Gianyar.

---

## 1. Identitas & Karakter (Identity & Personality)

- **Instansi / Wilayah**: Pemerintah Desa Tegal Tugu, Kecamatan Gianyar, Kabupaten Gianyar, Bali.
- **Karakter Desain**:
  - **Bersih, Elegan, & Terpercaya (Clean White & Royal Blue)**: Nuansa institusi publik modern dengan latar putih bersih, kanvas slate-50 yang lembut di mata, dan aksen biru royal yang berwibawa.
  - **Sederhana & Humanis**: Tata letak yang lapang (airy whitespace), hierarki visual yang jelas, dan navigasi yang langsung menuju kebutuhan warga tanpa distraksi ornamen berlebihan.
  - **Inklusif & Ramah Warga**: Mudah diakses oleh generasi muda hingga lansia dengan kontras warna teks tinggi (WCAG AA compliant) dan ukuran target sentuh minimal 44x44px.
  - **Bebas AI-Slop**: Menghilangkan gradien neon acak, bento grid berantakan, efek kaca (glassmorphism) berlebih, dan ornamen dekoratif tanpa fungsi.

---

## 2. Parameter Dials (R-37)

- **ENERGY: 2 / 5**
  - Tenang, tertata, dan profesional. Fokus pada kejelasan informasi administrasi dan kemudahan penyampaian pengaduan warga.
- **RHYTHM: 2 / 5**
  - Komposisi seimbang dan terstruktur antara kartu ringkasan, formulir pengajuan, dan linimasa pelacakan tanpa kejenuhan layout monoton.
- **MOTION: 1 / 5**
  - Gerakan halus terarah pada hover dan fokus (150ms - 200ms). Tidak ada elemen yang berdenyut atau mengambang secara terus-menerus tanpa interaksi pengguna.

---

## 3. Tipografi (Typography)

1. **Display, Headings, & Kontrol Antarmuka**:
   - Font: `Plus Jakarta Sans`, `Inter`, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif.
   - Penggunaan: Judul utama, tajuk seksi, label navigasi, tombol tindakan, dan isi teks. Bersih, modern, dan sangat nyaman dibaca di layar smartphone maupun monitor kantor.
2. **Kode Tiket & Identitas Arsip**:
   - Font: `ui-monospace`, `SFMono-Regular`, `Menlo`, `Monaco`, monospace.
   - Penggunaan: Kode tiket (`CMP-YYYYMM-XXXX`, `REQ-YYYYMM-XXXX`), NIK warga yang disamarkan, dan nomor registrasi surat resmi.

---

## 4. Palet Warna (Color Palette)

### Tema Terang (Light Mode: Putih & Biru Elegan)
- **Latar Kanvas (Background Canvas)**: `#f8fafc` (Slate 50, bersih dan lembut di mata).
- **Permukaan Kartu (Card Surface)**: `#ffffff` (Putih murni dengan pembatas tegas).
- **Teks Utama (High Contrast Text)**: `#0f172a` (Slate 900, rasio kontras > 12:1 terhadap latar).
- **Teks Sekunder (Secondary & Guidance Text)**: `#475569` (Slate 600, rasio kontras > 5.5:1 WCAG AA).
- **Biru Utama (Royal Blue / Primary Brand)**: `#1d4ed8` (Blue 700 / `#2563eb` Blue 600 untuk tombol utama, tab aktif, dan status resmi).
- **Biru Gelap (Deep Navy / Header & Authority)**: `#0f172a` (Aksen wibawa pemerintahan).
- **Garis & Pembatas (Borders & Dividers)**: `#e2e8f0` (Slate 200, pembatas halus teratur).
- **Sorotan Lembut (Blue Tint Surface)**: `#eff6ff` (Blue 50, kartu highlight atau bantuan).

### Tema Gelap (Dark Mode: Deep Navy & Slate)
- **Latar Kanvas (Background Canvas)**: `#020617` (Slate 950).
- **Permukaan Kartu (Card Surface)**: `#0f172a` (Slate 900).
- **Teks Utama**: `#f8fafc` (Slate 50).
- **Teks Sekunder**: `#94a3b8` (Slate 400).
- **Biru Utama**: `#3b82f6` (Blue 500).
- **Garis & Pembatas**: `#1e293b` (Slate 800).

### Warna Semantik (Status Tindak Lanjut & Pelayanan)
- **Sukses / Disetujui / Selesai**: Emerald (`#16a34a` / `#22c55e`).
- **Peringatan / Sedang Diproses**: Amber (`#d97706` / `#f59e0b`).
- **Kedaruratan / Ditolak**: Red / Rose (`#dc2626` / `#ef4444`).
- **Informasi / Menunggu**: Blue (`#1d4ed8` / `#3b82f6`).

---

## 5. Prinsip Antislop & Aksesibilitas (Rules & Standards)

1. **Larangan Tanda Em Dash (R-02)**:
   - Hindari karakter em dash (tanda pisah panjang) pada seluruh teks antarmuka dan copywriting warga. Gunakan koma, titik dua, tanda kurung, atau titik.
2. **Keterbacaan & Kontras (R-25 / WCAG AA)**:
   - Seluruh teks wajib memiliki rasio kontras minimal 4.5:1 terhadap latarnya. Hindari abu-abu pudar di atas abu-abu.
3. **Desain Ramah Ponsel (Mobile-First / R-03)**:
   - Target sentuh minimal 44x44px untuk seluruh tombol dan input.
   - Tidak ada overflow horizontal di layar 360px ke atas.
   - Kompatibel dengan Safe Area Inset notch iPhone & navigasi Android.
4. **Kelengkapan Fungsional (C-2 & R-26)**:
   - Tidak menampilkan tombol, tab, atau menu mati yang tidak dapat diklik atau tidak memiliki fungsi nyata.
   - Setiap komponen data wajib memiliki varian: *loading*, *empty state*, dan *error recovery*.
5. **Kejujuran Data & Bukti (C-5, R-17, R-18)**:
   - Tidak menggunakan testimoni fiktif atau angka statistik palsu. Data yang disajikan berasal dari database riil desa.

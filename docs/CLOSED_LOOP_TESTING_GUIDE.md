# Panduan Pengujian Alur Tertutup (Closed-Loop Workflow Testing)
## DesaAI: Citizen-to-Government Operating System

**Dokumen**: Panduan Gladi Resik Pengujian & Skenario Walkthrough  
**Target Milestone**: Phase 6 (Demo Prototype & Pitching APTIKOM Hackathon 2026)  
**Wilayah Implementasi**: Desa Tegal Tugu, Kecamatan Gianyar, Kabupaten Gianyar, Bali  

---

## 1. Ikhtisar Arsitektur Closed-Loop

Keunggulan utama produk DesaAI di hadapan dewan juri adalah alur kerja tertutup dua arah (*closed-loop workflow*) yang menghubungkan warga desa (*Citizen*) dengan perangkat desa (*Government*) secara real-time dan transparan.

```mermaid
flowchart TD
    subgraph Warga["Sisi Warga (Portal Digital & PWA)"]
        A1[1. Tanya Syarat ke AI Made Tegal Tugu] --> A2[2. Isi Formulir Layanan / Pengaduan]
        A2 --> A3[3. Terima Kode Unik REQ / CMP]
        A4[6. Lacak Status Real-time] <-- Notifikasi Transparan -- A3
    end

    subgraph Backend["DesaAI Core Engine"]
        B1[(PostgreSQL + pgvector)]
        B2[AI Triage & RAG Embedding]
    end

    subgraph Perangkat["Sisi Perangkat Desa (Admin Dashboard)"]
        C1[4. Meja Kerja Triage / Verifikasi Layanan]
        C2[5. Telaah Berkas & Disposisi Status]
        C3[7. Analitik Tren & Rekomendasi Musrenbangdes]
    end

    A1 -.-> B2
    A2 --> B1
    B2 --> C1
    C1 --> C2
    C2 --> B1
    B1 --> A4
    B1 --> C3
```

---

## 2. Kredensial Akun Pengujian & Demo

Seluruh data akun telah terdaftar di database lokal hasil proses seed:

| Peran (Role) | Nama Pengguna | Email Login | Password Demo | Wilayah Banjar |
| :--- | :--- | :--- | :--- | :--- |
| **Administrator** | I Gusti Ngurah Agung | `admin@desa-ai.id` | `Password123!` | Kantor Desa Tegal Tugu |
| **Petugas Pelayanan** | Ni Made Sri Wahyuni | `petugas@desa-ai.id` | `Password123!` | Banjar Kaja |
| **Warga 1** | I Wayan Agus Pratama | `warga@desa-ai.id` | `Password123!` | Banjar Kaja |
| **Warga 2** | Ni Ketut Dewi Lestari | `ketut.dewi@desa-ai.id` | `Password123!` | Banjar Kelod |
| **Warga 3** | I Nyoman Budiartha | `nyoman.budiartha@desa-ai.id` | `Password123!` | Banjar Tengah |
| **Warga 4** | Ni Putu Ayu Saraswati | `putu.saraswati@desa-ai.id` | `Password123!` | Banjar Kangin |
| **Warga 5** | I Made Bagus Wijaya | `made.bagus@desa-ai.id` | `Password123!` | Banjar Kauh |

---

## 3. Skenario Uji 1: Layanan Persuratan Mandiri Closed-Loop

Tujuan: Membuktikan bahwa warga dapat bertanya ke asisten AI resmi, diarahkan ke form yang tepat, mengajukan surat, dan petugas dapat menyetujui langsung dari meja kerja verifikasi.

### Langkah-Langkah Pengujian:

1. **Konsultasi Persyaratan ke AI Desa (`/asisten`)**
   - Akses: Buka halaman `http://localhost:3000/asisten`.
   - Aksi: Ketik pertanyaan: *"Om Swastyastu, apa saja syarat membuat Surat Keterangan Domisili di Desa Tegal Tugu?"*
   - Verifikasi:
     - Asisten AI (Made Tegal Tugu) menjawab grounded berdasarkan SOP resmi desa (bebas biaya, syarat KTP, KK, pengantar banjar).
     - Tombol cepat (*action link*) muncul mengarahkan ke `Ajukan Surat Domisili Online`.

2. **Pengisian Formulir Permohonan Surat (`/layanan`)**
   - Akses: Buka halaman `http://localhost:3000/layanan` atau klik tombol cepat dari asisten.
   - Aksi:
     - Pilih jenis layanan: `Surat Keterangan Domisili`.
     - Isi data pemohon: NIK `5171010303920003`, Nama `I Wayan Agus Pratama`, Banjar `Banjar Kaja`.
     - Masukkan keperluan: *Pembukaan rekening tabungan bisnis bank BPD Bali Kantor Cabang Gianyar*.
     - Unggah dokumen simulasi (KTP dan KK).
     - Klik tombol `Kirim Permohonan Surat`.
   - Verifikasi:
     - Kartu tanda terima sukses muncul menampilkan kode pelacakan unik (contoh: `REQ-202609-XXXX`).
     - Estimasi penyelesaian tertera 1 hari kerja dan bebas biaya (Rp 0).

3. **Verifikasi oleh Petugas di Meja Kerja Admin (`/admin/layanan`)**
   - Akses: Buka halaman `http://localhost:3000/admin/layanan`.
   - Aksi:
     - Periksa tab status `Antrean Baru (Pending)`.
     - Temukan permohonan atas nama *I Wayan Agus Pratama*.
     - Klik tombol `Periksa Berkas` untuk melihat rincian dokumen dan identitas pemohon.
     - Ubah status menjadi `Sedang Ditelaah (IN_REVIEW)` dengan catatan: *"Berkas KTP dan KK lengkap, sedang disiapkan lembar surat resmi."*
     - Klik `Setujui & Terbitkan Surat (APPROVED)` dengan catatan: *"Surat Keterangan Domisili telah ditandatangani Perbekel Desa Tegal Tugu."*
   - Verifikasi:
     - Counter tab diperbarui secara real-time.
     - Permohonan berpindah ke tab `Disetujui`.

4. **Pelacakan Status oleh Warga (`/layanan` -> Tab Lacak)**
   - Akses: Buka halaman `http://localhost:3000/layanan` pada tab `Lacak Status`.
   - Aksi: Masukkan kode pelacakan tiket permohonan.
   - Verifikasi:
     - Status ditampilkan `Disetujui: Surat Siap Diambil`.
     - Catatan petugas dari kantor desa tampil transparan di layar warga.
     - Linimasa riwayat status menampilkan rekam jejak lengkap dari pendaftaran hingga persetujuan.

---

## 4. Skenario Uji 2: Pengaduan Fasilitas Cerdas & AI Triage Closed-Loop

Tujuan: Membuktikan klasifikasi cerdas AI terhadap laporan warga secara otomatis, disposisi penugasan teknisi lapangan di meja triage admin, hingga konfirmasi tuntas penyelesaian.

### Langkah-Langkah Pengujian:

1. **Pelaporan Masalah oleh Warga (`/pengaduan`)**
   - Akses: Buka halaman `http://localhost:3000/pengaduan`.
   - Aksi:
     - Judul Laporan: *Lampu penerangan jalan padam di tikungan tajam Pura Dalem*.
     - Asal Banjar: Pilih `Banjar Kauh`.
     - Lokasi Spesifik: *Tikungan jalan sebelah barat Pura Dalem Banjar Kauh*.
     - Deskripsi: *Lampu jalan sudah mati selama 4 hari berturut-turut, kondisi jalan sangat gelap gulita di tikungan tajam sehingga rawan kecelakaan bagi pemotor malam hari.*
     - Data Pelapor: Masukkan nama *I Made Bagus Wijaya* dan nomor WhatsApp.
     - Klik `Kirim Laporan Pengaduan`.
   - Verifikasi:
     - Sistem AI secara instan mengevaluasi isi laporan tanpa jeda.
     - Kategori otomatis terdeteksi sebagai `Infrastruktur Jalan & Bangunan`.
     - Tingkat urgensi dinilai sebagai `Tinggi (High)` atau `Darurat (Emergency)`.
     - Nomor tiket unik diterbitkan dengan format `CMP-202609-XXXX`.

2. **Pemeriksaan di Meja Triage Admin (`/admin/triage`)**
   - Akses: Buka halaman `http://localhost:3000/admin/triage`.
   - Aksi:
     - Periksa kolom `Menunggu Disposisi (Open)`.
     - Temukan tiket pengaduan lampu padam Banjar Kauh.
     - Periksa kartu analisis kecerdasan buatan: Confidence Score, Ringkasan Eksekutif, dan Rekomendasi Tindakan Dinas.
     - Klik `Tindak Lanjut Lapangan (IN_PROGRESS)`.
     - Masukkan catatan penugasan: *"Petugas teknisi sarana desa dikerahkan ke lokasi bersama Kelian Banjar Kauh untuk perbaikan saklar dan bohlam LED baru."*
   - Verifikasi:
     - Kartu pengaduan berpindah ke kolom `Sedang Ditangani (In Progress)`.

3. **Penyelesaian Laporan oleh Perangkat Desa**
   - Akses: Masih pada kartu di Meja Triage.
   - Aksi:
     - Klik tombol `Tandai Selesai (RESOLVED)`.
     - Berikan catatan bukti penanganan: *"Penggantian 2 titik bohlam LED hemat energi tuntas. Lampu penerangan tikungan Pura Dalem kembali menyala terang normal."*
   - Verifikasi:
     - Status tersimpan `RESOLVED` dan waktu penyelesaian (*resolvedAt*) tercatat otomatis.

4. **Pelacakan Warga & Validasi Transparansi (`/pengaduan` -> Tab Lacak)**
   - Akses: Buka halaman `http://localhost:3000/pengaduan` pada tab `Lacak Tiket`.
   - Aksi: Masukkan nomor tiket `CMP-202609-XXXX`.
   - Verifikasi:
     - Status ditampilkan hijau `Selesai Ditindaklanjuti`.
     - Catatan tindakan petugas lapangan terbaca dengan jelas oleh warga pelapor.

5. **Dampak ke Dashboard Analitik & Musrenbangdes (`/admin/analitik`)**
   - Akses: Buka halaman `http://localhost:3000/admin/analitik`.
   - Verifikasi:
     - Metrik total pengaduan dan tingkat penyelesaian (SLA) otomatis teragregasi.
     - Diagram distribusi banjar menampilkan data untuk kelima banjar (Kaja, Kelod, Tengah, Kangin, Kauh).
     - Ringkasan perencanaan Musrenbangdes Desa Tegal Tugu merangkum isu prioritas infrastruktur penerangan jalan.

---

## 5. Checklist Verifikasi Teknis (Automated Testing)

Sebelum sesi gladi resik dan rekaman demo dimulai, pastikan seluruh pengujian otomatis lulus:

```bash
# 1. Pastikan Docker PostgreSQL aktif
docker compose up -d

# 2. Sinkronisasi skema dan seeding data realistis
npx prisma db push --accept-data-loss
npm run db:seed

# 3. Jalankan pengujian closed-loop end-to-end
node --import tsx --test tests/infrastructure/closed-loop-workflow.test.ts

# 4. Jalankan seluruh pengujian repositori
npm run test

# 5. Pastikan zero error pada linting dan build produksi
npm run lint
npm run build
```

Semua pengujian pada checklist di atas telah terbukti lulus 100% tanpa kesalahan jaringan, crash, ataupun state mismatch.

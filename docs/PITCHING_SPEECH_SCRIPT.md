# Naskah Presentasi Pitching Tim DesaAI

**Kompetisi:** APTIKOM Hackathon 2026  
**Karya Inovasi:** DesaAI - Platform Tata Kelola Administrasi & Pengaduan Warga Berbasis AI Multimodal  
**Institusi:** Universitas Pendidikan Nasional (Undiknas), Denpasar, Bali  
**Total Alokasi Waktu:** 7 Menit Presentasi (diikuti 5 - 8 Menit Sesi Tanya-Jawab Juri)  
**Anggota Tim:**
1. **Benedito Nidio Da Rosa Maia Tilman** (Team Leader / Product Vision & Problem)
2. **Kadek Wahyu Santika Putra** (Lead Fullstack & AI Engineer / Technical Architecture & Live Demo)
3. **Renald Kevin Azzaky** (Government Operations & UX Specialist / Tata Kelola, Keamanan & Roadmap)

---

## Pembagian Waktu & Giliran Bicara

```
00:00 - 02:30 | Benedito Nidio Da Rosa Maia Tilman (Opening, Problem, Solusi)
02:30 - 05:15 | Kadek Wahyu Santika Putra (Arsitektur Teknis, AI RAG, & Demo Sistem)
05:15 - 06:45 | Renald Kevin Azzaky (Tata Kelola Banjar, Keamanan UU PDP, & Dampak)
06:45 - 07:00 | Benedito Nidio Da Rosa Maia Tilman (Closing Vision & Tagline)
```

---

## Naskah Lengkap Pitching 7 Menit

### Bagian 1: Latar Belakang, Problem, & Visi Solusi (00:00 - 02:30)
**Pembicara:** Benedito Nidio Da Rosa Maia Tilman  
**Posisi:** Berdiri di tengah panggung, suara lantang, percaya diri, dan membangun kontak mata dengan juri.

---

**[00:00 - 00:45 | Slide 1: Judul & Opening Hook]**  
*(Visual: Slide 1 - Cover DesaAI & Profil Tim Undiknas)*

> "Om Swastyastu, Selamat pagi dan salam sejahtera bagi Dewan Juri yang terhormat dan rekan-rekan inovator APTIKOM Hackathon 2026.  
> 
> Bayangkan skenario ini: Seorang petani atau pengrajin di Desa Tegal Tugu Gianyar membutuhkan Surat Keterangan Usaha mendesak untuk pencairan kredit modal usaha bank esok pagi. Namun, jam 3 sore balai desa sudah tutup. Warga harus izin kerja setengah hari, mengantre di loket desa, dan kecewa saat diberitahu bahwa berkas fotokopi KK miliknya kurang lengkap.  
> 
> Di era digital di mana kita bisa memesan tiket pesawat dan makanan dalam hitungan detik, mengapa urusan birokrasi paling mendasar di tingkat desa masih berjalan seperti 20 tahun yang lalu?"

---

**[00:45 - 01:45 | Slide 2: Akar Permasalahan Birokrasi Desa]**  
*(Transisi: [Ganti Slide: Slide 2 - Problem Statement & Fenomena 74.000 Desa])*

> "Masalah ini bukan hanya terjadi di Gianyar. Dari 74.961 desa di seluruh Indonesia, terdapat 3 bottleneck utama yang melumpuhkan produktivitas pelayanan publik:  
> Pertama, birokrasi manual berbasis kertas yang memakan waktu 2 hingga 5 hari kerja hanya untuk selembar surat keterangan.  
> Kedua, kanal pengaduan warga yang pasif dan sporadis. Keluhan lampu jalan mati atau tumpukan sampah sering kali hanya berakhir di grup WhatsApp banjar tanpa tindak lanjut terukur.  
> Ketiga, beban kerja aparatur desa yang tinggi namun minim dukungan otomatisasi data.  
> Akibatnya, kepercayaan warga menurun dan tata kelola desa tertinggal dari arus transformasi digital nasional."

---

**[01:45 - 02:30 | Slide 3: Memperkenalkan DesaAI]**  
*(Transisi: [Ganti Slide: Slide 3 - Solusi DesaAI & Value Proposition])*

> "Untuk menjawab persoalan tersebut, kami dari Universitas Pendidikan Nasional mempersembahkan: **DesaAI**.  
> DesaAI adalah platform tata kelola pemerintahan desa cerdas yang memadukan automasi administrasi surat mandiri, sistem respons aduan multimodal berbasis AI, serta asisten regulasi desa dengan teknologi Retrieval-Augmented Generation.  
> DesaAI mentransformasi kantor desa konvensional menjadi kantor desa digital yang beroperasi 24 jam sehari, 7 hari seminggu, tanpa menambah beban kerja staf desa.  
> Bagaimana arsitektur dan keandalan sistem kami dibangun? Rekan saya, Kadek Wahyu Santika Putra, akan memaparkannya secara mendalam."

---

### Bagian 2: Arsitektur Teknis, Inovasi AI & Demonstrasi Prototype (02:30 - 05:15)
**Pembicara:** Kadek Wahyu Santika Putra  
**Posisi:** Melangkah maju, mengoperasikan remote kendali slide dan pointer layar demo.

---

**[02:30 - 03:15 | Slide 4: Arsitektur Sistem & Modern Tech Stack]**  
*(Transisi: [Ganti Slide: Slide 4 - Arsitektur Fullstack & Infrastruktur Cloud])*

> "Terima kasih, Benedito. Dewan Juri yang terhormat, keandalan DesaAI ditopang oleh arsitektur web modern fullstack berkinerja tinggi.  
> Kami membangun DesaAI menggunakan framework **TanStack Start** berbasis React 19 dan TypeScript end-to-end, menghasilkan server-side rendering ultra-cepat dan rendering UI yang responsif di segala perangkat warga.  
> Pada lapisan basis data, kami menggunakan **PostgreSQL** yang diperkuat ekstensi **pgvector** untuk pencarian semantik vektor instan, diorkestrasikan dengan **Prisma ORM** yang menjamin integritas skema data secara type-safe.  
> Seluruh alur kerja divalidasi dengan test suite komprehensif berisi 114 automated tests, menjamin ketersediaan sistem hingga taraf production-ready."

---

**[03:15 - 04:00 | Slide 5: Mesin AI Multimodal & RAG Terkurasi]**  
*(Transisi: [Ganti Slide: Slide 5 - Alur AI Multimodal & Retrieval-Augmented Generation])*

> "Inovasi inti DesaAI terletak pada dua mesin kecerdasan buatan utama:  
> Pertama, **Vision & NLP Classifier** untuk pengaduan warga. Ketika warga memotret masalah fisik lingkungan, model AI multimodal kami mengidentifikasi objek, mengklasifikasi kategori dinas terkait, serta memperkirakan tingkat keparahan laporan secara otomatis tanpa intervensi manual.  
> Kedua, **RAG Knowledge Assistant**. Masalah umum pada chatbot LLM publik adalah risiko halusinasi. DesaAI mengeliminasi risiko tersebut dengan teknik embedding dokumen lokal regulasi Perdes Desa Tegal Tugu ke dalam vector database. Ketika warga bertanya seputar hukum desa atau syarat administrasi, AI hanya merujuk pada basis hukum resmi yang valid dengan mencantumkan pasal dan regulasi asli."

---

**[04:00 - 05:15 | Slide 6 & 7: Demonstrasi Prototype Nyata]**  
*(Transisi: [Ganti Slide: Slide 6 & 7 - Live Prototype Demo: Portal Warga & Admin Workspace])*

> "Mari kita saksikan prototype DesaAI secara langsung.  
> Di layar tampak antarmuka portal warga Desa Tegal Tugu. Saat warga ingin mengajukan Surat Keterangan Usaha, asisten cerdas memverifikasi kelengkapan identitas NIK dan persyaratan secara instan dalam kurun waktu kurang dari 60 detik.  
> Begitu pula pada kanal aduan: foto saluran irigasi yang tersumbat di Banjar Tengah teridentifikasi seketika sebagai kategori lingkungan dengan prioritas tinggi.  
> Beralih ke Workspace Perbekel dan Sekretaris Desa, aparatur desa disajikan dashboard analitik real-time. Dokumen yang diajukan warga ditinjau dalam satu klik, lalu diterbitkan dengan stempel digital ber-QR Code kriptografis yang anti-pemalsuan. Dari yang tadinya butuh 3 hari, kini selesai dalam 15 menit.  
> Aspek tata kelola, kepatuhan hukum, dan dampak sosialnya akan dilanjutkan oleh rekan saya, Renald Kevin Azzaky."

---

### Bagian 3: Tata Kelola Banjar, Kepatuhan Regulasi, & Dampak Nyata (05:15 - 06:45)
**Pembicara:** Renald Kevin Azzaky  
**Posisi:** Melangkah ke depan dengan bahasa tubuh meyakinkan, menekankan nilai sosial dan kepatuhan hukum.

---

**[05:15 - 05:45 | Slide 8 & 9: Inklusi Banjar & Kepatuhan UU Perlindungan Data Pribadi]**  
*(Transisi: [Ganti Slide: Slide 8 & 9 - Tata Kelola Lokal Banjar & Kepatuhan UU PDP No. 27/2022])*

> "Terima kasih, Kadek. Dewan juri yang kami hormati, secanggih apa pun teknologi, kuncinya adalah adopsi masyarakat dan kepatuhan hukum.  
> DesaAI dirancang khusus dengan sensitivitas kearifan lokal. Di Bali, unit sosial terdekat masyarakat adalah **Banjar**. Sistem kami memetakan data hingga 5 banjar di Desa Tegal Tugu: Banjar Kaja, Kelod, Tengah, Kangin, dan Kauh, memastikan kepala banjar (Kelian Banjar) terhubung erat dalam siklus aduan warga.  
> Dari sisi keamanan informasi, DesaAI tunduk sepenuhnya pada **Undang-Undang Perlindungan Data Pribadi Nomor 27 Tahun 2022**. Data sensitif seperti NIK dan nomor kontak warga kami lindungi dengan enkripsi end-to-end, penyembunyian identitas (masking), serta role-based access control bertingkat sehingga data warga aman dari ancaman kebocoran."

---

**[05:45 - 06:45 | Slide 10 & 11: Metrik Dampak Terukur & Kelayakan Skalabilitas]**  
*(Transisi: [Ganti Slide: Slide 10 & 11 - Metrik Dampak Teruji & Rencana Roadmap Nasional])*

> "Melalui uji coba closed-loop dengan dataset realistis, DesaAI mencatatkan lompatan efisiensi yang signifikan:  
> Waktu pemrosesan dokumen terpangkas hingga 85 persen. Kepuasan warga naik menjadi 98 persen, dan penggunaan kertas kantor desa terpangkas drastis menuju zero-paper governance.  
> Dari segi biaya operasional, arsitektur open-source DesaAI sangat hemat anggaran, hanya membutuhkan infrastruktur server minimal yang sangat terjangkau bagi APBDes.  
> Roadmap kami siap membawa DesaAI dari percontohan Desa Tegal Tugu Gianyar, menuju adopsi antardesa se-Kabupaten Gianyar, hingga replikasi nasional di ribuan desa di seluruh Indonesia."

---

### Bagian 4: Penutup & Visi Besar (06:45 - 07:00)
**Pembicara:** Benedito Nidio Da Rosa Maia Tilman  
**Posisi:** Ketiga anggota tim berdiri berjajar rapat di depan panggung, gestur menyatukan tekad.

---

**[06:45 - 07:00 | Slide 12: Penutup & Tagline]**  
*(Transisi: [Ganti Slide: Slide 12 - Kesimpulan & Call to Action])*

> "Dewan Juri yang kami hormati, kemajuan sebuah bangsa tidak diukur dari megahnya gedung di ibu kota, melainkan dari kemandirian dan kesejahteraan masyarakat di desa-desa terdepan.  
> Dengan DesaAI, kami membuktikan bahwa kecerdasan buatan bukan hanya milik korporasi multinasional, melainkan hak seluruh warga desa untuk menikmati pelayanan publik yang adil, cepat, dan transparan.  
> Bersama DesaAI: *Desa Cerdas, Warga Berdaya, Menuju Indonesia Emas 2045*.  
> 
> Terima kasih. Kami siap menyambut pertanyaan dan masukan berharga dari Dewan Juri."  
> *(Ketiga presenter membungkuk hormat: "Matur Suksma, Om Shanti Shanti Shanti Om")*

---

## Panduan Gestur, Tempo, & Antisipasi Teknis Panggung

1. **Pengendalian Tempo Bicara:**
   * Batasi kecepatan bicara pada rata-rata 130 - 140 kata per menit. Jangan terburu-buru saat menyebutkan angka statistik atau nama teknologi.
   * Gunakan jeda dramatis 1.5 detik setelah pertanyaan retoris di Slide 1 untuk memancing atensi juri.
2. **Kompak dalam Transisi:**
   * Saat giliran bicara berpindah, presenter berikutnya melangkah maju setengah langkah sementara presenter sebelumnya mundur dengan tenang.
   * Pertahankan kontak mata dengan dewan juri, jangan membaca teks slide secara verbatim.
3. **Peralihan ke Sesi Q&A:**
   * Ketika juri bertanya, Benedito sebagai Team Leader menerima pertanyaan terlebih dahulu, lalu secara profesional mengarahkan delegasi jawaban teknis kepada Kadek Wahyu atau regulasi/operasional kepada Renald Kevin.

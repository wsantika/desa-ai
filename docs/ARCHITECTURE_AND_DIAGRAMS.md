# System Architecture & Diagrams
## DesaAI — AI-Powered Operating System for Smart Villages

Dokumen ini memuat arsitektur sistem, **Use Case Diagram**, dan **Activity Diagram** untuk alur utama sistem DesaAI sesuai dengan proposal APTIKOM Hackathon 2026.

---

## 1. High-Level System Architecture

```mermaid
flowchart TB
    subgraph PresentationLayer["1. Presentation Layer (Antarmuka Pengguna)"]
        A["Citizen Web / PWA (Mobile-First)"]
        B["Government Dashboard (Desktop/Tablet)"]
    end

    subgraph ApplicationLayer["2. Application & API Layer (TanStack Start / Router)"]
        C["Auth & RBAC Middleware (Citizen, Officer, Admin)"]
        D["Service Request Controller"]
        E["Complaint Management Controller"]
        F["Knowledge Base Controller"]
        G["Analytics & Aggregation Engine"]
    end

    subgraph AILayer["3. AI & Intelligence Layer"]
        H["AI Village Assistant (RAG Chat Agent)"]
        I["AI Complaint Intelligence (Classification & Urgency Triage)"]
        J["Document Chunking & Vector Search Engine"]
        K["LLM Provider (Google Gemini / OpenAI via API)"]
    end

    subgraph DataLayer["4. Data & Persistence Layer"]
        L[("PostgreSQL Database (Relational Core)")]
        M[("Vector Store / Embeddings (pgvector)")]
    end

    A -->|Pertanyaan & Form| C
    B -->|Triage, Approval & Monitoring| C
    C --> D & E & F & G
    D & E --> L
    F --> J
    H --> J & K
    I --> K
    E -->|Analisis Teks Laporan| I
    J --> M
    G --> L
```

---

## 2. Use Case Diagram

Sistem DesaAI memiliki 3 aktor utama:
1. **Warga Desa (Citizen)**: Mengakses informasi, mengajukan permohonan surat layanan, dan melapor pengaduan.
2. **Perangkat Desa (Village Officer)**: Melakukan triage pengaduan, verifikasi berkas pengajuan surat, dan memperbarui status tiket.
3. **Administrator Desa (Admin)**: Mengelola master data, mengunggah SOP/dokumen ke Knowledge Base desa, dan memantau analitik desa.

```mermaid
flowchart LR
    %% Actors
    Citizen(("👤 Warga Desa (Citizen)"))
    Officer(("👮 Perangkat Desa (Officer)"))
    Admin(("⚙️ Administrator Desa"))

    subgraph DesaAI_System["Sistem DesaAI (Operating System Desa)"]
        %% Citizen Use Cases
        UC1(["Tanya Info & SOP Layanan via AI Assistant"])
        UC2(["Ajukan Permohonan Surat Layanan Mandiri"])
        UC3(["Pantau Status Permohonan Surat"])
        UC4(["Kirim Laporan Pengaduan Fasilitas/Masalah"])
        UC5(["Pantau Status & Tindak Lanjut Pengaduan"])

        %% AI Sub-processes
        UC_AI1[["<<include>> RAG Knowledge Retrieval"]]
        UC_AI2[["<<include>> AI Klasifikasi & Prioritas Triage"]]

        %% Officer Use Cases
        UC6(["Review & Verifikasi Pengajuan Surat"])
        UC7(["Update Status Surat (Disetujui/Ditolak/Selesai)"])
        UC8(["Triage & Disposisi Pengaduan Masuk"])
        UC9(["Update Progres Pengaduan & Catatan Lapangan"])

        %% Admin Use Cases
        UC10(["Kelola Knowledge Base Desa (Upload SOP/Perdes)"])
        UC11(["Lihat Analitik & Tren Masalah Desa"])
        UC12(["Kelola Akun & Hak Akses Pengguna"])
    end

    %% Relations Citizen
    Citizen --> UC1
    Citizen --> UC2
    Citizen --> UC3
    Citizen --> UC4
    Citizen --> UC5

    UC1 -.->|uses| UC_AI1
    UC4 -.->|triggers| UC_AI2

    %% Relations Officer
    Officer --> UC6
    Officer --> UC7
    Officer --> UC8
    Officer --> UC9

    %% Relations Admin
    Admin --> UC10
    Admin --> UC11
    Admin --> UC12
```

---

## 3. Activity Diagram 1: Pengajuan Layanan Surat Digital

Alur aktivitas pengajuan layanan mandiri oleh warga hingga verifikasi oleh perangkat desa:

```mermaid
stateDiagram-v2
    [*] --> WargaMembukaPortal: Akses Web/PWA DesaAI
    
    state Warga_Flow {
        WargaMembukaPortal --> TanyaPersyaratan: Bingung Syarat Berkas?
        TanyaPersyaratan --> AIAssistant_RAG: Tanya AI Assistant
        AIAssistant_RAG --> TampilkanSyaratSOP: AI beri info resmi & link form
        TampilkanSyaratSOP --> IsiFormulirLayanan: Lanjut Ajukan
        
        WargaMembukaPortal --> IsiFormulirLayanan: Langsung ke Menu Layanan
        IsiFormulirLayanan --> UploadDokumen: Isi NIK, Nama, Banjar, Alasan
        UploadDokumen --> SubmitPengajuan: Unggah KTP/KK/Lampiran
        SubmitPengajuan --> TerimaKodeTiket: Sistem generate No. Tiket (REQ-xxx)
    }

    TerimaKodeTiket --> NotifikasiMasukDashboard: Masuk antrean Admin

    state Officer_Flow {
        NotifikasiMasukDashboard --> BukaDetailPengajuan: Staf Desa buka tiket
        BukaDetailPengajuan --> ValidasiBerkas: Cek kelengkapan data & NIK
        
        state KelengkapanCheck <<choice>>
        ValidasiBerkas --> KelengkapanCheck
        
        KelengkapanCheck --> MintaRevisi: Berkas Tidak Valid / Kurang
        KelengkapanCheck --> SetujuiPengajuan: Berkas Lengkap & Sah
        
        MintaRevisi --> UpdateStatusRevisi: Status: REVISION_REQUIRED
        SetujuiPengajuan --> CetakTandaTangan: Status: APPROVED / READY_FOR_PICKUP
    }

    UpdateStatusRevisi --> NotifikasiWarga: Warga dapat update & catatan
    CetakTandaTangan --> NotifikasiWarga: Warga ambil surat fisik/unduh PDF
    NotifikasiWarga --> SelesaiLayanan: Selesai
    SelesaiLayanan --> [*]
```

---

## 4. Activity Diagram 2: Pengaduan Warga & AI Triage Intelligence

Alur pengaduan warga dari pelaporan bebas hingga otomatisasi klasifikasi AI dan tindak lanjut petugas di lapangan:

```mermaid
stateDiagram-v2
    [*] --> WargaInputLaporan: Warga input keluhan (teks bebas, misal: 'Lampu jalan Banjar X mati')
    
    state WargaInput {
        WargaInputLaporan --> PilihLokasiBanjar: Tentukan Banjar & titik lokasi
        PilihLokasiBanjar --> LampirkanFoto: Tambah foto bukti (opsional)
        LampirkanFoto --> KirimPengaduan: Submit Tiket
    }

    state AI_Intelligence_Engine {
        KirimPengaduan --> AnalisisTeksNLP: LLM Structured Classification
        AnalisisTeksNLP --> EkstrakKategori: Kategori: Infrastruktur / Sampah / Keamanan
        EkstrakKategori --> HitungUrgensi: Urgensi: Emergency / High / Medium / Low
        HitungUrgensi --> GenerateSummary: Buat ringkasan 1 baris & rekomendasi dinas
    }

    state Government_Triage {
        GenerateSummary --> SimpanKeDatabase: Insert Ticket (CMP-xxx)
        SimpanKeDatabase --> TampilDiDashboard: Tampil di Triage Board dengan Tag Prioritas
        
        state PrioritasCheck <<choice>>
        TampilDiDashboard --> PrioritasCheck
        
        PrioritasCheck --> AlertDarurat: Jika Prioritas HIGH/EMERGENCY
        PrioritasCheck --> AntreanReguler: Jika Prioritas MEDIUM/LOW
        
        AlertDarurat --> DisposisiPetugasLapangan: Notifikasi prioritas cepat
        AntreanReguler --> DisposisiPetugasLapangan: Penjadwalan giliran kerja
        
        DisposisiPetugasLapangan --> EksekusiLapangan: Petugas menangani masalah fisik
        EksekusiLapangan --> UploadBuktiPenyelesaian: Foto perbaikan + status RESOLVED
    }

    UploadBuktiPenyelesaian --> FeedbackKeWarga: Status tiket warga berubah 'Selesai'
    FeedbackKeWarga --> [*]
```

---

## 5. Ringkasan Keunggulan Alur
1. **Zero Confusion**: Warga tidak perlu bingung memilih dinas atau SOP karena diarahkan oleh AI Village Assistant berbasis dokumen resmi.
2. **Automated Triage**: Petugas kantor desa tidak perlu membaca ribuan laporan secara manual dari awal; AI langsung menyajikan kategori, tingkat keparahan, dan ringkasan eksekutif.
3. **Accountability**: Setiap permohonan dan keluhan tercatat dengan nomor registrasi unik dan jejak status yang tidak bisa dimanipulasi.

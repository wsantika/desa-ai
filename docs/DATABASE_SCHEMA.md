# Database Schema & ERD
## DesaAI — AI-Powered Operating System for Smart Villages

Dokumen ini memuat spesifikasi skema basis data relasional (PostgreSQL via Prisma ORM) dan Entity-Relationship Diagram (ERD) untuk sistem DesaAI.

---

## 1. Entity-Relationship Diagram (ERD)

```mermaid
erDiagram
    USERS ||--o{ CITIZEN_PROFILES : has
    USERS ||--o{ SERVICE_REQUESTS : submits
    USERS ||--o{ COMPLAINTS : reports
    USERS ||--o{ COMPLAINT_LOGS : logs

    BANJAR ||--o{ CITIZEN_PROFILES : located_at
    BANJAR ||--o{ COMPLAINTS : occurs_in

    SERVICE_TYPES ||--o{ SERVICE_REQUESTS : classifies
    SERVICE_REQUESTS ||--o{ SERVICE_ATTACHMENTS : contains
    SERVICE_REQUESTS ||--o{ SERVICE_STATUS_LOGS : records

    COMPLAINTS ||--|| COMPLAINT_AI_EVALUATIONS : analyzed_by
    COMPLAINTS ||--o{ COMPLAINT_LOGS : tracks

    KNOWLEDGE_DOCUMENTS ||--o{ KNOWLEDGE_CHUNKS : splits_into

    USERS {
        string id PK "cuid/uuid"
        string email UK "nullable"
        string phone UK "nomor whatsapp/hp"
        string passwordHash
        string role "CITIZEN | VILLAGE_OFFICER | ADMIN"
        datetime createdAt
        datetime updatedAt
    }

    BANJAR {
        string id PK
        string name "Contoh: Banjar Kaja, Banjar Kelod"
        string dusun "Nama Dusun/Lingkungan"
        string leaderName "Nama Kelian/Kaling"
        string leaderPhone "Kontak Darurat"
    }

    CITIZEN_PROFILES {
        string id PK
        string userId FK
        string nik UK "16 Digit NIK KTP"
        string fullName
        string gender "L | P"
        string birthPlace
        date birthDate
        string occupation
        string address
        string banjarId FK
    }

    SERVICE_TYPES {
        string id PK
        string code UK "DOMISILI | SKU | SKCK | SKTM"
        string title "Nama Surat / Layanan"
        string description
        json requiredDocs "Daftar syarat berkas JSON"
        int estimatedDays "Estimasi pengerjaan"
        boolean isActive
    }

    SERVICE_REQUESTS {
        string id PK
        string trackingCode UK "REQ-202609-0001"
        string userId FK
        string serviceTypeId FK
        string status "PENDING | IN_REVIEW | REVISION | APPROVED | REJECTED"
        string purpose "Tujuan/keperluan surat"
        text officerNotes "Catatan tindak lanjut staf desa"
        datetime createdAt
        datetime completedAt
    }

    SERVICE_ATTACHMENTS {
        string id PK
        string requestId FK
        string fileName
        string fileUrl
        string fileType
    }

    SERVICE_STATUS_LOGS {
        string id PK
        string requestId FK
        string status
        string updatedBy FK
        text notes
        datetime createdAt
    }

    COMPLAINTS {
        string id PK
        string ticketCode UK "CMP-202609-0001"
        string citizenId FK "Pengadu (bisa anonim/terdaftar)"
        string reporterName "Nama pengadu jika publik"
        string reporterPhone "No HP pengadu"
        string title "Judul singkat keluhan"
        text description "Uraian detail kejadian"
        string banjarId FK
        string specificLocation "Patokan lokasi fisik"
        string photoUrl "Bukti foto jika ada"
        string status "OPEN | IN_PROGRESS | RESOLVED | REJECTED"
        datetime createdAt
        datetime resolvedAt
    }

    COMPLAINT_AI_EVALUATIONS {
        string id PK
        string complaintId FK UK
        string predictedCategory "INFRASTRUKTUR | KEBERSIHAN | KEAMANAN | PELAYANAN | SOSIAL"
        string priority "LOW | MEDIUM | HIGH | EMERGENCY"
        float confidenceScore "Tingkat keyakinan AI (0.0 - 1.0)"
        text executiveSummary "Ringkasan 1 kalimat AI untuk perangkat desa"
        text recommendedAction "Saran aksi taktis untuk dinas terkait"
        json rawAIResponse "Payload mentah LLM"
        datetime evaluatedAt
    }

    COMPLAINT_LOGS {
        string id PK
        string complaintId FK
        string previousStatus
        string newStatus
        string actorId FK
        text actionNote "Catatan tindakan staf di lapangan"
        string proofPhotoUrl "Foto bukti perbaikan"
        datetime createdAt
    }

    KNOWLEDGE_DOCUMENTS {
        string id PK
        string title "Nama Dokumen/SOP"
        string category "REGULASI | SOP_LAYANAN | FAQ | PROFIL_DESA"
        string sourceUrl "Path file / URL asal"
        text contentText "Isi teks dokumen utuh"
        json metadata "Versi, nomor surat perdes, tanggal rilis"
        boolean isPublished
        datetime createdAt
        datetime updatedAt
    }

    KNOWLEDGE_CHUNKS {
        string id PK
        string documentId FK
        int chunkIndex
        text chunkContent
        string embedding "Vector embedding (1536 dim / 768 dim)"
    }
```

---

## 2. Kamus Data & Enumerasi (Data Dictionary)

### 2.1 Enumerasi Role
- `CITIZEN`: Warga masyarakat yang dapat membuat permohonan layanan dan melapor pengaduan.
- `VILLAGE_OFFICER`: Staf dan kepala seksi kantor desa yang bertugas memproses surat dan mengelola disposisi laporan pengaduan.
- `ADMIN`: Administrator sistem desa dengan akses penuh terhadap konfigurasi, analitik, dan Knowledge Base.

### 2.2 Status Permohonan Layanan (`ServiceRequestStatus`)
- `PENDING`: Permohonan baru diajukan oleh warga, menunggu peninjauan staf.
- `IN_REVIEW`: Berkas sedang diverifikasi dan draf surat sedang diproses.
- `REVISION`: Berkas pemohon ada yang salah atau kurang, membutuhkan perbaikan.
- `APPROVED`: Permohonan disetujui, surat resmi siap diambil atau diunduh.
- `REJECTED`: Permohonan ditolak dengan alasan resmi dari perangkat desa.

### 2.3 Status Pengaduan (`ComplaintStatus`)
- `OPEN`: Laporan baru masuk dan telah dievaluasi oleh AI.
- `IN_PROGRESS`: Laporan telah ditugaskan ke petugas lapangan / banjar untuk ditindaklanjuti.
- `RESOLVED`: Masalah telah diselesaikan disertai dokumentasi foto bukti.
- `REJECTED`: Laporan tidak valid atau bukan wewenang pemerintah desa.

### 2.4 Tingkat Prioritas AI (`AIComplaintPriority`)
- `EMERGENCY`: Bencana mendadak, ancaman keselamatan nyawa, tiang roboh di jalan utama. Wajib respon dalam <3 jam.
- `HIGH`: Lampu jalan mati di tikungan rawan, pipa air bersih utama pecah, jalan amblas. Respon <24 jam.
- `MEDIUM`: Sampah menumpuk di TPS, saluran air tersumbat sebagian, fasilitas pos ronda rusak.
- `LOW`: Keluhan minor, saran estetika taman desa, atau pertanyaan fasilitas non-krusial.

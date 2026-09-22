# GitFlow & Conventional Commits Guide
## DesaAI — APTIKOM Hackathon 2026

Panduan ini mengatur standar branching, format commit, dan alur Pull Request (PR) agar kolaborasi tim berjalan rapi, terlacak, dan bebas konflik antar lingkungan (Windows vs macOS).

---

## 1. Model Percabangan (Branching Model)

Struktur cabang repositori DesaAI terdiri dari dua cabang utama terlindungi (*protected*):

```mermaid
gitGraph
   commit id: "Initial Commit"
   branch dev
   checkout dev
   commit id: "Setup Docker & CI"
   branch feat/ai-complaint
   checkout feat/ai-complaint
   commit id: "feat(complaint): add triage model"
   commit id: "feat(complaint): connect LLM prompt"
   checkout dev
   merge feat/ai-complaint id: "PR #1 (feat -> dev)"
   branch feat/citizen-portal
   checkout feat/citizen-portal
   commit id: "feat(portal): add PWA layout"
   checkout dev
   merge feat/citizen-portal id: "PR #2 (feat -> dev)"
   checkout master
   merge dev id: "Release v1.0.0 (MVP APTIKOM)"
```

### 1.1 Deskripsi Cabang Utama
- **`master`** (Production Branch):
  - Berisi kode stabil yang siap dipresentasikan di hadapan juri APTIKOM.
  - **DILARANG** melakukan direct commit ke `master`.
  - Hanya menerima Pull Request dari branch `dev` setelah seluruh QA dan review selesai.
- **`dev`** (Integration & Development Branch):
  - Cabang sentral tempat penggabungan seluruh fitur harian tim.
  - Semua branch fitur (`feat/*`), perbaikan bug (`fix/*`), dan chore dibuat dari `dev` dan dimerge kembali ke `dev`.

### 1.2 Konvensi Penamaan Branch Kerja
Buat branch baru selalu berpangkal dari `dev`:
- `feat/<nama-fitur>`: Penambahan fitur baru (misal: `feat/ai-assistant-rag`, `feat/citizen-complaint-form`).
- `fix/<nama-bug>`: Perbaikan bug atau error (misal: `fix/prisma-connection-leak`, `fix/mobile-navbar-overflow`).
- `chore/<tugas-pemeliharaan>`: Setup dependensi, konfigurasi build (misal: `chore/docker-compose-pgvector`).
- `docs/<topik-dokumentasi>`: Pembaruan atau penambahan dokumen (misal: `docs/erd-update`).
- `refactor/<nama-komponen>`: Perombakan struktur kode tanpa mengubah fungsi (misal: `refactor/api-response-handler`).

---

## 2. Standar Conventional Commits

Setiap pesan commit **WAJIB** mengikuti format:
```text
<type>(<scope>): <keterangan singkat dalam huruf kecil>
```

### 2.1 Tipe Commit (`type`)
| Type | Kapan Digunakan | Contoh |
| :--- | :--- | :--- |
| **`feat`** | Menambah fitur baru untuk pengguna | `feat(rag): add document vector ingestion pipeline` |
| **`fix`** | Memperbaiki bug di kode yang ada | `fix(auth): resolve session token expiry in cookies` |
| **`docs`** | Mengubah atau menambah dokumentasi saja | `docs(prd): add KPI metrics for APTIKOM hackathon` |
| **`style`** | Format kode (spasi, titik koma, eslint fixes) tanpa ubah logika | `style(ui): adjust card padding and contrast colors` |
| **`refactor`** | Perubahan kode yang bukan bugfix dan bukan fitur baru | `refactor(db): extract prisma client to singleton module` |
| **`perf`** | Peningkatan performa kode / query | `perf(query): add index to trackingCode and nik fields` |
| **`test`** | Menambah atau mengubah unit / integration test | `test(ai): add mock test for complaint classification` |
| **`chore`** | Pembaruan build tools, docker, config, dependensi | `chore(docker): add compose service for postgres 16` |
| **`ci`** | Perubahan pada file GitHub Actions CI/CD | `ci(workflow): enforce PR target branch dev check` |

### 2.2 Lingkup (`scope`) yang Disarankan
- `rag` / `ai` : Engine AI, prompt, dan embedding.
- `complaint` : Alur pengaduan warga.
- `service` : Pengajuan surat layanan.
- `dashboard` : Halaman admin / perangkat desa.
- `citizen` : Halaman portal warga.
- `db` : Schema Prisma, migrasi, dan seed data.
- `docker` : Konfigurasi container.
- `auth` : Login, registrasi, session RBAC.

### 2.3 Aturan Commit Atomik
1. Jangan mencampur perubahan unrelated dalam satu commit besar.
2. Lakukan commit per konteks (misal: commit schema database terpisah dengan commit form UI).
3. Gunakan `git add <path/to/file>` spesifik.

---

## 3. Protokol Pull Request (PR) & CI Automation

### 3.1 Aturan Target Branch PR (Enforced via CI)
- Branch `feat/*`, `fix/*`, `chore/*` **HARUS diarahkan ke target branch `dev`**.
- CI GitHub Actions akan **otomatis membatalkan (FAIL)** jika ada PR dari `feat/*` yang salah target langsung ke `master`.
- PR ke `master` hanya diperbolehkan dari branch `dev`.

### 3.2 Format Template PR
```markdown
## Deskripsi Singkat
[Jelaskan apa yang dibuat atau diperbaiki]

## Perubahan Utama
- **`src/...`**: [Perubahan kode 1]
- **`prisma/...`**: [Perubahan database jika ada]

## QA Checklist Mandiri
- [ ] Menjalankan `npm run lint` lokal (0 errors)
- [ ] Menjalankan `npm run build` lokal (Build sukses)
- [ ] Menguji alur fitur secara manual di browser

## Target Branch
- Base branch: `dev`
```

---

## 4. Panduan Siklus Kerja Sehari-hari (Cheatsheet)

```bash
# 1. Pastikan dev lokal up to date
git checkout dev
git pull origin dev

# 2. Buat branch fitur baru
git checkout -b feat/ai-complaint-triage

# 3. Koding dan verifikasi lokal
npm run lint
npm run build

# 4. Commit dengan format Conventional Commits
git add src/routes/complaint.tsx src/lib/ai-classifier.ts
git commit -m "feat(complaint): add triage classification form and handler"

# 5. Push ke remote
git push -u origin feat/ai-complaint-triage

# 6. Buka PR di GitHub dengan base branch: dev
```

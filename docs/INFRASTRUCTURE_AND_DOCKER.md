# Infrastructure & Docker Guide
## DesaAI — Cross-Platform Team Setup (Windows & macOS)

Dokumen ini memandu tim pengembang DesaAI agar dapat menjalankan seluruh *stack* aplikasi dan basis data secara seragam, cepat, dan terisolasi tanpa kendala perbedaan sistem operasi (Windows vs macOS Apple Silicon/Intel).

---

## 1. Arsitektur Lingkungan Docker

```mermaid
flowchart TD
    subgraph HostOS["Host Machine (Windows WSL2 / macOS Darwin)"]
        subgraph DockerEngine["Docker Compose Ecosystem"]
            DB[("Database Container\npostgres:16-alpine\nPort: 5432")]
            APP["DesaAI App Container\nNode.js 22 LTS / TanStack Start\nPort: 3000"]
            VOL[("Named Volume\ndesa_ai_pgdata")]
        end
        
        Browser["Web Browser (Warga & Admin)\nhttp://localhost:3000"]
        PrismaStudio["Prisma Studio / GUI\nhttp://localhost:5555"]
    end

    Browser -->|HTTP Requests| APP
    APP -->|Prisma Client SQL| DB
    DB --- VOL
    PrismaStudio -.->|Direct Query| DB
```

---

## 2. Struktur Konfigurasi Docker

- **`docker-compose.yml`**: Mengorkestrasi database PostgreSQL 16 dan aplikasi web DesaAI.
- **`Dockerfile`**: Image berbasis Node.js 22 Alpine, teroptimasi untuk caching dependensi dan binary compilation lintas arsitektur (`linux/amd64` & `linux/arm64`).
- **`.dockerignore`**: Mencegah folder lokal seperti `node_modules`, `.git`, `.tanstack`, dan file cache di-copy ke dalam container.

---

## 3. Panduan Menjalankan Sistem

### Skenario A: Menjalankan Seluruh Stack via Docker (Paling Praktis)
Cocok jika rekan satu tim tidak ingin ribet menginstall Node.js atau PostgreSQL secara lokal di laptop:

```bash
# 1. Salin template environment
cp .env.example .env.local

# 2. Build dan jalankan container
docker compose up -d --build

# 3. Pantau log sistem
docker compose logs -f app
```
Aplikasi langsung dapat diakses di:
- **Web DesaAI**: [http://localhost:3000](http://localhost:3000)
- **PostgreSQL Port**: `localhost:5432`

---

### Skenario B: Hybrid (PostgreSQL di Docker + App di Host Lokal)
Cocok untuk pengembangan fitur yang intensif dan butuh Vite Hot-Module-Replacement (HMR) secepat kilat:

```bash
# 1. Jalankan HANYA container database PostgreSQL
docker compose up -d db

# 2. Pastikan DATABASE_URL di .env.local mengarah ke localhost:
# DATABASE_URL="postgresql://postgres:postgres@localhost:5432/desa_ai?schema=public"

# 3. Jalankan migrasi / prisma generate lokal
npm run db:generate
npm run db:push

# 4. Jalankan dev server lokal
npm run dev
```

---

## 4. Perhatian Khusus Antar OS (Windows vs macOS)

### 4.1 Untuk Pengguna Windows
1. **Line Endings (CRLF vs LF)**:
   - Pastikan Git tidak mengubah file shell script menjadi CRLF:
     ```bash
     git config core.autocrlf false
     ```
2. **Port Conflict (Port 5432)**:
   - Jika di laptop sudah terinstall PostgreSQL versi native Windows, pastikan service-nya di-stop terlebih dahulu lewat `services.msc`, atau ubah host port di `docker-compose.yml` menjadi `5433:5432`.

### 4.2 Untuk Pengguna macOS (Apple Silicon / M1 / M2 / M3 / M4)
1. **Arsitektur ARM64**:
   - Docker image yang kita gunakan (`node:22-alpine` dan `postgres:16-alpine`) sudah memiliki build *multi-arch* resmi yang mendukung arsitektur ARM64 bawaan Mac tanpa perlu emulasi Rosetta 2 yang lambat.
2. **File Permission**:
   - Docker di Mac terkadang memiliki permission issue pada volume binding. Penggunaan *named volume* (`desa_ai_pgdata`) di `docker-compose.yml` menjamin performa I/O disk maksimal di macOS.

---

## 5. Perintah Rutin Docker (Cheatsheet)

```bash
# Melihat status kontainer aktif
docker compose ps

# Mematikan kontainer tanpa menghapus data database
docker compose down

# Menghapus seluruh kontainer dan reset volume database (fresh start)
docker compose down -v

# Masuk ke terminal kontainer aplikasi
docker compose exec app sh

# Menjalankan prisma studio di dalam kontainer
docker compose exec app npx prisma studio --port 5555
```

import { useState } from 'react'
import {
  AlertTriangle,
  Upload,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Trash2,
  Sparkles,
  Bot,
  MapPin,
} from 'lucide-react'
import { submitComplaintServerFn } from '../../application/server-functions/complaint.fn'
import type { ComplaintEntity } from '../../domain/entities/complaint.entity'
import type { AIEvaluationResult } from '../../domain/repositories/i-ai-evaluator.service'

interface ComplaintFormProps {
  onSuccess: (result: {
    complaint: ComplaintEntity
    evaluation: AIEvaluationResult
  }) => void
}

const BANJAR_LIST = [
  { id: 'banjar-kaja', name: 'Banjar Kaja' },
  { id: 'banjar-kelod', name: 'Banjar Kelod' },
  { id: 'banjar-tengah', name: 'Banjar Tengah' },
  { id: 'banjar-kangin', name: 'Banjar Kangin' },
  { id: 'banjar-kauh', name: 'Banjar Kauh' },
]

export default function ComplaintForm({ onSuccess }: ComplaintFormProps) {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [banjarId, setBanjarId] = useState(BANJAR_LIST[0].id)
  const [specificLocation, setSpecificLocation] = useState('')
  const [reporterName, setReporterName] = useState('')
  const [reporterPhone, setReporterPhone] = useState('')
  const [photoUrl, setPhotoUrl] = useState<string | null>(null)
  const [photoName, setPhotoName] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)

  // Handle simulated photo upload from mobile camera or gallery
  const handlePhotoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setPhotoName(file.name)
    const reader = new FileReader()
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setPhotoUrl(reader.result)
      }
    }
    reader.readAsDataURL(file)
  }

  const handleRemovePhoto = () => {
    setPhotoUrl(null)
    setPhotoName(null)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMsg(null)

    if (title.trim().length < 5) {
      setErrorMsg('Judul keluhan minimal 5 karakter.')
      return
    }

    if (description.trim().length < 10) {
      setErrorMsg('Ceritakan detail kendala/kerusakan minimal 10 karakter.')
      return
    }

    if (specificLocation.trim().length < 3) {
      setErrorMsg('Patokan lokasi fisik wajib diisi (contoh: Depan Pura Dalem).')
      return
    }

    if (reporterName.trim().length < 2) {
      setErrorMsg('Nama pelapor minimal 2 karakter.')
      return
    }

    setLoading(true)

    try {
      const result = await submitComplaintServerFn({
        data: {
          title: title.trim(),
          description: description.trim(),
          banjarId,
          specificLocation: specificLocation.trim(),
          reporterName: reporterName.trim(),
          reporterPhone: reporterPhone.trim() || undefined,
          photoUrl: photoUrl || undefined,
        },
      })

      onSuccess(result)
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : 'Gagal mengirim laporan pengaduan'
      setErrorMsg(message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="island-shell rounded-3xl p-5 sm:p-8">
      {/* Kop Pengaduan Desa Tegal Tugu */}
      <div className="mb-6 border-b border-[var(--line)] pb-5 text-center sm:text-left">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-rose-500/10 px-3 py-1 text-xs font-bold text-rose-700 dark:text-rose-300">
          <AlertTriangle className="h-3.5 w-3.5" aria-hidden="true" />
          <span>Pengaduan Warga Cerdas — Desa Tegal Tugu</span>
        </span>
        <h2 className="mt-2 text-xl font-bold text-[var(--sea-ink)] sm:text-2xl">
          Formulir Lapor Fasilitas &amp; Lingkungan
        </h2>
        <p className="mt-1 text-xs text-[var(--sea-ink-soft)] sm:text-sm">
          Laporkan kendala fasilitas umum. AI Desa Tegal Tugu akan otomatis
          menganalisis kategori dan tingkat urgensinya agar cepat ditangani.
        </p>
      </div>

      {errorMsg && (
        <div
          role="alert"
          className="mb-6 flex items-start gap-3 rounded-2xl border border-rose-500/30 bg-rose-500/10 p-4 text-xs font-medium text-rose-800 dark:text-rose-200 sm:text-sm"
        >
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-rose-600" aria-hidden="true" />
          <div>
            <p className="font-bold">Mohon lengkapi formulir laporan:</p>
            <p className="mt-0.5">{errorMsg}</p>
          </div>
        </div>
      )}

      <div className="space-y-5">
        {/* 1. Judul Laporan */}
        <div>
          <label
            htmlFor="complaint-title"
            className="mb-1.5 block text-xs font-bold text-[var(--sea-ink)] sm:text-sm"
          >
            1. Judul Masalah / Laporan <span className="text-rose-500">*</span>
          </label>
          <input
            id="complaint-title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Contoh: Lampu Penerangan Jalan Padam di Depan Pura Dalem"
            required
            className="w-full rounded-xl border border-[var(--line)] bg-[var(--header-bg)] px-3.5 py-2.5 text-xs text-[var(--sea-ink)] placeholder-[var(--sea-ink-soft)] focus:border-emerald-600 focus:outline-none focus:ring-1 focus:ring-emerald-600 sm:text-sm"
          />
        </div>

        {/* 2. Wilayah Banjar & Patokan Lokasi */}
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label
              htmlFor="banjar-select"
              className="mb-1.5 block text-xs font-bold text-[var(--sea-ink)] sm:text-sm"
            >
              2. Wilayah Banjar Adat <span className="text-rose-500">*</span>
            </label>
            <select
              id="banjar-select"
              value={banjarId}
              onChange={(e) => setBanjarId(e.target.value)}
              className="w-full rounded-xl border border-[var(--line)] bg-[var(--header-bg)] px-3.5 py-2.5 text-xs text-[var(--sea-ink)] focus:border-emerald-600 focus:outline-none focus:ring-1 focus:ring-emerald-600 sm:text-sm"
            >
              {BANJAR_LIST.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label
              htmlFor="location"
              className="mb-1.5 block text-xs font-bold text-[var(--sea-ink)] sm:text-sm"
            >
              3. Patokan Lokasi Spesifik <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <MapPin className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--sea-ink-soft)]" aria-hidden="true" />
              <input
                id="location"
                type="text"
                value={specificLocation}
                onChange={(e) => setSpecificLocation(e.target.value)}
                placeholder="Contoh: Depan Balai Banjar Kaja / Dekat SDN 1"
                required
                className="w-full rounded-xl border border-[var(--line)] bg-[var(--header-bg)] py-2.5 pl-10 pr-3.5 text-xs text-[var(--sea-ink)] placeholder-[var(--sea-ink-soft)] focus:border-emerald-600 focus:outline-none focus:ring-1 focus:ring-emerald-600 sm:text-sm"
              />
            </div>
          </div>
        </div>

        {/* 3. Deskripsi Keluhan Lengkap */}
        <div>
          <label
            htmlFor="description"
            className="mb-1.5 block text-xs font-bold text-[var(--sea-ink)] sm:text-sm"
          >
            4. Ceritakan Detail Kendala <span className="text-rose-500">*</span>
          </label>
          <textarea
            id="description"
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Jelaskan kondisi kerusakan, sejak kapan terjadi, dan potensi bahayanya bagi warga..."
            required
            className="w-full rounded-xl border border-[var(--line)] bg-[var(--header-bg)] px-3.5 py-2.5 text-xs text-[var(--sea-ink)] placeholder-[var(--sea-ink-soft)] focus:border-emerald-600 focus:outline-none focus:ring-1 focus:ring-emerald-600 sm:text-sm"
          />
        </div>

        {/* 4. Unggah Foto Bukti */}
        <div>
          <label className="mb-1.5 block text-xs font-bold text-[var(--sea-ink)] sm:text-sm">
            5. Unggah Foto Bukti Kendala (Opsional)
          </label>
          <div className="rounded-2xl border-2 border-dashed border-[var(--line)] bg-black/[0.02] p-5 text-center dark:bg-white/[0.02]">
            <input
              type="file"
              id="photo-upload"
              accept="image/*"
              onChange={handlePhotoSelect}
              className="hidden"
            />
            {photoUrl ? (
              <div className="flex flex-col items-center">
                <img
                  src={photoUrl}
                  alt="Bukti Pengaduan"
                  className="h-36 w-full max-w-xs rounded-xl object-cover shadow-sm"
                />
                <span className="mt-2 text-xs font-medium text-[var(--sea-ink)]">
                  {photoName}
                </span>
                <button
                  type="button"
                  onClick={handleRemovePhoto}
                  className="mt-2 inline-flex items-center gap-1 text-xs text-rose-600 hover:underline"
                >
                  <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
                  <span>Hapus / Ganti Foto</span>
                </button>
              </div>
            ) : (
              <div>
                <label
                  htmlFor="photo-upload"
                  className="inline-flex min-h-[44px] cursor-pointer items-center justify-center gap-2 rounded-xl bg-emerald-700 px-4 py-2.5 text-xs font-bold text-white shadow-sm transition hover:bg-emerald-800 dark:bg-emerald-600 dark:hover:bg-emerald-500 sm:text-sm"
                >
                  <Upload className="h-4 w-4" aria-hidden="true" />
                  <span>Ambil Foto dari Kamera / Galeri HP</span>
                </label>
                <p className="mt-2 text-[11px] text-[var(--sea-ink-soft)]">
                  Foto yang jelas membantu petugas mempercepat proses peninjauan lapangan.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* 5. Data Pelapor (Identitas & WhatsApp) */}
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label
              htmlFor="reporterName"
              className="mb-1.5 block text-xs font-bold text-[var(--sea-ink)] sm:text-sm"
            >
              6. Nama Anda (Pelapor) <span className="text-rose-500">*</span>
            </label>
            <input
              id="reporterName"
              type="text"
              value={reporterName}
              onChange={(e) => setReporterName(e.target.value)}
              placeholder="Nama lengkap atau panggilan..."
              required
              className="w-full rounded-xl border border-[var(--line)] bg-[var(--header-bg)] px-3.5 py-2.5 text-xs text-[var(--sea-ink)] placeholder-[var(--sea-ink-soft)] focus:border-emerald-600 focus:outline-none focus:ring-1 focus:ring-emerald-600 sm:text-sm"
            />
          </div>

          <div>
            <label
              htmlFor="reporterPhone"
              className="mb-1.5 block text-xs font-bold text-[var(--sea-ink)] sm:text-sm"
            >
              7. Nomor WhatsApp (Untuk Notifikasi Progres)
            </label>
            <input
              id="reporterPhone"
              type="tel"
              value={reporterPhone}
              onChange={(e) => setReporterPhone(e.target.value)}
              placeholder="Contoh: 081234567890"
              className="w-full rounded-xl border border-[var(--line)] bg-[var(--header-bg)] px-3.5 py-2.5 text-xs text-[var(--sea-ink)] placeholder-[var(--sea-ink-soft)] focus:border-emerald-600 focus:outline-none focus:ring-1 focus:ring-emerald-600 sm:text-sm"
            />
          </div>
        </div>

        {/* AI Evaluation Loading Banner */}
        {loading && (
          <div
            role="status"
            className="flex items-center gap-3 rounded-2xl border border-emerald-600/30 bg-emerald-600/10 p-4 text-xs sm:text-sm"
          >
            <Bot className="h-5 w-5 animate-pulse text-emerald-700 dark:text-emerald-400" aria-hidden="true" />
            <div>
              <p className="font-bold text-emerald-900 dark:text-emerald-200">
                AI Intelligence Engine sedang mengevaluasi laporan Anda...
              </p>
              <p className="mt-0.5 text-xs text-emerald-800 dark:text-emerald-300">
                Mengekstrak kategori, menilai tingkat kedaruratan, dan merumuskan disposisi awal untuk petugas desa.
              </p>
            </div>
          </div>
        )}

        {/* Submit Action */}
        <div className="pt-2">
          <button
            type="submit"
            disabled={loading}
            className="flex min-h-[50px] w-full items-center justify-center gap-2 rounded-2xl bg-rose-600 px-6 py-3 text-sm font-bold text-white shadow-md transition hover:bg-rose-700 disabled:opacity-50 sm:text-base"
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                <span>Menganalisis &amp; Mengirim Laporan...</span>
              </>
            ) : (
              <>
                <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
                <span>Kirim Pengaduan Warga Sekarang</span>
              </>
            )}
          </button>
          <div className="mt-2.5 flex items-center justify-center gap-1.5 text-center text-[11px] text-[var(--sea-ink-soft)]">
            <Sparkles className="h-3.5 w-3.5 text-emerald-600" aria-hidden="true" />
            <span>Terhubung otomatis dengan Triage AI Google Gemini &amp; Meja Kerja Petugas Desa Tegal Tugu</span>
          </div>
        </div>
      </div>
    </form>
  )
}

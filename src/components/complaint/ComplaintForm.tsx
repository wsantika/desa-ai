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

    if (!title.trim() || title.trim().length < 5) {
      setErrorMsg('Judul masalah wajib diisi minimal 5 karakter.')
      return
    }

    if (!specificLocation.trim()) {
      setErrorMsg('Patokan lokasi spesifik wajib diisi agar mudah dicari petugas.')
      return
    }

    if (!description.trim() || description.trim().length < 10) {
      setErrorMsg('Deskripsi kendala wajib diceritakan minimal 10 karakter.')
      return
    }

    if (!reporterName.trim()) {
      setErrorMsg('Nama pelapor wajib diisi.')
      return
    }

    try {
      setLoading(true)

      const response = await submitComplaintServerFn({
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

      if (response.success && response.data) {
        onSuccess({
          complaint: response.data.complaint,
          evaluation: response.data.evaluation,
        })
      } else {
        setErrorMsg(response.error || 'Gagal mengirim pengaduan. Silakan coba lagi.')
      }
    } catch (err: unknown) {
      const msg =
        err instanceof Error
          ? err.message
          : 'Terjadi kesalahan sistem saat mengirim laporan.'
      setErrorMsg(msg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs sm:p-8 dark:border-slate-800 dark:bg-slate-900"
    >
      {/* Kop Header */}
      <div className="mb-6 border-b border-slate-100 pb-5 text-center sm:text-left dark:border-slate-800">
        <span className="inline-flex items-center gap-1.5 rounded-full border border-rose-200 bg-rose-50 px-3 py-1 text-xs font-bold text-rose-800 dark:border-rose-900/50 dark:bg-rose-950/60 dark:text-rose-300">
          <AlertTriangle className="h-3.5 w-3.5" aria-hidden="true" />
          <span>Saluran Pengaduan Warga Desa Tegal Tugu</span>
        </span>
        <h2 className="mt-2 text-xl font-bold text-slate-900 sm:text-2xl dark:text-white">
          Formulir Lapor Fasilitas &amp; Lingkungan
        </h2>
        <p className="mt-1 text-xs text-slate-500 sm:text-sm dark:text-slate-400">
          Laporkan kendala fasilitas umum. AI Desa Tegal Tugu akan otomatis
          menganalisis kategori dan tingkat urgensinya agar cepat ditangani.
        </p>
      </div>

      {errorMsg && (
        <div
          role="alert"
          className="mb-6 flex items-start gap-3 rounded-xl border border-rose-200 bg-rose-50/50 p-4 text-xs font-medium text-rose-800 dark:border-rose-900/40 dark:bg-rose-950/30 dark:text-rose-200 sm:text-sm"
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
            className="mb-1.5 block text-xs font-bold text-slate-900 sm:text-sm dark:text-white"
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
            className="w-full rounded-xl border border-slate-300 bg-slate-50/50 px-3.5 py-2.5 text-xs text-slate-900 placeholder:text-slate-400 focus:border-blue-600 focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-600 dark:border-slate-700 dark:bg-slate-800 dark:text-white sm:text-sm"
          />
        </div>

        {/* 2. Wilayah Banjar & Patokan Lokasi */}
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label
              htmlFor="banjar-select"
              className="mb-1.5 block text-xs font-bold text-slate-900 sm:text-sm dark:text-white"
            >
              2. Wilayah Banjar Adat <span className="text-rose-500">*</span>
            </label>
            <select
              id="banjar-select"
              value={banjarId}
              onChange={(e) => setBanjarId(e.target.value)}
              className="w-full rounded-xl border border-slate-300 bg-slate-50/50 px-3.5 py-2.5 text-xs text-slate-900 focus:border-blue-600 focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-600 dark:border-slate-700 dark:bg-slate-800 dark:text-white sm:text-sm"
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
              className="mb-1.5 block text-xs font-bold text-slate-900 sm:text-sm dark:text-white"
            >
              3. Patokan Lokasi Spesifik <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <MapPin className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" aria-hidden="true" />
              <input
                id="location"
                type="text"
                value={specificLocation}
                onChange={(e) => setSpecificLocation(e.target.value)}
                placeholder="Contoh: Depan Balai Banjar Kaja / Dekat SDN 1"
                required
                className="w-full rounded-xl border border-slate-300 bg-slate-50/50 py-2.5 pl-10 pr-3.5 text-xs text-slate-900 placeholder:text-slate-400 focus:border-blue-600 focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-600 dark:border-slate-700 dark:bg-slate-800 dark:text-white sm:text-sm"
              />
            </div>
          </div>
        </div>

        {/* 3. Deskripsi Keluhan Lengkap */}
        <div>
          <label
            htmlFor="description"
            className="mb-1.5 block text-xs font-bold text-slate-900 sm:text-sm dark:text-white"
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
            className="w-full rounded-xl border border-slate-300 bg-slate-50/50 px-3.5 py-2.5 text-xs text-slate-900 placeholder:text-slate-400 focus:border-blue-600 focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-600 dark:border-slate-700 dark:bg-slate-800 dark:text-white sm:text-sm"
          />
        </div>

        {/* 4. Unggah Foto Bukti */}
        <div>
          <label className="mb-1.5 block text-xs font-bold text-slate-900 sm:text-sm dark:text-white">
            5. Unggah Foto Bukti Kendala (Opsional)
          </label>
          <div className="rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50/50 p-5 text-center dark:border-slate-700 dark:bg-slate-800/40">
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
                  className="h-36 w-full max-w-xs rounded-xl object-cover shadow-xs"
                />
                <span className="mt-2 text-xs font-medium text-slate-900 dark:text-white">
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
                  className="inline-flex min-h-[44px] cursor-pointer items-center justify-center gap-2 rounded-xl bg-blue-700 px-4 py-2.5 text-xs font-bold text-white shadow-xs transition hover:bg-blue-800 dark:bg-blue-600 dark:hover:bg-blue-500 sm:text-sm"
                >
                  <Upload className="h-4 w-4" aria-hidden="true" />
                  <span>Ambil Foto dari Kamera / Galeri HP</span>
                </label>
                <p className="mt-2 text-[11px] text-slate-500 dark:text-slate-400">
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
              className="mb-1.5 block text-xs font-bold text-slate-900 sm:text-sm dark:text-white"
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
              className="w-full rounded-xl border border-slate-300 bg-slate-50/50 px-3.5 py-2.5 text-xs text-slate-900 placeholder:text-slate-400 focus:border-blue-600 focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-600 dark:border-slate-700 dark:bg-slate-800 dark:text-white sm:text-sm"
            />
          </div>

          <div>
            <label
              htmlFor="reporterPhone"
              className="mb-1.5 block text-xs font-bold text-slate-900 sm:text-sm dark:text-white"
            >
              7. Nomor WhatsApp (Untuk Notifikasi Progres)
            </label>
            <input
              id="reporterPhone"
              type="tel"
              value={reporterPhone}
              onChange={(e) => setReporterPhone(e.target.value)}
              placeholder="Contoh: 081234567890"
              className="w-full rounded-xl border border-slate-300 bg-slate-50/50 px-3.5 py-2.5 text-xs text-slate-900 placeholder:text-slate-400 focus:border-blue-600 focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-600 dark:border-slate-700 dark:bg-slate-800 dark:text-white sm:text-sm"
            />
          </div>
        </div>

        {/* AI Evaluation Loading Banner */}
        {loading && (
          <div
            role="status"
            className="flex items-center gap-3 rounded-xl border border-blue-200 bg-blue-50/70 p-4 text-xs sm:text-sm dark:border-blue-900/50 dark:bg-blue-950/30"
          >
            <Bot className="h-5 w-5 animate-pulse text-blue-700 dark:text-blue-400" aria-hidden="true" />
            <div>
              <p className="font-bold text-blue-900 dark:text-blue-200">
                AI Intelligence Engine sedang mengevaluasi laporan Anda...
              </p>
              <p className="mt-0.5 text-xs text-blue-700 dark:text-blue-300">
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
            className="flex min-h-[50px] w-full items-center justify-center gap-2 rounded-xl bg-rose-600 px-6 py-3 text-sm font-bold text-white shadow-xs transition hover:bg-rose-700 disabled:opacity-50 sm:text-base"
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
          <div className="mt-2.5 flex items-center justify-center gap-1.5 text-center text-[11px] text-slate-500 dark:text-slate-400">
            <Sparkles className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400" aria-hidden="true" />
            <span>Terhubung otomatis dengan Triage AI Google Gemini &amp; Meja Kerja Petugas Desa Tegal Tugu</span>
          </div>
        </div>
      </div>
    </form>
  )
}

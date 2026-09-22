import { useState } from 'react'
import {
  FileText,
  Upload,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Trash2,
  Image as ImageIcon,
} from 'lucide-react'
import { submitServiceRequestServerFn } from '../../application/server-functions/service-request.fn'
import type { ServiceRequestEntity } from '../../domain/entities/service-request.entity'

interface ServiceRequestFormProps {
  initialServiceTypeCode?: 'DOMISILI' | 'SKU' | 'SKCK' | 'SKTM'
  onSuccess: (request: ServiceRequestEntity) => void
}

const SERVICE_OPTIONS = [
  {
    code: 'DOMISILI' as const,
    title: 'Surat Keterangan Domisili',
    docs: 'KTP, Kartu Keluarga, Pengantar Kelian Banjar',
  },
  {
    code: 'SKU' as const,
    title: 'Surat Keterangan Usaha (SKU)',
    docs: 'KTP, Kartu Keluarga, Foto Tempat Usaha',
  },
  {
    code: 'SKCK' as const,
    title: 'Surat Pengantar SKCK',
    docs: 'KTP, KK, Pas Foto 4x6 Latar Merah',
  },
  {
    code: 'SKTM' as const,
    title: 'Surat Keterangan Tidak Mampu (SKTM)',
    docs: 'KTP, KK, Pengantar Banjar, Surat Pernyataan',
  },
]

const BANJAR_OPTIONS = [
  'Banjar Kaja',
  'Banjar Kelod',
  'Banjar Tengah',
  'Banjar Kangin',
  'Banjar Kauh',
]

interface UploadedFilePreview {
  fileName: string
  fileUrl: string
  fileType: string
}

export default function ServiceRequestForm({
  initialServiceTypeCode = 'DOMISILI',
  onSuccess,
}: ServiceRequestFormProps) {
  const [serviceTypeCode, setServiceTypeCode] = useState<'DOMISILI' | 'SKU' | 'SKCK' | 'SKTM'>(
    initialServiceTypeCode
  )
  const [applicantName, setApplicantName] = useState('')
  const [applicantNik, setApplicantNik] = useState('')
  const [applicantPhone, setApplicantPhone] = useState('')
  const [banjarName, setBanjarName] = useState(BANJAR_OPTIONS[0])
  const [purpose, setPurpose] = useState('')
  const [attachments, setAttachments] = useState<UploadedFilePreview[]>([])
  const [loading, setLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)

  // Handle simulated photo upload via FileReader
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    Array.from(files).forEach((file) => {
      const reader = new FileReader()
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          setAttachments((prev) => [
            ...prev,
            {
              fileName: file.name,
              fileUrl: reader.result as string,
              fileType: file.type || 'image/jpeg',
            },
          ])
        }
      }
      reader.readAsDataURL(file)
    })
  }

  const handleRemoveFile = (index: number) => {
    setAttachments((prev) => prev.filter((_, i) => i !== index))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMsg(null)

    // Validation
    if (applicantNik.length !== 16 || !/^\d+$/.test(applicantNik)) {
      setErrorMsg('NIK harus tepat 16 digit angka sesuai KTP.')
      return
    }

    if (applicantName.trim().length < 3) {
      setErrorMsg('Nama lengkap harus diisi minimal 3 karakter.')
      return
    }

    if (!applicantPhone.trim() || applicantPhone.length < 9) {
      setErrorMsg('Nomor WhatsApp/telepon minimal 9 digit angka.')
      return
    }

    if (!purpose.trim() || purpose.length < 5) {
      setErrorMsg('Keperluan pembuatan surat harus diisi jelas minimal 5 karakter.')
      return
    }

    setLoading(true)

    try {
      const result = await submitServiceRequestServerFn({
        data: {
          serviceTypeCode,
          applicantName: applicantName.trim(),
          applicantNik: applicantNik.trim(),
          applicantPhone: applicantPhone.trim(),
          banjarName,
          purpose: purpose.trim(),
          attachments: attachments.map((att) => ({
            fileName: att.fileName,
            fileUrl: att.fileUrl,
            fileType: att.fileType,
          })),
        },
      })

      onSuccess(result)
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Gagal mengirim permohonan surat'
      setErrorMsg(message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="island-shell rounded-3xl p-5 sm:p-8">
      {/* Kop Formulir Desa Tegal Tugu */}
      <div className="mb-6 border-b border-[var(--line)] pb-5 text-center sm:text-left">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-600/10 px-3 py-1 text-xs font-bold text-emerald-800 dark:text-emerald-300">
          <FileText className="h-3.5 w-3.5" aria-hidden="true" />
          <span>Layanan Surat Mandiri — Desa Tegal Tugu</span>
        </span>
        <h2 className="mt-2 text-xl font-bold text-[var(--sea-ink)] sm:text-2xl">
          Formulir Permohonan Surat
        </h2>
        <p className="mt-1 text-xs text-[var(--sea-ink-soft)] sm:text-sm">
          Isi data diri dan unggah berkas persyaratan. Petugas Desa Tegal Tugu akan memverifikasi permohonan Anda.
        </p>
      </div>

      {errorMsg && (
        <div
          role="alert"
          className="mb-6 flex items-start gap-3 rounded-2xl border border-rose-500/30 bg-rose-500/10 p-4 text-xs font-medium text-rose-800 dark:text-rose-200 sm:text-sm"
        >
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-rose-600" aria-hidden="true" />
          <div>
            <p className="font-bold">Mohon periksa kembali formulir Anda:</p>
            <p className="mt-0.5">{errorMsg}</p>
          </div>
        </div>
      )}

      <div className="space-y-5">
        {/* 1. Pilih Jenis Surat */}
        <div>
          <label className="mb-2 block text-xs font-bold text-[var(--sea-ink)] sm:text-sm">
            1. Pilihan Jenis Surat <span className="text-rose-500">*</span>
          </label>
          <div className="grid gap-2.5 sm:grid-cols-2">
            {SERVICE_OPTIONS.map((srv) => {
              const isSelected = serviceTypeCode === srv.code
              return (
                <button
                  key={srv.code}
                  type="button"
                  onClick={() => setServiceTypeCode(srv.code)}
                  className={`flex flex-col items-start rounded-2xl border p-4 text-left transition-all ${
                    isSelected
                      ? 'border-emerald-600 bg-emerald-600/10 ring-2 ring-emerald-600/20'
                      : 'border-[var(--line)] bg-[var(--header-bg)] hover:border-emerald-600/40'
                  }`}
                >
                  <div className="flex w-full items-center justify-between">
                    <span className="text-xs font-bold text-[var(--sea-ink)] sm:text-sm">
                      {srv.title}
                    </span>
                    {isSelected && (
                      <CheckCircle2 className="h-4 w-4 text-emerald-600" aria-hidden="true" />
                    )}
                  </div>
                  <span className="mt-1 text-[11px] text-[var(--sea-ink-soft)]">
                    Persyaratan: {srv.docs}
                  </span>
                </button>
              )
            })}
          </div>
        </div>

        {/* 2. Data Pemohon (NIK & Nama) */}
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label
              htmlFor="applicantNik"
              className="mb-1.5 block text-xs font-bold text-[var(--sea-ink)] sm:text-sm"
            >
              2. NIK (Nomor Induk Kependudukan) <span className="text-rose-500">*</span>
            </label>
            <input
              id="applicantNik"
              type="text"
              maxLength={16}
              value={applicantNik}
              onChange={(e) => setApplicantNik(e.target.value.replace(/\D/g, ''))}
              placeholder="Contoh: 5171010303920003"
              required
              className="w-full rounded-xl border border-[var(--line)] bg-[var(--header-bg)] px-3.5 py-2.5 text-xs text-[var(--sea-ink)] placeholder-[var(--sea-ink-soft)] focus:border-emerald-600 focus:outline-none focus:ring-1 focus:ring-emerald-600 sm:text-sm"
            />
            <span className="mt-1 block text-[11px] text-[var(--sea-ink-soft)]">
              {applicantNik.length}/16 digit
            </span>
          </div>

          <div>
            <label
              htmlFor="applicantName"
              className="mb-1.5 block text-xs font-bold text-[var(--sea-ink)] sm:text-sm"
            >
              3. Nama Lengkap (Sesuai KTP) <span className="text-rose-500">*</span>
            </label>
            <input
              id="applicantName"
              type="text"
              value={applicantName}
              onChange={(e) => setApplicantName(e.target.value)}
              placeholder="Nama lengkap pemohon..."
              required
              className="w-full rounded-xl border border-[var(--line)] bg-[var(--header-bg)] px-3.5 py-2.5 text-xs text-[var(--sea-ink)] placeholder-[var(--sea-ink-soft)] focus:border-emerald-600 focus:outline-none focus:ring-1 focus:ring-emerald-600 sm:text-sm"
            />
          </div>
        </div>

        {/* 3. Kontak & Banjar */}
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label
              htmlFor="applicantPhone"
              className="mb-1.5 block text-xs font-bold text-[var(--sea-ink)] sm:text-sm"
            >
              4. Nomor WhatsApp / Telepon <span className="text-rose-500">*</span>
            </label>
            <input
              id="applicantPhone"
              type="tel"
              value={applicantPhone}
              onChange={(e) => setApplicantPhone(e.target.value)}
              placeholder="Contoh: 081234567890"
              required
              className="w-full rounded-xl border border-[var(--line)] bg-[var(--header-bg)] px-3.5 py-2.5 text-xs text-[var(--sea-ink)] placeholder-[var(--sea-ink-soft)] focus:border-emerald-600 focus:outline-none focus:ring-1 focus:ring-emerald-600 sm:text-sm"
            />
            <span className="mt-1 block text-[11px] text-[var(--sea-ink-soft)]">
              Untuk menerima notifikasi status permohonan.
            </span>
          </div>

          <div>
            <label
              htmlFor="banjarName"
              className="mb-1.5 block text-xs font-bold text-[var(--sea-ink)] sm:text-sm"
            >
              5. Asal Banjar Adat (Desa Tegal Tugu) <span className="text-rose-500">*</span>
            </label>
            <select
              id="banjarName"
              value={banjarName}
              onChange={(e) => setBanjarName(e.target.value)}
              className="w-full rounded-xl border border-[var(--line)] bg-[var(--header-bg)] px-3.5 py-2.5 text-xs text-[var(--sea-ink)] focus:border-emerald-600 focus:outline-none focus:ring-1 focus:ring-emerald-600 sm:text-sm"
            >
              {BANJAR_OPTIONS.map((b) => (
                <option key={b} value={b}>
                  {b}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* 4. Keperluan Pembuatan Surat */}
        <div>
          <label
            htmlFor="purpose"
            className="mb-1.5 block text-xs font-bold text-[var(--sea-ink)] sm:text-sm"
          >
            6. Keperluan / Tujuan Pembuatan Surat <span className="text-rose-500">*</span>
          </label>
          <textarea
            id="purpose"
            rows={3}
            value={purpose}
            onChange={(e) => setPurpose(e.target.value)}
            placeholder="Contoh: Persyaratan pembukaan rekening bank BRI cabang Gianyar / Pengajuan KUR usaha warung sembako..."
            required
            className="w-full rounded-xl border border-[var(--line)] bg-[var(--header-bg)] px-3.5 py-2.5 text-xs text-[var(--sea-ink)] placeholder-[var(--sea-ink-soft)] focus:border-emerald-600 focus:outline-none focus:ring-1 focus:ring-emerald-600 sm:text-sm"
          />
        </div>

        {/* 5. Unggah Berkas Persyaratan (KTP / KK) */}
        <div>
          <label className="mb-1.5 block text-xs font-bold text-[var(--sea-ink)] sm:text-sm">
            7. Unggah Foto Berkas (KTP / KK / Bukti Pendukung)
          </label>
          <div className="rounded-2xl border-2 border-dashed border-[var(--line)] bg-black/[0.02] p-5 text-center dark:bg-white/[0.02]">
            <input
              type="file"
              id="file-upload"
              accept="image/*,.pdf"
              multiple
              onChange={handleFileSelect}
              className="hidden"
            />
            <label
              htmlFor="file-upload"
              className="inline-flex min-h-[44px] cursor-pointer items-center justify-center gap-2 rounded-xl bg-emerald-700 px-4 py-2.5 text-xs font-bold text-white shadow-sm transition hover:bg-emerald-800 dark:bg-emerald-600 dark:hover:bg-emerald-500 sm:text-sm"
            >
              <Upload className="h-4 w-4" aria-hidden="true" />
              <span>Pilih Foto dari Galeri / Kamera HP</span>
            </label>
            <p className="mt-2 text-[11px] text-[var(--sea-ink-soft)]">
              Mendukung format JPG, PNG, PDF (Maksimal 5MB per berkas).
            </p>

            {/* Uploaded Files Preview List */}
            {attachments.length > 0 && (
              <div className="mt-4 grid gap-2 sm:grid-cols-2">
                {attachments.map((file, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between rounded-xl border border-[var(--line)] bg-[var(--header-bg)] p-2.5 text-left"
                  >
                    <div className="flex items-center gap-2.5 overflow-hidden">
                      {file.fileType.startsWith('image/') ? (
                        <img
                          src={file.fileUrl}
                          alt={file.fileName}
                          className="h-9 w-9 rounded-lg object-cover"
                        />
                      ) : (
                        <ImageIcon className="h-5 w-5 text-emerald-600" aria-hidden="true" />
                      )}
                      <span className="truncate text-xs font-medium text-[var(--sea-ink)]">
                        {file.fileName}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveFile(idx)}
                      className="rounded-lg p-1.5 text-rose-600 hover:bg-rose-500/10"
                      title="Hapus berkas"
                    >
                      <Trash2 className="h-4 w-4" aria-hidden="true" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Submit Action */}
        <div className="pt-3">
          <button
            type="submit"
            disabled={loading}
            className="flex min-h-[50px] w-full items-center justify-center gap-2 rounded-2xl bg-emerald-700 px-6 py-3 text-sm font-bold text-white shadow-md transition hover:bg-emerald-800 disabled:opacity-50 dark:bg-emerald-600 dark:hover:bg-emerald-500"
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                <span>Memproses Permohonan Surat...</span>
              </>
            ) : (
              <>
                <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
                <span>Kirim Permohonan Surat Sekarang</span>
              </>
            )}
          </button>
          <p className="mt-2 text-center text-[11px] text-[var(--sea-ink-soft)]">
            Seluruh pelayanan administrasi di Desa Tegal Tugu tidak dipungut biaya apapun (Gratis Rp 0).
          </p>
        </div>
      </div>
    </form>
  )
}

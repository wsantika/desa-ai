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
    initialServiceTypeCode,
  )
  const [applicantNik, setApplicantNik] = useState('')
  const [applicantName, setApplicantName] = useState('')
  const [applicantPhone, setApplicantPhone] = useState('')
  const [banjarName, setBanjarName] = useState(BANJAR_OPTIONS[0])
  const [purpose, setPurpose] = useState('')
  const [attachments, setAttachments] = useState<UploadedFilePreview[]>([])
  const [loading, setLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    const newFiles: UploadedFilePreview[] = []
    Array.from(files).forEach((file) => {
      const fakeUrl = URL.createObjectURL(file)
      newFiles.push({
        fileName: file.name,
        fileUrl: fakeUrl,
        fileType: file.type,
      })
    })

    setAttachments((prev) => [...prev, ...newFiles])
  }

  const handleRemoveFile = (index: number) => {
    setAttachments((prev) => prev.filter((_, idx) => idx !== index))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMsg(null)

    // Form Client Validations
    if (!applicantNik || applicantNik.length !== 16) {
      setErrorMsg('NIK harus terdiri dari 16 digit angka resmi.')
      return
    }

    if (!applicantName.trim()) {
      setErrorMsg('Nama pemohon wajib diisi sesuai KTP.')
      return
    }

    if (!applicantPhone.trim()) {
      setErrorMsg('Nomor WhatsApp / telepon wajib diisi untuk notifikasi.')
      return
    }

    if (!purpose.trim() || purpose.trim().length < 5) {
      setErrorMsg('Keperluan pembuatan surat wajib diisi dengan jelas (minimal 5 karakter).')
      return
    }

    try {
      setLoading(true)

      const result = await submitServiceRequestServerFn({
        data: {
          serviceTypeCode,
          applicantNik: applicantNik.trim(),
          applicantName: applicantName.trim(),
          applicantPhone: applicantPhone.trim(),
          banjarName,
          purpose: purpose.trim(),
          attachments: attachments.map((a) => a.fileUrl),
        },
      })

      if (result.success && result.data) {
        onSuccess(result.data)
      } else {
        setErrorMsg(result.error || 'Terjadi kegagalan saat mengirim permohonan surat.')
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Kesalahan jaringan sistem desa.'
      setErrorMsg(msg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs sm:p-8 dark:border-slate-800 dark:bg-slate-900">
      {/* Kop Formulir Desa Tegal Tugu */}
      <div className="mb-6 border-b border-slate-100 pb-5 text-center sm:text-left dark:border-slate-800">
        <span className="inline-flex items-center gap-1.5 rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-xs font-bold text-blue-800 dark:border-blue-900/50 dark:bg-blue-950/60 dark:text-blue-300">
          <FileText className="h-3.5 w-3.5" aria-hidden="true" />
          <span>Layanan Surat Mandiri: Desa Tegal Tugu</span>
        </span>
        <h2 className="mt-2 text-xl font-bold text-slate-900 sm:text-2xl dark:text-white">
          Formulir Permohonan Surat
        </h2>
        <p className="mt-1 text-xs text-slate-500 sm:text-sm dark:text-slate-400">
          Isi data diri dan unggah berkas persyaratan. Petugas Desa Tegal Tugu akan memverifikasi permohonan Anda.
        </p>
      </div>

      {errorMsg && (
        <div
          role="alert"
          className="mb-6 flex items-start gap-3 rounded-xl border border-rose-200 bg-rose-50/50 p-4 text-xs font-medium text-rose-800 dark:border-rose-900/40 dark:bg-rose-950/30 dark:text-rose-200 sm:text-sm"
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
          <label className="mb-2 block text-xs font-bold text-slate-900 sm:text-sm dark:text-white">
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
                  className={`flex flex-col items-start rounded-xl border p-4 text-left transition-all ${
                    isSelected
                      ? 'border-blue-600 bg-blue-50/80 ring-2 ring-blue-600/20 dark:border-blue-500 dark:bg-blue-950/50'
                      : 'border-slate-200 bg-white hover:border-blue-300 dark:border-slate-700 dark:bg-slate-800'
                  }`}
                >
                  <div className="flex w-full items-center justify-between">
                    <span className="text-xs font-bold text-slate-900 sm:text-sm dark:text-white">
                      {srv.title}
                    </span>
                    {isSelected && (
                      <CheckCircle2 className="h-4 w-4 text-blue-600 dark:text-blue-400" aria-hidden="true" />
                    )}
                  </div>
                  <span className="mt-1 text-[11px] text-slate-500 dark:text-slate-400">
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
              className="mb-1.5 block text-xs font-bold text-slate-900 sm:text-sm dark:text-white"
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
              className="w-full rounded-xl border border-slate-300 bg-slate-50/50 px-3.5 py-2.5 text-xs text-slate-900 placeholder:text-slate-400 focus:border-blue-600 focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-600 dark:border-slate-700 dark:bg-slate-800 dark:text-white sm:text-sm"
            />
            <span className="mt-1 block text-[11px] text-slate-500 dark:text-slate-400">
              {applicantNik.length}/16 digit
            </span>
          </div>

          <div>
            <label
              htmlFor="applicantName"
              className="mb-1.5 block text-xs font-bold text-slate-900 sm:text-sm dark:text-white"
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
              className="w-full rounded-xl border border-slate-300 bg-slate-50/50 px-3.5 py-2.5 text-xs text-slate-900 placeholder:text-slate-400 focus:border-blue-600 focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-600 dark:border-slate-700 dark:bg-slate-800 dark:text-white sm:text-sm"
            />
          </div>
        </div>

        {/* 3. Kontak & Banjar */}
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label
              htmlFor="applicantPhone"
              className="mb-1.5 block text-xs font-bold text-slate-900 sm:text-sm dark:text-white"
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
              className="w-full rounded-xl border border-slate-300 bg-slate-50/50 px-3.5 py-2.5 text-xs text-slate-900 placeholder:text-slate-400 focus:border-blue-600 focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-600 dark:border-slate-700 dark:bg-slate-800 dark:text-white sm:text-sm"
            />
            <span className="mt-1 block text-[11px] text-slate-500 dark:text-slate-400">
              Untuk menerima notifikasi status permohonan.
            </span>
          </div>

          <div>
            <label
              htmlFor="banjarName"
              className="mb-1.5 block text-xs font-bold text-slate-900 sm:text-sm dark:text-white"
            >
              5. Asal Banjar Adat (Desa Tegal Tugu) <span className="text-rose-500">*</span>
            </label>
            <select
              id="banjarName"
              value={banjarName}
              onChange={(e) => setBanjarName(e.target.value)}
              className="w-full rounded-xl border border-slate-300 bg-slate-50/50 px-3.5 py-2.5 text-xs text-slate-900 focus:border-blue-600 focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-600 dark:border-slate-700 dark:bg-slate-800 dark:text-white sm:text-sm"
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
            className="mb-1.5 block text-xs font-bold text-slate-900 sm:text-sm dark:text-white"
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
            className="w-full rounded-xl border border-slate-300 bg-slate-50/50 px-3.5 py-2.5 text-xs text-slate-900 placeholder:text-slate-400 focus:border-blue-600 focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-600 dark:border-slate-700 dark:bg-slate-800 dark:text-white sm:text-sm"
          />
        </div>

        {/* 5. Unggah Berkas Persyaratan (KTP / KK) */}
        <div>
          <label className="mb-1.5 block text-xs font-bold text-slate-900 sm:text-sm dark:text-white">
            7. Unggah Foto Berkas (KTP / KK / Bukti Pendukung)
          </label>
          <div className="rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50/50 p-5 text-center dark:border-slate-700 dark:bg-slate-800/40">
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
              className="inline-flex min-h-[44px] cursor-pointer items-center justify-center gap-2 rounded-xl bg-blue-700 px-4 py-2.5 text-xs font-bold text-white shadow-xs transition hover:bg-blue-800 dark:bg-blue-600 dark:hover:bg-blue-500 sm:text-sm"
            >
              <Upload className="h-4 w-4" aria-hidden="true" />
              <span>Pilih Foto dari Galeri / Kamera HP</span>
            </label>
            <p className="mt-2 text-[11px] text-slate-500 dark:text-slate-400">
              Mendukung format JPG, PNG, PDF (Maksimal 5MB per berkas).
            </p>

            {/* Uploaded Files Preview List */}
            {attachments.length > 0 && (
              <div className="mt-4 grid gap-2 sm:grid-cols-2">
                {attachments.map((file, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between rounded-xl border border-slate-200 bg-white p-2.5 text-left dark:border-slate-700 dark:bg-slate-800"
                  >
                    <div className="flex items-center gap-2.5 overflow-hidden">
                      {file.fileType.startsWith('image/') ? (
                        <img
                          src={file.fileUrl}
                          alt={file.fileName}
                          className="h-9 w-9 rounded-lg object-cover"
                        />
                      ) : (
                        <ImageIcon className="h-5 w-5 text-blue-600 dark:text-blue-400" aria-hidden="true" />
                      )}
                      <span className="truncate text-xs font-medium text-slate-900 dark:text-white">
                        {file.fileName}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveFile(idx)}
                      className="rounded-lg p-1.5 text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/50"
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
            className="flex min-h-[50px] w-full items-center justify-center gap-2 rounded-xl bg-blue-700 px-6 py-3 text-sm font-bold text-white shadow-xs transition hover:bg-blue-800 disabled:opacity-50 dark:bg-blue-600 dark:hover:bg-blue-500"
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
          <p className="mt-2 text-center text-[11px] text-slate-500 dark:text-slate-400">
            Seluruh pelayanan administrasi di Desa Tegal Tugu tidak dipungut biaya apapun (Gratis Rp 0).
          </p>
        </div>
      </div>
    </form>
  )
}

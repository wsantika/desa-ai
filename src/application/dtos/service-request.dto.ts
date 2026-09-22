import { z } from 'zod'

export const SubmitServiceRequestSchema = z.object({
  serviceTypeCode: z.enum(['DOMISILI', 'SKU', 'SKCK', 'SKTM']),
  applicantName: z.string().min(3, 'Nama lengkap minimal 3 karakter'),
  applicantNik: z
    .string()
    .length(16, 'NIK harus tepat 16 digit')
    .regex(/^\d+$/, 'NIK hanya boleh berisi angka'),
  applicantPhone: z
    .string()
    .min(9, 'Nomor telepon/WhatsApp minimal 9 digit')
    .regex(/^[0-9+]+$/, 'Nomor telepon tidak valid'),
  banjarName: z.string().min(1, 'Banjar wajib dipilih'),
  purpose: z.string().min(5, 'Keperluan pembuatan surat minimal 5 karakter'),
  attachments: z
    .array(
      z.object({
        fileName: z.string(),
        fileUrl: z.string(),
        fileType: z.string(),
      }),
    )
    .optional(),
})

export type SubmitServiceRequestDto = z.infer<typeof SubmitServiceRequestSchema>

export const TrackServiceRequestSchema = z.object({
  trackingCode: z
    .string()
    .min(5, 'Kode tiket tidak valid')
    .transform((val) => val.trim().toUpperCase()),
})

export type TrackServiceRequestDto = z.infer<typeof TrackServiceRequestSchema>

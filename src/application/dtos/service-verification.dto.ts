import { z } from 'zod'

export const serviceVerificationFilterSchema = z.object({
  status: z
    .enum(['ALL', 'PENDING', 'IN_REVIEW', 'REVISION', 'APPROVED', 'REJECTED'])
    .optional()
    .default('ALL'),
  serviceCode: z
    .enum(['ALL', 'DOMISILI', 'SKU', 'SKCK', 'SKTM'])
    .optional()
    .default('ALL'),
  banjarId: z.string().optional().default('ALL'),
  search: z.string().optional().default(''),
})

export type ServiceVerificationFilterDTO = z.infer<
  typeof serviceVerificationFilterSchema
>

export const updateServiceVerificationStatusSchema = z.object({
  requestId: z.string().min(1, 'ID permohonan surat wajib diisi'),
  status: z.enum(['PENDING', 'IN_REVIEW', 'REVISION', 'APPROVED', 'REJECTED']),
  notes: z
    .string()
    .min(3, 'Catatan petugas atau alasan verifikasi wajib diisi (minimal 3 karakter)'),
  actorId: z.string().optional().nullable(),
})

export type UpdateServiceVerificationStatusDTO = z.infer<
  typeof updateServiceVerificationStatusSchema
>

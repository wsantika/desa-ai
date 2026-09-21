import { z } from 'zod'

export const triageFilterSchema = z.object({
  status: z
    .enum(['ALL', 'OPEN', 'IN_PROGRESS', 'RESOLVED', 'REJECTED'])
    .optional()
    .default('ALL'),
  priority: z
    .enum(['ALL', 'EMERGENCY', 'HIGH', 'MEDIUM', 'LOW'])
    .optional()
    .default('ALL'),
  category: z
    .enum([
      'ALL',
      'INFRASTRUCTURE',
      'PUBLIC_FACILITY',
      'WASTE_MANAGEMENT',
      'HEALTH_SANITATION',
      'SOCIAL_CONFLICT',
      'SECURITY_ORDER',
      'ADMINISTRATIVE',
      'OTHER',
    ])
    .optional()
    .default('ALL'),
  banjarId: z.string().optional().default('ALL'),
  search: z.string().optional().default(''),
})

export type TriageFilterDTO = z.infer<typeof triageFilterSchema>

export const updateTriageStatusSchema = z.object({
  complaintId: z.string().min(1, 'ID pengaduan wajib diisi'),
  status: z.enum(['OPEN', 'IN_PROGRESS', 'RESOLVED', 'REJECTED']),
  notes: z
    .string()
    .min(3, 'Catatan tindakan penanganan wajib diisi (minimal 3 karakter)'),
  proofPhotoUrl: z.string().optional().nullable(),
  actorId: z.string().optional().nullable(),
})

export type UpdateTriageStatusDTO = z.infer<typeof updateTriageStatusSchema>

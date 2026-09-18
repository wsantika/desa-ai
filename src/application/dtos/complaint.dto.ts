import { z } from 'zod'

export const createComplaintSchema = z.object({
  reporterName: z.string().min(2, 'Nama minimal 2 karakter'),
  reporterPhone: z.string().optional(),
  title: z.string().min(5, 'Judul keluhan minimal 5 karakter'),
  description: z.string().min(10, 'Deskripsi keluhan minimal 10 karakter'),
  banjarId: z.string().min(1, 'Banjar harus dipilih'),
  specificLocation: z.string().min(3, 'Lokasi spesifik wajib diisi'),
  photoUrl: z.string().url().optional().or(z.literal('')),
})

export type CreateComplaintDTO = z.infer<typeof createComplaintSchema>

import { z } from 'zod'

export const createComplaintSchema = z.object({
  reporterName: z.string().min(2, 'Nama minimal 2 karakter'),
  reporterPhone: z.string().optional(),
  title: z.string().min(5, 'Judul keluhan minimal 5 karakter'),
  description: z.string().min(10, 'Deskripsi keluhan minimal 10 karakter'),
  banjarId: z.string().min(1, 'Banjar harus dipilih'),
  specificLocation: z.string().min(3, 'Lokasi spesifik wajib diisi'),
  photoUrl: z.string().optional(),
})

export type CreateComplaintDTO = z.infer<typeof createComplaintSchema>

export const trackComplaintSchema = z.object({
  ticketCode: z
    .string()
    .min(5, 'Kode tiket tidak valid')
    .transform((val) => val.trim().toUpperCase()),
})

export type TrackComplaintDTO = z.infer<typeof trackComplaintSchema>

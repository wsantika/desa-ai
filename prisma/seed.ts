import { PrismaPg } from '@prisma/adapter-pg'
import { getDatabaseUrl } from '../src/database-url.js'
import { PrismaClient } from '../src/generated/prisma/client.js'
import { banjarsSeedData } from './seed-data/banjars.data.js'
import { knowledgeSeedData } from './seed-data/knowledge.data.js'
import { GeminiEmbeddingService } from '../src/infrastructure/ai/gemini-embedding.service.js'
import { serviceTypesSeedData } from './seed-data/service-types.data.js'
import { usersSeedData } from './seed-data/users.data.js'
import { complaintsSeedData } from './seed-data/complaints.data.js'

const adapter = new PrismaPg({
  connectionString: getDatabaseUrl(),
})

const prisma = new PrismaClient({ adapter })

async function main() {
  console.log('🌱 Memulai proses seeding database DesaAI...')

  // 1. Seed Master Banjar
  console.log('📍 Menyiapkan Master Banjar...')
  for (const banjar of banjarsSeedData) {
    await prisma.banjar.upsert({
      where: { id: banjar.id },
      update: {
        name: banjar.name,
        dusun: banjar.dusun,
        leaderName: banjar.leaderName,
        leaderPhone: banjar.leaderPhone,
      },
      create: banjar,
    })
  }
  console.log(`   ✅ ${banjarsSeedData.length} Banjar berhasil disiapkan`)

  // 2. Seed Katalog Layanan Surat
  console.log('📄 Menyiapkan Katalog Layanan Surat...')
  for (const st of serviceTypesSeedData) {
    await prisma.serviceType.upsert({
      where: { code: st.code },
      update: {
        title: st.title,
        description: st.description,
        requiredDocs: st.requiredDocs,
        estimatedDays: st.estimatedDays,
        isActive: st.isActive,
      },
      create: {
        id: st.id,
        code: st.code,
        title: st.title,
        description: st.description,
        requiredDocs: st.requiredDocs,
        estimatedDays: st.estimatedDays,
        isActive: st.isActive,
      },
    })
  }
  console.log(
    `   ✅ ${serviceTypesSeedData.length} Katalog Layanan berhasil disiapkan`,
  )

  // 3. Seed Akun Pengguna Demo (Admin, Petugas, Warga)
  console.log('👥 Menyiapkan Akun Pengguna Demo & Profil Warga...')
  for (const u of usersSeedData) {
    await prisma.user.upsert({
      where: { id: u.id },
      update: {
        email: u.email,
        phone: u.phone,
        passwordHash: u.passwordHash,
        role: u.role,
        profile: {
          upsert: {
            update: {
              nik: u.profile.nik,
              fullName: u.profile.fullName,
              gender: u.profile.gender,
              birthPlace: u.profile.birthPlace,
              birthDate: u.profile.birthDate,
              occupation: u.profile.occupation,
              address: u.profile.address,
              banjarId: u.profile.banjarId,
            },
            create: {
              nik: u.profile.nik,
              fullName: u.profile.fullName,
              gender: u.profile.gender,
              birthPlace: u.profile.birthPlace,
              birthDate: u.profile.birthDate,
              occupation: u.profile.occupation,
              address: u.profile.address,
              banjarId: u.profile.banjarId,
            },
          },
        },
      },
      create: {
        id: u.id,
        email: u.email,
        phone: u.phone,
        passwordHash: u.passwordHash,
        role: u.role,
        profile: {
          create: {
            nik: u.profile.nik,
            fullName: u.profile.fullName,
            gender: u.profile.gender,
            birthPlace: u.profile.birthPlace,
            birthDate: u.profile.birthDate,
            occupation: u.profile.occupation,
            address: u.profile.address,
            banjarId: u.profile.banjarId,
          },
        },
      },
    })
  }
  console.log(
    `   ✅ ${usersSeedData.length} Akun Pengguna Demo berhasil disiapkan`,
  )

  // 4. Seed Dokumen Regulasi & SOP Desa
  console.log('📚 Menyiapkan Dokumen SOP, Regulasi & Profil Desa...')
  for (const doc of knowledgeSeedData) {
    const upsertedDoc = await prisma.knowledgeDocument.upsert({
      where: { id: doc.id },
      update: {
        title: doc.title,
        category: doc.category,
        sourceUrl: doc.sourceUrl ?? null,
        contentText: doc.contentText,
        metadata: doc.metadata
          ? JSON.parse(JSON.stringify(doc.metadata))
          : undefined,
      },
      create: {
        id: doc.id,
        title: doc.title,
        category: doc.category,
        sourceUrl: doc.sourceUrl ?? null,
        contentText: doc.contentText,
        metadata: doc.metadata
          ? JSON.parse(JSON.stringify(doc.metadata))
          : undefined,
      },
    })

    // Generate dense vector embeddings for chunks
    const embeddingService = new GeminiEmbeddingService()
    const embeddings = await embeddingService.generateBatchEmbeddings(
      doc.chunks,
    )

    // Bersihkan dan sinkronisasi chunks dokumen
    await prisma.knowledgeChunk.deleteMany({
      where: { documentId: upsertedDoc.id },
    })

    await prisma.knowledgeChunk.createMany({
      data: doc.chunks.map((chunkContent, index) => ({
        documentId: upsertedDoc.id,
        chunkIndex: index + 1,
        chunkContent,
        embedding: embeddings[index] || [],
      })),
    })
  }
  console.log(
    `   ✅ ${knowledgeSeedData.length} Dokumen SOP/Regulasi berhasil diindeks beserta vector embeddings`,
  )

  // 5. Seed Pengaduan Warga & Riwayat Status (Demo Data Analitik)
  console.log('📢 Menyiapkan Data Pengaduan Warga Demo...')
  for (const c of complaintsSeedData) {
    const existing = await prisma.complaint.findUnique({
      where: { ticketCode: c.ticketCode },
    })

    if (existing) {
      await prisma.complaint.update({
        where: { ticketCode: c.ticketCode },
        update: {
          title: c.title,
          description: c.description,
          status: c.status,
          category: c.category,
          priority: c.priority,
          aiSummary: c.aiSummary,
          resolvedAt: c.resolvedAt ?? null,
        },
      })
    } else {
      await prisma.complaint.create({
        data: {
          ticketCode: c.ticketCode,
          citizenId: c.citizenId ?? null,
          reporterName: c.reporterName,
          reporterPhone: c.reporterPhone,
          banjarId: c.banjarId,
          title: c.title,
          description: c.description,
          specificLocation: c.specificLocation,
          status: c.status,
          category: c.category,
          priority: c.priority,
          aiSummary: c.aiSummary,
          createdAt: c.createdAt,
          resolvedAt: c.resolvedAt ?? null,
          aiEvaluation: {
            create: {
              predictedCategory: c.evaluation.predictedCategory,
              priority: c.evaluation.priority,
              confidenceScore: c.evaluation.confidenceScore,
              executiveSummary: c.evaluation.executiveSummary,
              recommendedAction: c.evaluation.recommendedAction,
            },
          },
          statusLogs: {
            create: [
              {
                newStatus: 'OPEN',
                actionNote: 'Pengaduan dicatat melalui kanal digital DesaAI.',
                createdAt: c.createdAt,
              },
              ...(c.status === 'IN_PROGRESS' || c.status === 'RESOLVED'
                ? [
                    {
                      previousStatus: 'OPEN' as const,
                      newStatus: 'IN_PROGRESS' as const,
                      actionNote:
                        'Petugas lapangan ditugaskan untuk peninjauan fisik.',
                      createdAt: new Date(c.createdAt.getTime() + 2 * 3600000),
                    },
                  ]
                : []),
              ...(c.status === 'RESOLVED' && c.resolvedAt
                ? [
                    {
                      previousStatus: 'IN_PROGRESS' as const,
                      newStatus: 'RESOLVED' as const,
                      actionNote:
                        'Penanganan tuntas dan telah dikonfirmasi warga.',
                      createdAt: c.resolvedAt,
                    },
                  ]
                : []),
            ],
          },
        },
      })
    }
  }
  console.log(
    `   ✅ ${complaintsSeedData.length} Pengaduan Warga Demo berhasil disiapkan`,
  )

  console.log('🎉 Seeding database DesaAI selesai dengan sukses!')
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

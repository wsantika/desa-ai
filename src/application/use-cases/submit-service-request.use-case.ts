import type { IServiceRequestRepository } from '../../domain/repositories/i-service-request.repository.js'
import type { ServiceRequestEntity } from '../../domain/entities/service-request.entity.js'
import type { SubmitServiceRequestDto } from '../dtos/service-request.dto.js'
import { prisma } from '../../infrastructure/db/prisma.js'

export class SubmitServiceRequestUseCase {
  constructor(private readonly serviceRequestRepo: IServiceRequestRepository) {}

  /**
   * Generates a unique tracking code with format: REQ-YYYYMM-XXXX
   * e.g. REQ-202609-1042
   */
  generateTrackingCode(date: Date = new Date()): string {
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const randomSuffix = Math.floor(1000 + Math.random() * 9000)
    return `REQ-${year}${month}-${randomSuffix}`
  }

  async execute(dto: SubmitServiceRequestDto): Promise<ServiceRequestEntity> {
    // 1. Resolve or fallback service type
    const serviceType = await prisma.serviceType.findUnique({
      where: { code: dto.serviceTypeCode },
    })

    const serviceTypeId = serviceType?.id ?? `st-${dto.serviceTypeCode.toLowerCase()}`

    // 2. Ensure citizen user exists (look up by phone or create guest citizen)
    let citizenUser = await prisma.user.findFirst({
      where: {
        OR: [
          { phone: dto.applicantPhone },
          { profile: { nik: dto.applicantNik } },
        ],
      },
      include: { profile: true },
    })

    if (!citizenUser) {
      // Find banjar if matches
      const banjar = await prisma.banjar.findFirst({
        where: { name: { contains: dto.banjarName, mode: 'insensitive' } },
      })

      // Create citizen user with profile
      citizenUser = await prisma.user.create({
        data: {
          phone: dto.applicantPhone,
          passwordHash: 'guest-session-unauthenticated',
          role: 'CITIZEN',
          profile: {
            create: {
              nik: dto.applicantNik,
              fullName: dto.applicantName,
              gender: 'L',
              address: `Wilayah ${dto.banjarName}, Desa Tegal Tugu`,
              banjarId: banjar?.id ?? null,
            },
          },
        },
        include: { profile: true },
      })
    }

    // 3. Generate unique tracking code
    let trackingCode = this.generateTrackingCode()
    let attempts = 0
    while (attempts < 5) {
      const existing = await this.serviceRequestRepo.findByTrackingCode(trackingCode)
      if (!existing) break
      trackingCode = this.generateTrackingCode()
      attempts++
    }

    // 4. Create request in repository
    return this.serviceRequestRepo.create({
      trackingCode,
      citizenId: citizenUser.id,
      serviceTypeId,
      applicantName: dto.applicantName,
      applicantNik: dto.applicantNik,
      applicantPhone: dto.applicantPhone,
      purpose: dto.purpose,
      attachments: dto.attachments?.map((att) => ({
        fileName: att.fileName,
        fileUrl: att.fileUrl,
        fileType: att.fileType,
      })),
    })
  }
}

import { createServerFn } from '@tanstack/react-start'
import {
  SubmitServiceRequestSchema,
  TrackServiceRequestSchema,
} from '../dtos/service-request.dto.js'
import { PrismaServiceRequestRepository } from '../../infrastructure/repositories/prisma-service-request.repository.js'
import { SubmitServiceRequestUseCase } from '../use-cases/submit-service-request.use-case.js'
import { TrackServiceRequestUseCase } from '../use-cases/track-service-request.use-case.js'

export const submitServiceRequestServerFn = createServerFn({ method: 'POST' })
  .validator((data: unknown) => SubmitServiceRequestSchema.parse(data))
  .handler(async ({ data }) => {
    const repository = new PrismaServiceRequestRepository()
    const useCase = new SubmitServiceRequestUseCase(repository)
    return useCase.execute(data)
  })

export const trackServiceRequestServerFn = createServerFn({ method: 'GET' })
  .validator((data: unknown) => TrackServiceRequestSchema.parse(data))
  .handler(async ({ data }) => {
    const repository = new PrismaServiceRequestRepository()
    const useCase = new TrackServiceRequestUseCase(repository)
    return useCase.execute(data.trackingCode)
  })

import { createServerFn } from '@tanstack/react-start'
import {
  createComplaintSchema,
  trackComplaintSchema,
} from '../dtos/complaint.dto.js'
import { PrismaComplaintRepository } from '../../infrastructure/repositories/prisma-complaint.repository.js'
import { createAIEvaluatorService } from '../../infrastructure/ai/ai-evaluator.factory.js'
import { SubmitComplaintUseCase } from '../use-cases/submit-complaint.use-case.js'
import { TrackComplaintUseCase } from '../use-cases/track-complaint.use-case.js'

export const submitComplaintServerFn = createServerFn({ method: 'POST' })
  .validator((data: unknown) => createComplaintSchema.parse(data))
  .handler(async ({ data }) => {
    const repository = new PrismaComplaintRepository()
    const aiEvaluator = createAIEvaluatorService()
    const useCase = new SubmitComplaintUseCase(repository, aiEvaluator)
    return useCase.execute(data)
  })

export const trackComplaintServerFn = createServerFn({ method: 'GET' })
  .validator((data: unknown) => trackComplaintSchema.parse(data))
  .handler(async ({ data }) => {
    const repository = new PrismaComplaintRepository()
    const useCase = new TrackComplaintUseCase(repository)
    return useCase.execute(data.ticketCode)
  })

import { createServerFn } from '@tanstack/react-start'
import {
  serviceVerificationFilterSchema,
  updateServiceVerificationStatusSchema,
} from '../dtos/service-verification.dto.js'
import {
  fetchServiceVerificationData,
  updateServiceRequestStatus,
} from '../services/admin-service-verification.service.js'

export type {
  ServiceVerificationStatusLogItem,
  ServiceVerificationAttachmentItem,
  ServiceVerificationItem,
  ServiceVerificationCounters,
  ServiceTypeOption,
  ServiceVerificationDeskData,
} from '../services/admin-service-verification.service.js'

// Server functions untuk TanStack Start
export const fetchServiceVerificationDataServerFn = createServerFn({
  method: 'GET',
})
  .validator((d: unknown) => serviceVerificationFilterSchema.optional().parse(d))
  .handler(async ({ data }) => {
    return fetchServiceVerificationData(data)
  })

export const updateServiceRequestStatusServerFn = createServerFn({
  method: 'POST',
})
  .validator((d: unknown) => updateServiceVerificationStatusSchema.parse(d))
  .handler(async ({ data }) => {
    return updateServiceRequestStatus(data)
  })

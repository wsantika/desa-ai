import { createServerFn } from '@tanstack/react-start'
import {
  triageFilterSchema,
  updateTriageStatusSchema,
} from '../dtos/triage-desk.dto.js'
import {
  fetchTriageDeskData,
  updateTriageComplaintStatus,
} from '../services/admin-triage.service.js'

export type {
  TriageStatusLogItem,
  TriageComplaintItem,
  TriageCounters,
  BanjarOption,
  TriageDeskData,
} from '../services/admin-triage.service.js'

export const fetchTriageDeskDataServerFn = createServerFn({
  method: 'GET',
})
  .validator((d: unknown) => triageFilterSchema.optional().parse(d))
  .handler(async ({ data }) => {
    return fetchTriageDeskData(data)
  })

export const updateTriageComplaintStatusServerFn = createServerFn({
  method: 'POST',
})
  .validator((d: unknown) => updateTriageStatusSchema.parse(d))
  .handler(async ({ data }) => {
    return updateTriageComplaintStatus(data)
  })

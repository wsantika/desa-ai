import { createFileRoute, redirect } from '@tanstack/react-router'

interface PelacakanSearchParams {
  track?: string
}

export const Route = createFileRoute('/pelacakan')({
  validateSearch: (search: Record<string, unknown>): PelacakanSearchParams => {
    return {
      track: typeof search.track === 'string' ? search.track : undefined,
    }
  },
  beforeLoad: ({ search }) => {
    throw redirect({
      to: '/layanan',
      search: {
        tab: 'lacak',
        track: search.track,
      },
    })
  },
})

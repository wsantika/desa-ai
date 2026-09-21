import { createFileRoute, redirect } from '@tanstack/react-router'

interface LayananPengajuanSearchParams {
  type?: 'DOMISILI' | 'SKU' | 'SKCK' | 'SKTM'
}

export const Route = createFileRoute('/layanan_/pengajuan')({
  validateSearch: (
    search: Record<string, unknown>,
  ): LayananPengajuanSearchParams => {
    const validTypes = ['DOMISILI', 'SKU', 'SKCK', 'SKTM'] as const
    return {
      type:
        typeof search.type === 'string' &&
        validTypes.includes(search.type as (typeof validTypes)[number])
          ? (search.type as (typeof validTypes)[number])
          : undefined,
    }
  },
  beforeLoad: ({ search }) => {
    throw redirect({
      to: '/layanan',
      search: {
        tab: 'form',
        type: search.type || 'DOMISILI',
      },
    })
  },
})

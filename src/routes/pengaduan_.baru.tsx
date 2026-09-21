import { createFileRoute, redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/pengaduan_/baru')({
  beforeLoad: () => {
    throw redirect({
      to: '/pengaduan',
      search: {
        tab: 'form',
      },
    })
  },
})

import { PrismaClient } from './generated/prisma/client.js'
import { getDatabaseUrl } from './database-url.js'
import { PrismaPg } from '@prisma/adapter-pg'

const isServer = typeof window === 'undefined'

declare global {
  var __prisma: PrismaClient | undefined
}

export const prisma = isServer
  ? globalThis.__prisma ||
    new PrismaClient({
      adapter: new PrismaPg({
        connectionString: getDatabaseUrl(),
      }),
    })
  : ({} as unknown as PrismaClient)

if (isServer && typeof process !== 'undefined' && process.env?.NODE_ENV !== 'production') {
  globalThis.__prisma = prisma
}

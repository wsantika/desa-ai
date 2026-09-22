import { prisma } from '../../db.js'
import type { PrismaClient } from '../../generated/prisma/client.js'

export { prisma }
export type { PrismaClient }

export type PrismaTransaction = Omit<
  PrismaClient,
  '$connect' | '$disconnect' | '$on' | '$transaction' | '$use' | '$extends'
>

export type DbClient = PrismaClient | PrismaTransaction

export function getDatabaseUrl() {
  const env = typeof process !== 'undefined' && process.env ? process.env : {}
  const databaseUrl =
    env.DATABASE_URL ||
    env.POSTGRES_PRISMA_URL ||
    env.POSTGRES_URL ||
    env.DATABASE_URL_UNPOOLED

  if (!databaseUrl || !databaseUrl.trim()) {
    return 'postgresql://postgres:postgres@localhost:5432/desa_ai?schema=public'
  }

  return databaseUrl.trim()
}

export function getDatabaseUrl() {
  const databaseUrl = process.env.DATABASE_URL

  if (!databaseUrl) {
    return 'postgresql://postgres:postgres@localhost:5432/desa_ai?schema=public'
  }

  return databaseUrl
}

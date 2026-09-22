export function getDatabaseUrl() {
  const databaseUrl =
    typeof process !== 'undefined' && process.env ? process.env.DATABASE_URL : undefined

  if (!databaseUrl) {
    return 'postgresql://postgres:postgres@localhost:5432/desa_ai?schema=public'
  }

  return databaseUrl
}

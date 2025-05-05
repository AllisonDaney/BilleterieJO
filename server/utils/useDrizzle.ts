import type { PostgresJsDatabase } from 'drizzle-orm/postgres-js'
import { sql } from 'drizzle-orm'
import { PgTable } from 'drizzle-orm/pg-core'
import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'
import { schema } from '~~/server/database/schema'
import 'dotenv/config'

export function useDrizzle() {
  const url = process.env.NUXT_POSTGRES_URL

  if (!url) {
    throw createError({ statusCode: 500, statusMessage: 'Missing NUXT_POSTGRES_URL' })
  }

  const client = postgres(url, { ssl: 'require' })
  const db = drizzle(client, { schema })

  return { db, client }
}

export function useDrizzleToSeed() {
  const url = process.env.NUXT_POSTGRES_URL

  if (!url) {
    throw new Error('Missing NUXT_POSTGRES_URL')
  }

  const client = postgres(url, { ssl: 'require' })
  const db = drizzle(client, { schema })

  return { db, client }
}

export async function reset(
  db: PostgresJsDatabase<Record<string, never>>,
  ...tables: PgTable[]
) {
  // @ts-ignore
  const tableNames = tables.map(table => table[PgTable.Symbol.Name])

  if (tableNames.length === 0)
    return

  const joined = sql.join(
    tableNames.map(name => sql.identifier(name)),
    sql`, `,
  )

  await db.execute(
    sql`TRUNCATE ${joined} RESTART IDENTITY CASCADE`,
  )
}

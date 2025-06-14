import type { PostgresJsDatabase } from 'drizzle-orm/postgres-js'
import process from 'node:process'
import { sql } from 'drizzle-orm'
import { PgTable } from 'drizzle-orm/pg-core'
import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'
import { schema } from '~~/server/database/schema'
import 'dotenv/config'

export function useDrizzle() {
  const config = useRuntimeConfig()

  const url = process.env.APP_ENV === 'test' ? process.env.NUXT_POSTGRES_TEST_URL : config.private.NUXT_POSTGRES_URL

  if (!url) {
    throw createError({ statusCode: 500, message: 'Missing NUXT_POSTGRES_URL' })
  }

  const client = postgres(url, { prepare: false })
  const db = drizzle(client, { schema })

  return { db, client }
}

export function useDrizzleToSeed(mode: string = 'production') {
  const url = mode === 'test' ? process.env.NUXT_POSTGRES_TEST_URL : process.env.NUXT_POSTGRES_URL

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
  // @ts-expect-error can't type the Symbol.Name
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

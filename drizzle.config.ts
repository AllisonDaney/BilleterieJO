import type { Config } from 'drizzle-kit'
import process from 'node:process'
import 'dotenv/config'

export default {
  schema: './server/database/schema',
  out: './server/database/migrations',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.NUXT_POSTGRES_URL!,
  },
} satisfies Config

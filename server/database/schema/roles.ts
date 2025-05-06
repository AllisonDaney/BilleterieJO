import { pgTable, text, uuid } from 'drizzle-orm/pg-core'

export const roles = pgTable('roles', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name').notNull().unique(),
  slug: text('slug').notNull().unique(),
})

export type InsertRole = typeof roles.$inferInsert
export type SelectRole = typeof roles.$inferSelect

import { relations } from 'drizzle-orm'
import { pgTable, text, uuid } from 'drizzle-orm/pg-core'
import { users } from './users'

export const roles = pgTable('roles', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name').notNull().unique(),
  slug: text('slug').notNull().unique(),
})

export const rolesRelations = relations(roles, ({ many }) => ({
  users: many(users),
}))

export type InsertRole = typeof roles.$inferInsert
export type SelectRole = typeof roles.$inferSelect

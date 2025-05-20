import type { SelectRole } from './roles'
import { relations } from 'drizzle-orm'
import { pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core'
import { roles } from './roles'

export const users = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  firstname: text('firstname').notNull(),
  lastname: text('lastname').notNull(),
  email: text('email').notNull().unique(),
  password: text('password').notNull(),
  securityKey: text('security_key').notNull(),
  roleId: uuid('role_id').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
})

export const usersRelations = relations(users, ({ one }) => ({
  role: one(roles, {
    fields: [users.roleId],
    references: [roles.id],
  }),
}))

export type InsertUser = typeof users.$inferInsert
export type SelectUser = typeof users.$inferSelect & {
  createdAt: string | null
  role: SelectRole
}
export type SelectSafeUser = Omit<SelectUser, 'password' | 'securityKey' | 'createdAt'> & {
  createdAt: string | null
  role: SelectRole
}

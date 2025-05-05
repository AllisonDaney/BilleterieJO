import { integer, pgTable, serial, text, timestamp } from 'drizzle-orm/pg-core'
import { roles } from './roles'

export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  firstname: text('firstname').notNull(),
  lastname: text('lastname').notNull(),
  email: text('email').notNull().unique(),
  password: text('password').notNull(),
  securityKey: text('security_key').notNull(),
  roleId: integer('role_id').references(() => roles.id).notNull(),
  createdAt: timestamp('created_at').defaultNow(),
})

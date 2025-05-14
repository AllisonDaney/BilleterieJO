import { relations } from 'drizzle-orm'
import { boolean, pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core'
import { tickets } from './tickets'
import { users } from './users'

export const usersTickets = pgTable('users_tickets', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').notNull(),
  ticketId: uuid('ticket_id').notNull(),
  isUsed: boolean('is_used').default(false),
  qrCodeUrl: text('qr_code_url').notNull(),
  securityKey: text('security_key').notNull(),
  timestamp: timestamp('timestamp').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
})

export const usersRelations = relations(users, ({ many }) => ({
  tickets: many(usersTickets),
}))

export const ticketsRelations = relations(tickets, ({ many }) => ({
  users: many(usersTickets),
}))

import { integer, jsonb, pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core'

export const tickets = pgTable('tickets', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name').notNull().unique(),
  price: integer('price').notNull(),
  description: text('description').notNull(),
  list: jsonb('list').notNull(),
  stripeProductId: text('stripe_product_id').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
})

export type InsertTicket = typeof tickets.$inferInsert
export type SelectTicket = typeof tickets.$inferSelect

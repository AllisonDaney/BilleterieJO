import { defineEventHandler } from 'h3'
import { useDrizzle } from '~/server/utils/useDrizzle'

export default defineEventHandler(async (event) => {
  const { db, client } = useDrizzle()

  const ticketsData = await db.query.tickets.findMany()

  event.waitUntil(client.end())

  return {
    tickets: ticketsData,
  }
})

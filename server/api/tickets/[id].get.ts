import { eq } from 'drizzle-orm'
import { tickets } from '~/server/database/schema/tickets'

export default defineEventHandler(async (event) => {
  const { db, client } = useDrizzle()

  const id = getRouterParam(event, 'id')

  const ticketData = await db.query.tickets.findFirst({
    where: eq(tickets.id, id as string),
  })

  event.waitUntil(client.end())

  return {
    ticket: ticketData,
  }
})

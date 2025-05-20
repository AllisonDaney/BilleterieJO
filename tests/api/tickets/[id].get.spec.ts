import type { InsertTicket } from '~/server/database/schema/tickets'
import { describe, expect, it } from 'vitest'
import handler from '~/server/api/tickets/[id].get'
import { tickets } from '~/server/database/schema/tickets'
import { useDrizzle } from '~/server/utils/useDrizzle'
import { useTest } from '~/tests/utils/useTest'

describe('gET /api/tickets/:id', () => {
  const { createMockEvent } = useTest()
  const { db } = useDrizzle()

  it('should return ticket data', async () => {
    const randomName = `ticket_${Math.random().toString(36).substring(2, 8)}`

    const mockedTicket: InsertTicket = {
      name: randomName,
      price: 0,
      description: '',
      list: [],
      stripeProductId: '',
    }

    const insertedTicketRes = await db.insert(tickets).values(mockedTicket).returning()

    mockedTicket.id = insertedTicketRes[0]?.id as string
    mockedTicket.createdAt = insertedTicketRes[0]?.createdAt as Date

    const event = createMockEvent({}, {}, 'GET', {}, {}, { id: insertedTicketRes[0]?.id as string })

    const res = await handler(event)

    expect(res).toEqual({ ticket: mockedTicket })
  })
})

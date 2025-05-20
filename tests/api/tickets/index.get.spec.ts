import { describe, expect, it } from 'vitest'
import handler from '~/server/api/tickets/index.get'
import { useTest } from '~/tests/utils/useTest'
import 'dotenv/config'

describe('gET /api/tickets', () => {
  const { createMockEvent } = useTest()

  it('should return a list of tickets and call client.end()', async () => {
    const event = createMockEvent({}, {})

    const res = await handler(event)

    expect(Array.isArray(res.tickets)).toBe(true)
    expect(res.tickets.length).toBeGreaterThan(0)
  })
})

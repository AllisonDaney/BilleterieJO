import { describe, expect, it } from 'vitest'
import handler from '~/server/api/tickets/verify.get'
import { useTest } from '~/tests/utils/useTest'

describe('gET /api/tickets/verify', () => {
  const { createMockEvent } = useTest()

  it('should return error if no token', async () => {
    const event = createMockEvent({}, {}, 'GET', {}, {})
    const res = await handler(event)
    console.log(res)
    expect(res.error).toBe(true)
    expect(res.message).toBe('Le ticket n’est pas valide')
  })
})

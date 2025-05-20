import type { SelectUser } from '~/server/database/schema/users'
import { $fetch, setup } from '@nuxt/test-utils/e2e'
import { beforeAll, describe, expect, it } from 'vitest'
import handler from '~/server/api/users/index.get'
import { getTestUsers } from '~/server/database/seed/users'
import { useDrizzle } from '~/server/utils/useDrizzle'
import { useTest } from '~/tests/utils/useTest'
import 'dotenv/config'

let user: SelectUser

beforeAll(async () => {
  const { db } = useDrizzle()

  await setup({
    host: process.env.NUXT_PROJECT_URL,
  })

  const { userEmployee, notHashedPassword } = await getTestUsers(db)

  const res = await $fetch('/api/auth/signin', {
    method: 'POST',
    body: {
      email: userEmployee?.email,
      password: notHashedPassword,
    },
  })

  user = res.user as SelectUser
})

describe('gET /api/users', () => {
  const { createMockEvent } = useTest()

  it('should return a paginated list of users with default limit', async () => {
    const event = createMockEvent({}, {
      auth: {
        userId: user.id,
      },
    })

    const res = await handler(event)

    expect(res).toHaveProperty('users')
    expect(Array.isArray(res.users)).toBe(true)
    expect(res).toHaveProperty('total')
    expect(res).toHaveProperty('limit')
    expect(res).toHaveProperty('skip')
  })

  it('should return limited results and skip properly', async () => {
    const event = createMockEvent({}, {
      auth: {
        userId: user.id,
      },
    }, 'GET', {}, {
      limit: '2',
      skip: '1',
    })

    const res = await handler(event)

    expect(res.users.length).toBeLessThanOrEqual(2)
    expect(res.skip).toBe(1)
    expect(res.limit).toBe(2)
  })

  it('should filter by roleSlug if provided', async () => {
    const event = createMockEvent({}, {
      auth: {
        userId: user.id,
      },
    }, 'GET', {}, {
      roleSlug: 'user',
    })

    const res = await handler(event)

    expect(res.users?.every(u => u.role.slug === 'user')).toBe(true)
  })

  it('should return 401 if no token provided', async () => {
    try {
      const event = createMockEvent({}, {})

      await handler(event)
    }
    catch (error: any) {
      expect(error.statusCode).toBe(401)
    }
  })
})

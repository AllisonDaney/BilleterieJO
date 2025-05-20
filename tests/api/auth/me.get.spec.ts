import type { SelectUser } from '~/server/database/schema/users'
import crypto from 'node:crypto'
import { $fetch, setup } from '@nuxt/test-utils/e2e'
import { beforeAll, describe, expect, it, vi } from 'vitest'
import handler from '~/server/api/auth/me.get'
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

  const { userUser, notHashedPassword } = await getTestUsers(db)

  const res = await $fetch('/api/auth/signin', {
    method: 'POST',
    body: {
      email: userUser?.email,
      password: notHashedPassword,
    },
  })

  user = res.user as SelectUser
})

describe('gET /api/auth/me', () => {
  const { createMockEvent } = useTest()

  it('should return the current authenticated user without password or securityKey', async () => {
    const event = createMockEvent({}, {
      auth: {
        userId: user.id,
      },
    })

    const res = await handler(event)

    const userResponse = res.user as SelectUser

    expect(res.statusCode).toBe(200)
    expect(userResponse).toBeDefined()
    expect(userResponse).not.toHaveProperty('password')
    expect(userResponse).not.toHaveProperty('securityKey')
    expect(userResponse).toHaveProperty('email')
    expect(userResponse).toHaveProperty('firstname')
    expect(userResponse).toHaveProperty('lastname')
    expect(userResponse?.role).toBeDefined()
    expect(userResponse?.role).toHaveProperty('name')
    expect(userResponse?.role).toHaveProperty('slug')
  })

  it('should return 401 if token is missing', async () => {
    try {
      const event = {
        context: {
          auth: {
            userId: crypto.randomUUID(),
          },
        },
        waitUntil: vi.fn(),
      } as any

      await handler(event)
    }
    catch (error: any) {
      expect(error.statusCode).toBe(401)
    }
  })
})

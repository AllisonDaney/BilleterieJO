import { describe, expect, it, vi } from 'vitest'
import handler from '~/server/api/auth/signin.post'
import { getTestUsers } from '~/server/database/seed/users'
import { useDrizzle } from '~/server/utils/useDrizzle'
import { useTest } from '~/tests/utils/useTest'
import 'dotenv/config'

vi.mock('h3', async () => {
  const actual = await vi.importActual<typeof import('h3')>('h3')
  return {
    ...actual,
    readBody: (event: any) => Promise.resolve(event.body),
  }
})

describe('pOST /api/auth/signin', async () => {
  const { createMockEvent } = useTest()
  const { db } = useDrizzle()
  const { userUser, notHashedPassword } = await getTestUsers(db)

  it('should return token and user without password when credentials are valid', async () => {
    const event = createMockEvent({
      email: userUser?.email,
      password: notHashedPassword,
    }, {}, 'POST')

    const res = await handler(event)

    expect(res).toHaveProperty('token')
    expect(typeof res.token).toBe('string')

    expect(res).toHaveProperty('user')
    expect(res.user).toHaveProperty('id')
    expect(res.user).toHaveProperty('email', userUser?.email)
    expect(res.user).not.toHaveProperty('password')
    expect(res.user).not.toHaveProperty('securityKey')

    expect(res).toHaveProperty('statusCode', 200)
    expect(res).toHaveProperty('message', 'Connexion réussie.')
  })

  it('should return 400 when password is invalid', async () => {
    try {
      const event = createMockEvent({
        email: userUser?.email,
        password: 'wrongpassword',
      }, {}, 'POST')

      await handler(event)
    }
    catch (error: any) {
      expect(error.cause).toBeDefined()
      expect(error.cause.statusCode).toBe(400)
      expect(error.cause.message).toBe('Information de connexion incorrecte.')
    }
  })

  it('should return 400 when user does not exist', async () => {
    try {
      const event = createMockEvent({
        email: 'notfound@example.com',
        password: notHashedPassword,
      }, {}, 'POST')

      await handler(event)
    }
    catch (error: any) {
      expect(error.cause).toBeDefined()
      expect(error.cause.statusCode).toBe(400)
      expect(error.cause.message).toBe('Information de connexion incorrecte.')
    }
  })
})

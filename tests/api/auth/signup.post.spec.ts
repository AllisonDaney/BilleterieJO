import { $fetch, setup } from '@nuxt/test-utils/e2e'
import { beforeAll, describe, expect, it } from 'vitest'
import handler from '~/server/api/auth/signup.post'
import { useTest } from '~/tests/utils/useTest'
import 'dotenv/config'

beforeAll(async () => {
  await setup({
    host: process.env.NUXT_PROJECT_URL,
  })
})

describe('pOST /api/auth/signup', () => {
  const { createMockEvent } = useTest()

  const randomEmail = `user_${Math.random().toString(36).substring(2, 8)}@example.com`

  it('should register a new user and return success message', async () => {
    const event = createMockEvent({
      firstname: 'John',
      lastname: 'Doe',
      email: randomEmail,
      password: 'Password123!',
      confirmPassword: 'Password123!',
    }, {}, 'POST')

    const res = await handler(event)

    expect(res).toHaveProperty('statusCode', 200)
    expect(res).toHaveProperty('message', 'Inscription réussie.')
  })

  it('should fail if the email is already taken', async () => {
    const reusedEmail = `taken_${Math.random().toString(36).substring(2, 8)}@example.com`
    await $fetch('/api/auth/signup', {
      method: 'POST',
      body: {
        firstname: 'Alice',
        lastname: 'Dupont',
        email: reusedEmail,
        password: 'SecurePass456!',
        confirmPassword: 'SecurePass456!',
      },
    })

    try {
      const event = createMockEvent({
        firstname: 'John',
        lastname: 'Doe',
        email: randomEmail,
        password: 'Password123!',
        confirmPassword: 'Password123!',
      }, {}, 'POST')

      await handler(event)
    }
    catch (error: any) {
      expect(error.cause).toBeDefined()
      expect(error.cause.statusCode).toBe(400)
      expect(error.cause.message).toBe('Cette adresse email est déjà utilisée.')
    }
  })

  it('should return 400 if the form is invalid', async () => {
    try {
      const event = createMockEvent({
        firstname: '',
        lastname: '',
        email: 'not-an-email',
        password: 'short',
        confirmPassword: 'not-matching',
      }, {}, 'POST')

      await handler(event)
    }
    catch (error: any) {
      expect(error.cause).toBeDefined()
      expect(error.cause.statusCode).toBe(400)
      expect(error.cause.message).toBe('Les informations sont invalides.')
    }
  })
})

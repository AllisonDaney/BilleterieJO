import crypto from 'node:crypto'
import bcrypt from 'bcryptjs'
import { eq } from 'drizzle-orm'
import { createError, defineEventHandler, readBody } from 'h3'
import { roles } from '~~/server/database/schema/roles'
import { users } from '~~/server/database/schema/users'
import { useDrizzle } from '~~/server/utils/useDrizzle'

export default defineEventHandler(async (event) => {
  const { db, client } = useDrizzle()

  const formState: SchemaSignupForm = await readBody(event)

  const { success } = schemaSignupForm.safeParse(formState)

  if (!success) {
    throw createError({
      statusCode: 400,
      message: 'Les informations sont invalides.',
    })
  }

  const existingUser = await db.query.users.findFirst({
    where: eq(users.email, formState.email),
  })

  if (existingUser) {
    throw createError({
      statusCode: 400,
      message: 'Cette adresse email est déjà utilisée.',
    })
  }

  const userRole = await db.query.roles.findFirst({
    where: eq(roles.slug, 'user'),
  })

  const hashedPassword = await bcrypt.hash(formState.password, 10)

  await db.insert(users).values({
    firstname: formState.firstname,
    lastname: formState.lastname,
    email: formState.email,
    password: hashedPassword,
    roleId: userRole?.id ?? '',
    securityKey: crypto.randomUUID(),
  })

  event.waitUntil(client.end())

  return {
    statusCode: 200,
    message: 'Inscription réussie.',
  }
})

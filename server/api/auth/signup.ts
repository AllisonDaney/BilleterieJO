import { users } from '~~/server/database/schema/users'
import bcrypt from 'bcryptjs'
import { eq } from 'drizzle-orm'
import crypto from 'crypto'
import { roles } from '~~/server/database/schema/roles'

export default eventHandler(async (event) => {
  const { db, client } = useDrizzle()
  const formState: SchemaSignupForm = await readBody(event)

  if (!schemaSignupForm.safeParse(formState)) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Les informations sont invalides.'
    })
  }

  const existingUser = await db.query.users.findFirst({
    where: eq(users.email, formState.email),
  })
  
  if (existingUser) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Cette adresse email est déjà utilisée.'
    })
  }

  const userRole = await db.query.roles.findFirst({
    where: eq(roles.slug, 'user')
  })

  const hashedPassword = await bcrypt.hash(formState.password, 10)
  
  await db.insert(users).values({
    firstname: formState.firstname,
    lastname: formState.lastname,
    email: formState.email,
    password: hashedPassword,
    createdAt: new Date(),
    roleId: userRole?.id ?? 3,
    securityKey: crypto.randomUUID()
  })

  event.waitUntil(client.end())

  return {
    statusCode: 200,
    statusMessage: 'Inscription réussie.'
  }
})

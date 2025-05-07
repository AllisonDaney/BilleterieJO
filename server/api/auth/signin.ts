import bcrypt from 'bcryptjs'
import { eq } from 'drizzle-orm'
import * as jose from 'jose'
import { users } from '~~/server/database/schema/users'

export default eventHandler(async (event) => {
  const { db, client } = useDrizzle()
  const config = useRuntimeConfig()

  const formState: SchemaSigninForm = await readBody(event)

  const user = await db.query.users.findFirst({
    where: eq(users.email, formState.email),
  })

  const isPasswordValid = await bcrypt.compare(formState.password, user?.password ?? '')

  if (!user || !isPasswordValid) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Information de connexion incorrecte.',
    })
  }

  const secret = new TextEncoder().encode(config.private.NUXT_JWT_SECRET)

  const token = await new jose.SignJWT({ id: user.id })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setIssuer('billeterie-jo')
    .setAudience('api-billeterie-jo')
    .setExpirationTime('1d')
    .sign(secret)

  event.waitUntil(client.end())

  const { password, securityKey, ...safeUser } = user

  return {
    statusCode: 200,
    statusMessage: 'Connexion réussie.',
    token,
    user: safeUser,
  }
})

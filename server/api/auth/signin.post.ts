import type { SelectUser } from '~~/server/database/schema/users'
import type { SelectRole } from '~/server/database/schema/roles'
import bcrypt from 'bcryptjs'
import { eq } from 'drizzle-orm'
import { createError, defineEventHandler, readBody } from 'h3'
import * as jose from 'jose'
import { users } from '~~/server/database/schema/users'
import { useDrizzle } from '~~/server/utils/useDrizzle'

type AuthenticatedUser = SelectUser & {
  role: Pick<SelectRole, 'name' | 'slug'>
}

export default defineEventHandler(async (event) => {
  const { db, client } = useDrizzle()
  const config = useRuntimeConfig()

  const formState: SchemaSigninForm = await readBody(event)

  const user = await db.query.users.findFirst({
    where: eq(users.email, formState.email),
    with: {
      role: {
        columns: {
          name: true,
          slug: true,
        },
      },
    },
  }) as AuthenticatedUser

  const isPasswordValid = await bcrypt.compare(formState.password, user?.password ?? '')

  if (!user || !isPasswordValid) {
    throw createError({
      statusCode: 400,
      message: 'Information de connexion incorrecte.',
    })
  }

  const secret = new TextEncoder().encode(config.private.NUXT_JWT_SECRET)

  const token = await new jose.SignJWT({ id: user.id, role: user.role.slug })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setIssuer('billetterie-jo')
    .setAudience('api-billetterie-jo')
    .setExpirationTime('1d')
    .sign(secret)

  event.waitUntil(client.end())

  const { password, securityKey, ...safeUser } = user

  return {
    statusCode: 200,
    message: 'Connexion réussie.',
    token,
    user: safeUser,
  }
})

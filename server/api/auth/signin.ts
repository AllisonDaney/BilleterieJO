import bcrypt from "bcryptjs"
import { eq } from "drizzle-orm"
import { users } from "~~/server/database/schema/users"
import jwt from 'jsonwebtoken'

export default eventHandler(async (event) => {
  const { db, client } = useDrizzle()

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

  const token = jwt.sign({
    id: user.id,
  }, process.env.NUXT_JWT_SECRET ?? '', { expiresIn: '1d' })

  event.waitUntil(client.end())

  return {
    statusCode: 200,
    statusMessage: 'Connexion réussie.',
    token,
  }
})

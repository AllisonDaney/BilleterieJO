import { eq } from 'drizzle-orm'
import { defineEventHandler } from 'h3'
import { users } from '~/server/database/schema/users'
import { useDrizzle } from '~/server/utils/useDrizzle'

export default defineEventHandler(async (event) => {
  const { db, client } = useDrizzle()

  const user = await db.query.users.findFirst({
    where: eq(users.id, event.context.auth.userId),
    columns: {
      password: false,
      securityKey: false,
    },
    with: {
      role: {
        columns: {
          name: true,
          slug: true,
        },
      },
    },
  })

  if (!user) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Unauthorized',
    })
  }

  event.waitUntil(client.end())

  return {
    statusCode: 200,
    user,
  }
})

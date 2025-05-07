import { eq } from 'drizzle-orm'
import { users } from '~/server/database/schema/users'

export default eventHandler(async (event) => {
  const { db, client } = useDrizzle()

  const user = await db.query.users.findFirst({
    where: eq(users.id, event.context.auth.userId),
    columns: {
      password: false,
      securityKey: false,
    },
  })

  event.waitUntil(client.end())

  return {
    statusCode: 200,
    user,
  }
})

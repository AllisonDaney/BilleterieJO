import { asc, eq, sql } from 'drizzle-orm'
import { defineEventHandler, getQuery } from 'h3'
import { roles } from '~~/server/database/schema/roles'
import { users } from '~~/server/database/schema/users'
import { useDrizzle } from '~~/server/utils/useDrizzle'

export default defineEventHandler(async (event) => {
  const { db, client } = useDrizzle()
  const query = getQuery(event)

  if (!event.context.auth?.userId) {
    throw createError({
      statusCode: 401,
      message: 'Unauthorized',
    })
  }

  const connectedUser = await db.query.users.findFirst({
    where: eq(users.id, event.context.auth.userId),
    with: {
      role: {
        columns: {
          name: true,
          slug: true,
        },
      },
    },
  })

  const offset = query.skip ? Number.parseInt(query.skip as string) : 0
  const limit = query.limit ? Number.parseInt(query.limit as string) : 10
  let roleSlug = query.roleSlug ? (query.roleSlug as string) : ''

  if (connectedUser?.role.slug === 'employee') {
    roleSlug = 'user'
  }

  const baseUsersCountQuery = db.select({ count: sql<number>`count(*)` })
    .from(users)
    .innerJoin(roles, eq(users.roleId, roles.id))

  if (roleSlug) {
    baseUsersCountQuery.where(eq(roles.slug, roleSlug))
  }

  const [{ count: totalCount }] = await baseUsersCountQuery

  const baseUsersQuery = db.select({
    id: users.id,
    firstname: users.firstname,
    lastname: users.lastname,
    email: users.email,
    createdAt: users.createdAt,
    role: {
      name: roles.name,
      slug: roles.slug,
    },
  })
    .from(users)
    .innerJoin(roles, eq(users.roleId, roles.id))

  if (roleSlug) {
    baseUsersQuery.where(eq(roles.slug, roleSlug))
  }

  const usersData = await baseUsersQuery
    .orderBy(asc(users.firstname))
    .limit(limit)
    .offset(offset)

  event.waitUntil(client.end())

  return {
    users: usersData,
    total: totalCount,
    skip: offset,
    limit,
  }
})

import { asc, eq, sql } from 'drizzle-orm'
import { roles } from '~/server/database/schema/roles'
import { users } from '~/server/database/schema/users'

export default defineEventHandler(async (event) => {
  const { db, client } = useDrizzle()
  const query = getQuery(event)

  const offset = query.skip ? Number.parseInt(query.skip as string) : 0
  const limit = query.limit ? Number.parseInt(query.limit as string) : 10
  const roleSlug = query.roleSlug ? (query.roleSlug as string) : ''

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

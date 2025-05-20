import crypto from 'node:crypto'
import process from 'node:process'
import bcrypt from 'bcryptjs'
import { eq } from 'drizzle-orm'
import { reset } from '../../utils/useDrizzle'
import { roles } from '../schema/roles'
import { users } from '../schema/users'
import 'dotenv/config'

export async function getTestUsers(db: any) {
  const roleAdmin = await db.query.roles.findFirst({
    where: eq(roles.slug, 'admin'),
  })

  const roleEmployee = await db.query.roles.findFirst({
    where: eq(roles.slug, 'employee'),
  })

  const roleUser = await db.query.roles.findFirst({
    where: eq(roles.slug, 'user'),
  })

  const hashedPassword = await bcrypt.hash('passwordpasswordpassword', 10)

  const seedUsers = Array.from({ length: 10 }).fill({
    firstname: '',
    lastname: '',
    email: '',
    password: '',
    roleId: '',
    securityKey: '',
  }).map((_, index) => ({
    firstname: `User ${index + 1}`,
    lastname: `User ${index + 1}`,
    email: `user${index + 1}@example.com`,
    password: hashedPassword,
    roleId: roleUser?.id ?? '',
    securityKey: crypto.randomUUID(),
  }))

  const resultSeedUsers = [
    {
      firstname: 'Admin',
      lastname: 'Admin',
      email: 'admin@example.com',
      password: hashedPassword,
      roleId: roleAdmin?.id ?? '',
      securityKey: crypto.randomUUID(),
    },
    {
      firstname: 'Employee',
      lastname: 'Employee',
      email: 'employee@example.com',
      password: hashedPassword,
      roleId: roleEmployee?.id ?? '',
      securityKey: crypto.randomUUID(),
    },
    {
      firstname: 'User',
      lastname: 'User',
      email: 'user@example.com',
      password: hashedPassword,
      roleId: roleUser?.id ?? '',
      securityKey: crypto.randomUUID(),
    },
    ...seedUsers,
  ]

  return {
    allUsers: resultSeedUsers,
    userAdmin: resultSeedUsers.find(user => user.roleId === roleAdmin?.id),
    userEmployee: resultSeedUsers.find(user => user.roleId === roleEmployee?.id),
    userUser: resultSeedUsers.find(user => user.roleId === roleUser?.id),
    notHashedPassword: 'passwordpasswordpassword',
  }
}

export async function seedUsers(db: any) {
  const { allUsers } = await getTestUsers(db)

  await db.insert(users).values(allUsers).onConflictDoNothing()

  if (process.env.APP_ENV !== 'test') {
    console.warn('✅ Users seedé')
  }
}

export async function resetUsers(db: any) {
  await reset(db, users)

  if (process.env.APP_ENV !== 'test') {
    console.warn('✅ Users reseté')
  }
}

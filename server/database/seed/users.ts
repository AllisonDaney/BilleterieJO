import crypto from 'node:crypto'
import bcrypt from 'bcryptjs'
import { eq } from 'drizzle-orm'
import { reset } from '../../utils/useDrizzle'
import { roles } from '../schema/roles'
import { users } from '../schema/users'

export async function seedUsers(db: any) {
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

  await db.insert(users).values([
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
  ]).onConflictDoNothing()

  console.warn('✅ Users seedé')
}

export async function resetUsers(db: any) {
  await reset(db, users)

  console.warn('✅ Users reseté')
}

import type { PostgresJsDatabase } from 'drizzle-orm/postgres-js'
import { reset } from '../../utils/useDrizzle'
import { roles } from '../schema/roles'

export async function seedRoles(db: PostgresJsDatabase<Record<string, never>>) {
  await db.insert(roles).values([
    { name: 'Administrateur', slug: 'admin' },
    { name: 'Employé', slug: 'employee' },
    { name: 'Utilisateur', slug: 'user' },
  ]).onConflictDoNothing() // ignore si déjà inséré

  console.log('✅ Roles seedé')
}

export async function resetRoles(db: PostgresJsDatabase<Record<string, never>>) {
  await reset(db, roles)

  console.log('✅ Roles reseté')
}

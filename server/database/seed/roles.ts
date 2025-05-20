import process from 'node:process'
import { reset } from '../../utils/useDrizzle'
import { roles } from '../schema/roles'

export async function seedRoles(db: any) {
  await db.insert(roles).values([
    { name: 'Administrateur', slug: 'admin' },
    { name: 'Employé', slug: 'employee' },
    { name: 'Utilisateur', slug: 'user' },
  ]).onConflictDoNothing()

  if (process.env.APP_ENV !== 'test') {
    console.warn('✅ Roles seedé')
  }
}

export async function resetRoles(db: any) {
  await reset(db, roles)

  if (process.env.APP_ENV !== 'test') {
    console.warn('✅ Roles reseté')
  }
}

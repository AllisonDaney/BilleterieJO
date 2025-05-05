import { reset } from '../../utils/useDrizzle'
import { roles } from '../schema/roles'

export async function seedRoles(db: any) {
  await db.insert(roles).values([
    { name: 'Administrateur', slug: 'admin' },
    { name: 'Employé', slug: 'employee' },
    { name: 'Utilisateur', slug: 'user' },
  ]).onConflictDoNothing()

  console.log('✅ Roles seedé')
}

export async function resetRoles(db: any) {
  await reset(db, roles)

  console.log('✅ Roles reseté')
}

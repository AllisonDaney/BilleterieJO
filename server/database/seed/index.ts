import process from 'node:process'
import { useDrizzleToSeed } from '../../utils/useDrizzle'
import { resetRoles, seedRoles } from './roles'
import { resetUsers, seedUsers } from './users'

async function main() {
  const { db, client } = useDrizzleToSeed()

  await resetUsers(db)
  await resetRoles(db)

  await seedRoles(db)
  await seedUsers(db)

  await client.end()
}

main()
  .then(() => {
    console.warn('✅ Tous les seeds terminés')
    process.exit(0)
  })
  .catch((err) => {
    console.error('❌ Erreur pendant le seeding :', err)
    process.exit(1)
  })

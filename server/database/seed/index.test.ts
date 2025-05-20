import process from 'node:process'
import { useDrizzleToSeed } from '../../utils/useDrizzle'
import { resetRoles, seedRoles } from './roles'
import { resetTickets, seedTickets } from './tickets'
import { resetUsers, seedUsers } from './users'
import 'dotenv/config'

async function resetAll(db: any) {
  await resetRoles(db)
  await resetUsers(db)
  await resetTickets(db)

  console.warn('✅ Tous les seeds resetés')
}

async function main() {
  const { db, client } = useDrizzleToSeed('test')

  await resetAll(db)

  await seedRoles(db)
  await seedUsers(db)
  await seedTickets(db)

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

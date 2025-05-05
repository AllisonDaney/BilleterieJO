import { useDrizzleToSeed } from '../../utils/useDrizzle'
import { resetRoles, seedRoles } from './roles'

async function main() {
  const { db, client } = useDrizzleToSeed()

  await resetRoles(db)

  await seedRoles(db)

  await client.end()
}

main()
  .then(() => {
    console.log('✅ Tous les seeds terminés')
    process.exit(0)
  })
  .catch((err) => {
    console.error('❌ Erreur pendant le seeding :', err)
    process.exit(1)
  })

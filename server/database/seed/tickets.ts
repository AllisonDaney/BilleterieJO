import process from 'node:process'
import { reset } from '../../utils/useDrizzle'
import { tickets } from '../schema/tickets'

export async function seedTickets(db: any) {
  await db.insert(tickets).values([
    {
      name: 'Offre Solo',
      price: 29,
      description: 'Idéale pour vivre l’événement à votre rythme.',
      list: [
        '1 billet pour une épreuve au choix',
        'E-ticket sécurisé',
        'Assistance par email',
        'Accès aux infos en temps réel',
      ],
      stripeProductId: 'prod_SIuYwHZCQz4VBa',
    },
    {
      name: 'Offre Duo',
      price: 55,
      description: 'Parfait pour partager l’émotion des JO à deux.',
      list: [
        '2 billets pour la même épreuve',
        'Placement côte à côte garanti',
        'E-tickets sécurisés',
        'Support prioritaire',
      ],
      stripeProductId: 'prod_SIuY9pbnJIjp2a',
    },
    {
      name: 'Offre Familiale',
      price: 99,
      description: 'Conçue pour une sortie sportive en famille.',
      list: [
        '4 billets pour la même épreuve',
        'Placement groupé',
        'Cadeau souvenir officiel',
        'Assistance dédiée',
      ],
      stripeProductId: 'prod_SIuYH55fRTa48R',
    },
  ]).onConflictDoNothing()

  if (process.env.APP_ENV !== 'test') {
    console.warn('✅ Roles seedé')
  }
}

export async function resetTickets(db: any) {
  await reset(db, tickets)

  if (process.env.APP_ENV !== 'test') {
    console.warn('✅ Tickets reseté')
  }
}

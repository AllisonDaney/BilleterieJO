import { and, eq } from 'drizzle-orm'
import * as jose from 'jose'
import { usersTickets } from '~/server/database/schema/users_tickets'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const { db } = useDrizzle()
  const config = useRuntimeConfig(event)

  const token = typeof query.token === 'string' ? query.token : ''

  if (!token) {
    return {
      message: 'Le ticket n’est pas valide',
      description: 'Aucun code de ticket n’a été fourni.',
      error: true,
    }
  }

  const secret = new TextEncoder().encode(config.private.NUXT_JWT_SECRET)

  let decodedToken: { userId: string, ticketId: string, timestamp: number, hash: string }

  try {
    await jose.jwtVerify(token, secret)
    decodedToken = jose.decodeJwt(token) as typeof decodedToken
  } catch (err) {
    return {
      message: 'Le ticket n’est pas valide',
      description: 'Le code fourni est incorrect ou a expiré.',
      error: true,
    }
  }

  if (!decodedToken) {
    return {
      message: 'Le ticket n’est pas valide',
      description: 'Impossible de lire les informations du ticket.',
      error: true,
    }
  }

  const { userId, ticketId, hash, timestamp } = decodedToken

  const userTicket = await db.query.usersTickets.findFirst({
    where: and(
      eq(usersTickets.ticketId, ticketId),
      eq(usersTickets.userId, userId),
      eq(usersTickets.securityKey, hash),
      eq(usersTickets.timestamp, new Date(timestamp)),
    ),
  })

  if (!userTicket) {
    return {
      message: 'Le ticket n’est pas valide',
      description: 'Ce ticket n’existe pas ou ne correspond pas à nos enregistrements.',
      error: true,
    }
  }

  if (userTicket.isUsed) {
    return {
      message: 'Le ticket n’est pas valide',
      description: 'Ce ticket a déjà été utilisé.',
      error: true,
    }
  }

  await db.update(usersTickets).set({
    isUsed: true,
  }).where(eq(usersTickets.id, userTicket.id))

  return {
    message: 'Le ticket est valide',
    description: 'Bienvenue ! Ce ticket a bien été vérifié et marqué comme utilisé.',
    error: false,
  }
})

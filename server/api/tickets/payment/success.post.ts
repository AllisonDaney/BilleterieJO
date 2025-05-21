import { createHash, randomBytes } from 'node:crypto'
import { eq } from 'drizzle-orm'
import * as jose from 'jose'
import { tickets } from '~/server/database/schema/tickets'
import { users } from '~/server/database/schema/users'
import { usersTickets } from '~/server/database/schema/users_tickets'

function generateTicketKey(): string {
  return randomBytes(32).toString('hex')
}

function generateTicketHash(
  userKey: string,
  ticketKey: string,
  userId: string,
  ticketId: string,
  timestamp: number,
): string {
  const data = `${userKey}:${ticketKey}:${userId}:${ticketId}:${timestamp}`
  return createHash('sha256').update(data).digest('hex')
}

function generateTicketPayload(
  userId: string,
  ticketId: string,
  timestamp: number,
  hash: string,
) {
  return { userId, ticketId, timestamp, hash }
}

export default defineEventHandler(async (event) => {
  const { db, client } = useDrizzle()
  const { generateQRCodeWithUrl } = useQRCode()
  const config = useRuntimeConfig()
  const { uploadFile } = useCloudinary(config)
  const { sendEmail } = useEmail(config)

  const { ticketId, userId } = await readBody(event)

  const ticket = await db.query.tickets.findFirst({ where: eq(tickets.id, ticketId) })

  if (!ticket) {
    throw createError({
      statusCode: 404,
      message: 'Ticket non trouvé',
    })
  }

  const user = await db.query.users.findFirst({ where: eq(users.id, userId) })

  if (!user) {
    throw createError({
      statusCode: 404,
      message: 'Utilisateur non trouvé',
    })
  }

  const userSecurityKey = user?.securityKey || ''
  const ticketKey = generateTicketKey()
  const timestamp = Date.now()

  const ticketSecurityKey = generateTicketHash(userSecurityKey, ticketKey, userId, ticketId, timestamp)
  const payload = generateTicketPayload(userId, ticketId, timestamp, ticketSecurityKey)
  const token = await new jose.SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .sign(new TextEncoder().encode(config.private.NUXT_JWT_SECRET))
  const qrCode = await generateQRCodeWithUrl(`${config.public.NUXT_PROJECT_URL}/api/tickets/verify?token=${token}`)
  const qrCodeUrl = await uploadFile({ folder: 'tickets-secures', file: qrCode, publicId: `qr_${Date.now()}` })
  
  await sendEmail(
    {
      sender: { name: 'Ma Billetterie', email: 'azerty24041997@gmail.com' },
      to: [{ email: user?.email as string, name: `${user?.firstname} ${user?.lastname}` }],
      subject: 'Votre billet pour l’événement',
      htmlContent: `
          <h1>Merci ${user?.firstname} ${user?.lastname} !</h1>
          <p>Voici votre billet ${ticket.name} :</p>
          <img src="${qrCodeUrl}" alt="QR Code">
        `,
    },
  )

  await db.insert(usersTickets).values({
    userId,
    ticketId,
    qrCodeUrl,
    securityKey: ticketSecurityKey,
    timestamp: new Date(timestamp),
    isUsed: false,
  })

  event.waitUntil(client.end())

  return {
    message: `Billet ${ticket.name} réservé avec succès`,
  }
})

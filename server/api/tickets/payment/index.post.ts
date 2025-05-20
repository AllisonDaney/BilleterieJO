import crypto, { randomBytes } from 'node:crypto'
import { eq } from 'drizzle-orm'
import * as jose from 'jose'
import Stripe from 'stripe'
import { tickets } from '~/server/database/schema/tickets'
import { users } from '~/server/database/schema/users'
import { usersTickets } from '~/server/database/schema/users_tickets'
import { useEmail } from '~/shared/utils/useEmail'

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
  const config = useRuntimeConfig()
  const { generateQRCodeWithUrl } = useQRCode()
  const { uploadFile } = useCloudinary(config)
  const { sendEmail } = useEmail(config)

  const { id } = await readBody(event)

  try {
    const stripe = new Stripe(config.private.NUXT_STRIPE_SECRET_KEY as string, {
      apiVersion: '2025-04-30.basil',
    })

    const ticket = await db.query.tickets.findFirst({
      where: eq(tickets.id, id),
    })

    if (!ticket) {
      throw createError({ statusCode: 404, message: 'Ticket not found' })
    }

    const user = await db.query.users.findFirst({
      where: eq(users.id, event.context.auth.userId),
    })

    const stripeProduct = await stripe.products.retrieve(ticket.stripeProductId)
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      line_items: [
        {
          price: stripeProduct.default_price as string,
          quantity: 1,
        },
      ],
      success_url: `${config.public.NUXT_PROJECT_URL}/tickets?success=true&id=${id}`,
      cancel_url: `${config.public.NUXT_PROJECT_URL}/tickets`,
      customer_email: user?.email,
      payment_method_options: {
        card: {
          request_three_d_secure: 'automatic',
        },
      },
    })

    const userSecurityKey = user?.securityKey || ''
    const ticketKey = generateTicketKey()
    const userId = user?.id || ''
    const ticketId = ticket?.id || ''
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

    return { id: session.id }
  }
  catch {
    throw createError({ statusCode: 500, message: 'Internal server error' })
  }
})

// import crypto, { randomBytes } from 'node:crypto'
// import axios from 'axios'
// import { useEmail } from '~/shared/utils/useEmail'
// import { usersTickets } from '~/server/database/schema/users_tickets'
// import * as jose from 'jose'

// function generateTicketKey() {
//   return randomBytes(32).toString('hex')
// }

// function generateTicketHash(
//   userKey: string,
//   ticketKey: string,
//   userId: string,
//   ticketId: string,
//   timestamp: number
// ): string {
//   const data = `${userKey}:${ticketKey}:${userId}:${ticketId}:${timestamp}`
//   return crypto.createHash('sha256').update(data).digest('hex')
// }

// function generateTicketPayload(
//   userId: string,
//   ticketId: string,
//   timestamp: number,
//   hash: string
// ) {
//   return { userId, ticketId, timestamp, hash }
// }

// export default defineEventHandler(async (event) => {
//   const { db, client } = useDrizzle()
//   const config = useRuntimeConfig()
//   const { generateQRCodeWithUrl } = useQRCode()
//   const { uploadFile } = useCloudinary(config)
//   const { sendEmail } = useEmail(config)

//   const { id } = await readBody(event)

//   try {
//     const stripe = new Stripe(config.private.NUXT_STRIPE_SECRET_KEY as string, {
//       apiVersion: '2025-04-30.basil',
//     })

//     const ticket = await db.query.tickets.findFirst({
//       where: eq(tickets.id, id),
//     })

//     if (!ticket) {
//       throw createError({ statusCode: 404, statusMessage: 'Ticket not found' })
//     }

//     const user = await db.query.users.findFirst({
//       where: eq(users.id, event.context.auth.userId),
//     })

//     const stripeProduct = await stripe.products.retrieve(ticket.stripeProductId)
//     const session = await stripe.checkout.sessions.create({
//       payment_method_types: ['card'],
//       mode: 'payment',
//       line_items: [
//         {
//           price: stripeProduct.default_price as string,
//           quantity: 1,
//         },
//       ],
//       success_url: `${config.public.NUXT_PROJECT_URL}/tickets?success=true&id=${id}`,
//       cancel_url: `${config.public.NUXT_PROJECT_URL}/tickets`,
//       customer_email: user?.email,
//       payment_method_options: {
//         card: {
//           request_three_d_secure: 'automatic',
//         },
//       },
//     })

//     const userSecurityKey = user?.securityKey || ''
//     const ticketKey = generateTicketKey()
//     const userId = user?.id || ''
//     const ticketId = ticket?.id || ''
//     const timestamp = Date.now()

//     const ticketSecurityKey = generateTicketHash(userSecurityKey, ticketKey, userId, ticketId, timestamp)
//     const payload = generateTicketPayload(userId, ticketId, timestamp, ticketSecurityKey)
//     const token = await new jose.SignJWT(payload)
//       .setProtectedHeader({ alg: 'HS256' })
//       .sign(new TextEncoder().encode(config.private.NUXT_JWT_SECRET))
//     const qrCode = await generateQRCodeWithUrl(`${config.public.NUXT_PROJECT_URL}/api/tickets/verify?token=${token}`)
//     const qrCodeUrl = await uploadFile({ folder: 'tickets-secures', file: qrCode, publicId: `qr_${Date.now()}` })

//     await sendEmail(
//       {
//         sender: { name: 'Ma Billetterie', email: 'azerty24041997@gmail.com' },
//         to: [{ email: user?.email as string, name: `${user?.firstname} ${user?.lastname}` }],
//         subject: 'Votre billet pour l’événement',
//         htmlContent: `
//           <h1>Merci ${user?.firstname} ${user?.lastname} !</h1>
//           <p>Voici votre billet ${ticket.name} :</p>
//           <img src="${qrCodeUrl}" alt="QR Code">
//         `,
//       }
//     )

//     await db.insert(usersTickets).values({
//       userId,
//       ticketId,
//       qrCodeUrl,
//       securityKey: ticketSecurityKey,
//       timestamp: new Date(timestamp),
//       isUsed: false,
//     })

//     event.waitUntil(client.end())

//     return { id: session.id }
//   }
//   catch (err) {
//     console.log(err)
//   }
// })

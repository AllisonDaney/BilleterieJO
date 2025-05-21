import { eq } from 'drizzle-orm'
import Stripe from 'stripe'
import { tickets } from '~/server/database/schema/tickets'
import { users } from '~/server/database/schema/users'

export default defineEventHandler(async (event) => {
  const { db, client } = useDrizzle()
  const config = useRuntimeConfig()

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
      success_url: `${config.public.NUXT_PROJECT_URL}/tickets?success=true&ticketId=${ticket.id}&userId=${user?.id}`,
      cancel_url: `${config.public.NUXT_PROJECT_URL}/tickets`,
      customer_email: user?.email,
      payment_method_options: {
        card: {
          request_three_d_secure: 'automatic',
        },
      },
    })

    event.waitUntil(client.end())

    return { id: session.id }
  }
  catch (err) {
    console.log(err)
    throw createError({ statusCode: 500, message: 'Internal server error' })
  }
})

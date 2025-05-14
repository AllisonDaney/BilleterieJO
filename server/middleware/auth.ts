import * as jose from 'jose'

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig(event)

  const url = event.node.req.url || ''
  const method = event.node.req.method || 'GET'

  const protectedRoutes: Record<string, string[]> = {
    'GET /api/users': ['admin', 'employee'],
    'GET /api/auth/me': ['admin', 'employee', 'user'],
    'POST /api/tickets/payment': ['user'],
    'GET /api/tickets/verify': ['employee'],
  }

  const routeKey = `${method.toUpperCase()} ${url}`

  const allowedRoles = protectedRoutes[routeKey]
  if (!allowedRoles)
    return

  const { authorization } = getHeaders(event)

  const tokenStartWithBearer = authorization?.startsWith('Bearer ')
  const token = tokenStartWithBearer ? authorization?.split(' ')[1] : null

  if (!tokenStartWithBearer || !token) {
    return sendError(event, createError({
      statusCode: 401,
      statusMessage: 'Unauthorized',
    }))
  }

  const secret = new TextEncoder().encode(config.private.NUXT_JWT_SECRET)
  const isTokenValid = await jose.jwtVerify(token, secret)

  if (!isTokenValid) {
    return sendError(event, createError({
      statusCode: 401,
      statusMessage: 'Unauthorized',
    }))
  }

  const decodedToken = jose.decodeJwt(token)

  if (!decodedToken) {
    return sendError(event, createError({
      statusCode: 401,
      statusMessage: 'Unauthorized',
    }))
  }

  if (!allowedRoles.includes(decodedToken?.role as string)) {
    return sendError(event, createError({
      statusCode: 403,
      statusMessage: 'Forbidden',
    }))
  }

  event.context.auth = {
    userId: decodedToken.id,
  }
})

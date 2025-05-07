import * as jose from 'jose'

export default defineEventHandler((event) => {
  const url = event.node.req.url || ''

  const protectedRoutes = ['/api/auth/me']

  if (protectedRoutes.some(path => !url.startsWith(path)))
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

  const decodedToken = jose.decodeJwt(token)

  if (!decodedToken) {
    return sendError(event, createError({
      statusCode: 401,
      statusMessage: 'Unauthorized',
    }))
  }

  event.context.auth = {
    userId: decodedToken.id,
  }
})

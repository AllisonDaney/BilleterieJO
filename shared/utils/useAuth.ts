import * as jose from 'jose'

export function useAuth() {
  async function checkIfTokenStillValid(token: string | null) {
    if (!token) {
      return false
    }

    const decoded = await jose.decodeJwt(token)

    if (new Date().getTime() / 1000 > (decoded.exp ?? 0)) {
      return false
    }

    return true
  }

  return { checkIfTokenStillValid }
}

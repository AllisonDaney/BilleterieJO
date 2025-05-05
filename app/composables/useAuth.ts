export function useAuth() {
  const token = useCookie('auth.token')
  const isLogged = useCookie('auth.isLogged')

  return { token, isLogged }
}

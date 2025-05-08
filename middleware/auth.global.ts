export default defineNuxtRouteMiddleware(async () => {
  if (import.meta.server || import.meta.client) {
    const token = useCookie('auth.token')
    const { checkIfTokenStillValid } = useAuth()
    const authStore = useAuthStore()

    if (!token.value) {
      return
    }

    const isTokenValid = await checkIfTokenStillValid(token.value)

    if (!isTokenValid) {
      authStore.logout(false)
      return
    }

    if (!authStore.isLogged && !authStore.user?.id) {
      const { data } = await useFetch('/api/auth/me', {
        headers: {
          Authorization: `Bearer ${token.value}`,
        },
      })

      const userData = data.value?.user

      if (!userData) {
        authStore.logout(false)
        return
      }

      authStore.setUser(userData)
    }
  }
})

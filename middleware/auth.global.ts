export default defineNuxtRouteMiddleware(async () => {
  if (import.meta.server || import.meta.client) {
    const token = useCookie('auth.token')
    const { checkIfTokenStillValid } = useAuth()
    const authStore = useAuthStore()
    const { isLogged } = storeToRefs(authStore)

    if (!token.value) {
      return
    }

    const isTokenValid = await checkIfTokenStillValid(token.value)

    if (!isTokenValid) {
      authStore.logout(false)
      return
    }

    if (!isLogged.value && !authStore.user.id) {
      const { data } = await useFetch('/api/auth/me', {
        headers: {
          Authorization: `Bearer ${token.value}`,
        },
      })

      const user = data.value?.user

      if (!user) {
        authStore.logout(false)
        return
      }

      Object.assign(authStore.user, user)
    }
  }
})

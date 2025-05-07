import type { SelectSafeUser } from '~~/server/database/schema/users'

export const useAuthStore = defineStore('auth', () => {
  const { successToast } = useCustomToast()

  const user = reactive<SelectSafeUser>({} as SelectSafeUser)

  const isLogged = computed(() => !!user?.id)

  function logout(showToast = true) {
    const token = useCookie('auth.token')

    Object.assign(user, {} as SelectSafeUser)
    token.value = null

    if (showToast) {
      successToast('Déconnexion réussie.')
    }
  }

  return {
    user,
    isLogged,
    logout,
  }
})

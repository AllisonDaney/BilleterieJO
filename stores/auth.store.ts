import type { SelectSafeUser } from '~/server/database/schema/users'

export const useAuthStore = defineStore('auth', () => {
  const appStore = useAppStore()
  const { successToast } = useCustomToast()

  const user = ref<SelectSafeUser | null>(null)

  const isLogged = computed(() => !!user.value?.id)

  function setUser(userData: SelectSafeUser | null) {
    user.value = userData
  }

  function logout(showToast = true) {
    const token = useCookie('auth.token')

    setUser(null)

    token.value = null

    if (showToast) {
      successToast('Déconnexion réussie.')
      navigateTo('/')
      appStore.toggleDrawer(false)
    }
  }

  return {
    user,
    isLogged,
    setUser,
    logout,
  }
})

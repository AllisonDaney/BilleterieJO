import type { RouteLocationNormalized } from 'vue-router'
import type { SelectSafeUser } from '~/server/database/schema/users'

const routePermissions = new Map<string, string[]>([
  ['/', []],
  ['/tickets', []],
  ['/tickets/pay', ['user']],
  ['/auth/signin', []],
  ['/auth/signup', []],
  ['/admin/users', ['admin', 'employee']],
  ['/admin/employees', ['admin']],
])

function checkRoles(to: RouteLocationNormalized, user: SelectSafeUser | null) {
  const allowedRoles = routePermissions.get(to.path)

  if (!allowedRoles?.length) {
    return
  }

  if (allowedRoles && !allowedRoles.includes(user?.role?.slug ?? '')) {
    if (['admin', 'employee'].includes(user?.role?.slug ?? '')) {
      return navigateTo('/admin/users')
    }
    else {
      return navigateTo('/')
    }
  }
}

export default defineNuxtRouteMiddleware(async (to) => {
  const token = useCookie('auth.token')
  const authStore = useAuthStore()
  const { checkIfTokenStillValid } = useAuth()

  if (!token.value)
    return checkRoles(to, authStore.user)

  if (!authStore.isLogged) {
    const isValid = await checkIfTokenStillValid(token.value)
    if (!isValid) {
      authStore.logout(false)
      return checkRoles(to, authStore.user)
    }

    const { data, error } = await useFetch('/api/auth/me', {
      headers: {
        Authorization: `Bearer ${token.value}`,
      },
    })

    const userData = data.value?.user

    if (error.value || !userData) {
      authStore.logout(false)
    }
    else {
      authStore.setUser(userData as SelectSafeUser)
    }
  }

  return checkRoles(to, authStore.user)
})

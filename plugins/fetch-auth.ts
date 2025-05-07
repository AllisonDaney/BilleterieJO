export default defineNuxtPlugin(() => {
  const fetchAuth = $fetch.create({
    onRequest({ options }) {
      const token = useCookie('auth.token')

      const headers = new Headers(options.headers)

      if (token) {
        headers.append('Authorization', `Bearer ${token}`)
      }

      options.headers = headers
    },
  })

  return {
    provide: {
      fetchAuth,
    },
  }
})

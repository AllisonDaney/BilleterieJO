export default function useApp() {
  const fetchAuth: typeof $fetch = $fetch.create({
    onRequest({ options }) {
      const token = useCookie('auth.token')

      const headers = new Headers(options.headers)

      if (token.value) {
        headers.append('Authorization', `Bearer ${token.value}`)
      }

      options.headers = headers
    },
  })

  return {
    $fetchAuth: fetchAuth,
  }
}

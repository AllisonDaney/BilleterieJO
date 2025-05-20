import { vi } from 'vitest'

vi.mock('h3', async () => {
  const actual = await vi.importActual<any>('h3')
  return {
    ...actual,
    getRouterParam: (event: any, name: string) => {
      return event?.__routerParams?.[name]
    },
    getQuery: (event: any) => {
      const url = event?.req?.url || ''
      const searchParams = new URLSearchParams(url.split('?')[1])
      const query: Record<string, string> = {}
      for (const [key, value] of searchParams.entries()) {
        query[key] = value
      }
      return query
    },
    readBody: (event: any) => Promise.resolve(event.body),
  }
})

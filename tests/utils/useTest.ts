import { vi } from 'vitest'

export function useTest() {
  function createMockEvent(body: any, context = {}, method = 'GET', headers = {}, query: Record<string, string> = {}, routerParams: Record<string, string> = {}) {
    const searchParams = new URLSearchParams(query).toString()
    const url = searchParams ? `/?${searchParams}` : '/'

    return {
      req: { method, headers, url },
      res: {},
      body,
      context,
      waitUntil: vi.fn(),
      __routerParams: routerParams,
    } as any
  }

  return {
    createMockEvent,
  }
}

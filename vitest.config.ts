import { defineVitestConfig } from '@nuxt/test-utils/config'

export default defineVitestConfig({
  test: {
    setupFiles: ['tests/setup.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html'],
      all: true,
      include: ['server/api/**/*.{ts,js}'],
      exclude: ['**/*.spec.ts', '**/node_modules/**'],
    },
    environment: 'nuxt',
    include: ['tests/**/*.spec.ts'],
  },
})

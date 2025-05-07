import process from 'node:process'

export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  future: {
    compatibilityVersion: 4,
  },

  devtools: { enabled: true },

  modules: [
    '@nuxthub/core',
    '@nuxt/fonts',
    '@nuxt/image',
    '@nuxt/ui',
    '@nuxt/eslint',
    '@vueuse/nuxt',
    '@pinia/nuxt',
  ],

  imports: {
    dirs: ['stores'],
  },

  css: [
    'assets/css/main.css',
  ],

  ui: {
    colorMode: false,
  },

  eslint: {
    config: {
      standalone: false,
    },
  },

  components: [
    {
      path: '~/components',
      pathPrefix: false,
    },
    {
      path: '../app/components',
      pathPrefix: false,
    },
  ],

  // https://hub.nuxt.com/docs/getting-started/installation#options
  hub: {},

  pinia: {
    storesDirs: ['./stores'],
  },

  runtimeConfig: {
    private: {
      NUXT_POSTGRES_URL: process.env.NUXT_POSTGRES_URL || '',
      NUXT_JWT_SECRET: process.env.NUXT_JWT_SECRET || '',
    },
  },
})

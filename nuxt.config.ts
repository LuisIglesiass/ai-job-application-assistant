/// <reference types="node" />

export default defineNuxtConfig({
  compatibilityDate: '2025-05-01',

  app: {
    head: {
      title: 'AI Job Assistant',
      link: [
        { rel: 'icon', type: 'image/png', href: '/favicon.png' },
        { rel: 'apple-touch-icon', href: '/favicon.png' },
      ],
      meta: [
        { name: 'theme-color', content: '#4f46e5' },
      ],
    },
  },

  typescript: {
    strict: true,
    typeCheck: true,
  },

  css: ['~/assets/scss/main.scss'],

  vite: {
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: '@use "~/assets/scss/variables" as *;',
        },
      },
    },
  },

  runtimeConfig: {
    aiApiKey: process.env.AI_API_KEY ?? '',
  },

  nitro: {
    storage: {
      // File-based storage for job tracker data.
      // Swap driver to 'redis', 'cloudflare-kv-binding', etc. to scale up.
      data: { driver: 'fs', base: './.data' },
    },
  },

  components: [
    { path: '~/components', pathPrefix: false },
    { path: '~/features/job-tracker/components', pathPrefix: false },
  ],

  imports: {
    dirs: ['composables', 'features/job-tracker'],
  },

  devtools: { enabled: true },
})

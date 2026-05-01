/// <reference types="node" />

export default defineNuxtConfig({
  compatibilityDate: '2025-05-01',

  app: {
    head: {
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

  devtools: { enabled: true },
})

/// <reference types="node" />

export default defineNuxtConfig({
  compatibilityDate: '2025-05-01',

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

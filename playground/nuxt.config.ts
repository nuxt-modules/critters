export default defineNuxtConfig({
  modules: ['@nuxtjs/critters'],
  css: ['~/styles/global.css'],
  compatibilityDate: '2024-08-19',
  nitro: {
    prerender: {
      routes: ['/'],
    },
  },
})

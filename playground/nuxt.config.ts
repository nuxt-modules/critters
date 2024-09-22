export default defineNuxtConfig({
  compatibilityDate: '2024-08-19',
  modules: ['@nuxtjs/critters'],
  css: ['~/styles/global.css'],
  nitro: {
    prerender: {
      routes: ['/'],
    },
  },
})

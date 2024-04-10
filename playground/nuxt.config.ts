export default defineNuxtConfig({
  modules: ['@nuxtjs/critters'],
  css: ['~/styles/global.css'],
  nitro: {
    prerender: {
      routes: ['/'],
    },
  },
})

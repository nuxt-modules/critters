export default defineNuxtConfig({
  modules: ['../src'],
  css: ['~/styles/global.css'],
  nitro: {
    prerender: {
      routes: ['/'],
    },
  },
})

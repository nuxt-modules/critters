export default {
  modules: ['@nuxtjs/critters'],
  css: ['~/styles/global.css'],
  nitro: {
    prerender: {
      routes: ['/'],
    },
  },
}

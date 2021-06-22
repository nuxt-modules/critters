import { defineNuxtModule } from '@nuxt/kit'
import { resolve } from 'upath'
import Critters from 'critters'

export default defineNuxtModule({
  name: 'critters',
  options: {
    preload: 'media'
  },
  setup (options, nuxt) {
    // Only enable for production
    if (nuxt.options.dev) {
      return
    }

    const critters = new Critters({
      path: resolve(nuxt.options.buildDir, 'dist/client'),
      publicPath: nuxt.options.build.publicPath,
      preload: options.preload,
    })

    // ٍEnable css extraction
    nuxt.options.build.extractCSS = true

    // Add transform step
    nuxt.hook('render:route', async (_url, result) => {
      result.html = await critters.process(result.html)
    })
  }
})

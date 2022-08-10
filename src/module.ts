import { defineNuxtModule, isNuxt2 } from '@nuxt/kit'
import { resolve } from 'pathe'
import Critters, { Options } from 'critters'

export interface ModuleOptions {
  // Options passed directly to `critters`
  config?: Options
}

export default defineNuxtModule<ModuleOptions>({
  meta: {
    name: 'critters',
    configKey: 'critters',
  },
  defaults: {
    config: {
      preload: 'media',
    },
  },
  setup(options, nuxt) {
    // Only enable for production
    if (nuxt.options.dev) return

    // Enable css extraction
    nuxt.options.build.extractCSS = true

    // Nitro handler (for prerendering only)

    nuxt.hook('nitro:init', nitro => {
      const critters = new Critters({
        path: nitro.options.output.publicDir,
        publicPath: nitro.options.baseURL,
        ...options.config,
      })
      nitro.hooks.hook('prerender:generate', async route => {
        if (!route.contents || !route.fileName?.endsWith('.html')) return
        route.contents = await critters.process(route.contents)
      })
    })

    if (isNuxt2()) {
      const critters = new Critters({
        path: resolve(nuxt.options.buildDir, 'dist/client'),
        publicPath: nuxt.options.build.publicPath,
        ...options.config,
      })

      // Add transform step
      nuxt.hook('render:route', async (_url, result) => {
        result.html = await critters.process(result.html)
      })

      nuxt.hook('generate:page', async result => {
        result.html = await critters.process(result.html)
      })
    }
  },
})

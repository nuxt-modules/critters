import { defineNuxtModule } from '@nuxt/kit'
import { resolve } from 'upath'
import Critters, { Options } from 'critters'

const configKey = 'critters'

interface CrittersModuleOptions {
  config?: Options
}

export default defineNuxtModule<CrittersModuleOptions>({
  name: 'critters',
  configKey,
  defaults: {
    // Options passed directly to `critters`
    config: {
      preload: 'media'
    }
  },
  setup (options, nuxt) {
    // Only enable for production
    if (nuxt.options.dev) {
      return
    }

    const critters = new Critters({
      path: resolve(nuxt.options.buildDir, 'dist/client'),
      publicPath: nuxt.options.build.publicPath,
      ...options.config,
    })

    // Enable css extraction
    nuxt.options.build.extractCSS = true

    // Add transform step
    nuxt.hook('render:route', async (_url, result) => {
      result.html = await critters.process(result.html)
    })

    nuxt.hook('generate:page', async (result) => {
      result.html = await critters.process(result.html)
    })
  }
})

declare module '@nuxt/types' {
  // Nuxt 2.14+
  interface NuxtOptions {
    [configKey]: CrittersModuleOptions
  }
  // Nuxt 2.9 - 2.13
  interface Configuration {
    [configKey]: CrittersModuleOptions
  }
}

declare module '@nuxt/kit' {
  interface NuxtConfig {
    [configKey]: CrittersModuleOptions
  }
}

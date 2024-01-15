import { readFile, writeFile } from 'node:fs/promises'
import { defineNuxtModule, isNuxt2, useLogger } from '@nuxt/kit'
import { resolve } from 'pathe'
import { withoutLeadingSlash } from 'ufo'
import Critters from 'critters'
import type { Options } from 'critters'

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
  setup (options, nuxt) {
    // Only enable for production
    if (nuxt.options.dev) return

    const logger = useLogger('critters')

    // Enable css extraction
    // @ts-expect-error TODO: use @nuxt/bridge-schema
    nuxt.options.build.extractCSS = true

    // Nitro handler (for prerendering only)

    const generatedFiles = new Set<string>()
    nuxt.hook('nitro:init', nitro => {
      nitro.hooks.hook('prerender:generate', route => {
        if (!route.fileName?.endsWith('.html') || route.error) return
        generatedFiles.add(withoutLeadingSlash(route.fileName))
      })
    })
    nuxt.hook('nitro:build:public-assets', async nitro => {
      const critters = new Critters({
        path: nitro.options.output.publicDir,
        publicPath: nitro.options.baseURL,
        ...options.config,
      })
      for (const file of generatedFiles) {
        try {
          const path = resolve(nitro.options.output.publicDir, file)
          const contents = await readFile(path, 'utf-8')
          const processed = await critters.process(contents)
          await writeFile(path, processed)
        } catch {
          logger.log(`Could not inline CSS in \`${file}\`.`)
        }
      }
    })

    /* c8 ignore start */
    if (isNuxt2()) {
      const critters = new Critters({
        path: resolve(nuxt.options.buildDir, 'dist/client'),
        // @ts-expect-error TODO: use @nuxt/bridge-schema
        publicPath: nuxt.options.build.publicPath,
        ...options.config,
      })

      // Add transform step
      // @ts-expect-error TODO: use @nuxt/bridge-schema
      nuxt.hook('render:route', async (_url, result) => {
        if (!result.html || result.error) return
        try {
          result.html = await critters.process(result.html)
        } catch (e) {
          logger.log(e)
        }
      })

      // @ts-expect-error TODO: use @nuxt/bridge-schema
      nuxt.hook('generate:page', async result => {
        if (!result.html || result.error) return
        result.html = await critters.process(result.html)
      })
    }
  },
})

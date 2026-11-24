import { createRequire } from 'node:module'
import { dirname } from 'node:path'
import { addRendererPlugin, addVitePlugin, createResolver, defineNuxtModule, useLogger } from '@nuxt/kit'
import { compileSheet, encodePlan } from 'beasties/compiler'
import type { CompileOptions } from 'beasties/compiler'
import type { ProcessorOptions } from 'beasties/runtime'
import { joinURL, withLeadingSlash, withoutLeadingSlash } from 'ufo'

/** The nonce is read from the request, so it is not configurable */
export interface CrittersConfig extends Omit<ProcessorOptions, 'nonce'>, Pick<CompileOptions, 'allowRules' | 'exact'> {}

export interface ModuleOptions {
  // Options passed to the `beasties` compiler and runtime
  config?: CrittersConfig
}

/** Above this, embedding compiled plans in the server bundle is worth flagging */
const PLAN_SIZE_WARNING = 512 * 1024

/**
 * Below this total CSS size, evaluating the compiled sheets per request costs
 * less than fingerprinting the document to look up a cached result.
 */
const CACHE_CSS_SIZE_THRESHOLD = 30 * 1024

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

    const logger = useLogger('critters')
    const resolver = createResolver(import.meta.url)

    // Inlined component styles are never emitted as CSS assets, so they cannot
    // be pruned - and leaving them on ships the same rules twice
    nuxt.options.features.inlineStyles = false

    const stylesheets = new Map<string, string>()
    let clientBuilt = false

    nuxt.hook('vite:extendConfig', (config, { isClient }) => {
      if (!isClient) return
      config.plugins!.push({
        name: 'critters:collect-stylesheets',
        generateBundle(_outputOptions, bundle) {
          if (this.environment?.config.consumer !== 'server') {
            clientBuilt = true
          }
          for (const [fileName, asset] of Object.entries(bundle)) {
            if (asset.type !== 'asset' || !fileName.endsWith('.css')) continue
            stylesheets.set(fileName, asset.source.toString())
          }
        },
      })
    })

    const { allowRules, exact, nonce, ...runtimeOptions } = (options.config || {}) as CrittersConfig & ProcessorOptions
    if (nonce) {
      logger.warn('`critters.config.nonce` is not supported - the nonce is read from the request.')
    }

    const renderPlans = () => {
      const buildAssetsDir = withoutLeadingSlash(nuxt.options.app.buildAssetsDir)
      // `url()` references are rebased against this href, so it has to be
      // document-absolute or they resolve relative to the rendered route
      const base = withLeadingSlash(nuxt.options.app.baseURL)
      const plans: unknown[] = []
      let cssSize = 0

      for (const [fileName, css] of stylesheets) {
        const href = joinURL(base, fileName.startsWith(buildAssetsDir) ? fileName : joinURL(buildAssetsDir, fileName))
        const sheet = compileSheet(css, { href, allowRules, exact })
        for (const warning of sheet.warnings) {
          logger.warn(warning)
        }
        cssSize += sheet.size
        plans.push(encodePlan(sheet))
      }

      const serialized = JSON.stringify(plans)
      if (serialized.length > PLAN_SIZE_WARNING) {
        logger.warn(`Compiled critical CSS plans add ${Math.round(serialized.length / 1024)}kB to the server bundle.`)
      }

      const cache = runtimeOptions.cache ?? cssSize >= CACHE_CSS_SIZE_THRESHOLD

      return [
        `export const plans = ${serialized}`,
        `export const options = ${JSON.stringify({ ...runtimeOptions, cache })}`,
      ].join('\n')
    }

    nuxt.options.nitro.virtual ||= {}
    nuxt.options.nitro.virtual['#critters'] = renderPlans

    let hasNitro = false
    nuxt.hook('nitro:init', () => {
      hasNitro = true
    })

    addVitePlugin({
      name: 'critters:plans',
      enforce: 'pre',
      resolveId: {
        order: 'pre',
        handler(id) {
          if (id !== '#critters') return
          // Nitro bundles the server output once the client build has finished
          return hasNitro ? { id, external: true } : '\0#critters'
        },
      },
      load(id) {
        if (id !== '\0#critters') return
        if (!clientBuilt) {
          logger.warn('The server was bundled before the client build finished, so critical CSS will not be inlined.')
        }
        return renderPlans()
      },
    }, { client: false })

    const beastiesRuntime = createRequire(import.meta.url).resolve('beasties/runtime')

    nuxt.options.nitro.alias ||= {}
    nuxt.options.nitro.alias['beasties/runtime'] = beastiesRuntime

    nuxt.options.nitro.externals ||= {}
    nuxt.options.nitro.externals.inline ||= []
    nuxt.options.nitro.externals.inline.push(dirname(beastiesRuntime))

    addRendererPlugin({
      nuxt: resolver.resolve('./runtime/renderer-plugin'),
      nitro2: resolver.resolve('./runtime/nitro-plugin'),
    })
  },
})

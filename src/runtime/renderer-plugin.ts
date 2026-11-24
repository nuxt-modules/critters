import type { RendererPlugin } from 'nuxt/server'
import { createProcessor } from 'beasties/runtime'
import { options, plans } from '#critters'

/**
 * The shape of the request context we rely on, kept structural so the module
 * does not depend on whichever module supplies the nonce.
 */
interface SecurityContextLike {
  nonce?: string
}

export default (({ hooks }) => {
  if (plans.length === 0) return

  const processor = createProcessor(plans, options)

  hooks.hook('render:document', (document, { event }) => {
    try {
      const nonce = (event.context.security as SecurityContextLike | undefined)?.nonce
      document.html = processor.process(document.html, { nonce })
    }
    catch (error) {
      console.error('[critters] Could not inline critical CSS.', error)
    }
  })
}) satisfies RendererPlugin

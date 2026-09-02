import { createProcessor } from 'beasties/runtime'
import { defineNitroPlugin } from 'nitropack/runtime'
import { options, plans } from '#critters'

/**
 * The shape of the `render:response` context we rely on, kept structural so the
 * module does not depend on whichever module supplies the nonce.
 */
interface RenderContextLike {
  event?: {
    context?: {
      security?: {
        nonce?: string
      }
    }
  }
}

export default defineNitroPlugin((nitroApp) => {
  if (plans.length === 0) return

  const processor = createProcessor(plans, options)

  nitroApp.hooks.hook('render:response', (response, context) => {
    if (typeof response.body !== 'string') return
    const contentType = response.headers?.['content-type']
    if (contentType && !contentType.includes('text/html')) return

    try {
      const nonce = (context as RenderContextLike).event?.context?.security?.nonce
      response.body = processor.process(response.body, { nonce })
    }
    catch (error) {
      console.error('[critters] Could not inline critical CSS.', error)
    }
  })
})

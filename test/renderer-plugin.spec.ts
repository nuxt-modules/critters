import type { NuxtServerRendererHooks, RendererPluginContext } from 'nuxt/server'
import { describe, expect, it } from 'vitest'
import plugin from '../src/runtime/renderer-plugin'

type RenderDocumentHandler = NuxtServerRendererHooks['render:document']

const html = `<html><head><link rel="stylesheet" href="/_nuxt/entry.css"></head><body><div class="used"></div></body></html>`

function createHandler() {
  let handler: RenderDocumentHandler | undefined
  const hooks = {
    hook(name: string, fn: RenderDocumentHandler) {
      if (name === 'render:document') {
        handler = fn
      }
    },
  } as unknown as RendererPluginContext['hooks']

  plugin({ hooks })

  if (!handler) {
    throw new Error('plugin did not register a `render:document` handler')
  }

  return handler
}

function render(handler: RenderDocumentHandler, nonce?: string) {
  const document = { html }
  // @ts-expect-error the fake event only implements what the plugin reads
  handler(document, { event: { context: nonce ? { security: { nonce } } : {} } })
  return document.html
}

describe('renderer plugin', () => {
  it('inlines critical CSS and defers the stylesheet', () => {
    const body = render(createHandler())
    expect(body).toContain('.used')
    expect(body).not.toContain('.unused')
    expect(body).toContain('media="print"')
  })

  it('applies the per-request nonce to injected tags', () => {
    const handler = createHandler()
    const first = render(handler, 'first')
    const second = render(handler, 'second')
    expect(first).toContain('<style nonce="first">')
    expect(first).toContain('<script nonce="first">')
    expect(second).toContain('nonce="second"')
    expect(second).not.toContain('nonce="first"')
  })

  it('injects no nonce when the request has none', () => {
    expect(render(createHandler())).not.toContain('nonce=')
  })
})

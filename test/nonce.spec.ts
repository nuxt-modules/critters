import { describe, expect, it } from 'vitest'
import plugin from '../src/runtime/nitro-plugin'

type NitroApp = Parameters<typeof plugin>[0]
type RenderResponseHandler = Parameters<NitroApp['hooks']['hook']> extends [unknown, infer H] ? H : never

const html = `<html><head><link rel="stylesheet" href="/_nuxt/entry.css"></head><body><div class="used"></div></body></html>`

function createHandler() {
  let handler: RenderResponseHandler | undefined
  const nitroApp = {
    hooks: {
      hook(name: string, fn: RenderResponseHandler) {
        if (name === 'render:response') {
          handler = fn
        }
      },
    },
  } as unknown as NitroApp

  plugin(nitroApp)

  if (!handler) {
    throw new Error('plugin did not register a `render:response` handler')
  }

  return handler
}

function render(nonce?: string) {
  const response: { body?: string } = { body: html }
  const handler = createHandler()
  // @ts-expect-error the fake context only implements what the plugin reads
  handler(response, { event: { context: nonce ? { security: { nonce } } : {} } })
  return response.body!
}

describe('csp nonce', () => {
  it('applies the per-request nonce to injected tags', () => {
    const body = render('request-nonce')
    expect(body).toContain('<style nonce="request-nonce">')
    expect(body).toContain('<script nonce="request-nonce">')
  })

  it('injects no nonce when the request has none', () => {
    expect(render()).not.toContain('nonce=')
  })

  it('does not let a cached render reuse a previous nonce', () => {
    const handler = createHandler()
    const first: { body?: string } = { body: html }
    const second: { body?: string } = { body: html }
    // @ts-expect-error the fake context only implements what the plugin reads
    handler(first, { event: { context: { security: { nonce: 'first' } } } })
    // @ts-expect-error the fake context only implements what the plugin reads
    handler(second, { event: { context: { security: { nonce: 'second' } } } })
    expect(first.body).toContain('nonce="first"')
    expect(second.body).toContain('nonce="second"')
    expect(second.body).not.toContain('nonce="first"')
  })
})

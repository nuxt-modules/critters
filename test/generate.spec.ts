import { fileURLToPath } from 'node:url'
import { promises as fsp } from 'node:fs'
import { setup, useTestContext } from '@nuxt/test-utils'
import { resolve } from 'pathe'
import { describe, it, expect } from 'vitest'

await setup({
  rootDir: fileURLToPath(new URL('../playground', import.meta.url)),
  build: true,
})

describe('module in generated pages', () => {
  it('processes generated index.html', async () => {
    const ctx = useTestContext()
    const body = await fsp.readFile(
      resolve(ctx.nuxt!.options.nitro.output?.dir || '', 'public/index.html'),
      'utf-8',
    )
    expect(body).toContain('<style>')
    expect(body).toContain('.sample-class')
    expect(body).not.toContain('.sample-unused-class')
  })

  it('inlines used media queries and keyframes only', async () => {
    const ctx = useTestContext()
    const body = await fsp.readFile(
      resolve(ctx.nuxt!.options.nitro.output?.dir || '', 'public/index.html'),
      'utf-8',
    )
    const critical = body.match(/<style>(.*?)<\/style>/s)?.[1] || ''
    expect(critical).toContain('.sample-media-class')
    expect(critical).not.toContain('.sample-unused-media-class')
    expect(critical).toContain('@keyframes sample-fade')
    expect(critical).not.toContain('sample-unused-keyframes')
  })

  it('leaves the original stylesheets loading asynchronously', async () => {
    const ctx = useTestContext()
    const body = await fsp.readFile(
      resolve(ctx.nuxt!.options.nitro.output?.dir || '', 'public/index.html'),
      'utf-8',
    )
    expect(body).toContain('media="print"')
    expect(body).toContain('<noscript>')
  })
})

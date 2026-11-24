import { fileURLToPath } from 'node:url'
import { promises as fsp } from 'node:fs'
import { setup, useTestContext } from '@nuxt/test-utils'
import { resolve } from 'pathe'
import { describe, it, expect } from 'vitest'

await setup({
  rootDir: fileURLToPath(new URL('../playground', import.meta.url)),
  build: true,
  server: false,
  nuxtConfig: {
    server: { builder: 'vite' },
    nitro: { static: true },
  },
})

async function readIndex() {
  const ctx = useTestContext()
  return fsp.readFile(resolve(ctx.nuxt!.options.nitro.output?.dir || '', 'public/index.html'), 'utf-8')
}

describe('module in pages prerendered by the vite server builder', () => {
  it('inlines critical CSS', async () => {
    const critical = (await readIndex()).match(/<style>(.*?)<\/style>/s)?.[1] || ''
    expect(critical).toContain('.sample-class')
    expect(critical).not.toContain('.sample-unused-class')
    expect(critical).toContain('.sample-media-class')
    expect(critical).toContain('@keyframes sample-fade')
  })

  it('leaves the original stylesheets loading asynchronously', async () => {
    const body = await readIndex()
    expect(body).toContain('media="print"')
    expect(body).toContain('<noscript>')
  })
})

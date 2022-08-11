import { fileURLToPath } from 'url'
import { promises as fsp } from 'fs'
import { setup, useTestContext } from '@nuxt/test-utils'
import { resolve } from 'pathe'
import { describe, it, expect } from 'vitest'

await setup({
  rootDir: fileURLToPath(new URL('../playground', import.meta.url).href),
  build: true,
})

describe('module in generated pages', () => {
  it('enables extractCSS', async () => {
    const ctx = useTestContext()
    const body = await fsp.readFile(
      resolve(ctx.nuxt!.options.nitro.output?.dir || '', 'public/index.html'),
      'utf-8'
    )
    expect(body).toContain('<style>')
    expect(body).toContain('.sample-class')
    expect(body).not.toContain('.sample-unused-class')
  })
})

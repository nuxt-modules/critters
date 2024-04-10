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
})

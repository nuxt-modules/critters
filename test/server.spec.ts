import { fileURLToPath } from 'url'
import { setup, $fetch, useTestContext } from '@nuxt/test-utils'
import { describe, it, expect } from 'vitest'

await setup({
  rootDir: fileURLToPath(new URL('../playground', import.meta.url).href),
  server: true,
})

describe.skip('module in server', () => {
  it('enables extractCSS', () => {
    const ctx = useTestContext()
    expect(ctx.nuxt!.options.build.extractCSS).toBeTruthy()
  })

  it('inlines CSS', async () => {
    const body = await $fetch('/')
    expect(body).toContain('<style>')
    expect(body).toContain('.sample-class')
    expect(body).not.toContain('.sample-unused-class')
  })
})

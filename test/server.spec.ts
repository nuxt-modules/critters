import { fileURLToPath } from 'node:url'
import { setup, $fetch } from '@nuxt/test-utils'
import { describe, it, expect } from 'vitest'

await setup({
  rootDir: fileURLToPath(new URL('../playground', import.meta.url)),
  server: true,
})

describe('module in server', () => {
  it('inlines CSS', async () => {
    const body = await $fetch<string>('/')
    expect(body).toContain('<style>')
    expect(body).toContain('.sample-class')
    expect(body).not.toContain('.sample-unused-class')
  })
})

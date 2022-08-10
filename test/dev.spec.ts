import { fileURLToPath } from 'url'
import { setup, $fetch } from '@nuxt/test-utils'
import { describe, it, expect } from 'vitest'

await setup({
  rootDir: fileURLToPath(new URL('../playground', import.meta.url).href),
  server: true,
  nuxtConfig: {
    dev: true,
  },
})

describe('module in dev mode', () => {
  it('does not add module', async () => {
    const body = await $fetch('/')
    expect(body).not.toContain('<style>')
  })
})

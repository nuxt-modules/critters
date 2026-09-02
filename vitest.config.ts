import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    alias: {
      '#critters': new URL('./test/fixtures/critters.ts', import.meta.url).pathname,
      'nitropack/runtime': new URL('./test/fixtures/nitropack-runtime.ts', import.meta.url).pathname,
    },
    coverage: {
      include: ['src'],
      reporter: ['text', 'json', 'html', 'lcov'],
    },
  },
})

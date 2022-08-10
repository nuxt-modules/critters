/// <reference types="vitest" />
import { defineConfig } from 'vite'

export default defineConfig({
  test: {
    coverage: {
      include: ['src'],
      reporter: ['text', 'json', 'html', 'lcov'],
    },
  },
})

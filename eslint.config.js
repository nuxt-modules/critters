// @ts-check
import { createConfigForNuxt } from '@nuxt/eslint-config/flat'

export default createConfigForNuxt({
  features: {
    tooling: true,
    stylistic: true,
    typescript: true,
  },
  dirs: {
    src: [
      './playground',
    ],
  },
})

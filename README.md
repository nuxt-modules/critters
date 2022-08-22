# @nuxtjs/critters

[![npm version][npm-version-src]][npm-version-href]
[![npm downloads][npm-downloads-src]][npm-downloads-href]
[![Github Actions CI][github-actions-ci-src]][github-actions-ci-href]
[![Codecov][codecov-src]][codecov-href]
[![License][license-src]][license-href]

> CSS optimization using [critters](https://github.com/GoogleChromeLabs/critters) for [Nuxt](https://nuxtjs.org)

## Features

- Zero-configuration required
- Enables CSS Extraction
- Critical CSS automatically injected to page
- Works with Nitro prerendering

## Quick setup

1. Add `@nuxtjs/critters` dependency to your project

```bash
yarn add @nuxtjs/critters # or npm install @nuxtjs/critters
```

2. Add `@nuxtjs/critters` to the `modules` section of `nuxt.config.js`

```js
{
  modules: [
    '@nuxtjs/critters',
  ],
}
```

## How it works

Nuxt has a number of ways to optimize your CSS in production:

1. ✅ Nuxt uses [`cssnano`](https://cssnano.co/) in the build step to minify CSS rules
2. 📦 You can enable [`purgecss`](https://github.com/Developmint/nuxt-purgecss) to remove unused CSS rules from your bundle.
3. ✅ with `@nuxtjs/critters` you can now extract CSS files and load them separately, just inlining the CSS necessary to render the page.

## Options

You can override the `@nuxtjs/critters` defaults like this:

```js
// nuxt.config.js
import { defineNuxtConfig } from 'nuxt'
export default defineNuxtConfig({
  modules: ['@nuxtjs/critters'],
  critters: {
    // Options passed directly to critters: https://github.com/GoogleChromeLabs/critters#critters-2
    config: {
      // Default: 'media'
      preload: 'swap',
    },
  },
})
```

## Development

1. Clone this repository
2. Install dependencies using `yarn install`
3. Start development server using `yarn dev`

## License

[MIT License](./LICENSE)

<!-- Badges -->

[npm-version-src]: https://img.shields.io/npm/v/@nuxtjs/critters/latest.svg
[npm-version-href]: https://npmjs.com/package/@nuxtjs/critters
[npm-downloads-src]: https://img.shields.io/npm/dm/@nuxtjs/critters.svg
[npm-downloads-href]: https://npmjs.com/package/@nuxtjs/critters
[github-actions-ci-src]: https://github.com/nuxt-modules/critters/workflows/ci/badge.svg
[github-actions-ci-href]: https://github.com/nuxt-modules/critters/actions?query=workflow%3Aci
[codecov-src]: https://img.shields.io/codecov/c/github/nuxt-modules/critters.svg
[codecov-href]: https://codecov.io/gh/nuxt-modules/critters
[license-src]: https://img.shields.io/npm/l/@nuxtjs/critters.svg
[license-href]: https://npmjs.com/package/@nuxtjs/critters

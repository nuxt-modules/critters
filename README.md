# @nuxtjs/critters

[![npm version][npm-version-src]][npm-version-href]
[![npm downloads][npm-downloads-src]][npm-downloads-href]
[![Github Actions CI][github-actions-ci-src]][github-actions-ci-href]
[![Codecov][codecov-src]][codecov-href]
[![License][license-src]][license-href]

> CSS optimization using [beasties](https://github.com/danielroe/beasties) (formerly [critters](https://github.com/GoogleChromeLabs/critters)) for [Nuxt](https://nuxtjs.org)

## Features

- Zero-configuration required
- Stylesheets are compiled at build time, so no CSS parser or DOM is needed at runtime
- Critical CSS automatically injected to page
- Works with runtime SSR and Nitro prerendering

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

1. ✅ Nuxt uses [`cssnano`](https://cssnano.github.io/cssnano/) in the build step to minify CSS rules
2. 📦 You can enable [`purgecss`](https://github.com/Developmint/nuxt-purgecss) to remove unused CSS rules from your bundle.
3. ✅ with `@nuxtjs/critters` you can now extract CSS files and load them separately, just inlining the CSS necessary to render the page.

At build time the module compiles every CSS asset emitted by the client build into a compact plan with [`beasties/compiler`](https://github.com/danielroe/beasties), and embeds those plans in the server bundle. At request (or prerender) time a Nitro plugin runs the zero-dependency `beasties/runtime` processor over the rendered HTML, which scans the markup in a single pass and inlines only the rules that can match.

Because inlined component styles never become external CSS assets (and so can never be pruned), the module disables `features.inlineStyles`.

## Options

You can override the `@nuxtjs/critters` defaults like this:

```js
// nuxt.config.js
import { defineNuxtConfig } from 'nuxt'
export default defineNuxtConfig({
  modules: ['@nuxtjs/critters'],
  critters: {
    config: {
      // Default: 'media'
      preload: 'swap',
    },
  },
})
```

Supported `config` keys are the compiler's `allowRules` and `exact`, plus the runtime processor options: `preload`, `noscriptFallback`, `keyframes`, `fonts`, `inlineFonts`, `preloadFonts`, `cache`, `inlineThreshold` and `minimumExternalSize`.

### Differences from classic beasties

Some options of the classic (per-request, DOM-based) beasties API have no equivalent in the compiler + runtime pipeline:

- `pruneSource` — the runtime does not rewrite the external stylesheet, so rules that were inlined are still served by it.
- `path`, `publicPath`, `external`, `remote`, `additionalStylesheets`, `mergeStylesheets` — stylesheets are taken from the client build's emitted assets rather than resolved from the filesystem or network.
- `reduceInlineStyles`, `compress`, `safeParser`, `logLevel`, `logger`, `dedupeWarnings` — parsing, minification and diagnostics all happen at build time, and compiler warnings are reported through the Nuxt logger.

Two behaviours also differ:

- `minimumExternalSize` is measured against the rules that were *not* inlined, i.e. what the external stylesheet would still need to provide, rather than against a rewritten external stylesheet.
- `cache` defaults to being enabled only when the total compiled CSS is large enough that fingerprinting a document is cheaper than re-evaluating the plans. Set `cache: true` or `cache: false` to decide explicitly.

## CSP nonces

The module reads the per-request nonce from `event.context.security.nonce` and applies it to the `<style>` and `<script>` elements it injects. With [`nuxt-security`](https://nuxt-security.com) and its `nonce` support enabled, this needs no configuration.

It has to happen here rather than in the module that generates the nonce: `nuxt-security` stamps nonces onto rendered tags in Nitro's `render:html` hook, which runs *before* the `render:response` hook where critical CSS is inlined, so anything injected there is invisible to that pass. When the event carries no nonce — during prerendering, for instance — nothing is added.

beasties itself also accepts a `nonce` option, but it is not exposed here: a value fixed at build time is constant for the lifetime of the server, which defeats the point of a nonce.

## Development

1. Clone this repository
1. Enable corepack with `corepack enable`
1. Install dependencies using `pnpm install`
1. Start development server using `pnpm dev`

## License

[MIT License](./LICENSE)

<!-- Badges -->

[npm-version-src]: https://npmx.dev/api/registry/badge/version/@nuxtjs/critters
[npm-version-href]: https://npmx.dev/package/@nuxtjs/critters
[npm-downloads-src]: https://npmx.dev/api/registry/badge/downloads/@nuxtjs/critters
[npm-downloads-href]: https://npm.chart.dev/@nuxtjs/critters
[github-actions-ci-src]: https://github.com/nuxt-modules/critters/workflows/ci/badge.svg
[github-actions-ci-href]: https://github.com/nuxt-modules/critters/actions?query=workflow%3Aci
[codecov-src]: https://img.shields.io/codecov/c/github/nuxt-modules/critters.svg
[codecov-href]: https://codecov.io/gh/nuxt-modules/critters
[license-src]: https://npmx.dev/api/registry/badge/license/@nuxtjs/critters
[license-href]: https://npmx.dev/package/@nuxtjs/critters

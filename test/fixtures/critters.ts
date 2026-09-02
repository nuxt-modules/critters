import { compileSheet, encodePlan } from 'beasties/compiler'
import type { CompactPlan, ProcessorOptions } from 'beasties/runtime'

const css = `.used { color: red } .unused { color: blue }`

export const plans: CompactPlan[] = [encodePlan(compileSheet(css, { href: '_nuxt/entry.css' }))]

export const options: ProcessorOptions = { preload: 'media-script' }

import { setupTest, get, getNuxt } from '@nuxt/test-utils'
import { resolve } from 'upath'
import { readFile } from 'fs-extra'

const rootDir = './example'

describe('module in server', () => {
  setupTest({
    rootDir,
    server: true,
  })

  it('enables extractCSS', () => {
    const nuxt = getNuxt()
    expect(nuxt.options.build.extractCSS).toBeTruthy()
  })

  it('inlines CSS', async () => {
    const { body } = await get('/')
    expect(body).toContain('<style>')
    expect(body).toContain('.sample-class')
    expect(body).not.toContain('.sample-unused-class')
  })
})

describe('module in generated pages', () => {
  setupTest({
    rootDir,
    generate: true,
    config: {
      target: 'static',
    },
  })

  it('enables extractCSS', async () => {
    const body = await readFile(resolve(rootDir, 'dist/index.html'), 'utf-8')
    expect(body).toContain('<style>')
    expect(body).toContain('.sample-class')
    expect(body).not.toContain('.sample-unused-class')
  })
})

describe('module in dev mode', () => {
  setupTest({
    rootDir,
    server: true,
    config: {
      dev: true,
    },
  })

  it('does not add module', async () => {
    const { body } = await get('/')
    expect(body).toContain('.sample-unused-class')
  })
})

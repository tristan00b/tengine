import { isError        } from '@engine/util/Error'
import { ResourceLoader } from '@engine/util/ResourceLoader'

describe('engine.ResourceLoader', () => {

  const baseUrl = `${ process.env.BASE_URL }`

  it('it resolves the correct baseUrl', () => {
    expect(ResourceLoader.baseUrl).toBe(baseUrl)
  })

  it('it loads a local file', async () => {
    return ResourceLoader
      .loadLocal('app.config.json', { headers: { 'Content-Type': 'application/json' }})
      .then(async resp => expect(isError(resp)).toBe(false))
  })

  it('it loads an asset file', () => {
    return ResourceLoader
      .loadAsset('shaders/basic.vert', { headers: { 'Content-Type': 'text/plain' }})
      .then(async resp => isError(resp) ? fail(resp) : await resp.text())
      .then(async text => expect(text.startsWith('#version 300 es')).toBe(true))
  })
})

import { ResourceLoader } from '@engine/ResourceLoader'
import { isError        } from '@engine/util/Errors'

describe('engine.ResourceLoader', () => {

  const baseUrl = `${process.env.BASE_URL}`

  test('it loads a resource file', async () => {
    return ResourceLoader
      .load(new URL('/assets/shaders/basic.vert', baseUrl), { headers: { 'Content-Type': 'text/plain' }})
      .then(async resp => isError(resp) ? fail(resp) : await resp.text())
      .then(async text => expect(text.startsWith('#version 300 es')).toBeTruthy())
  })
})

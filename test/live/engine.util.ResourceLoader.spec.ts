import { isError        } from '@engine/util/Errors'
import { ResourceLoader } from '@engine/util/ResourceLoader'

describe('engine.ResourceLoader', () => {

  const baseUrl = `${process.env.BASE_URL}`

  test('it loads a resource file', async () => {
    return ResourceLoader
      .load(new URL('/assets/shaders/basic.vert', baseUrl), { headers: { 'Content-Type': 'text/plain' }})
      .then(async resp => isError(resp) ? fail(resp) : await resp.text())
      .then(async text => expect(text.startsWith('#version 300 es')).toBeTruthy())
  })
})

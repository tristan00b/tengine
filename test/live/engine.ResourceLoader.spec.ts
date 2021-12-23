import { ResourceLoader } from '@engine/ResourceLoader'

describe('engine.ResourceLoader', () => {

  const baseUrl = `${process.env.BASE_URL}`

  test('it loads a resource file', async () => {
    return ResourceLoader
      .load(new URL('/assets/shaders/basic.vert', baseUrl), { headers: { 'Content-Type': 'text/plain' }})
      .then(resp => resp.text())
      .then(text => expect(text.startsWith('#version 300 es')).toBeTruthy())
  })
})

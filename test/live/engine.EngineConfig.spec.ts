import { loadConfig  } from '@engine/EngineConfig'
import { isError     } from '@engine/util/Error'

describe('engine.EngineConfig', () => {

  describe('engine.EngineConfig.loadConfig', () => {

    it('it can load the application config file', async () => {
      return loadConfig()
        .then(result => expect(isError(result)).toBe(false))
    })
  })
})

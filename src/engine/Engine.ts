import { type BuildInfo,
         type BuildMode  } from './EngineConfig'
import { fail,
         FatalError,
         flattenErrors,
         isError         } from '@engine/util/Error'

import { ResourceLoader  } from '@engine/util/ResourceLoader'

/** The engine configuration schema. */
export type EngineConfig = {
  build      : BuildInfo,
  baseUrl    : string,
  loopOnce?  : boolean,
  showDebug? : boolean,
}

/** */
export class TEngine
{
  static async loadBaseConfig(): Promise<EngineConfig>
  {
    const path = '/app.config.json'
    const opts = { headers: { 'Content-Type' : 'application/json' }}

    return Promise.resolve(ResourceLoader.baseUrl)
      .then(async result => new URL(path, result))
      .then(async result => ResourceLoader.load(result, opts))
      .then(async result => isError(result) ? fail(result) : result.json())
      .catch(error => {
        fail(flattenErrors(
          new FatalError('failed to load base configuration'),
          error
        ))
      })
  }
}

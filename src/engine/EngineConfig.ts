import { isError,        } from '@engine/util/Error'
import { ResourceLoader  } from '@engine/util/ResourceLoader'


export type BuildMode = 'development' | 'production'

export type BuildInfo = {
  mode: BuildMode,
  date: Date,
  vers: string
}

/** The engine configuration schema. */
export type EngineConfig = {
  build      : BuildInfo,
  baseUrl    : string,
  loopOnce?  : boolean,
  showDebug? : boolean,
}

/** Loads the build-time generated engine config */
export const loadConfig = async (): Promise<EngineConfig | Error> =>
{
  const path = '/app.config.json'
  const opts = { headers: { 'Content-Type' : 'application/json' }}

  return Promise.resolve(ResourceLoader.baseUrl)
    .then(async result => isError(result) ? result : new URL(path, result))
    .then(async result => isError(result) ? result : await ResourceLoader.load(result, opts))
    .then(async result => isError(result) ? result : await result.json())
}

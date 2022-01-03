import { concatErrors,
         Error,
         fail,
         isError,
         type IError } from '@engine/util/Errors'

/**
 * Gets the origin from which application is being hosted:
 *  - `globalThis.location` if executed in a browser
 *  - `process.env.BASE_URL if executed in node
 *     (i.e. corresponding to the base URL of the test server)
 * @returns The base URL of the local host
 */
export function getBaseUrl(): string | IError<'CONFIG_ERROR'>
{
  return (globalThis?.location as unknown) as string
    ?? process?.env?.BASE_URL
    ?? new Error('CONFIG_ERROR', 'failed to determine baseUrl')
}

/**
 * Returns true if the response's status code is 200
 * @param res The result of a call to fetch
 */
export const isSuccessResponse = (res: Response) =>
  res.status === 200

/**
 * Fetches a resource from the given URL
 */
export class ResourceLoader
{
  private static _baseUrl: string
  static get baseUrl() { return this._baseUrl }

  static {
    const result = getBaseUrl()
    this._baseUrl  = !isError(result)
      ? result
      : fail(
        concatErrors(new Error('FATAL_ERROR', 'failed to determin baseUrl'), result)
      )
  }

  /**
   * A wrapper for the Javascript `fetch` global method
   * @param url The location to fetch from (see [here](https://developer.mozilla.org/en-US/docs/Web/API/URL/URL) for details)
   * @param options Request init options (see [here](https://developer.mozilla.org/en-US/docs/Web/API/Request/Request) for details)
   * @returns
   */
  static async load(url: URL, options?: RequestInit): Promise<Response|IError<'FETCH_ERROR'>>
  {
    return fetch(url.href, options)
      .then((response: Response) =>
        isSuccessResponse(response)
          ? response
          : new Error('FETCH_ERROR', `received [${response.status} - ${response.statusText}] for address ${url.href}`)
      )
  }

  /**
   * Loads a file relative to the root directory from which the application is served.
   * @param path The relative path of the resource to fetch
   * @param options Request init options (see [here](https://developer.mozilla.org/en-US/docs/Web/API/Request/Request) for details)
   * @returns
   */
  static async loadLocal(path: string, options?: RequestInit)
  {
    const url = new URL(path, this.baseUrl)
    return this.load(url, options)
  }

  /**
   *
   * @param path
   * @param options
   * @returns
   */
  static async loadAsset(path: string, options?: RequestInit)
  {
    const url = new URL(`/assets/${path}`, this.baseUrl)
    return this.load(url, options)
  }

}

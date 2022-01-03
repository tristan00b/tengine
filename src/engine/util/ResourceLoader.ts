import { Error,
         isError,
         type IError } from '@engine/util/Errors'

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
  /**
   * A wrapper for the Javascript `fetch` global method
   * @param url The location to fetch from (see [here](https://developer.mozilla.org/en-US/docs/Web/API/URL/URL) for details).
   * @param options Request init options (see [here](https://developer.mozilla.org/en-US/docs/Web/API/Request/Request) for details).
   * @returns
   */
  static async load(url: URL, options?: RequestInit): Promise<Response|IError<'FETCH_ERROR'>>
  {
    return fetch(url.href, options)
      .then((response: Response) =>
        isSuccessResponse(response)
          ? response
          : new Error('FETCH_ERROR', `${response.status}: ${response.statusText}`)
      )
  }
}

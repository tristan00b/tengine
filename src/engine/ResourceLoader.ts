export class ResourceLoader
{
  static load(url: URL, options?: RequestInit): Promise<Response>
  {
    return fetch(url.href, options)
  }
}

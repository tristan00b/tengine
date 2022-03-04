/** Interface for any class maintaining a WebGL resource that can be created and subsequently deleted. */
export interface Deletable<T>
{
  readonly location: T | null
  delete(context: WebGL2RenderingContext): void
}

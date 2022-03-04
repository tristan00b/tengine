import type { Deletable } from '@engine/types/Deletable'

/** Interface for any class maintaining a WebGL resource that requires binding/unbinding from the rendering context. */
export interface Bindable<T> extends Deletable<T>
{
  bind(context: WebGL2RenderingContext, target: GLenum, buffer: unknown): void
  unbind(context: WebGL2RenderingContext, target: GLenum): void
}

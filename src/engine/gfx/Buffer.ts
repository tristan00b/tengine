import { STATIC_DRAW   } from '@engine/gfx/constants'
import { BufferError
       , fail          } from '@engine/util/Error'
import { toHex         } from '@engine/util/Utilities'
import { type Bindable } from '@engine/types/Bindable'

/** Provides an interface to `WebGLBuffer` */
export class Buffer implements Bindable<WebGLBuffer>
{
  protected _location: WebGLBuffer | null

  constructor(context: WebGL2RenderingContext)
  {
    const location = context.createBuffer()
    this._location = location ?? fail('failed to acquire WebGLBuffer instance', BufferError)
  }

  /** Queries for a given parameter buffer parameter */
  static getParam(context: WebGL2RenderingContext,
    target: GLenum,
    pname: GLenum
  ): unknown
  {
    return context.getBufferParameter(target, pname)
  }

  /** Returns a reference to the internal `WebGLBuffer` object */
  get location() { return this._location }

  /** Binds the buffer to `target` */
  bind(context: WebGL2RenderingContext, target: GLenum)
  {
    context.bindBuffer(target, this.location)
  }

  /** Unbinds the buffer from `target` */
  unbind(context: WebGL2RenderingContext, target: GLenum)
  {
    context.bindBuffer(target, null)
  }

  /** Frees the internal `WebGLBuffer` object */
  delete(context: WebGL2RenderingContext)
  {
    /** @todo remove instrumentation when you get the answer. add comment if deleteBuffer null's out _location */
    const instrument = !!this._location
    context.deleteBuffer(this._location)
    if (instrument)
      console.debug(`this<buffer>._location was set to null by gl.deleteBuffer: ${ this._location == null }`)
    this._location = null
  }

  /** Creates and initializes the buffer's data store */
  data(context: WebGL2RenderingContext, target: GLenum, size:  GLsizeiptr,      usage?: GLenum): void
  data(context: WebGL2RenderingContext, target: GLenum, data?: BufferSource,    usage?: GLenum): void
  data(context: WebGL2RenderingContext, target: GLenum, data?: ArrayBufferView, usage?: GLenum, srcOffset?: GLuint, length?: GLuint): void
  data(
    context:     WebGL2RenderingContext,
    target:      GLenum,
    sizeOrData?: GLsizeiptr | BufferSource,
    usage:       GLenum = STATIC_DRAW,
    srcOffset:   GLuint = 0,
    length?:     GLuint
  ): void
  {
    try {
      if (ArrayBuffer.isView(sizeOrData)) {
        context.bufferData(target, sizeOrData, usage, srcOffset, length)
      } else {
        context.bufferData(target, sizeOrData, usage)
      }
    } catch(e) {
      fail('Buffer initialization failed' + typeof e === 'number' ? ` (error: ${ toHex(e as number) })` : '', BufferError)
    }
  }

  /** Creates and initializes a portion of the buffer's data store */
  subData(
    context:       WebGL2RenderingContext,
    target:        GLenum,
    data:          BufferSource,
    dstByteOffset: GLintptr,
    srcOffset:     GLuint = 0,
    length?:       GLuint
  ): void
  {
    try {
      if (ArrayBuffer.isView(data)) {
        context.bufferSubData(target, dstByteOffset, data, srcOffset, length)
      } else {
        context.bufferSubData(target, dstByteOffset, data)
      }
    } catch (e) {
      fail('Buffer initialization failed' + typeof e === 'number' ? ` (error: ${ toHex(e as number) })` : '', BufferError)
    }
  }
}

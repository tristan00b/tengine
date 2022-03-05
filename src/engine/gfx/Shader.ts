import { COMPILE_STATUS
       , FRAGMENT_SHADER
       , VERTEX_SHADER         } from '@engine/gfx/constants'
import { fail
       , isError
       , ShaderError
       , type FetchError       } from '@engine/util/Error'
import { ResourceLoader        } from '@engine/util/ResourceLoader'
import { defaultTemplateParser
       , toHex                 } from '@engine/util/Utilities'
import { type Deletable        } from '@engine/types/Deletable'

/** Valid shader types */
export type ShaderType =
  | typeof VERTEX_SHADER
  | typeof FRAGMENT_SHADER


/** Wraps the `WebGLShader` interface. */
export class Shader implements Deletable<WebGLShader>
{
  protected _location : WebGLShader | null
  protected _source?  : string
  protected _type     : ShaderType

  constructor(context: WebGL2RenderingContext, type: ShaderType)
  {
    const location = context.createShader(type)
    this._type     = type
    this._location = location || fail(
      new ShaderError(`shader creation failed (${ toHex(context.getError()) })`)
    )
  }

  get location() { return this._location }
  get type()     { return this._type     }

  delete(context: WebGL2RenderingContext)
  {
    context.deleteShader(this._location)
    this._location = null
  }

  /**
   * @param template The shader template to interpolate
   * @param replacements A dictionary of keys  and replacement values
   */
  static replace = defaultTemplateParser

  /** Fetches the source for a shader at the given resource path that is relative to `baseUrl`. */
  static async loadSource(context: WebGL2RenderingContext, type: ShaderType, path: string): Promise<string | FetchError>
  {
    const resp = await ResourceLoader.loadAsset(path, { headers: { 'Content-Type' : 'text/plain' }})
    return isError(resp) ? resp : await resp.text()
  }

  /** Attaches the shader source to the shader instance and compiles it. */
  static async compile(context: WebGL2RenderingContext, shader: Shader, source: string): Promise<Shader | ShaderError>
  {
    if (shader.location == null) return new ShaderError('attempted to compile uninitialized Shader')

    context.shaderSource(shader.location, source)
    context.compileShader(shader.location)

    return !Shader.getParam(context, shader, COMPILE_STATUS)
      ? new ShaderError(context.getShaderInfoLog(shader.location) as string)
      : shader
  }

  /** Queries for a shader for a given parameter. */
  static getParam(context: WebGL2RenderingContext, shader: Shader, pname: GLenum)
  {
    return shader.location
      ? context.getShaderParameter(shader.location, pname) as unknown
      : null
  }
}

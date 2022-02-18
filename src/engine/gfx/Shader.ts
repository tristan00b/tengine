import { COMPILE_STATUS,
         FRAGMENT_SHADER,
         VERTEX_SHADER    } from './constants'
import { Component        } from '@engine/ecs/Component'
import { fail,
         isError,
         ShaderError      } from '@engine/util/Error'
import { ResourceLoader   } from '@engine/util/ResourceLoader'
import { toHex            } from '@engine/util/Utilities'

/** Valid shader types */
export type ShaderType =
  | typeof VERTEX_SHADER
  | typeof FRAGMENT_SHADER

/**
 * Abstracts over the WebGLShader interface
 */
export class Shader extends Component
{
  static readonly mimeType = 'text/plain'

  protected _location : WebGLShader
  protected _source?  : string
  protected _type     : ShaderType

  get location() { return this._location }
  get type()     { return this._type     }

  constructor(context: WebGL2RenderingContext, type: ShaderType)
  {
    super()
    const location = context.createShader(type)
    this._type     = type
    this._location = location || fail(
      new ShaderError(`shader creation failed (${ toHex(context.getError()) })`)
    )
  }

  /** Queries for a shader for a given parameter. */
  static getParam(context: WebGL2RenderingContext, shader: Shader, pname: GLenum)
  {
    return context.getShaderParameter(shader.location, pname) as unknown
  }

  /**
   * Fetches the source for a shader at the given resource path that is relative to the `<webroot>`.
   */
  static async loadSource(context: WebGL2RenderingContext, type: ShaderType, path: string)
  {
    const resp = await ResourceLoader.loadAsset(path, { headers: { 'Content-Type' : Shader.mimeType }})
    return isError(resp) ? resp : await resp.text()
  }

  /** Attaches the shader source to the shader instance and compiles it. */
  static async compile(context: WebGL2RenderingContext, shader: Shader, source: string)
  {
    context.shaderSource(shader.location, source)
    context.compileShader(shader.location)

    return !Shader.getParam(context, shader, COMPILE_STATUS)
      ? new ShaderError(context.getShaderInfoLog(shader.location) as string)
      : shader
  }
}

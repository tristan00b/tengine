import { Component     } from '@engine/ecs/Component'
import { LINK_STATUS   } from '@engine/gfx/constants'
import { Shader        } from '@engine/gfx/Shader'
import { fail
       , ShaderError   } from '@engine/util/Error'
import { toHex         } from '@engine/util/Utilities'
import { type Bindable } from '@engine/types/Bindable'

export class ShaderProgram extends Component implements Bindable<WebGLProgram>
{
  _location : WebGLProgram | null

  constructor(context: WebGL2RenderingContext)
  {
    super()

    const location = context.createProgram()
    this._location = location || fail(
      `shader program creation failed (${ toHex(context.getError()) })`
    , ShaderError
    )
  }

  get location() { return this._location }

  /** Sets this shader as part of the rendering state. */
  bind(context: WebGL2RenderingContext)
  {
    context.useProgram(this._location)
  }

  /** Removes this shader from the rendering state. */
  unbind(context: WebGL2RenderingContext)
  {
    context.useProgram(null)
  }

  /** Frees the internal WebGLShader */
  delete(context: WebGL2RenderingContext)
  {
    context.deleteProgram(this._location)
    this._location = null
  }

  /** Queries for a shader for a given parameter. */
  static getParam(context: WebGL2RenderingContext, program: ShaderProgram, pname: GLenum)
  {
    return program.location
      ? context.getProgramParameter(program.location, pname) as unknown
      : null
  }

  /** Attaches the shaders to the program and links it. */
  static async link(
    context: WebGL2RenderingContext,
    program: ShaderProgram,
    shaders: [Shader, Shader]
  ): Promise<ShaderProgram | ShaderError>
  {
    if (program.location    == null) return new ShaderError('attempted to link uninitialized shader program')
    if (shaders[0].location == null) return new ShaderError('attempted to link ShaderProgram with uninitialized shader')
    if (shaders[1].location == null) return new ShaderError('attempted to link ShaderProgram with uninitialized shader')

    context.attachShader(program.location, shaders[0].location)
    context.attachShader(program.location, shaders[1].location)
    context.linkProgram(program.location)
    context.validateProgram(program.location)

    return !ShaderProgram.getParam(context, program, LINK_STATUS)
      ? new ShaderError(context.getProgramInfoLog(program.location) as string)
      : program
  }
}

import { type Bindable } from '@engine/gfx/Bindable'
import { fail
       , TextureError  } from '@engine/util/Error'

/** Wraps the `WebGLTexture` interface. */
export class Texture implements Bindable<WebGLTexture>
{
  protected _location: WebGLTexture | null
  protected _height = 0
  protected _width  = 0

  constructor(context: WebGL2RenderingContext)
  {
    const location = context.createTexture()
    this._location = location ?? fail('failed to acquire WebGLTexture instance', TextureError)
  }

  /** Returns a reference to the internal WebGLTexture object */
  get location() { return this._location }

  /** The width of the texture in pixels */
  get width() { return this._width }

  /** The height of the texture in pixels */
  get height() { return this._height }

  /** Binds the texture to a given target */
  bind(context: WebGL2RenderingContext, target: GLenum)
  {
    context.bindTexture(target, this.location)
  }

  /** Unbinds the texture from the given target */
  unbind(context: WebGL2RenderingContext, target: GLenum)
  {
    context.bindTexture(target, null)
  }

  /** Frees the internal `WebGLTexture` object */
  delete(context: WebGL2RenderingContext)
  {
    context.deleteTexture(this.location)
    this._location = null
  }

  /**
   * Initializes the texture's data store
   * @param context WebGL2 rendering context
   * @param target Specifies the texture's binding point
   * @param level The level of detail (level n is the nth mipmap, n=0 is the base mimmap)
   * @param intlfmt Specifies the colour format for the texture (see links for complete list)
   * @param width The width of the texture image
   * @param height The height of the texture image
   * @param fmt Specifies the format of the pixel data source (see links for complete list)
   * @param type Specifies the data type of the pixel data (see links for complete list)
   * @param data The pixel data source (see MDN link for complete list of types)
   * @param flipY Flips the source data along its vertical axis if true
   * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/texImage2D}
   * @see {@link https://www.khronos.org/registry/webcontext/specs/latest/2.0/#TEXTURE_TYPES_FORMATS_FROM_DOM_ELEMENTS_TABLE}
   */
  setData2D(
    context : WebGL2RenderingContext
  , target  : GLenum
  , level   : GLint
  , intlfmt : GLenum
  , width   : GLsizei
  , height  : GLsizei
  , fmt     : GLenum
  , type    : GLenum
  , data?   : ArrayBufferView
  , flipY   = false
  )
  {
    this._width = width
    this._height = height
    context.pixelStorei(context.UNPACK_FLIP_Y_WEBGL, flipY)
    context.texImage2D(target, level, intlfmt, width, height, /* border = */0, fmt, type, data ?? null)
  }

  /**
   * Generates a set of mipmaps for the texture
   * @param context WebGL2 rendering context
   * @param target Specifies the texture's binding point
   * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/generateMipmap}
   */
  static generateMipmap(context: WebGL2RenderingContext, target: GLenum)
  {
    context.generateMipmap(target)
  }

  /**
   * Gets the value for a given texture and parameter
   * @param context WebGL2 rendering context
   * @param target The binding point (e.g. `context.TEXTURE_2D`)
   * @param pname The parameter to query (e.g. `context.TEXTURE_MAG_FILTER`)
   */
  static getParamter(context: WebGL2RenderingContext, target: GLenum, pname: GLenum)
  {
    context.getTexParameter(target, pname)
  }

  /**
   * Sets a given texture parameter with an *floating-point* value
   * @param context WebGL2 rendering context
   * @param target The binding point (e.g. `context.TEXTURE_2D`)
   * @param pname The parameter to set (e.g. `context.TEXTURE_MIN_LOD`)
   * @param value The value with which to set the parameter
   * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/texParameter}
   */
  static setFloatParam(context: WebGL2RenderingContext, target: GLenum, pname: GLenum, value: GLfloat)
  {
    context.texParameterf(target, pname, value)
  }

  /**
   * Sets a given texture parameter with an *integer* value
   * @param context WebGL2 rendering context
   * @param target The binding point (e.g. `context.TEXTURE_2D`)
   * @param pname The parameter to set (e.g. `context.TEXTURE_MAX_LEVEL`)
   * @param value The value with which to set the parameter (N.B. some parameters,
   *   such as `context.TEXTURE_MAG_FILTER`, take a value corresponding to a `GLenum`, such as `context.LINEAR`)
   * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/texParameter}
   */
  static setIntegerParam(context: WebGL2RenderingContext, target: GLenum, pname: GLenum, value: GLint)
  {
    context.texParameteri(target, pname, value)
  }

  /**
   * Specifies the index of the texture unit to make active (i.e. `index==n` equates to `context.TEXTURE0+n`)
   * @param context WebGL2 rendering context
   * @param index The index of the texture unit to make active
   */
  static setActiveTexture(context: WebGL2RenderingContext, index: GLuint)
  {
    context.activeTexture(context.TEXTURE0 + index)
  }
}

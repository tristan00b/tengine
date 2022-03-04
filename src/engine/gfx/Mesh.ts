import { TRIANGLES
       , type FLOAT
       , type UNSIGNED_INT } from '@engine/gfx/constants'
import { fail
       , isError
       , flattenErrors     } from '@engine/util/Error'
import { isNonNullable     } from '@engine/util/Utilities'


/** Enumerates the types of vertex attributes */
export const enum VertexAttributeKind
{ POSITIONS
, NORMALS
, UVCOORDS
, COLOURS
}

/** Specifies a vertex attribute. */
export interface VertexAttributeDescriptor
{
  /** The type of the vertex attribtue. */
  kind: VertexAttributeKind

  /** The number of components per vertex. */
  size: 1 | 2 | 3 | 4

  /**  A constant value specifying how to interpret the data (currently only `FLOAT` and `UNSIGNED_INT` are supported). */
  type: FLOAT | UNSIGNED_INT

  /** A 1D buffer containing the data corresponding to `type` (e.g. `[x0, y0, z0, x1, y1, z1, ...]`). */
  data: Array<number> | ArrayBufferView

  /** Specifies whether to enable the attribute (default: `true`). */
  enabled?: boolean
}

export type VertexAttributeMap = Partial<Record<
  VertexAttributeKind
, VertexAttributeDescriptor
>>

/** Container class for specifying mesh data */
export class Mesh
{
  protected _attribs  : VertexAttributeMap
  protected _indices  : number[]
  protected _primtype : GLenum

  /**
   * @param attributes The specification for all attribute data associated with each
   * @param indices Array of indices for indexing into vertex attributes at draw time
   * @param primtype The primitive type used to draw the mesh (default: `gl.TRIANGLES`)
   * (see {@link https://developer.mozilla.org/en-US/docs/Web/API/WebGL_API/Constants#rendering_primitives})
   * @throws Throws `TypeError` on malformed attributes
   */
  constructor(attributes: VertexAttributeDescriptor[], indices: number[], primtype?: GLenum)
  {
    this._attribs  = { } as VertexAttributeMap
    this._indices  = indices
    this._primtype = primtype ?? TRIANGLES

    const errors = attributes
      .map(checkAttribute)
      .filter(isError)

    errors.length || fail(flattenErrors(...errors))

    this._attribs = attributes.reduce(
      (attribs, attribute) => (attribs[attribute.kind] = Object.assign({ enabled: true }, attribute), attribs)
    , {} as VertexAttributeMap
    )
  }

  /** The vertex indices to be used to draw the mesh. */
  get indices()  { return this._indices  }

  /** The primitive type to be used to draw the mesh. */
  get primtype() { return this._primtype }

  /**
   * Gets the `VertexAttributeDescriptor` corresponding to `type` if it exists, otherwise `null`.
   * @param type The type of the attribute descriptor to get
   */
  at(type: VertexAttributeKind): VertexAttributeDescriptor | undefined
  {
    return this._attribs[ type ]
  }

  /**
   * Disables the attribute for rendering if it exists on this instance
   * @param {VertexAttributeKind} type
   */
  disableAttribute(type: VertexAttributeKind)
  {
    const attr = this.at(type)
    isNonNullable(attr)
      ? attr.enabled = false
      : console.warn('Attempted to disable undefined attribute')
  }

  /**
   * Enables the attribute for rendering if it exists on this instance
   * @param {VertexAttributeKind} type
   */
  enableAttribute(type: VertexAttributeKind)
  {
    const attr = this.at(type)
    isNonNullable(attr)
      ? attr.enabled = true
      : console.warn('Attempted to enable undefined attribute')
  }

  /** Returns `true` if `VertexAttributeDescriptor` corresponding to `type` exists, otherwise `false`. */
  isAttributeDefined(type: VertexAttributeKind)
  { return isNonNullable(this.at(type)) }
}

/**
 * Checks the attribute, returning if is it found to be well-formed:
 * - The attribute specifies both a `type` and a `size` attribute
 * - The `type` corresponds to an attribute of the `VertexAttributeType` enum
 * - The `size` specifies a number of components from 1 to 4 inclusive
 * @private
 */
function checkAttribute(attribute: VertexAttributeDescriptor)
{
  const { size
        , data   } = attribute
  const { length } = data

  return length && length % size > 0
    ? attribute
    : new TypeError(`attribute data must non-empty and contain a multiple of \`size\` elements (got length: ${ length }, size: ${ size })`)
}

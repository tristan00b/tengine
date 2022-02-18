import { vec3,
         mat4,
         quat  } from 'gl-matrix'

/**
 * Generates 4x4 a matrix (M=RTS) for represening an object's 3D orientation
 */
export class Transform
{
  protected _translation: vec3
  protected _rotation: quat
  protected _scale: vec3
  protected _localTransform: mat4
  protected _worldTransform: mat4
  protected _isDirty: boolean

  constructor()
  {
    this._translation    = [0,0,0]
    this._rotation       = quat.identity(quat.create())
    this._scale          = [1,1,1]
    this._localTransform = mat4.identity(mat4.create())
    this._worldTransform = mat4.identity(mat4.create())
    this._isDirty        = false
  }

  /**
   * The translation component.
   * @default [0,0,0]
   */
  get translation()
  {
    return this._translation
  }
  set translation(translation)
  {
    this._isDirty = true
    this._translation = translation
  }

  /** Sets the translation component. */
  setTranslation(translation: vec3): this
  {
    this.translation = translation
    return this
  }

  /** The roation component. */
  get rotation()
  {
    return this._rotation
  }
  set rotation(rotation)
  {
    this._isDirty = true
    this._rotation = rotation
  }

  /** Sets the rotation component. */
  setRotation(rotation: quat): this
  {
    this.rotation = rotation
    return this
  }

  /**
   * The scale component
   * @default [1,1,1]
   */
  get scale()
  {
    return this._scale
  }
  set scale(scale)
  {
    this._isDirty = true
    this._scale = scale
  }

  /** Sets the scaLe component */
  setScale(scale: vec3): this
  {
    this.scale = scale
    return this
  }

  /** The the transform in object space. */
  get localTransform()
  {
    if (this._isDirty)
    {
      this._localTransform = mat4.fromRotationTranslationScale(
        mat4.create(),
        this._rotation,
        this._translation,
        this._scale
      )
      this._isDirty = false
    }

    return this._localTransform
  }

  /** The transform in world space. */
  get worldTransform()
  {
    return this._worldTransform
  }
  set worldTransform(transform)
  {
    this._worldTransform = transform
  }
}

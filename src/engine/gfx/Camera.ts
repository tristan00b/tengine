import { mat4, vec3 } from 'gl-matrix'

export interface LookatParams
{
  eye: vec3,
  at:  vec3,
  up:  vec3
}

export interface PerspectiveParams
{
  near:   number,
  far:    number,
  fovy:   number,
  aspect: number,
}

/**
 * Generates 4x4 lookat and perspective matrices
 */
export class Camera
{
  protected _eye:  vec3
  protected _at:   vec3
  protected _up:   vec3

  protected _lookat: mat4
  protected _lookatIsDirty: boolean

  protected _near:   number
  protected _far:    number
  protected _fovy:   number
  protected _aspect: number

  protected _perspective: mat4
  protected _perspectiveIsDirty: boolean

  constructor()
  {
    this._eye = [0,  0,  1]
    this._at  = [0,  0, -1]
    this._up  = [0,  1,  0]

    this._lookat = mat4.identity(mat4.create())
    this._lookatIsDirty = true

    this._near   = 0.1
    this._far    = 100
    this._fovy   = 60 * Math.PI/180
    this._aspect = 1.5
    this._perspective = mat4.identity(mat4.create())
    this._perspectiveIsDirty = true
  }

  // -------------------------------------------------------------------------------------------------------------------
  // Lookat
  //

  /** The location of the camera */
  get eye() { return this._eye }
  set eye(eye: vec3)
  {
    this.setLookat({ eye })
  }

  /** The location that the camera is looking at */
  get at() { return this._at }
  set at(at: vec3)
  {
    this.setLookat({ at })
  }

  /** The camera's up vector */
  get up() { return this._up }
  set up(up: vec3)
  {
    this.setLookat({ up })
  }

  /**
   * Gets lookat transform matrix
   * @readonly
   */
  get lookat()
  {
    if (this._lookatIsDirty)
    {
      this._lookat = computeLookatMatrix(this)
      this._lookatIsDirty = false
    }

    return this._lookat
  }

  /**
   * Sets the lookat tranform matrix
   * @param args
   * @param args.eye=[0,0,1] The camera's position in world coordinates
   * @param args.at=[0,0,-1] The position that the camera is looking at in world coordinates
   * @param args.up=[0,1,0]  A vector specifying the direction that the top of the camera points (often aligns with the y-axis)
   */
  setLookat({ eye, at, up }: Partial<LookatParams>): this
  {
    this._lookatIsDirty = true
    this._eye = eye ?? this._eye
    this._at  = at  ?? this._at
    this._up  = up  ?? this._up
    return this
  }

  // -------------------------------------------------------------------------------------------------------------------
  // Perspective
  //

  /**
   * The camera's near plane distance (setting triggers a matrix calculation; use {@link Camera.setPerspective} to avoid
   * triggering extra calculations by setting properties individually)
   * @default 0.1
   */
  get near() { return this._near }

  set near(near: number)
  {
    this.setPerspective({ near })
  }

  /**
   * The camera's far plane distance (setting triggers a matrix calculation; use {@link Camera.setPerspective} to avoid
   * triggering extra calculations by setting properties individually)
   * @default 100
   */
  get far() { return this._far }

  set far(far)
  {
    this.setPerspective({ far })
  }

  /**
   * The camera's y-axis field of view (setting triggers a matrix calculation; use {@link Camera.setPerspective} to
   * avoid triggering extra calculations by setting properties individually)
   * @default (60*Math.PI/180)
   */
  get fovy() { return this._fovy }

  set fovy(fovy)
  {
    this.setPerspective({ fovy })
  }

  /**
   * The camera's aspect ratio (setting triggers a matrix calculation; use {@link Camera.setPerspective} to avoid
   * triggering extra calculations by setting properties individually)
   * @default 1.5
   */
  get aspect() { return this._aspect }

  set aspect(aspect)
  {
    this.setPerspective({ aspect })
  }

  /**
   * Gets the perspective matrix
   * @readonly
   */
  get perspective()
  {
    if (this._perspectiveIsDirty)
    {
      this._perspective = computePerspectiveMatrix(this)
      this._perspectiveIsDirty = false
    }

    return this._perspective
  }

  /**
   * Sets the perspective projection matrix (triggers a matrix calculation)
   * @param args
   * @param args.near=0.1 The near plain distance
   * @param args.far=100 The far plane distance
   * @param args.fovy=(60 * Math.PI/180) The y-axis field of view (radians)
   * @param args.aspect=1.5 The aspect ratio (width/height)
   */
  setPerspective({ near, far, fovy, aspect }: Partial<PerspectiveParams>): this
  {
    // Set properties by priority: arg > currently set value > default value
    this._perspectiveIsDirty = true
    this._near   = near   ?? this._near
    this._far    = far    ?? this._far
    this._fovy   = fovy   ?? this._fovy
    this._aspect = aspect ?? this._aspect
    return this
  }
}


/** @private */
function computeLookatMatrix({ eye, at, up }: LookatParams)
{
  return mat4.lookAt(mat4.create(), eye, at, up)
}


/** @private */
function computePerspectiveMatrix({ fovy, aspect, near, far}: PerspectiveParams)
{
  return mat4.perspective(mat4.create(), fovy, aspect, near, far)
}

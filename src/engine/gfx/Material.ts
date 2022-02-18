import { vec3 } from 'gl-matrix'

/**
 * Basic Material class for storing mesh colour properties
 *
 * Constraints:
 * - Colour components `R`, `G`, `B` should be in range `[0, 1]`
 * - Shininess coefficient should be greater than or equal to `0`
 */
export class Material
{
  protected _ambient: vec3
  protected _diffuse: vec3
  protected _specular: vec3
  protected _shininess: number

  constructor()
  {
    this._ambient   = [0,   0,   0, ]
    this._diffuse   = [0.9, 0.9, 0.9]
    this._specular  = [0,   0,   0, ]
    this._shininess = 64
  }

  /**
   * The material's ambient reflectivity.
   * @default [0,0,0]
   */
  get ambient()
  {
    return this._ambient
  }
  set ambient(ambient)
  {
    this._ambient = ambient
  }

  /** Sets the material's ambient reflectivity. */
  setAmbient(ambient: vec3): this
  {
    this.ambient = ambient
    return this
  }

  /**
   * The material's diffuse reflectivity.
   * @default [0.9,0.9,0.9]
   */
  get diffuse()
  {
    return this._diffuse
  }
  set diffuse(diffuse)
  {
    this._diffuse = diffuse
  }

  /** Sets the material's diffuse reflectivity. */
  setDiffuse(diffuse: vec3): this
  {
    this.diffuse = diffuse
    return this
  }

  /**
   * The material's specular reflectivity.
   * @default [0,0,0]
   */
  get specular()
  {
    return this._specular
  }
  set specular(specular)
  {
    this._specular = specular
  }

  /** Sets the material's specular reflectivity. */
  setSpecular(specular: vec3): this
  {
    this.specular = specular
    return this
  }

  /**
   * The material's shininess coefficient.
   * @default 64
   */
  get shininess()
  {
    return this._shininess
  }
  set shininess(shininess)
  {
    this._shininess = shininess
  }

  /**
   * Sets the materials shininess
   */
  setShininess(shininess: number): this
  {
    this.shininess = shininess
    return this
  }
}

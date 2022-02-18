import { vec3 } from 'gl-matrix'


/**
 * A simple point-source light
 */
export class Light
{
  protected _position: vec3
  protected _colour: vec3

  constructor()
  {
    this._position = [0, 1, 1]
    this._colour   = [1, 1, 1]
  }

  /**
   * Gets the position of the light
   * @default [0,1,1]
   */
  get position()
  {
    return this._position
  }
  set position(position)
  {
    this._position = position
  }

  /** Sets the position of the light */
  setPosition(position: vec3): this
  {
    this.position = position
    return this
  }

  /**
   * Gets the colour of the light
   * @default [1,1,1]
   */
  get colour()
  {
    return this._colour
  }
  set colour(colour)
  {
    this._colour = colour
  }

  /** Sets the colour of the light */
  setColour(colour: vec3): this
  {
    this.colour = colour
    return this
  }
}

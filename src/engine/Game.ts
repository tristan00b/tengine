import { Scene
       , SceneConstructor } from '@engine/ecs/Scene'
import { ConfigError
       , fail             } from '@engine/util/Error'


/**
 * Defines `Game` configuration options.
 */
export interface GameOptions
{
  /** Sets whether to run the game loop once or indefinitely. */
  loopOnce?: boolean,

  /** Sets whether to display debug info or not. */
  showDebugInfo?: boolean,
}


/**
 * Provides an interface for controlling updates to on-screen debug information display.
 *
 * @remarks
 * Requires the following document markup:
 *
 * ```html
 * <debug-info>
 *   <frame-rate></frame-rate>
 *   <compute-time></compute-time>
 * </debug-info>
 * ```
 *
 * @todo Fail gracefully when markup is not found
 */
class DebugInfo
{
  protected _fps = 0
  protected _cpu = 0

  protected _fpsElement: HTMLElement
  protected _cpuElement: HTMLElement

  protected _isRunning = false
  protected _timeoutId = -1
  protected _interval  = 1000 // milliseconds

  /**
   * @param updatesPerSecond The frequency at which to update the debug info display.
   */
  constructor(updatesPerSecond = 1)
  {
    this._interval   = updatesPerSecond * 1000
    this._fpsElement = document.querySelector('debug-info > frame-rate') ?? fail('failed to acquire page element <frame-rate>', ConfigError)
    this._cpuElement = document.querySelector('debug-info > compute-time') ?? fail('failed to acquire page element <compute-time>', ConfigError)
  }

  /**
   * Sets the frame rate display value.
   */
  set fps(value: number)
  {
    this._fps = 0.5 * (value + this._fps)
  }

  /**
   * Sets the frame cpu time display value.
   */
  set cpu(value: number)
  {
    this._cpu = 0.5 * (value + this._cpu)
  }

  /**
   * Starts updates to the debug info display.
   */
  start()
  {
    this._isRunning = true
    this._timeoutId = setTimeout(this.loop.bind(this), this._interval)
  }

  /**
   * Halts updates to the debug info display.
   */
  stop()
  {
    this._isRunning = false
    clearTimeout(this._timeoutId)
  }

  /**
   * Updates the debug info display with the values set for framerate (`fps`) and frame cpu time (`cpu`).
   */
  loop()
  {
    const fps = this._fps.toFixed(2)
    const cpu = this._cpu.toFixed(2)
    const max = Math.max(fps.length, cpu.length)

    this._fpsElement.innerText = `${ fps.padStart(max, '0') } fps`
    this._cpuElement.innerText = `${ cpu.padStart(max, '0') } ms `

    this._isRunning && (this._timeoutId = setTimeout(this.loop.bind(this), this._interval))
  }
}


/**
 * `Game` is intended to be used as the entry point for your application. Typically you will want to sublass
 * `Game` in order to run any aditional setup that your game requires (e.g. within your subclass' constructor).
 */
export class Game
{
  protected _isRunning = false
  protected _frameId = -1

  protected _loopOnce = false
  protected _showDebugInfo = false
  protected _debugInfo: DebugInfo

  protected _scene!: Scene

  /**
   * @param context The context to be used in rendering
   * @param options Any options needed for configuring the engines
   */
  constructor(context: WebGL2RenderingContext, MakeSene: SceneConstructor, options?: GameOptions)
  {
    this._loopOnce = options?.loopOnce ?? false
    this._showDebugInfo = options?.showDebugInfo ?? false
    this._debugInfo = new DebugInfo()

    Promise.resolve(MakeSene(context))
      .then(this.enterScene.bind(this))
      .catch()
  }

  /** Sets the currently playing scene. */
  enterScene(scene: Scene)
  {
    this._scene = scene
  }

  /**
   * Starts the game loop.
   */
  start()
  {
    this._isRunning = !this._loopOnce
    this._debugInfo.start()
    this.requestAnimationFrame(0)
  }

  /**
   * Stops the game loop.
   */
  stop()
  {
    this._isRunning = false
    this._debugInfo.stop()
    window.cancelAnimationFrame(this._frameId)
  }

  /**
   * The main update method. You should not need to override this if you are working with the engine's built-in
   * entity-component system (ecs).
   *
   * @param dt The time elapsed since the previous call
   */
  update(dt: number)
  {
    this._scene.update(dt)
  }

  /**
   * The game loop. This provides the game's 'heartbeat' by orchestrating critical machinery, such as tracking loop time,
   * triggering game-state updates, and requesting successive frame renders. Like `update` this method should also not
   * need to be overridden.
   *
   * @param t0 The time of the previous call to `loop`
   * @param t1 the time of the current call to `loop`
   */
  loop(t0: number, t1: number)
  {
    const now = Date.now()
    const dt = t1 - t0 || Number.MIN_VALUE

    this.update(dt)

    if (this._showDebugInfo)
    {
      this._debugInfo.fps = 1000/dt
      this._debugInfo.cpu = Date.now() - now
    }

    this._isRunning && this.requestAnimationFrame(t1)
  }

  /**
   * A convenience method for requesting the next frame (and call to `loop`). This method should also not need to be
   * called directly, as this is handled by `start` and `loop` respectively.
   *
   * @param t0 The time of the current call to `loop` (i.e. `t1` of `loop`'s call signature)
   */
  requestAnimationFrame(t0: number)
  {
    this._frameId = window.requestAnimationFrame(t1 => this.loop(t0, t1))
  }
}

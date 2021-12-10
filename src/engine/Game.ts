import { fail } from '@engine/Utilities'


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
  protected _fps: number = 0
  protected _cpu: number = 0

  protected _fpsElement: HTMLElement
  protected _cpuElement: HTMLElement

  protected _isRunning: boolean = false
  protected _interval: number   = 1000 // milliseconds

  /**
   * @param updatesPerSecond The frequency at which to update the debug info display.
   */
  constructor(updatesPerSecond:number = 1)
  {
    this._interval   = updatesPerSecond * 1000
    this._fpsElement = document.querySelector('debug-info > frame-rate') ?? fail('failed to acquire page element <frame-rate>')
    this._cpuElement = document.querySelector('debug-info > compute-time') ?? fail('failed to acquire page element <compute-time>')
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
    setTimeout(this.update.bind(this), this._interval)
  }

  /**
   * Halts updates to the debug info display.
   */
  stop()
  {
    this._isRunning = false
  }

  /**
   * Updates the debug info display with the values set for framerate (`fps`) and frame cpu time (`cpu`).
   */
  update()
  {
    let fps = this._fps.toFixed(2)
    let cpu = this._cpu.toFixed(2)
    let max = Math.max(fps.length, cpu.length)

    this._fpsElement.innerText = `${fps.padStart(max, '0')} fps`
    this._cpuElement.innerText = `${cpu.padStart(max, '0')} ms `
    this._isRunning && setTimeout(this.update.bind(this), this._interval)
  }
}



/**
 * `Game` is intended to be used as the entry point for your application. Typically you will want to sublass
 * `Game` in order to run any aditional setup that your game requires (e.g. within your subclass' constructor).
 */
export class Game
{
  protected _isRunning: boolean = false
  protected _frameId: number = -1

  protected _loopOnce: boolean = false
  protected _showDebugInfo: boolean = false
  protected _debugInfo: DebugInfo

  /**
   * @param context The context to be used in rendering
   * @param options Any options needed for configuring the engines
   */
  constructor(context: WebGL2RenderingContext, options?: GameOptions)
  {
    this._loopOnce = options?.loopOnce ?? false
    this._showDebugInfo = options?.showDebugInfo ?? false
    this._debugInfo = new DebugInfo()
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
    window.cancelAnimationFrame(this._frameId)
  }

  /**
   * The main update method. You should not need to override this if you are working with the engine's built-in
   * entity-component system.
   *
   * @remark
   * The arguments `t0` and `t1` are provided to `update` via the game loop method.
   *
   * @param t0 The time of the previous call to `loop`
   * @param t1 The time of the current call to `loop`
   */
  update(t0: number, t1: number)
  {
    const now = Date.now()

    // Update stuff...

    if (this._showDebugInfo)
    {
      this._debugInfo.fps = 1000/(t1 - t0)
      this._debugInfo.cpu = Date.now() - now
    }
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
    this.update(t0, t1)
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

import { Game        } from '@engine/Game'
import { Error,
         fail,
         type IError } from '@engine/util/Errors'


window.addEventListener('load', async () => {
  try {
    const canvas: HTMLCanvasElement =
      document.querySelector('#game-canvas') ??
        fail(new Error('FATAL_ERROR', 'failed to locate document canvas element'))

    const context: WebGL2RenderingContext =
      canvas?.getContext('webgl2') ??
        fail(new Error('FATAL_ERROR', 'failed to acquire WebGL2 rendering context'))

    const game = new Game(context, { loopOnce: false, showDebugInfo: true })

    game.start()
  }
  catch (err)
  {
    console.error(Error.toString(err as IError<string>))
  }
})

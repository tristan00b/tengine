import { Game       } from '@engine/Game'
import { fail,
         FatalError } from '@engine/util/Error'


window.addEventListener('load', async () => {
  try {
    const canvas: HTMLCanvasElement =
      document.querySelector('#game-canvas') ??
        fail(new FatalError('failed to locate document canvas element'))

    const context: WebGL2RenderingContext =
      canvas?.getContext('webgl2') ??
        fail(new FatalError('failed to acquire WebGL2 rendering context'))

    const game = new Game(context, { loopOnce: false, showDebugInfo: true })

    game.start()
  }
  catch (err)
  {
    console.error(err)
  }
})

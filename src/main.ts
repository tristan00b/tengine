import { Game        } from '@engine/Game'
import { Error,
         fail,
         type IError } from '@engine/util/Errors'

window.addEventListener('load', async () => {
  try {
    const canvas  = document.querySelector('#game-canvas') as HTMLCanvasElement ?? fail({ kind: 'APPLICATION_ERROR', message: 'failed to locate document canvas element' })
    const context = canvas?.getContext('webgl2') ?? fail({ kind: 'APPLICATION_ERROR', message: 'failed to acquire WebGL2 rendering context' })
    const game    = new Game(context, { loopOnce: false, showDebugInfo: true })

    game.start()
  }
  catch (err)
  {
    console.error(Error.toString(err as IError<any>))
  }
})

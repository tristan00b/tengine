/* main.ts */

import { Game } from '@engine/Game'
import { fail } from '@engine/Utilities'

window.addEventListener('load', () => {
  try {
    const canvas  = document.querySelector('#game-canvas') as HTMLCanvasElement ?? fail('failed to locate document canvas element')
    const context = canvas?.getContext('webgl2') ?? fail('failed to acquire WebGL2 rendering context')

    const game    = new Game(context, { loopOnce: false, showDebugInfo: true })

    game.start()
  }
  catch (err)
  {
    console.error(err)
  }
})

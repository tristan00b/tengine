import { Entity               } from '@engine/ecs/Entity'
import { ComponentConstructor } from '@engine/ecs/Component'
import { Scene                } from '@engine/ecs/Scene'


export function makeTestScene(entityCount: number, ...types: ComponentConstructor[]): Scene
{
  const scene = new Scene

  types.forEach(scene.registerComponentType.bind(scene))

  const entities = Array(entityCount).fill(undefined).map(_ => new Entity)

  entities.forEach(e => {
    scene.addEntity(e)
    types.forEach(Type => scene.setComponent(e, new Type))
  })

  return scene
}

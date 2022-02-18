import { Component        } from '@engine/ecs/Component'
import { Query,
         type QueryResult } from '@engine/ecs/Query'
import { makeTestScene    } from './helpers'

describe('engine.ecs.Query', () => {

  class ComponentA extends Component {}
  class ComponentB extends Component {}
  class ComponentC extends Component {}

  const entityCount = 10

  const types = [
    ComponentA,
    ComponentB,
    ComponentC
  ] as const

  const scene = makeTestScene(entityCount, ...types)
  const query = (new Query(...types)).run(scene)

  it('retrieves the desired component types', function () {

    const allComponentsFound =
      query.every(
        ([_Entity, components]: QueryResult<Component[]>) => components.length === types.length
      )

    expect(allComponentsFound).toBe(true)
  })
})

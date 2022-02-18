import { Component } from '@engine/ecs/Component'
import { Query     } from '@engine/ecs/Query'
import { System    } from '@engine/ecs/System'

import { makeTestScene } from './helpers'

class ComponentA extends Component
{
  constructor (public prop = 1)
  { super() }
}

class ComponentB extends Component
{
  constructor (public prop = 10)
  { super() }
}

describe('System', () => {

  const entityCount = 100
  const types = [ComponentA, ComponentB] as const
  const scene = makeTestScene(entityCount, ...types)

  it('Applies a callback to the entity components satisfied by a query', () => {

    const update =
      (dt: number, a: ComponentA, b: ComponentB) => { a.prop += b.prop }

    const query  = (new Query(ComponentA, ComponentB)).run(scene)
    const system = new System(query, update)

    system.update(0)

    const allEqualEleven = query
      .map(([_, compos]) => compos[0])
      .every(a => a.prop === 11)

    expect(allEqualEleven).toBe(true)
  })
})

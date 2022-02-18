import { Entity } from '@engine/ecs/Entity'

describe('engine.ecs.Entity', () => {

  const e0 = new Entity
  const e1 = new Entity
  const e2 = new Entity
  const e3 = new Entity

  const entities = [e0, e1, e2, e3]

  it('Is initialized with a unique ID', () => {
    const ids = entities.map(e => e.id)
    const haveUniqueIDs = (new Set(ids)).size === entities.length
    expect(haveUniqueIDs).toBe(true)
  })

  it('Can be initialized from an existing ID', () => {
    const ea = Entity.fromId(e0.id)
    expect(ea.id === e0.id).toBe(true)
  })

  it('Can be enabled/disabled', () => {
    expect(e0.isEnabled).toBe(true)

    e0.disable()
    expect(e0.isEnabled).toBe(false)

    e0.enable()
    expect(e0.isEnabled).toBe(true)
  })
})

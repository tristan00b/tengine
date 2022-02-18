import { Component,
         type ComponentConstructor } from '@engine/ecs/Component'

describe('engine.ecs', () => {

  class ComponentA extends Component  {}

  function passComponentType(Type: ComponentConstructor)
  {
    return Type
  }

  function processComponentType(Type: ComponentConstructor)
  {
    return new Type
  }

  describe('engine.ecs.Component', () => {
    it('It inherits from Component', () => {
      const c = new ComponentA
      expect(c instanceof Component).toBe(true)
    })

    it('Has class and instance name properties', () => {
      const componentA = new ComponentA
      expect(componentA.name).toBe('ComponentA')
      expect(ComponentA.name).toBe('ComponentA')
    })
  })

  describe('engine.ecs.ComponentConstructor', () => {
    it('It can be assigned to from Component', () => {
      const component = passComponentType(ComponentA)
      expect(component).toBeDefined()
    })

    it('It can construct a component instance', () => {
      const component = processComponentType(ComponentA)
      expect(component).toBeDefined()
    })
  })
})

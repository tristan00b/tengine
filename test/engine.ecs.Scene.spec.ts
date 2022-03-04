import { Component     } from '@engine/ecs/Component'
import { Entity        } from '@engine/ecs/Entity'
import { keyFrom
       , Scene         } from '@engine/ecs/Scene'
import { ShaderProgram } from '@engine/gfx/ShaderProgram'
import { id            } from '@engine/util/Utilities'

describe('engine.ecs.Scene', () => {

  describe('keyFrom', () => {
    it('handles shaders correctly', () => {
      const shaderProgram = ShaderProgram.prototype

      const allSame = keyFrom(ShaderProgram) === keyFrom(ShaderProgram)
                   && keyFrom(shaderProgram) === keyFrom(ShaderProgram)

      expect(allSame).toBe(true)

      const scene  = new Scene
      const entity = new Entity

      scene.registerComponentType(ShaderProgram)
      scene.addEntity(entity)
      scene.setComponent(entity, shaderProgram)

      expect(scene.isComponentTypeRegistered(ShaderProgram)).toBe(true)
      expect(scene.getComponent(entity, ShaderProgram) === shaderProgram).toBe(true)
      expect(scene.hasComponent(entity, ShaderProgram)).toBe(true)
    })
  })

  describe('Scene', () => {

    class C0 extends Component {}
    class C1 extends Component {}
    class C2 extends Component {}
    class C3 extends Component {}

    describe('Scene.hasEntity', () => {

      it('reports whether an entity has been added to the scene', () => {
        const scene   = new Scene
        const entity0 = new Entity
        const entity1 = new Entity

        /* eslint-disable */
        /* @ts-ignore     */
        scene._entities[ entity0.id ] = entity0
        /* eslint-enable */

        const expected = scene.hasEntity(entity0) && !scene.hasEntity(entity1)

        expect(expected).toBe(true)
      })
    })

    describe('Scene.addEntity', () => {

      it('Adds an entity to the scene', () => {
        const scene = new Scene
        const entity = new Entity

        scene.addEntity(entity)

        /* eslint-disable */
        /* @ts-ignore     */
        expect(scene.entities[ entity.id ]).toBeDefined()
        /* eslint-enable */
      })
    })

    describe('Scene.isComponentTypeRegistered', () => {

      it('Reports whether a component type has been registered', () => {
        const scene = new Scene

        /* eslint-disable */
        /* @ts-ignore     */
        scene._components[ keyFrom(C0) ] = []
        /* @ts-ignore     */
        scene._components[ keyFrom(C2) ] = []
        /* eslint-enable */

        const expected =  scene.isComponentTypeRegistered(C0)
                      && !scene.isComponentTypeRegistered(C1)
                      &&  scene.isComponentTypeRegistered(C2)
                      && !scene.isComponentTypeRegistered(C3)

        expect(expected).toBe(true)
      })
    })

    describe('Scene.registerComponentType', () => {

      it('registers component types', () => {
        const scene = new Scene
        scene.registerComponentType(C0)
        scene.registerComponentType(C2)

        /* eslint-disable */
        /* @ts-ignore     */  const expected =
        /* @ts-ignore     */      scene._components[ keyFrom(C0) ]
        /* @ts-ignore     */  && !scene._components[ keyFrom(C1) ]
        /* @ts-ignore     */  &&  scene._components[ keyFrom(C2) ]
        /* eslint-enable  */  && !scene._components[ keyFrom(C3) ]

        expect(expected).toBe(true)
      })

      it('does not re-register component types', () => {
        const scene = new Scene
        const success1 = scene.registerComponentType(C0)
        const success2 = scene.registerComponentType(C0)
        expect(success1 && !success2).toBe(true)
      })
    })

    describe('Scene.getEntity', () => {

      const ComponentType = class extends Component {}

      const scene = new Scene
      const e0    = new Entity,
            e1    = new Entity,
            e2    = new Entity
      const c0    = new ComponentType,
            c1    = new ComponentType,
            c2    = new ComponentType

      scene.registerComponentType(ComponentType)

      ;[e0, e1, e2].forEach(e => scene.addEntity(e))

      scene.setComponent(e0, c0)
      /* skip e1 */
      scene.setComponent(e2, c2)

      it('it can retrieve entities given their respective components', () => {
        const e0 = scene.getEntity(c0)
        const e1 = scene.getEntity(c1)
        const e2 = scene.getEntity(c2)

        expect(e0).toBeDefined()
        expect(e1).toBeNull()
        expect(e2).toBeDefined()
      })
    })

    describe('Scene.getComponent', () => {

      it('gets entity all components that have been set', () => {
        const scene  = new Scene
        const entity = new Entity
        const types  = [C0, C1, C2]

        types.forEach(Type => {
          scene.registerComponentType(Type)
          /* eslint-disable */
          /* @ts-ignore     */
          scene._components[ keyFrom(Type) ][ entity.id ] = new Type
          /* eslint-enable  */
        })

        const components = types.map(Type => scene.getComponent(entity, Type))

        const expected = components.reduce((acc, c, idx) =>
          /* eslint-disable */
          /* @ts-ignore     */
          acc && scene._components[ keyFrom(c) ][ entity.id ] instanceof c.constructor
          /* eslint-enable  */
        )

        expect(expected).toBe(true)
      })
    })

    describe('Scene.hasComponent', () => {

      it('tells whether and entity\'s component(s) have been set', function () {
        const scene = new Scene
        const entity = new Entity
        const types = [C0, C1, C2]

        types.forEach(Type => scene.registerComponentType(Type))
        /* eslint-disable */
        /* @ts-ignore     */
        types.forEach((Type, idx) => scene._components[ keyFrom(Type) ][ entity.id ] = new Type)
        /* eslint-enable  */

        // Unregistered component argument
        expect(scene.hasComponent(entity, C3)).toBe(false)

        // Registered component argument
        expect(scene.hasComponent(entity, C0)).toBe(true)
      })
    })

    describe('Scene.setComponent', () => {

      const scene  = new Scene
      const entity = new Entity
      const types  = [C0, C1, C2]
      const registeredTypesCount = types.length

      scene.addEntity(entity)
      types.forEach(scene.registerComponentType.bind(scene))

      it('sets all components whose types have been registered', function () {

        const actual = types
          .map(Type => (scene.setComponent(entity, new Type), Type))
          /* eslint-disable */
          /* @ts-ignore     */
          .map(Type => scene._components[ keyFrom(Type) ]?.[ entity.id ])
          /* eslint-enable  */
          .filter(id)

        expect(actual.length).toBe(registeredTypesCount)
      })

      it('does not set components of unregistered types', function () {
        const c3 = new C3
        scene.setComponent(entity, c3)
        /* eslint-disable */
        /* @ts-ignore     */
        expect(scene._components[ keyFrom(C3) ]).toBeUndefined()
        /* eslint-enable  */
      })

      it('does not set components on entities that have not yet been added', function () {
        const notAdded = new Entity
        scene.setComponent(notAdded, new C0)
        /* eslint-disable */
        /* @ts-ignore     */
        expect(scene._components[ keyFrom(C0) ][ notAdded.id ]).toBeUndefined()
        /* eslint-enable  */
      })
    })
  })
})

import { type Component      } from './Component'
import { type Entity         } from './Entity'
import { type System         } from './System'
import { NotImplementedError } from '@engine/util/Error'
import { fr
       , keyFrom             } from '@engine/util/Utilities'

export { keyFrom }

/** Type for synchonous Scene factory methods or functions. */
export interface SyncSceneFactory {
  (context: WebGL2RenderingContext): Scene
}

/** Type for asynchronous Scene factory methods or functions. */
export interface AsyncSceneFactory {
  (context: WebGL2RenderingContext): Promise<Scene>
}

/** Type for Scene factory methods or functions. */
export type SceneConstructor =
  | SyncSceneFactory
  | AsyncSceneFactory

/**
* A data structure for holding all ECS elements associated with a particular game scene
*/
export class Scene
{
  protected _entities   : Entity[]
  protected _components : Record<PropertyKey, Component[]>
  protected _systems    : System<Component[], (dt: number, ...args: any) => void>[]

  constructor()
  {
    this._entities   = []
    this._components = {}
    this._systems    = []
  }

  /**
   * The array of entities that have been added to the scene
   *
   * **Important**: Entities are stored in a *sparse* array, and thus the entity array's `length` property cannot be
   * assumed to be valid. Use {@link Scene#entityCount} to get the number of stored entities.
   */
  get entities() { return this._entities }

  /**
   * The number of entities that have been added to the scene. Use this property instead of `scene.entities.length`,
   * which cannot be relied upon to report the correct value (see {@link Scene#entities} for explanation).
   */
  get entityCount()
  {
    return this._entities.reduce((sum, e) => e ? sum+1 : sum, 0)
  }

  /** Returns the array of systems attached to this instance. */
  get systems() { return this._systems }

  /** Adds one or more enetities to the scene */
  addEntity(entity: Entity)
  {
    const hasEntity = this.hasEntity(entity)

    hasEntity
      ? console.warn(`Entity (id: ${ entity.id }) already added`)
      : this._entities[ fr(entity.id) ] = entity

    return !hasEntity
  }

  /** Tells whether an entity as been added to the scene */
  hasEntity(entity: Entity)
  {
    return !!this._entities[ fr(entity.id) ]
  }

  /**
   * Gets the entity associated with a given component, assuming the entity exists (via {@link Scene#addEntity}), the
   * component's type has been registered (via {@link Scene#registerComponentType}), and the component has been
   * associated with the entity (via {@link Scene#addEntity})
   */
  getEntity(component: Component): Entity | null
  {
    const key   = keyFrom(component.constructor)
    const index = this._components[key]?.findIndex(element => element === component)
    return this._entities[ index as number ] ?? null
  }

  /** Get all components of a single type */
  getComponentsOfType(Type: Component): Component[] | null
  {
    return this._components[ keyFrom(Type) ] ?? null
  }

  /** Queries whether a given `Component` type has been registered with this instance. */
  isComponentTypeRegistered(Type: Component): boolean
  {
    return keyFrom(Type) in this._components
  }

  /** Registers a new `Component` type. */
  registerComponentType(Type: Component)
  {
    const isRegistered = this.isComponentTypeRegistered(Type)

    isRegistered
      ? console.warn(`ComponentType ${ Type.name } already registered`)
      : this._components[keyFrom(Type)] = []

    return !isRegistered
  }

  /**
   * Sets the entity's component of type `component.constructor` to component, overwriting any previously set component
   * of the same type
   * @example
   * const c0 = new Component(...)
   * const c1 = new Component(...)
   * scene.setComponent(entity, c0) // => entity now has c0 associated with it
   * scene.setComponent(entity, c1) // => c0 has been overwritten with c1
   */
  setComponent(entity: Entity, component: Component)
  {
    const haveEntity = this.hasEntity(entity)
    const components = this._components[ keyFrom(component) ]

    if (haveEntity)
      if (components)
        components[ fr(entity.id) ] = component
      else
        console.warn(`Component types must be registered before use (received: ${ keyFrom(component) })`)
    else
      console.warn('Entity must be added prior to setting its components')
  }

  /**
   * This returns `true` if the given `Entity` has an instance of the specified component type associated with it,
   * otherwise false.
   */
  hasComponent(entity: Entity, Type: Component)
  {
    return !!this.getComponent(entity, Type)
  }

  /**
   * Gets the the instance for the specified Component type associated with a given `Entity`, if it exists, otherwise
   * null.
   */
  getComponent(entity: Entity, Type: Component): Component | null
  {
    return this._components[ keyFrom(Type) ]?.[ fr(entity.id) ] ?? null
  }

  /**
   * Adds the specified systems to the scene, checking that each one is an instance of `System`, and discarding those
   * that are not
   */
  addSystem<
    Cs extends Component[]
  , Callback extends (dt: number, ...args: [...Cs]) => void
  >(system: System<[...Cs], Callback>)
  {
    this._systems.push(system)
  }

  /**
   * Calls `update` on all systems that have been added to this scene with the time elapsed since the previous update
   * (Note that the time duration `dt` is expected to be provide by the JavaScript runtime, e.g. by
   * `window.requestAnimationFrame`)
   * @param dt The time duration (ms) since the last update
   */
  update(dt: number)
  {
    this._systems.forEach(system => system.update(dt))
  }

  /** @todo To be implemented */
  static deflate(): never
  {
    throw new NotImplementedError('deflate is not emplemented')
  }

  /** @todo To be implemented */
  static inflate(data: unknown): never
  {
    throw new NotImplementedError('inflate is not implemented')
  }
}

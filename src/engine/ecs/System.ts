import { type Component   } from './Component'
import { type QueryResult } from './Query'


/**
 * @param dt The amount of time that has elapsed since the previous call to this function
 * @param components The components associated with a given entity that are required for updating the
 */
export type ComponentUpdateCallback<Cs extends Component[]> = (dt: number, ...components: [...Cs]) => void

/**
 * Applies a callback to the entity components matched by a `Query` instance
 *
 * @example
 * const query = new Query(scene, ComponentTypeA, ComponentTypeB)
 * const callback = (dt, componentA, componentB) => {
 *   // do work with the states of componentA and componentB here...
 * }
 * const system = new System(query, callback)
 * ...
 * system.update(dt) // executes over all entities having instances of both ComponentTypeA and ComponentTypeB
 */
export class System<
  Cs extends Component[]
, Callback extends (dt: number, ...args: [...Cs]) => void
>
{
  protected _query: QueryResult<[...Cs]>[]
  protected _callback: Callback

  constructor(query: QueryResult<[...Cs]>[], callback: Callback)
  {
    this._query = query
    this._callback = callback
  }

  update(dt: number)
  {
    for (const [entity, components] of this._query)
    {
      entity.isEnabled && this._callback(dt, ...components)
    }
  }
}

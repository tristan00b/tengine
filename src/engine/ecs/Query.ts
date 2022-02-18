import { type Component,
         type ComponentConstructor } from './Component'
import { type Entity               } from './Entity'
import { type Scene                } from './Scene'

import { isNonNullable             } from '@engine/util/Utilities'
import { type InstanceTypes        } from '@engine/util/Types'


export type QueryResult<Cs extends Component[]>  = [Entity, [...Cs]]

/** Queries a scene for all entities having the specified component types associated */
export class Query<
  Ts extends ComponentConstructor[]
, Cs extends Component[] = InstanceTypes<Ts>
>
{
  protected readonly _types: [...Ts]

  /**
   * @param componentTypes The Component types to query for when run is called
   */
  constructor(...componentTypes: [...Ts])
  {
    this._types = componentTypes
  }

  /**
   * Runs queries a scene for all entities having each of the Component types that were specified at the time of
   * construction.
   */
  run(scene: Scene): QueryResult<[...Cs]>[]
  {
    const reducer = (acc: QueryResult<[...Cs]>[], entity: Entity) => {

      const entityComponents = this._types
        .map(type => scene.getComponent(entity, type))
        .filter(isNonNullable)

      const entityHasAllComponents =
        this._types.length === entityComponents.length

      if (entityHasAllComponents)
        acc.push([ entity, entityComponents ] as QueryResult<[...Cs]>)

      return acc
    }

    return scene.entities.reduce(reducer, [])
  }
}

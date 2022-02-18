/**
 * ECS Component base class
 *
 * Inherit from this class when defining new ECS component types.
 */
export class Component
{
  get name() {
    return this.constructor.name
  }
}

/** Entity component base class constructor interface */
export interface ComponentConstructor
{
  readonly name: string
  new (...args: any[]): Component
}

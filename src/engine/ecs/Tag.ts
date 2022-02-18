import { Component } from './Component'

/**
 * Used for grouping components by tag.
 * @example
 * const components = [...]
 * const pinkElephants = components.filter(c => c.isTag && isPinkElephant(c))
 */
export abstract class Tag extends Component
{
   static get isTag()
   {
     return true
   }

  get isTag()
  {
    return true
  }
}

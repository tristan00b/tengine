/* eslint-disable no-var */

/**
 * Expose node's process global to TypeScript
 * @internal
 */
declare var process

/**
 * @todo Remove with TypeScript 4.6
 * @internal
 */
 interface Array<T> {
  /**
   * Returns the item located at the specified index.
   * @param index The zero-based index of the desired code unit. A negative index will count back from the last item.
   */
  at(index: number): T | undefined;
}

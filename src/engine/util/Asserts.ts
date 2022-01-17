import { Error,
         type IError } from './Errors'

/**
 * Asserts the truthiness of a given `value`.
 */
export function assert<T>(value: T, e: IError<string>): asserts value
{
  if (!value) throw new Error(e.kind, e.message)
}

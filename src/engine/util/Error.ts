import { head,
         split            } from './Utilities'

import { fail,
         isError,
         isAggregateError } from 'typey-doo'

export { fail,
         isError,
         isAggregateError }

export * from './error/types'

/** Takes an error and returns a string representation in the form "<ErrorTypeName>: <ErrorMessage>" */
export function showError<E extends Error>(error: E): string
{
  return `${ error.constructor.name }: ${ error.message }`
}

/**
 * Takes a variable number error arguments and concatenates their messages, while preserving the type and stack of the
 * first argument.
 * @throws TypeError when called without arguments
 */
export function flattenErrors<E extends Error, Es extends E[]>(...errors: [...Es]): Es[0] | TypeError
{
  if (errors.length === 0) return new TypeError('No errors to flatten')

  const _flattenErrors = <Es extends Error[]>(errors: [...Es], prefix = ''): string[] =>
  {
    const reducer = (messages: string[], error: Error) =>
    messages.concat([
      prefix + showError(error),
      ...(isAggregateError(error) ? _flattenErrors(error.errors, prefix + '  ') : [])
    ])

    return errors.reduce(reducer, [])
  }

  const first = head(errors) as Es[0]

  return errors.length === 1
    ? first
    : Object.assign(
        Reflect.construct(first.constructor, [ _flattenErrors(errors).join('\n') ]),
        { stack: first.stack }
      )
}

/**
 * @param items
 * @returns A 2-tuple consisting of an array of errors, and an array of non-error elements
 */
export function splitErrors(items: unknown[])
{
  return split(isError, items)
}

/** Logs then returns `it`. */
export function trace<T>(it: T): T
{
  console.log(it)
  return it
}

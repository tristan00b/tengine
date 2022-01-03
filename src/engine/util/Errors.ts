import { split } from './Utilities'


export type ErrorKind =
  | 'BUFFER_ERROR'
  | 'CONFIG_ERROR'
  | 'FATAL_ERROR'
  | 'FETCH_ERROR'
  | 'SHADER_ERROR'
  | 'TYPE_ERROR'

/**
 * Provides a generic inferface for FP friendly error handling.
 */
export interface IError<E extends string>
{
  kind: E,
  message: string
}

/**
 * Implements `IError` in addition to providing `toString` methods for both itself and `IError` objects.
 */
export class Error<E extends string> implements IError<E>
{
  /**
   * @param kind A string representation of the error type (e.g. 'BUFFER_ERROR')
   * @param message The error message
   */
  constructor(
    public readonly kind: E,
    public readonly message: string
  )
  {
  }

  /**
   * @returns A string representation of the `Error` instance
   */
  toString(): string
  {
    return Error.toString(this)
  }

  /**
   * @param error Any object that implements Error
   * @returns A string representation of `error`
   */
  static toString<E extends string>(error: IError<E>): string
  {
    return `[${error.kind}] ${error.message}`
  }
}

/**
 * @param obj The object under test
 * @returns `true` if `obj` implements `IError`, otherwise `false`.
 */
export const isError = <E extends string>(obj: unknown): obj is IError<E> =>
  !!obj && typeof obj === 'object'
        && 'kind' in obj
        && 'message' in obj

/**
 * Concatenates one or more errors
 *
 * @example
 * ```ts
 * const e0 = { kind: 'A', message: 'Error message A' }
 * const e1 = { kind: 'B', message: 'Error message B' }
 * const e2 = { kind: 'C', message: 'Error message C' }
 *
 * const e3 = concatErrors(e0, e1, e2)
 *
 * e3.kind === 'A'
 * e3.message === 'Error message A'
 *              + '\n  [B] Error message B'
 *              + '\n  [C] Error message C'
 * ```
 *
 * @param fst The first error
 * @param rest Errors to concatenate with `fst`
 * @returns The concatenated error or TYPE_ERROR if no arguments given
 */
export const concatErrors = <E extends string>(...errors: IError<E>[]): IError<E | 'TYPE_ERROR'> =>
  errors.length === 0
    ? new Error('TYPE_ERROR', 'Attempt to concat errors on empty array')
    : new Error(errors[0].kind,
        [errors[0].message, ...errors.slice(1).map(Error.toString)].join('\n  '))


/**
 * A convenience function for emulating JavaScript throw expressions.
 *
 * Example:
 *
 * ```ts
 * condition || fail('Condition not met.')
 * ```
 *
 * @param msg The error message
 * @param ErrorType The error type to throw
 */
export function fail<E extends string>(error: IError<E>): never
{
  throw new globalThis.Error(Error.toString(error))
}

/**
 * @param items
 * @returns A 2-tuple consisting of an array of errors, and an array of non-error elements
 */
export const splitErrors = <E extends string>(items: unknown[]) => split<IError<E>>(isError, items)

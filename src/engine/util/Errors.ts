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
  static toString(error: IError<any>): string
  {
    return `[${error.kind}] ${error.message}`
  }
}

/**
 * @param obj The object under test
 * @returns `true` if `obj` implements `IError`, otherwise `false`.
 */
export const isError = <E extends string>(obj: unknown): obj is IError<E> =>
 !!((obj as IError<E>).kind && (obj as IError<E>).message)

/**
 * @param errors
 * @returns
 */
export const concatErrors = <E extends string>(...errors: IError<E>[]) =>
  new Error(
    errors[0].kind,
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
export function fail<E extends string>(...errors: IError<E>[]): never
{
  const err = concatErrors(...errors)
  throw new globalThis.Error(`${err}`)
}

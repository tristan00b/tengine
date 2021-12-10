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
export function fail(msg?: string, ErrorType: ErrorConstructor = Error): never
{
  throw new ErrorType(msg)
}

import { head
       , split            } from './Utilities'
import { fail
       , isError
       , isAggregateError } from 'typey-doo'


export { fail
       , isError
       , isAggregateError }


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


/* ------------------------------------------------------------------------------------------------------------------ *\
   Custom Error types
\* ------------------------------------------------------------------------------------------------------------------ */

/* eslint-disable @typescript-eslint/no-empty-interface */

export class BufferError extends Error
{
}

export interface BufferError extends Error
{
}

export interface BufferErrorConstructor extends ErrorConstructor
{
}

export class ConfigError extends Error
{
}

export interface ConfigError extends Error
{
}

export interface ConfigErrorConstructor extends ErrorConstructor
{
}

export class FatalError extends Error
{
}

export interface FatalError extends Error
{
}

export interface FatalErrorConstructor extends ErrorConstructor
{
}

export class FetchError extends Error
{
}

export interface FetchError extends Error
{
}

export interface FetchErrorConstructor extends ErrorConstructor
{
}


export class NotImplementedError extends Error
{
}

export interface NotImplementedError extends Error
{
}

export interface NotImplementedErrorConstructor extends ErrorConstructor
{
}

export class ShaderError extends Error
{
}

export interface ShaderError extends Error
{
}

export interface ShaderErrorConstructor extends ErrorConstructor
{
}

export class TextureError extends Error
{
}

export interface TextureError extends Error
{
}

export interface TextureErrorConstructor extends ErrorConstructor
{
}

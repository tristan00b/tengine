import { Error,
         type IError } from './Errors'

/**
 * Attempts to get the extension from a given path by splitting on the '.' character.
 * @param path
 * @returns The extension, if found
 */
export function extensionFromPath(path: string): string | IError<'TYPE_ERROR'> {
  const extension = path.split('.').pop()
  return (extension)
    ? extension // TS cannot determine this that this will never be undefined
                // See: https://github.com/microsoft/TypeScript/issues/47292
    : new Error('TYPE_ERROR', `Unable to determine extension for path (${ path })`)
}

/**
 * @param value A hexadecimal string optionally prefixed by '0x'
 * @returns A numeric representation of `value`
 */
 export function fromHex(value: string): number
 {
   return parseInt(value, 16)
 }

/**
 * @param value The number to convert to hex
 * @returns A hex string represention of `value`
 */
export function toHex(value: number): `0x${ string }`
{
  return `0x${ value.toString(16) }`
}

/**
 * Splits an array into two&mdash;the first of type `Kind[]` and the second of all remaining elements.
 * @param items The items from which you want to split out all instances of `Kind`
 * @param isKind Determes whether an element of `items` is of type `Kind`
 * @returns
 */
export function split<Kind>(isKind: (item: unknown) => item is Kind, items: unknown[]): [Kind[], unknown[]]
{
  const lft: Kind[]    = []
  const rgt: unknown[] = []

  items.forEach(item => isKind(item) ? lft.push(item) : rgt.push(item))

  return [lft, rgt]
}

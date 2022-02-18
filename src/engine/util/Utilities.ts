import { fr,
         to,
         type Head,
         type TaggedType,
         type Tail        } from 'typey-doo'

export { fr,
         to,
         type Head,
         type TaggedType,
         type Tail        }


/** Returns it's argument, as received */
export function id<T>(arg: T): T
{
  return arg
}

/**
 * Attempts to get the extension from a given path by splitting on the '.' character.
 * @param path
 * @returns The extension, if found
 */
export function extensionFromPath(path: string): string | TypeError {
  const extension = path.split('.').pop()
  return extension || new TypeError(`Unable to determine extension for path (${ path })`)
}

/** Returns the first element of an array, if it exists, otherwise undefined. */
export function head<Ts extends unknown[]>(items: [...Ts]): Head<[...Ts]>
{
  return items.at(0) as Head<Ts>
}

/** Returns the elements following the first element of an array, or `[]` if the array has less than 2 elements. */
export function tail<Ts extends unknown[]>(items: [...Ts])
{
  return items.slice(1) as Tail<Ts>
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

/** Type guard for arrays and buffer arrays */
export function isArray<T extends ArrayLike<unknown>|ArrayBufferLike>(it: object): it is T
{
  return Array.isArray(it) || isBufferArrayView(it)
}

/** Type guard for BufferArrayViews */
export function isBufferArrayView(it: object): it is ArrayBufferLike
{
  return 'byteLength' in it && 'byteOffset' in it
}

export function isNonNullable<T>(it: T): it is NonNullable<T>
{
  return (it ?? false) && true
}

/** Type guard for numbers */
export function isNumber(it: unknown): it is string
{
  return typeof it === 'number'
}

/** Type guard for strings */
export function isString(it: unknown): it is string
{
  return typeof it === 'string'
}

/**
 * Takes an object and derives a key (string) from its type.
 * @param obj The object to derive a key from
 */
export function keyFrom(obj: any): string
{
  // const _keyFrom = (obj: any) => obj instanceof Shader
  //  ? Shader.name
  //  : (obj?.name || obj?.constructor?.name || String(obj))
  const _keyFrom = (obj: any) =>
    (obj?.name || obj?.constructor?.name || String(obj))
  return Array.isArray(obj) ? _keyFrom( obj[0] ) : _keyFrom( obj )
}

/** Takes an n-ary predicate function and returns its negation. */
export function negate(f: (...args: unknown[]) => boolean)
{
  return (...args: unknown[]) => !f(...args)
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

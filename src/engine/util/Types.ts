/** String alias for signaling intent */
export type HexString = string

/**
 * @param value The number to convert to hex
 * @returns A string represention of `value` in hexadecimal
 */
export function toHex(value: number): HexString
{
  return `0x${value.toString(16)}`
}

/**
 * @param value A string representing a hexadecimal value
 * @returns An integer
 */
export function fromHex(value: HexString): number
{
  return parseInt(value, 16)
}

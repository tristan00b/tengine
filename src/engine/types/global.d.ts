/* eslint-disable no-var */

/**
 * Expose node's process global to TypeScript
 * @internal
 */
declare var process


interface ArrayBufferView {
  /** The number of elements of the array (i.e. byteLength / BYTES_PER_ELEMENT). */
  length: number
}


interface WebGL2RenderingContextOverloads
{
  // TS enforces null over undefined which incurs results in unnecessary
  // runtime checks to in order to narrow `sizeOrData`.
  bufferData(target: GLenum, sizeOrData: BufferSource | number | undefined, usage: GLenum): void;
}

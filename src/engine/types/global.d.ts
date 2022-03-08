/* eslint-disable no-var */

/**
 * Expose node's process global to TypeScript
 * @internal
 */
declare var process

interface WebGL2RenderingContextOverloads
{
  // TS enforces null over undefined which incurs results in unnecessary
  // runtime checks to in order to narrow `sizeOrData`.
  bufferData(target: GLenum, sizeOrData: BufferSource | number | undefined, usage: GLenum): void;
}

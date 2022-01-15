import { isArray,
         fromHex,
         toHex    } from '@engine/util/Utilities'


describe('engine.util.Utilities', () => {

  describe('engine.util.Utilities.isArray', () => {

    test('determines whether a value is an array', () => {
      expect(isArray({})).toBe(false)
      expect(isArray([])).toBe(true)
      expect(isArray(new Int8Array)).toBe(true)
    })
  })

  describe('engine.util.Utilities.fromHex', () => {

    test('converts a hexadecimal string to a number', () => {
      expect(fromHex('0x20')).toBe(32)
    })
  })

  describe('engine.util.Utilities.toHext', () => {

    test('converts a numeric value to a hexadecimal string', () => {
      expect(toHex(32)).toBe('0x20')
    })
  })
})

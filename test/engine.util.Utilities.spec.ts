import { fromHex,
         toHex    } from '@engine/util/Utilities'


describe('engine.util.Types', () => {

  const ival = 32
  const hexstr = '0x20'

  describe('engine.util.Types.fromHex', () => {

    test('Converts a hexadecimal string to a number', () => {
      expect(fromHex(hexstr)).toBe(ival)
    })
  })


  describe('engine.util.Types.toHext', () => {

    test('Converts a numeric value to a hexadecimal string', () => {
      expect(toHex(ival)).toBe(hexstr)
    })

  })

})

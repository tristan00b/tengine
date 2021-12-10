import * as util from '@engine/Utilities'

describe('engine.Utilities', () => {

  describe('engine.Utilities.fail', () => {


    test('zero argument call', () => {
      expect(() => util.fail()).toThrow()
    })


    test('One argument call', () => {
      const msg = 'An error has occurred'
      expect(() => util.fail(msg)).toThrow(msg)
    })


    test('Two argument call', () => {
      const msg = 'A type error has occurred'
      expect(() => util.fail(msg, TypeError)).toThrow(msg)
    })
  })

})

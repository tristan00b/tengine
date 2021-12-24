import { concatErrors,
         Error,
         fail,
         isError       } from '@engine/util/Errors'


describe('engine.Errors', () => {

  describe('engine.Errors.Error', () => {

    const kind     = 'BUFFER_ERROR'
    const message  = 'Buffer overflow!'
    const expected = `[${kind}] ${message}`
    const error    = new Error(kind, message)

    test('Can produce string representation of itself', () => {
      expect(`${error}`).toBe(expected)
    })

    test('Can produce string representation of IError', () => {
      expect(Error.toString(error as Error<typeof kind>)).toBe(expected)
    })
  })


  describe('engine.Errors.concatErrors', () => {

    const e0 = {
      kind    : 'Error',
      message : 'fatal: something broke'
    }

    const e1 = {
      kind    : 'RangeError',
      message : 'invalid array length',
    }

    const e2 = {
      kind    : 'SyntaxError',
      message : 'JSON.parse: bad parsing'
    }

    const expected = {
      kind    : 'Error',
      message : 'fatal: something broke\n'
              + '  [RangeError] invalid array length\n'
              + '  [SyntaxError] JSON.parse: bad parsing'
    }

    const result = concatErrors(e0, e1, e2)

    test('Preserves the first error\'s kind', () => {
      expect(result.kind).toBe(expected.kind)
    })

    test('Concatenates error messages', () => {
      expect(result.message).toBe(expected.message)
    })
  })


  describe('engine.Errors.fail', () => {

    const e0 = {
      kind    : 'SOME_KIND',
      message : 'An error has occurred'
    }

    const expected = `[${e0.kind}] ${e0.message}`

    test('Throws an error', () => {
      expect(() => fail(e0)).toThrow(expected)
    })
  })


  describe('engine.Errors.isError', () => {

    test('Correctly idendifies errors', () => {

      const e0 = {
        kind: 'Error',
        message: 'This is an error.'
      }

      const e1 = {
        kind: 'Error',
        message: ['Multiple', 'errors', 'have', 'occurred.']
      }

      const e2 = {
        success: true,
        result: 'This is not an error.'
      }

      const e3 = {
        kind: 'Error',
        description: 'This is not an error.'
      }

      const e4 = {
        hobbit: 'Bilbo Baggins',
        message: 'This is not an error.'
      }

      expect(isError(e0)).toBe(true)
      expect(isError(e1)).toBe(true)
      expect(isError(e2)).toBe(false)
      expect(isError(e3)).toBe(false)
      expect(isError(e4)).toBe(false)
    })
  })
})

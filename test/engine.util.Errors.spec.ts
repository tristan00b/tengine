import { concatErrors,
         Error,
         fail,
         IError,
         isError,
         splitErrors       } from '@engine/util/Errors'


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

    const e0: IError<'FATAL_ERROR'> = {
      kind    : 'FATAL_ERROR',
      message : 'fatal: something broke'
    }

    const e1: IError<'BUFFER_ERROR'> = {
      kind    : 'BUFFER_ERROR',
      message : 'invalid array length',
    }

    const e2: IError<'FETCH_ERROR'> = {
      kind    : 'FETCH_ERROR',
      message : 'JSON.parse: bad parsing'
    }

    const expected: IError<'FATAL_ERROR'> = {
      kind    : 'FATAL_ERROR',
      message : 'fatal: something broke\n'
              + '  [BUFFER_ERROR] invalid array length\n'
              + '  [FETCH_ERROR] JSON.parse: bad parsing'
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

    const e0: IError<'FATAL_ERROR'> = {
      kind    : 'FATAL_ERROR',
      message : 'An fatal error has occurred'
    }

    const expected = `[${e0.kind}] ${e0.message}`

    test('Throws an error', () => {
      expect(() => fail(e0)).toThrow(expected)
    })
  })


  describe('engine.Errors.isError', () => {

    test('Correctly idendifies errors', () => {

      const e0: IError<'FATAL_ERROR'> = {
        kind: 'FATAL_ERROR',
        message: 'This is an error.'
      }

      const e1 = concatErrors({
        kind: 'BUFFER_ERROR',
        message: 'Invalid operation.'
      }, e0)

      const e2 = {
        success: true,
        result: 'This is also not an error.'
      }

      const e3 = {
        kind: 'Error',
        description: 'This is also not an error.'
      }

      const e4 = {
        hobbit: 'Bilbo Baggins',
        message: 'This is a hobbit.'
      }

      expect(isError(e0)).toBe(true)
      expect(isError(e1)).toBe(true)
      expect(isError(e2)).toBe(false)
      expect(isError(e3)).toBe(false)
      expect(isError(e4)).toBe(false)
    })
  })


  describe('engine.Errors.splitErrors', () => {

    test('', () => {

      const items = [
        { p: 'prop', n: 0   },
        { a: 'a',    b: 'b' },
        new Error('BUFFER_ERROR', 'Buffer underrun'),
        new Error('SHADER_ERROR', 'Syntax error'   ),
        new Date(),
        new Error('CONFIG_ERROR', 'Missing schema' ),
        100,
      ]
      const numErrs = 3
      const numSucc = 4

      const [errs, succ] = splitErrors(items)

      expect(errs.length).toBe(numErrs)
      expect(succ.length).toBe(numSucc)
    })
  })
})

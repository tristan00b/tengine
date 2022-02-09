import { BufferError,
         ConfigError,
         FatalError,
         FetchError,
         flattenErrors,
         isError,
         ShaderError,
         splitErrors    } from '@engine/util/Error'

describe('engine.Errors', () => {

  const e0 = new FetchError('1st error')
  const e1 = new BufferError('2nd error')
  const e2 = new FatalError('3rd error')
  const e3 = new ShaderError('4th error')
  const a0 = new AggregateError([new ConfigError('A deeply nested error')], 'Somewhere in the bowels, there occurred')
  const a1 = new AggregateError([e1, e2, a0 ], 'Multiple errors in subroutine')

  describe('engine.Errors.flattenErrors', () => {

    const actual   = flattenErrors(e0, a1, e3)
    const expected = new FetchError(
      'FetchError: 1st error\n'
    + 'AggregateError: Multiple errors in subroutine\n'
    + '  BufferError: 2nd error\n'
    + '  FatalError: 3rd error\n'
    + '  AggregateError: Somewhere in the bowels, there occurred\n'
    + '    ConfigError: A deeply nested error\n'
    + 'ShaderError: 4th error'
    )

    test('Gives TypeError when no arguments provided', () => {
      const actual = flattenErrors()
      expect(actual instanceof TypeError).toBe(true)
    })

    test('Gives back original argument when only one provided', () => {
      const actual = flattenErrors(e0)
      expect(actual === e0).toBe(true)
    })

    test('Preserves the type of the first error', () => {
      expect(actual instanceof FetchError).toBe(true)
    })

    test('Preserves the stack trace of the first error', () => {
      expect(actual.stack).toBe(e0.stack)
    })

    test('Concats the error messages', () => {
      expect(actual.message).toBe(expected.message)
    })
  })

  describe('engine.Errors.isError', () => {

    test('Correctly idendifies errors', () => {
      const ex = flattenErrors(e0, e1)
      const ey = {
        message: 'This is not an error.'
      }
      expect(isError(e0)).toBe(true)
      expect(isError(a0)).toBe(true)
      expect(isError(ex)).toBe(true)
      expect(isError(ey)).toBe(false)
    })
  })

  describe('engine.Errors.splitErrors', () => {

    const [errors, others] = splitErrors(
      [ 'str', {}, e0, e1, new Date(), a0, 100 ]
    )

    const errorCount = 3
    const otherCount = 4

    test('splits errors out from a given array', () => {
      expect(errors.length).toBe(errorCount)
      expect(others.length).toBe(otherCount)
    })
  })
})

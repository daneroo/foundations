'use strict'
const fs = require('fs')
const { isError, preSeraialize } = require('..')

describe('@daneroo/error', () => {
  describe('isError', () => {
    test.each([
      // [name, expected, v],
      [ 'undefined', false, undefined ],
      [ 'false', false, false ],
      [ 'true', false, true ],
      [ '\'\'', false, '' ],
      [ 'string', false, 'string' ],
      [ '{}', false, {} ],
      [ '{a:1}', false, { a: 1 } ],
      [ '[]', false, [] ],
      [ '[1]', false, [1] ]
    ])('Check isError(%s) is %s', (name, expected, v) => {
      expect(isError(v)).toEqual(expected)
    })
    test.each([
      new Error(),
      new TypeError(),
      new SyntaxError(),
      new RangeError(),
      new URIError(),
      new ReferenceError(),
      new EvalError(),
      //   Error.prototype,
      TypeError.prototype,
      SyntaxError.prototype,
      RangeError.prototype,
      URIError.prototype,
      ReferenceError.prototype,
      EvalError.prototype,
      Object.create(Error.prototype)
    ])('Check isError(%s) is true', (error) => {
      expect(isError(error)).toEqual(true)
    })
  })

  describe('preSerialize', () => {
    describe('preSeraialize passthough (non-error)', () => {
      test.each([
      // [name, expected, v],
        [ 'undefined', false, undefined ],
        [ 'false', false, false ],
        [ 'true', false, true ],
        [ '\'\'', false, '' ],
        [ 'string', false, 'string' ],
        [ '{}', false, {} ],
        [ '{a:1}', false, { a: 1 } ],
        [ '[]', false, [] ],
        [ '[1]', false, [1] ]
      ])('Check preSeraialize(%s)', (name, expected, v) => {
        expect(preSeraialize(v)).toBe(v)
      })
    })

    describe('preSeraialize(error)', async () => {
      test.each([
      // [name, expected, v],
        [ 'Error(\'BAD!\')', Error('BAD!') ],
        [ 'new Error(\'BAD!\')', new Error('BAD!') ],
        [ 'new RangeError(\'BAD!\')', new RangeError('BAD!') ]
        //   [ 'fsError', fsError ]
      ])('Check preSeraialize(%s) looks like an error', (name, v) => {
        const out = preSeraialize(v)
        expect(Object.keys(out)).toEqual(expect.arrayContaining(['name', 'message', 'stack']))
      })

      test('Check preSeraialize(Error) - detailed', () => {
        const error = Error('Bad!')
        const out = preSeraialize(error)
        expect(Object.keys(out)).toEqual(expect.arrayContaining(['name', 'message', 'stack']))
        expect(out).toEqual(expect.objectContaining({
          name: 'Error',
          message: 'Bad!'
        // stack: expect.stringMatching(/Error/)
        }))
        //   expect(out.stack).toEqual('Error')
        expect(out.stack).toEqual(expect.stringMatching(/^Error: Bad!/))
        expect(out.stack).toEqual(expect.stringMatching(/at Object.Error/))
      })
      test('Check preSeraialize(error) for fs.readFile error', (done) => {
        const path = '/some/file/that/does-not-exist'
        fs.readFile(path, (error, data) => {
          const out = preSeraialize(error)
          expect(Object.keys(out)).toEqual(expect.arrayContaining(['name', 'message', 'stack', 'code']))
          expect(out).toEqual({
            name: 'Error',
            message: "ENOENT: no such file or directory, open '/some/file/that/does-not-exist'",
            code: 'ENOENT',
            stack: "Error: ENOENT: no such file or directory, open '/some/file/that/does-not-exist'"
          })
          done()
        })
      })
    })
  })
})

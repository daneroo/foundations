'use strict'

const { flat, shortstamp, prettify } = require('..').format

// const { MESSAGE } = require('triple-beam')
const MESSAGE = Symbol.for('message')
const SPLAT = Symbol.for('splat')

describe('@daneroo/logger', () => {
  describe('flat', () => {
    describe('basics', () => {
      test('flat() (default) sets info[MESSAGE]', () => {
        const info = invoke(
          flat(),
          { level: 'info', message: 'whatever' }
        )
        expect(info.level).toEqual('info')
        expect(info.message).toEqual('whatever')
        expect(info[MESSAGE]).toEqual('info whatever')
      })

      test('flat() shows { rest }', () => {
        const info = invoke(
          flat(),
          { level: 'info', message: 'whatever', [SPLAT]: ['something'] }
        )
        expect(info.level).toEqual('info')
        expect(info.message).toEqual('whatever')
        expect(info[MESSAGE]).toEqual('info whatever ["something"]')
      })
    })

    describe('options', () => {
      test.each([
        // [name, formatter, info, expected[Symbol(message)]],
        ['default', flat(), { level: 'info', message: 'hey' },
          'info hey'],
        ['pretty (str)', flat({ pretty: true }), { level: 'info', message: 'hey' },
          'info hey'],
        ['pretty (object)', flat({ pretty: true }), { level: 'info', message: { a: 1 } },
          'info {"a":1}'],
        ['pretty (error)', flat({ pretty: true }), { level: 'info', message: Error('Uh Oh!') },
          'info Error: Uh Oh!'],
        ['padded', flat({ padded: true }), { level: 'info', message: '    hey' },
          'info    hey'],
        ['timestamp', flat(), { level: 'info', message: 'hey', timestamp: '2018-11-27T03:31:06.006Z' },
          '2018-11-27T03:31:06.006Z info hey'],
        ['shortstamp padded', flat({ padded: true }), { level: 'info', message: '    hey', timestamp: 'T03:31:06.006Z' },
          'T03:31:06.006Z info    hey']
      ])('%s', (name, formatter, input, expected) => {
        const info = invoke(formatter, input)
        expect(info[MESSAGE]).toEqual(expected)
      })
    })

    // as called from log.info , reuse invoke from above, with possible [SPLAT] for rest
    function asCalled (fmt, input) {
      const [message, ...rest] = input
      const restMaybe = rest.length ? { [SPLAT]: rest } : {}
      const info = { level: 'info', message, ...restMaybe }
      return invoke(fmt, info)
    }
    describe('with parameters', () => {
      test.each([
        // [name, formatter, input, expected[Symbol(message)]],
        ['none', flat(), ['hey'], 'info hey'],
        ['string', flat(), ['hey', 'you'], 'info hey ["you"]'],
        ['string,string', flat(), ['hey', 'you', 'there'], 'info hey ["you","there"]'],
        ['string,{}', flat(), ['hey', 'you', '{a:1}'], 'info hey ["you","{a:1}"]']
      ])('%s', (name, formatter, input, expected) => {
        const info = asCalled(formatter, input)
        expect(info[MESSAGE]).toEqual(expected)
      })
    })
  })

  describe('shortstamp', () => {
    test('shortstamp() sets info.timestamp', () => {
      const info = invoke(
        shortstamp(),
        { level: 'info', message: 'whatever' }
      )
      expect(info).toEqual({
        level: 'info',
        message: 'whatever',
        // T04:20:40.157Z
        'timestamp': expect.stringMatching(/^T\d\d:\d\d:\d\d\.\d\d\dZ$/)
      })
    })
  })

  describe('prettify', () => {
    let rangeError
    try { Number(1).toPrecision(500) } catch (error) {
      rangeError = error
    }
    test.each([
      // [name, input , expected],
      ['string', 'hello', 'hello'],
      ['object', { a: 1 }, '{"a":1}'],
      ['Error', new Error('BAD!'), 'Error: BAD!'],
      ['RangeError', rangeError, 'RangeError: toPrecision() argument must be between 1 and 100']
    ])('%s', (name, input, expected) => {
      expect(prettify(input)).toEqual(expected)
    })
  })
})

// helpers

function invoke (fmt, input) {
  return fmt.transform({ ...input }, fmt.options)
}

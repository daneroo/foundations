'use strict'

// const logger = require('..')
const { flat, shortstamp, combo } = require('..').format

const winston = require('winston')
const stream = require('stream')
const os = require('os')

const MESSAGE = Symbol.for('message')

describe('@daneroo/logger - integration', () => {
  describe('transport - no format or transform', () => {
    test('stream', done => {
      const input = { [MESSAGE]: 'info hey' }
      const expected = 'info hey'

      const write = writeOneLineAndExpect(expected, done)

      const stream = writeable(write)
      const transport = new winston.transports.Stream({ stream })

      transport.log(input)
    })
  })

  describe('logger', () => {
    test('stream transport', done => {
      const input = ['info', 'hey']
      const expected = 'info hey'

      const write = writeOneLineAndExpect(expected, done)
      const format = flat()
      const logger = createLogger(write, format)

      logger.log(...input)
    })
  })

  describe('levels', () => {
    test.each([
    // [level],
      ['debug'],
      ['verbose'],
      ['info'],
      ['warn'],
      ['error']
    ])('level %s', (level, done) => {
      const input = [level, 'hey']
      const expected = `${level} hey`

      const write = writeOneLineAndExpect(expected, done)
      const format = flat()
      const logger = createLogger(write, format)

      logger.log(...input)
    })
  })

  describe('flat-options', () => {
    test.each([
      // [opts,expected],
      [{}, ['hey'], 'info hey'],
      [{}, ['  hey'], 'info   hey'],
      [{ padded: true }, [' hey'], 'info hey'],
      [{ pretty: true }, ['hey'], 'info hey'],
      [{ padded: true, pretty: true }, [' hey'], 'info hey']
    ])(`options %p %p`, (options, input, expected, done) => {
      const write = writeOneLineAndExpect(expected, done)
      const format = flat(options)
      const logger = createLogger(write, format)

      logger.info(...input)
    })
  })

  describe('combined with pad', () => {
    const { combine, padLevels } = winston.format
    test.each([
      // [opts,expected],
      ['flat()-info', flat(), ['info', 'hey'], 'info hey'],
      ['flat()-debug', flat(), ['debug', 'hey'], 'debug hey'],
      ['padded-flat()-info   ', combine(padLevels(), flat()), ['info', 'hey'], 'info     hey'],
      ['padded-flat()-debug  ', combine(padLevels(), flat()), ['debug', 'hey'], 'debug    hey'],
      ['padded-flat()-verbose', combine(padLevels(), flat()), ['verbose', 'hey'], 'verbose  hey'],
      ['padded-flat(pad)-info   ', combine(padLevels(), flat({ padded: true })), ['info', 'hey'], 'info    hey'],
      ['padded-flat(pad)-debug  ', combine(padLevels(), flat({ padded: true })), ['debug', 'hey'], 'debug   hey'],
      ['padded-flat(pad)-verbose', combine(padLevels(), flat({ padded: true })), ['verbose', 'hey'], 'verbose hey']
    ])(`%p`, (name, format, input, expected, done) => {
      const write = writeOneLineAndExpect(expected, done)
      const logger = createLogger(write, format)
      logger.log(...input)
    })
  })

  describe('combined colorize/pad', () => {
    const { combine, padLevels, colorize } = winston.format
    test.each([
      ['info hey   ', combine(colorize(), padLevels(), flat()), ['info', 'hey'], '\u001b[32minfo\u001b[39m     hey'],
      ['verbose hey', combine(colorize(), padLevels(), flat()), ['verbose', 'hey'], '\u001b[36mverbose\u001b[39m  hey'],
      ['info hey   ', combine(colorize(), padLevels(), flat({ padded: true })), ['info', 'hey'], '\u001b[32minfo\u001b[39m    hey'],
      ['verbose hey', combine(colorize(), padLevels(), flat({ padded: true })), ['verbose', 'hey'], '\u001b[36mverbose\u001b[39m hey']
    ])(`%p`, (name, format, input, expected, done) => {
      const write = writeOneLineAndExpect(expected, done)
      const logger = createLogger(write, format)
      logger.log(...input)
    })
  })

  describe('combined with timestamps', () => {
    const { combine, timestamp } = winston.format
    test.each([
      ['no timestamp', combine(flat()), ['info', 'hey'], 'info hey'],
      ['with timestamp', combine(timestamp(), flat()), ['info', 'hey'], expect.stringMatching(/^\d\d\d\d-\d\d-\d\dT\d\d:\d\d:\d\d\.\d\d\dZ info hey/)],
      ['with shortstamp', combine(shortstamp(), flat()), ['info', 'hey'], expect.stringMatching(/^T\d\d:\d\d:\d\d\.\d\d\dZ info hey/)]
    ])(`%p`, (name, format, input, expected, done) => {
      const write = writeOneLineAndExpect(expected, done)
      const logger = createLogger(write, format)
      logger.log(...input)
    })
  })

  describe('combo', () => {
    test.each([
      [{ }, ['info', 'hey'], expect.stringMatching(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z .*info.* hey/)],
      [{ color: false }, ['info', 'hey'], expect.stringMatching(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z info {4}hey/)],
      [{ color: false, padded: false }, ['info', 'hey'], expect.stringMatching(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z info hey/)],
      [{ color: false, local: true }, ['info', 'hey'], expect.stringMatching(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}[+-]\d{4} info {4}hey/)],
      [{ color: false, short: true }, ['info', 'hey'], expect.stringMatching(/^T\d{2}:\d{2}:\d{2}\.\d{3}Z info {4}hey/)],
      [{ color: false, local: true, short: true }, ['info', 'hey'], expect.stringMatching(/^T\d{2}:\d{2}:\d{2}\.\d{3}[+-]\d{4} info {4}hey/)],
      [{ }, ['info', 'hey'], expect.stringMatching(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z .*info.* hey/)]
    ])(`%p`, (opts, input, expected, done) => {
      // expect('2018-12-06T01:45:43.748Z info    hey').toEqual(expect.stringMatching(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z info {4}hey$/))
      // done()
      const write = writeOneLineAndExpect(expected, done)
      const logger = createLogger(write, combo(opts))
      logger.log(...input)
    })
  })
})

// helpers
// writeOneLineAndExpect is a writer which will assert the line content and call the done callback
function writeOneLineAndExpect (expected, done) {
  return function (raw) {
    // console.dir(JSON.stringify(raw.toString()))
    // in case we use a matcher
    if (typeof expected !== 'string') {
      expect(raw.toString()).toEqual(expected)
    } else {
      expect(raw.toString()).toEqual(`${expected}${os.EOL}`)
    }
    done()
  }
}
// took/modified these from winston test helpers
function createLogger (write, format, level = 'debug') {
  return winston.createLogger({
    level,
    format,
    transports: [
      new winston.transports.Stream({ stream: writeable(write) })
    ]
  })
}

function writeable (write) {
  return new stream.Writable({ write })
}

'use strict'

// const logger = require('..')
const { comboOpts } = require('..').transport

const winston = require('winston')
const stream = require('stream')
const os = require('os')

describe('@daneroo/logger - transport - integration', () => {
  describe('comboOps (for Stream instead of Console', () => {
    test.each([
      [{ }, ['info', 'hey'], expect.stringMatching(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z .*info.* hey/)]
      // [{ color: false }, ['info', 'hey'], expect.stringMatching(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z info {4}hey/)],
      // [{ color: false, padded: false }, ['info', 'hey'], expect.stringMatching(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z info hey/)],
      // [{ color: false, local: true }, ['info', 'hey'], expect.stringMatching(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}[+-]\d{4} info {4}hey/)],
      // [{ color: false, short: true }, ['info', 'hey'], expect.stringMatching(/^T\d{2}:\d{2}:\d{2}\.\d{3}Z info {4}hey/)],
      // [{ color: false, local: true, short: true }, ['info', 'hey'], expect.stringMatching(/^T\d{2}:\d{2}:\d{2}\.\d{3}[+-]\d{4} info {4}hey/)],
      // [{ }, ['info', 'hey'], expect.stringMatching(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z .*info.* hey/)]
    ])(`%p`, (opts, input, expected, done) => {
      // expect('2018-12-06T01:45:43.748Z info    hey').toEqual(expect.stringMatching(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z info {4}hey$/))
      // done()
      const write = writeOneLineAndExpect(expected, done)
      const logger = createLogger(write, comboOpts(opts))
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
function createLogger (write, opts) {
  return winston.createLogger({
    ...opts,
    transports: [
      new winston.transports.Stream({ stream: writeable(write) })
    ]
  })
}

function writeable (write) {
  return new stream.Writable({ write })
}

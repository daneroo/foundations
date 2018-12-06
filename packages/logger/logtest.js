'use strict'

// This is meant to exercise the fetch API
// Can use it to test under request error conditions

// dependencies - core-public-internal
// const { log } = require('@daneroo/logger')

// const { log } = require('./lib')

const { createLogger } = require('./lib')
// const log = createLogger({ color: true, level: 'debug', padded: true, local: false, short: false })
const log = createLogger({ color: true, level: 'debug', padded: true, local: true, short: true })

// const winston = require('winston')
// const { transport } = require('./lib')
// const log = winston.createLogger({
//   transports: [
//     transport.console({ color: true, level: 'debug', padded: true, local: false, short: false }),
//     new winston.transports.File({ filename: 'combined.log' })
//   ]
// })

main()
function main () {
  log.info('info msg')
  log.debug('debug msg')
  // log.info('msg', {a: {aa: 1.1}}, {b: 2})
  // log.info('msg', { a: { aa: 1.1 } }, { b: 2 }, { c: 2 })
  // log.info({a: 1})
  // log.info(new Error('BAD!'))
  // log.info('uh oh', new Error('BAD!'))
  // log.info('uh', 'oh', new Error('BAD!'))
  // log.info('uh', 'oh', new Error('BAD!'), 'thought so!')
  // log.info('uh', 'oh', 'thought so!', new Error('BAD!'))
}

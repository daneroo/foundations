
const winston = require('winston')
const format = require('./format')
const transport = require('./transport')

module.exports = {
  format,
  transport,
  createLogger,
  log: createLogger()
}

function createLogger (opts = {}) {
  return winston.createLogger({
    transports: [
      transport.console(opts)
    ]
  })
}

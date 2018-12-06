// These are preconfigure (and overrideable) transport/format combinations

const { transports, format } = require('winston')
const { selectTimestampFormat, flat } = require('./format')

module.exports = {
  console,
  comboOpts
}

// opts: ({ silent = false, level, color = true, padded = true, pretty = false, local = false, short = false }
function console (opts = {}) {
  return new transports.Console(comboOpts(opts))
}

// used for Console or Stream: decomposed for testing
function comboOpts ({ silent = false, level = 'debug', color = true, padded = true, pretty = false, local = false, short = false } = {}) {
  const combinedFormats = [
    ...(color ? [format.colorize()] : []),
    ...(padded ? [format.padLevels()] : []),
    selectTimestampFormat({ short, local }),
    flat({ padded, pretty })
  ]
  return {
    silent: silent,
    level: level,
    format: format.combine(...combinedFormats)
  }
}

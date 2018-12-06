'use strict'

// exports declared at bottom because my functions (shortstamp, flat) are wrapped at declaration time as
// const thingFormat = winston.format(((info,opts)=>{}))

// TODO(daneroo): can I remove these external dependencies

const jsonStringify = require('fast-safe-stringify') // add to dev and peer?
const { format } = require('winston')

const MESSAGE = Symbol.for('message')
const SPLAT = Symbol.for('splat')

// This is what's meat to be used
//  It combines all the fomatters
function combo ({ color = true, padded = true, pretty = false, local = false, short = false } = {}) {
  const combinedFormats = [
    ...(color ? [format.colorize()] : []),
    ...(padded ? [format.padLevels()] : []),
    selectTimestampFormat({ short, local }),
    flat({ padded, pretty })
  ]
  return format.combine(...combinedFormats)
}

// info.timestamp = T02:32:34.857Z
const shortstamp = format((info, opts) => {
  if (info && !info.timestamp) {
    info.timestamp = new Date().toISOString().slice(10) // T02:32:34.857Z
    info.timestamp = 'T02:32:34.857Z'
  }
  return info
})

// this return one of 4 formatters
function selectTimestampFormat ({ local = false, short = false } = {}) {
  var timeformat = short
    ? (local)
      ? format.timestamp({ format: 'THH:mm:ss.SSSZZ' }) // short and local
      : shortstamp() // short and UTC
    : (local)
      ? format.timestamp({ format: 'YYYY-MM-DDTHH:mm:ss.SSSZZ' }) // long and local
      : format.timestamp() // long and UTC, default
  return timeformat
}

// padded: indicates padLevels is used (and already has extra space before message)
const flat = format((info, { padded = false, pretty = false } = {}) => {
  let { level, message, timestamp } = info
  const rest = info[SPLAT]

  // console.dir(info, '\n')
  timestamp = (timestamp) ? timestamp + ' ' : ''

  if (pretty) {
    if (typeof message === 'object') {
      message = prettify(message)
    }
  }

  if (!padded) {
    message = ' ' + message
  }
  // console.log('++', jsonStringify(message))

  let stringifiedRest = (rest === undefined) ? '' : ' ' + jsonStringify(rest)

  info[MESSAGE] = `${timestamp}${level}${message}${stringifiedRest}`

  return info
})

// Better idea wrap error with serializable wrapper error type
//   TODO: apply isError and maybe preSerialize?
// gets applied to all objects message and ...rest
// if error: convert errors to useful string
// if object: remove top level {}, and []
function prettify (o) {
  if (o instanceof Error) {
    return o.toString()
  }
  if (typeof o === 'object') {
    return JSON.stringify(o)
    // return jsonStringify(o)
  }
  return o
}

module.exports = {
  combo,
  selectTimestampFormat,
  shortstamp,
  flat,
  prettify
}

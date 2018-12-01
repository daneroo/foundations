'use strict'

// TODO(daneroo): move export back to top
// TODO(daneroo): remove these external dependencies

const jsonStringify = require('fast-safe-stringify') // add to dev and peer?
const { format } = require('winston')

const MESSAGE = Symbol.for('message')
const SPLAT = Symbol.for('splat')

// info.timestamp = T02:32:34.857Z
const shortstamp = format((info, opts) => {
  if (!info.timestamp) {
    info.timestamp = new Date().toISOString().slice(10) // T02:32:34.857Z
  }
  return info
})

// padded: indicates padLevels is used (and already has extra space before message)
const flat = format((info, opts) => {
  const { padded, pretty } = opts
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
  format: {
    shortstamp,
    flat,
    prettify
  }
}

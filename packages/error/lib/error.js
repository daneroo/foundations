'use strict'

module.exports = {
  isError,
  preSeraialize
}
// https://github.com/yefremov/iserror
//  unable to get Coverage for Exception/DOMException
function isError (value) {
  switch (Object.prototype.toString.call(value)) {
    case '[object Error]': return true
    // case '[object Exception]': return true
    // case '[object DOMException]': return true
    default: return value instanceof Error
  }
}

//  make a JSON serializable Object from an error, otherwise return argumant unchangeds
function preSeraialize (value) {
  if (isError(value)) {
    const commonProperties = ['name', 'message', 'stack', 'code']
    const prepared = {}
    for (const property of commonProperties) {
      if (typeof value[property] === 'string') {
        prepared[property] = value[property]
      }
    }
    return prepared
  }
  return value
}

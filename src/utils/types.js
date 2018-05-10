'use strict'

// Is a plain object, including `Object.create(null)`
const isObject = function(val) {
  return val != null && (val.constructor === Object || val.constructor === undefined)
}

module.exports = {
  isObject,
}

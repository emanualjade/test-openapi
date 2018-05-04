'use strict'

const isObject = function(val) {
  return val != null && (val.constructor === Object || val.constructor === undefined)
}

module.exports = {
  isObject,
}

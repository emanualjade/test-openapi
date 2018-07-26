'use strict'

const { isDeepStrictEqual } = require('util')

const { addErrorHandler } = require('../errors')

// Tasks and config are constrained to JSON.
// Reasons:
//  - making sure return value is simple and serializable
//  - ensuring good reporting
//  - ensuring plugins can transfer it over network
//  - enforce that plugins are not returning functions.
//    Plugins should only return data/state.
//    If they want to return logic, they should export functions.
//    If they want to return bound functions, they should return the bound
//    argument and export the function separately.
// `startData` is not constrained to JSON, e.g. it can use sockets.
const checkJson = function({ value, getError }) {
  const copy = eClone({ value, getError })
  if (isDeepStrictEqual(value, copy)) {
    return
  }

  throw getError('')
}

const clone = function({ value }) {
  return JSON.parse(JSON.stringify(value))
}

const cloneHandler = function({ message }, { getError }) {
  throw getError(`: ${message}`)
}

const eClone = addErrorHandler(clone, cloneHandler)

module.exports = {
  checkJson,
}

'use strict'

const { capitalize } = require('lodash')

// Validation error
// Properties often assigned:
//  - `config` `{object}`: initial configuration object
//  - `plugins` `{string[]}`: list of loaded plugins
//  - `task` `{string}`: current task name
//  - `property` `{string}`: path to the property in the current task (if `task`
//    is defined) or in `config`
//  - `expected` `{value}`: expected value
//  - `actual` `{value}`: actual value
const throwError = function(type, message, properties) {
  const error = new Error(message)

  // We need to directly assign to keep `Error` prototype
  Object.assign(error, { type, [ERROR_SYM]: true }, properties)

  throw error
}

// Allow distinguishing between bugs and validation errors
const ERROR_SYM = Symbol('isValidationError')

// Return `getConfigError()`, etc. that call `throwError()` with a specific `type`
const getThrowErrors = function() {
  const funcs = TYPES.map(getThrowError)
  return Object.assign({}, ...funcs)
}

const TYPES = ['bug', 'config', 'specification', 'task', 'connect', 'response']

const getThrowError = function(type) {
  const name = `throw${capitalize(type)}Error`
  const func = throwError.bind(null, type)
  return { [name]: func }
}

const throwErrors = getThrowErrors()

module.exports = {
  ...throwErrors,
  ERROR_SYM,
}

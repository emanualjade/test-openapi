'use strict'

// Validation error
// Properties often assigned:
//  - `config` `{object}`: initial configuration object
//  - `plugins` `{string[]}`: list of loaded plugins
//  - `task` `{string}`: current task name
//  - `property` `{string}`: path to the property in the current task (if `task`
//    is defined) or in `config`
//  - `expected` `{value}`: expected value
//  - `actual` `{value}`: actual value
const throwError = function(message, properties) {
  const error = new Error(message)

  // We need to directly assign to keep `Error` prototype
  Object.assign(error, { [ERROR_SYM]: true }, properties)

  throw error
}

// Allow distinguishing between bugs and validation errors
const ERROR_SYM = Symbol('isValidationError')

module.exports = {
  throwError,
  ERROR_SYM,
}

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
class TestOpenApiError extends Error {
  constructor(message, properties) {
    super(message)

    Object.assign(this, properties)
  }
}

const throwError = function(message, properties) {
  throw new TestOpenApiError(message, properties)
}

module.exports = {
  TestOpenApiError,
  throwError,
}

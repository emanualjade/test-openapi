'use strict'

// Validation error
// Properties often assigned:
//  - `config` `{object}`: initial configuration object
//  - `plugins` `{string[]}`: list of loaded plugins
//  - `taskName` `{string}`: current task name
//  - `task` `{object}`: current task
//  - `property` `{string}`: path to the property in the current task (if `task`
//    is defined) or in `config`
//  - `expected` `{value}`: expected value
//  - `actual` `{value}`: actual value
class TestOpenApiError extends Error {
  constructor(message, properties) {
    super(message)

    Object.assign(this, properties, { name: 'TestOpenApiError' })
  }
}

module.exports = {
  TestOpenApiError,
}

'use strict'

// Validation error
// Properties often assigned:
//  - `config` `{object}`: initial configuration object
//  - `plugins` `{string[]}`: list of loaded plugins
//  - `plugin` `{string}`: plugin that triggered the error.
//    Will be `bug` if it was a bug in the library.
//    Will be `config` if it was outside of any plugin
//  - `taskName` `{string}`: current task name
//  - `task` `{object}`: current task
//  - `property` `{string}`: path to the property in `task`, `actual` or `config`
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

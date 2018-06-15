'use strict'

const { isSimpleSchema, getSimpleSchemaConstant } = require('../utils')

// Validation error
// Properties often assigned:
//  - `config` `{object}`: initial configuration object
//  - `plugins` `{string[]}`: list of loaded plugins
//  - `plugin` `{string}`: plugin that triggered the error.
//    Will be `bug` if it was a bug in the library.
//    Will be `config` if it was outside of any plugin
//    Will be `task` if a task failed
//  - `task` `{object}`: current task
//  - `property` `{string}`: path to the property in `task`, `actual` or `config`
//  - `actual` `{value}`: actual value
//  - `expected` `{value}`: expected value
//  - `schema` `{object}`: JSON schema v4 matched against `actual`
// Top-level error also has:
//  - `errors` `{array}`: all errors.
//    Will be single rror if no task was run, or if it's a bug
//  - `tasks` `{array}`: all tasks.
//    Will be empty array if no task was run, or if it's a bug
class TestOpenApiError extends Error {
  constructor(message, properties = {}) {
    super(message)

    Object.assign(this, properties, { name: 'TestOpenApiError' })

    addExpected({ obj: this, properties })
  }
}

// Tries to guess `error.expected` from simple `error.schema`
const addExpected = function({ obj, properties: { schema, expected } }) {
  if (expected !== undefined || !isSimpleSchema(schema)) {
    return
  }

  obj.expected = getSimpleSchemaConstant(schema)
}

module.exports = {
  TestOpenApiError,
}

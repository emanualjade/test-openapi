'use strict'

const { isSimpleSchema, getSimpleSchemaConstant } = require('../utils')

// Validation error
// Properties (all might not be present):
//  - `config` `{object}`: initial configuration object
//  - `plugins` `{string[]}`: list of loaded plugins
//  - `plugin` `{string}`: plugin that triggered the first error.
//  - `bug` `{boolean}`: true if it was a bug
//  - `task` `{object}`: current task
//  - `property` `{string}`: path to the property in `task`, `actual` or `config`
//  - `actual` `{value}`: actual value
//  - `expected` `{value}`: expected value
//  - `schema` `{object}`: JSON schema v4 matched against `actual`
// When all errors were thrown during task running, and there were not bugs,
// all above properties will be `undefined` (except `config`) and the following
// will be defined:
//  - `errors` `{array}`: all errors.
//  - `tasks` `{array}`: all tasks.
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

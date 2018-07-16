'use strict'

const { isSimpleSchema, getSimpleSchemaConstant } = require('../utils')

// Validation error
// Properties (all might not be present):
//  - `config` `{object}`: initial configuration object
//  - `plugins` `{string[]}`: list of loaded plugins
//  - `module` `{string}`: module that triggered the first error,
//     e.g. `plugin-PLUGIN` or `reporter-REPORTER`
//  - `bug` `{boolean}`: true if it was a bug
//  - `task` `{object}`: current task
//  - `property` `{string}`: path to the property in `task` or `config`
//    Always starts with either `task` or `config`
//  - `value` `{value}`: errored value
//  - `expected` `{value}`: expected value
//  - `schema` `{object}`: JSON schema v4 matched against `value`
// When all errors were thrown during task running, and there were not bugs,
// all above properties will be `undefined` (except `config`) and the following
// will be defined:
//  - `errors` `{array}`: all errors.
//  - `tasks` `{array}`: all tasks.
class TestOpenApiError extends Error {
  constructor(message, properties = {}) {
    super(message)

    validateProperties({ properties })

    Object.assign(this, properties, { name: 'TestOpenApiError' })

    addExpected({ obj: this, properties })
  }
}

// Enforce which properties can be attached to `error.*`
const validateProperties = function({ properties }) {
  Object.keys(properties).forEach(validateProperty)
}

const validateProperty = function(property) {
  if (VALID_PROPERTIES.includes(property)) {
    return
  }

  const validProperties = VALID_PROPERTIES.join(', ')
  throw new Error(
    `Error property '${property}' is invalid. The only valid error properties are: ${validProperties}`,
  )
}

const USER_VALID_PROPERTIES = ['property', 'value', 'expected', 'schema']
const CORE_VALID_PROPERTIES = [
  'config',
  'plugins',
  'module',
  'bug',
  'task',
  'tasks',
  'errors',
  'nested',
]
const VALID_PROPERTIES = [...USER_VALID_PROPERTIES, ...CORE_VALID_PROPERTIES]

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

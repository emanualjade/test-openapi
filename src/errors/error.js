'use strict'

const {
  isSimpleSchema,
  getSimpleSchemaConstant,
  getWordsList,
} = require('../utils')

// Error properties (all might not be present):
//  - `config` `{object}`: initial configuration object
//  - `plugins` `{string[]}`: list of loaded plugins
//  - `module` `{string}`: module that triggered the first error,
//     e.g. `plugin-PLUGIN` or `reporter-REPORTER`
//  - `bug` `{boolean}`: true if it was a bug
//  - `task` `{object}`: current task
//  - `property` `{string}`: path to the property in `task`, `config`, `plugin`
//    or `reporter`. Always starts with either of those.
//  - `value` `{value}`: errored value
//  - `expected` `{value}`: expected value
//  - `schema` `{object}`: JSON schema v4 matched against `value`
// When all errors were thrown during task running, and there were not bugs,
// all above properties will be `undefined` (except `config`) and the following
// will be defined:
//  - `errors` `{array}`: all errors.
//  - `tasks` `{array}`: all tasks.
class PropsError extends Error {
  constructor(message, properties = {}) {
    super(message)

    // Enforce which properties can be attached to `error.*`
    Object.keys(properties).forEach(validateProperty)

    const propertiesA = addExpected({ properties })

    this.name = 'PropsError'
    Object.assign(this, propertiesA)
  }
}

const validateProperty = function(property) {
  if (VALID_PROPERTIES.includes(property)) {
    return
  }

  const validProperties = getWordsList(VALID_PROPERTIES, { op: 'and' })
  throw new BugError(
    `Error property '${property}' is invalid. The only valid error properties are: ${validProperties}`,
    { value: property, expected: VALID_PROPERTIES },
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
const addExpected = function({ properties, properties: { schema, expected } }) {
  if (expected !== undefined || !isSimpleSchema(schema)) {
    return properties
  }

  const expectedA = getSimpleSchemaConstant(schema)
  return { ...properties, expected: expectedA }
}

// A normal error
class TestOpenApiError extends PropsError {
  constructor(...args) {
    super(...args)
    this.name = 'TestOpenApiError'
  }
}

// An error indicating a problem in the library or in a plugin.
// Note that any non `TestOpenApiError` error is considered a bug.
// Using `BugError` allows being more explicit and assigning
// `error.*` properties.
class BugError extends PropsError {
  constructor(...args) {
    super(...args)
    this.name = 'BugError'
  }
}

module.exports = {
  TestOpenApiError,
  BugError,
}

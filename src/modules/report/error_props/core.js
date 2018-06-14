'use strict'

const { isObject } = require('../../../utils')

// Core `errorProps` always present
const getCoreErrorProps = function({ error: { expected, actual, property, schema } }) {
  const schemaA = getJsonSchema({ schema })

  return {
    'Expected value': expected,
    'Actual value': actual,
    Property: property,
    'JSON schema': schemaA,
  }
}

const getJsonSchema = function({ schema }) {
  // Do not print JSON schemas which are simplistic, as they do not provide extra
  // information over `Expected value`
  if (isShortcut(schema)) {
    return
  }

  return schema
}

const isShortcut = function(schema) {
  return isObject(schema) && Array.isArray(schema.enum) && schema.enum.length === 1
}

module.exports = {
  getCoreErrorProps,
}

'use strict'

const { isSimpleSchema } = require('../../../utils')

// Core `errorProps` always present on error
const getCoreErrorProps = function({ error: { expected, actual, property, schema } = {} }) {
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
  if (isSimpleSchema(schema)) {
    return
  }

  return schema
}

module.exports = {
  getCoreErrorProps,
}

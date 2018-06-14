'use strict'

const { isSimpleSchema } = require('../../../utils')

// Add core `errorProps`
const addCoreErrorProps = function({ errorProps, task, noCore }) {
  if (noCore) {
    return errorProps
  }

  const coreErrorProps = getCoreErrorProps(task)
  // Merged with lower priority, and appear at beginning
  return [coreErrorProps, ...errorProps]
}

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
  addCoreErrorProps,
}

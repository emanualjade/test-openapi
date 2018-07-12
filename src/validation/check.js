'use strict'

const { TestOpenApiError } = require('../errors')

const { validateFromSchema } = require('./validate')

// Validate against JSON schema and on failure throw error with
// `error.schema|value|property` set accordingly
const checkSchema = function({ schema, value, propName, message }) {
  const { error, schema: schemaA, value: valueA, property } = validateFromSchema({
    schema,
    value,
    propName,
  })
  if (error === undefined) {
    return
  }

  throw new TestOpenApiError(`${message} ${error}`, { schema: schemaA, value: valueA, property })
}

module.exports = {
  checkSchema,
}

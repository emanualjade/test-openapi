'use strict'

const { TestOpenApiError } = require('../errors')

const { validateFromSchema } = require('./validate')

// Validate against JSON schema and on failure throw error with
// `error.schema|value|property` set accordingly
const checkSchema = function({ schema, value, name, message, target, props }) {
  const { error, schema: schemaA, value: valueA, property } = validateFromSchema({
    schema,
    value,
    name,
    target,
  })
  if (error === undefined) {
    return
  }

  const messageA = getMessage({ message, error })
  throw new TestOpenApiError(messageA, { schema: schemaA, value: valueA, property, ...props })
}

const getMessage = function({ message, error }) {
  const errorA = error.replace(/^ /, '')
  return `${message} is invalid: ${errorA}`
}

module.exports = {
  checkSchema,
}

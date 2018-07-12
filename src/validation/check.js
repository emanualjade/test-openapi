'use strict'

const { TestOpenApiError } = require('../errors')

const { validateFromSchema } = require('./validate')

// Validate against JSON schema and on failure throw error with
// `error.schema|value|property` set accordingly
const checkSchema = function({ schema, value, propName, message, target, props }) {
  const { error, schema: schemaA, value: valueA, property, path } = validateFromSchema({
    schema,
    value,
    propName,
    target,
  })
  if (error === undefined) {
    return
  }

  const messageA = getMessage({ message, error, path })
  throw new TestOpenApiError(messageA, { schema: schemaA, value: valueA, property, ...props })
}

const getMessage = function({ message, error, path }) {
  if (typeof message !== 'function') {
    return `${message} ${error}`
  }

  const messageA = message({ path })
  return `${messageA} ${error}`
}

module.exports = {
  checkSchema,
}

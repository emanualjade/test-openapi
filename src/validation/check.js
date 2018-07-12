'use strict'

const { TestOpenApiError } = require('../errors')

const { validateFromSchema } = require('./validate')

// Validate against JSON schema and on failure throw error with
// `error.schema|value|property` set accordingly
const checkSchema = function({ schema, value, name, propName, message, target, props }) {
  const { error, schema: schemaA, value: valueA, property, path } = validateFromSchema({
    schema,
    value,
    name,
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
  const errorA = error.replace(/^ /, '')

  if (typeof message !== 'function') {
    return `${message} ${errorA}`
  }

  const messageA = message({ path })
  return `${messageA} ${errorA}`
}

module.exports = {
  checkSchema,
}

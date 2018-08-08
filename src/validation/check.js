'use strict'

const { TestOpenApiError, BugError } = require('../errors')

const { validateFromSchema } = require('./validate')

// Validate against JSON schema and on failure throw error with
// `error.schema|value|property` set accordingly
const checkSchema = function({ schema, value, name, message = name, target, props, bug = false }) {
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
  const ErrorType = bug ? BugError : TestOpenApiError
  throw new ErrorType(messageA, { schema: schemaA, value: valueA, property, ...props })
}

const getMessage = function({ message, error }) {
  const errorA = error.replace(/^ /, '')
  return `${message} is invalid: ${errorA}`
}

module.exports = {
  checkSchema,
}

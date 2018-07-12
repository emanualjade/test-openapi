'use strict'

const { TestOpenApiError } = require('../../../errors')
const { validateFromSchema } = require('../../../validation')

// Validates response status code against OpenAPI specification
const validateStatus = function({
  validate: { status: schema = DEFAULT_STATUS },
  response: { status },
}) {
  if (schema === undefined) {
    return
  }

  checkSchema({ schema, value: status, propName: 'validate.status', message: 'Status code' })
}

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

const DEFAULT_STATUS = { type: 'integer', enum: [200] }

module.exports = {
  validateStatus,
}

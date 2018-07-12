'use strict'

const { TestOpenApiError } = require('../../../errors')
const { validateFromSchema } = require('../../../utils')

const { checkRequired } = require('./required')

// Validates response body against OpenAPI specification
const validateBody = function({ validate: { body: schema }, response: { body } }) {
  if (schema === undefined) {
    return
  }

  checkRequired({ schema, value: body, property: PROPERTY, name: NAME })

  if (body === undefined) {
    return
  }

  validateBodyValue({ schema, body })
}

const validateBodyValue = function({ schema, body }) {
  const { error, schema: schemaA, value: valueA, property } = validateFromSchema({
    schema,
    value: body,
    propName: PROPERTY,
  })
  if (error === undefined) {
    return
  }

  throw new TestOpenApiError(`${NAME} ${error}`, { schema: schemaA, value: valueA, property })
}

const PROPERTY = 'validate.body'
const NAME = 'Response body'

module.exports = {
  validateBody,
}

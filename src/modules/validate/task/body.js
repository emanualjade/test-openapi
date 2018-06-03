'use strict'

const { TestOpenApiError } = require('../../../errors')
const { validateFromSchema } = require('../../../utils')

const { validateRequiredBody } = require('./required')

// Validates response body against OpenAPI specification
const validateBody = function({ schemas: { body: schema }, response: { body } }) {
  if (schema === undefined) {
    return
  }

  validateRequiredBody({ schema, value: body })

  if (body === undefined) {
    return
  }

  validateBodyValue({ schema, body })
}

const validateBodyValue = function({ schema, body }) {
  const { error } = validateFromSchema({ schema, value: body })

  if (error === undefined) {
    return
  }

  const property = 'validate.body'
  throw new TestOpenApiError(`Response body${error}.`, { property, schema, actual: body })
}

module.exports = {
  validateBody,
}

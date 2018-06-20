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
  const { error } = validateFromSchema({ schema, value: body })
  if (error === undefined) {
    return
  }

  throw new TestOpenApiError(`${NAME}${error}.`, { property: PROPERTY, schema, value: body })
}

const PROPERTY = 'validate.body'
const NAME = 'Response body'

module.exports = {
  validateBody,
}

'use strict'

const { throwResponseError } = require('../../../errors')
const { validateFromSchema } = require('../../../utils')

const { validateRequiredBody } = require('./required')

// Validates response body against OpenAPI specification
const validateBody = function({ validate: { body: vBody }, response: { body } }) {
  if (vBody === undefined) {
    return
  }

  validateRequiredBody({ schema: vBody, value: body })

  if (body === undefined) {
    return
  }

  validateBodyValue({ vBody, body })
}

const validateBodyValue = function({ vBody, body }) {
  const { error } = validateFromSchema({ schema: vBody, value: body })

  if (error === undefined) {
    return
  }

  const property = 'response.body'
  throwResponseError(`Response body${error}.`, { property, expected: vBody, actual: body })
}

module.exports = {
  validateBody,
}

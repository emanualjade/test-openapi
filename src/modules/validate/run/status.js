'use strict'

const { TestOpenApiError } = require('../../../errors')
const { validateFromSchema } = require('../../../utils')

// Validates response status code against OpenAPI specification
const validateStatus = function({
  validate: { status: schema = DEFAULT_STATUS },
  response: { status },
}) {
  if (schema === undefined) {
    return
  }

  const { error } = validateFromSchema({ schema, value: status })
  if (error === undefined) {
    return
  }

  const property = 'validate.status'
  throw new TestOpenApiError(`Status code${error}.`, { property, schema, actual: status })
}

const DEFAULT_STATUS = { type: 'integer', enum: [200] }

module.exports = {
  validateStatus,
}

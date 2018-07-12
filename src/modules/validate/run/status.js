'use strict'

const { checkSchema } = require('../../../validation')

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

const DEFAULT_STATUS = { type: 'integer', enum: [200] }

module.exports = {
  validateStatus,
}

'use strict'

const { validateStatus } = require('./status')
const { validateHeaders } = require('./headers')
const { validateBody } = require('./body')
const { getValidateError } = require('./message')

// Validates response against OpenAPI specification
const validateResponse = function({ response, fetchRequest, fetchResponse }) {
  try {
    const status = validateStatus({ response, fetchResponse })
    const headers = validateHeaders({ response, fetchResponse })
    const body = validateBody({ response, fetchResponse })

    return { status, ...headers, body }
  } catch (error) {
    const message = getValidateError({ error, fetchRequest })
    throw new Error(message)
  }
}

module.exports = {
  validateResponse,
}

'use strict'

const { validateStatus } = require('./status')
const { validateHeaders } = require('./headers')
const { validateBody } = require('./body')
const { getValidateError } = require('./message')

// Validates response against OpenAPI specification
const validateResponse = function({ test, fetchRequest, fetchResponse }) {
  try {
    const status = validateStatus({ test, fetchResponse })
    const headers = validateHeaders({ test, fetchResponse })
    const body = validateBody({ test, fetchResponse })

    return { status, headers, body }
  } catch (error) {
    const message = getValidateError({ error, fetchRequest })
    throw new Error(message)
  }
}

module.exports = {
  validateResponse,
}

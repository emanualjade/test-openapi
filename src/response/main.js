'use strict'

const { addErrorHandler } = require('../errors')

const { validateStatus } = require('./status')
const { validateHeaders } = require('./headers')
const { validateBody } = require('./body')
const { validateResponseHandler } = require('./message')

// Validates response against OpenAPI specification
const validateResponse = function({ response, fetchResponse }) {
  const status = validateStatus({ response, fetchResponse })
  const headers = validateHeaders({ response, fetchResponse })
  const body = validateBody({ response, fetchResponse })

  return { status, ...headers, body }
}

const eValidateResponse = addErrorHandler(validateResponse, validateResponseHandler)

module.exports = {
  validateResponse: eValidateResponse,
}

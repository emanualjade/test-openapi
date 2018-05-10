'use strict'

const { validateStatus } = require('./status')
const { validateHeaders } = require('./headers')
const { validateBody } = require('./body')
const { getValidateError } = require('./message')

// Validates response against OpenAPI specification
const validateResponse = function({ test, fetchOpts, res: { resStatus, resHeaders, resBody } }) {
  try {
    validateStatus({ test, resStatus })
    validateHeaders({ test, resHeaders })
    validateBody({ test, resBody, resHeaders })
  } catch (error) {
    const message = getValidateError({ error, fetchOpts })
    throw new Error(message)
  }
}

module.exports = {
  validateResponse,
}

'use strict'

const { validateStatus } = require('./status')
const { validateHeaders } = require('./headers')
const { validateBody } = require('./body')
const { getValidateError } = require('./message')

// Validates response against OpenAPI specification
const validateResponse = function({ test, fetchOpts, res: { resStatus, resHeaders, resBody } }) {
  try {
    const status = validateStatus({ test, resStatus })
    const headers = validateHeaders({ test, resHeaders })
    const body = validateBody({ test, resBody, resHeaders })

    return { status, headers, body }
  } catch (error) {
    const message = getValidateError({ error, fetchOpts })
    throw new Error(message)
  }
}

module.exports = {
  validateResponse,
}

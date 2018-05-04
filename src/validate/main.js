'use strict'

const { validateResStatus } = require('./status')
const { validateResHeaders } = require('./headers')
const { validateResBody } = require('./body')
const { getValidateError } = require('./message')

// Validates response against OpenAPI specification
const validateRes = function({ test, fetchOpts, res: { resStatus, resHeaders, resBody } }) {
  try {
    validateResStatus({ test, resStatus })
    validateResHeaders({ test, resHeaders })
    validateResBody({ test, resBody, resHeaders })
  } catch (error) {
    const message = getValidateError({ error, fetchOpts })
    throw new Error(message)
  }
}

module.exports = {
  validateRes,
}

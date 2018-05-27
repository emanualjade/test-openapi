'use strict'

const { validateStatus } = require('./status')
const { validateHeaders } = require('./headers')
const { validateBody } = require('./body')

// Validates response against OpenAPI specification
const validateResponse = function({ validate, response, config: { dry } }) {
  if (dry) {
    return
  }

  validateStatus({ validate, response })
  validateHeaders({ validate, response })
  validateBody({ validate, response })
}

module.exports = {
  validateResponse,
}

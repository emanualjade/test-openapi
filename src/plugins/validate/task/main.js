'use strict'

const { validateStatus } = require('./status')
const { validateHeaders } = require('./headers')
const { validateBody } = require('./body')

// Validate response against `task.validate.*` JSON schemas
const validateResponse = function({ validate, response }) {
  validateStatus({ validate, response })
  validateHeaders({ validate, response })
  validateBody({ validate, response })
}

module.exports = {
  validateResponse,
}

'use strict'

const { pickSchemaByStatus } = require('./by_status')
const { validateStatus } = require('./status')
const { validateHeaders } = require('./headers')
const { validateBody } = require('./body')

// Validate response against `task.validate.*` JSON schemas
const validateResponse = function({ validate, call: { response } }) {
  const schemas = pickSchemaByStatus({ validate, response })

  validateStatus({ schemas, response })
  validateHeaders({ schemas, response })
  validateBody({ schemas, response })
}

module.exports = {
  validateResponse,
}

'use strict'

const { normalizeCase } = require('./case')
const { applyShortcuts } = require('./shortcut')
const { validateJsonSchemas } = require('./validate')
const { addByStatus } = require('./by_status')
const { validateStatus } = require('./status')
const { validateHeaders } = require('./headers')
const { validateBody } = require('./body')

// Validate response against `task.validate.*` JSON schemas
const validateResponse = function({ validate, call: { response } }) {
  const validateA = normalizeCase({ validate })

  const validateB = addByStatus({ validate: validateA, response })

  const validateC = applyShortcuts({ validate: validateB })

  validateJsonSchemas({ validate: validateC })

  validateStatus({ validate: validateC, response })
  validateHeaders({ validate: validateC, response })
  validateBody({ validate: validateC, response })
}

module.exports = {
  validateResponse,
}

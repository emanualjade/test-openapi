'use strict'

const { normalizeCase } = require('./case')
const { handleJsonSchemas } = require('./json_schema')
const { addByStatus } = require('./by_status')
const { validateStatus } = require('./status')
const { validateHeaders } = require('./headers')
const { validateBody } = require('./body')

// Validate response against `task.validate.*` JSON schemas
const run = function({ validate = {}, call, call: { response } = {} }) {
  if (call === undefined) {
    return
  }

  const validateA = normalizeCase({ validate })

  const validateB = addByStatus({ validate: validateA, response })

  const validateC = handleJsonSchemas({ validate: validateB })

  validateStatus({ validate: validateC, response })
  validateHeaders({ validate: validateC, response })
  validateBody({ validate: validateC, response })
}

module.exports = {
  run,
}

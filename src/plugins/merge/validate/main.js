'use strict'

const { getVStatus } = require('./status')
const { mergeVHeaders } = require('./headers')
const { mergeVBody } = require('./body')

// Merge `task.validate.*` into specification
const mergeValidate = function({ operation, validate }) {
  const status = getVStatus({ validate })
  const headers = mergeVHeaders({ operation, validate })
  const body = mergeVBody({ operation, validate })

  const validateA = { status, headers, body }
  return validateA
}

module.exports = {
  mergeValidate,
}

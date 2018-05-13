'use strict'

const { getResponseStatus } = require('./status')
const { mergeResponseHeaders } = require('./headers')
const { mergeResponseBody } = require('./body')

// Merge `test.response.*` into specification
const mergeResponse = function({ test: { operation, testOpts } }) {
  const status = getResponseStatus({ testOpts })
  const headers = mergeResponseHeaders({ operation, testOpts })
  const body = mergeResponseBody({ operation, testOpts })

  const response = { status, headers, body }
  return response
}

module.exports = {
  mergeResponse,
}

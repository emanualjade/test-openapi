'use strict'

const { getResponseStatus } = require('./status')
const { getResponseHeaders } = require('./headers')
const { getResponseBody } = require('./body')

// Parse `test.response.*`
const getResponse = function({ operation, testOpts }) {
  const responseStatus = getResponseStatus({ testOpts })
  const responseHeaders = getResponseHeaders({ operation, testOpts })
  const responseBody = getResponseBody({ operation, testOpts })

  const response = { status: responseStatus, headers: responseHeaders, body: responseBody }
  return response
}

module.exports = {
  getResponse,
}

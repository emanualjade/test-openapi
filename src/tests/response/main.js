'use strict'

const { getResponseStatus } = require('./status')
const { getResponseHeaders } = require('./headers')
const { getResponseBody } = require('./body')

// Parse `test.response.*`
const getResponse = function({ testOpts, operationObject, headers, schema }) {
  const responseStatus = getResponseStatus({ testOpts })
  const responseHeaders = getResponseHeaders({ headers, operationObject, testOpts })
  const responseBody = getResponseBody({ schema, testOpts })

  const response = { status: responseStatus, headers: responseHeaders, body: responseBody }
  return response
}

module.exports = {
  getResponse,
}

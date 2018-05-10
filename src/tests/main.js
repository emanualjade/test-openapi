'use strict'

const { findTests } = require('./traverse')
const { getOperationId } = require('./operation_id')
const { getRequests } = require('./request')
const { getResponseStatus, getResponseHeaders, getResponseBody } = require('./response')

// Returns lists of tests to perform
const getTests = function({ opts }) {
  const tests = findTests({ opts })

  const testsA = tests.map(normalizeTest)
  return testsA
}

// Normalize each combination of endpoint + response + parameters
// into something tests can use
const normalizeTest = function({ name, testOpts, operationObject, headers, schema }) {
  const method = getMethod({ operationObject })
  const path = getPath({ operationObject })
  const operationId = getOperationId({ operationObject })

  const requests = getRequests({ operationObject, testOpts })

  const responseStatus = getResponseStatus({ testOpts })
  const responseHeaders = getResponseHeaders({ headers, operationObject, testOpts })
  const responseBody = getResponseBody({ schema, testOpts })
  const response = { status: responseStatus, headers: responseHeaders, body: responseBody }

  return { name, method, path, operationId, requests, response }
}

const getMethod = function({ operationObject: { method } }) {
  return method.toUpperCase()
}

const getPath = function({
  operationObject: {
    pathObject: { path },
  },
}) {
  return path
}

module.exports = {
  getTests,
}

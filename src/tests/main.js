'use strict'

const { findTests } = require('./traverse')
const { getOperationId } = require('./operation_id')
const { getSpecReqParams } = require('./params')
const { getSpecResStatus, getSpecResHeaders, getSpecResBody } = require('./response')

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

  const specReqParams = getSpecReqParams({ operationObject, testOpts })

  const specResStatus = getSpecResStatus({ testOpts })
  const specResHeaders = getSpecResHeaders({ headers, operationObject, testOpts })
  const specResBody = getSpecResBody({ schema, testOpts })

  return {
    name,

    method,
    path,
    operationId,

    specReqParams,

    specResStatus,
    specResHeaders,
    specResBody,
  }
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

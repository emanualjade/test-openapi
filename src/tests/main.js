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
const normalizeTest = function({ name, settings, operationObject, statusCode, headers, schema }) {
  const method = getMethod({ operationObject })
  const path = getPath({ operationObject })
  const operationId = getOperationId({ operationObject })

  const specReqParams = getSpecReqParams({ operationObject, settings })

  const specResStatus = getSpecResStatus({ statusCode })
  const specResHeaders = getSpecResHeaders({ headers, operationObject, settings })
  const specResBody = getSpecResBody({ schema, settings })

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

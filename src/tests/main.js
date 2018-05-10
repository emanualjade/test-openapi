'use strict'

const { findTests } = require('./traverse')
const { getOperation } = require('./operation')
const { getRequests } = require('./request')
const { getResponse } = require('./response')

// Returns lists of tests to perform
const getTests = function({ opts }) {
  const tests = findTests({ opts })

  const testsA = tests.map(normalizeTest)
  return testsA
}

// Normalize each combination of endpoint + response + parameters
// into something tests can use
const normalizeTest = function({ name, testOpts, operationObject, headers, schema }) {
  const operation = getOperation({ operationObject })
  const requests = getRequests({ operationObject, testOpts })
  const response = getResponse({ testOpts, operationObject, headers, schema })

  return { name, operation, requests, response }
}

module.exports = {
  getTests,
}

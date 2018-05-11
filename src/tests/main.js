'use strict'

const { pick } = require('lodash')

const { findTests } = require('./traverse')
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
const normalizeTest = function({ name, operation, testOpts }) {
  const requests = getRequests({ operation, testOpts })
  const response = getResponse({ operation, testOpts })
  const operationA = pick(operation, ['method', 'path'])

  return { name, operation: operationA, requests, response }
}

module.exports = {
  getTests,
}

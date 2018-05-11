'use strict'

const { pick } = require('lodash')

const { getOperation } = require('./operation')
const { getRequests } = require('./request')
const { getResponse } = require('./response')

// Returns lists of tests to perform
// Normalize each combination of endpoint + response + parameters
// into something tests can use
const getTests = function({ opts, opts: { spec, tests } }) {
  return Object.entries(tests).map(([testKey, testOpts]) => getTest({ testKey, testOpts, spec }))
}

const getTest = function({ testKey, testOpts, spec }) {
  const { name, operation } = getOperation({ testKey, testOpts, spec })
  const requests = getRequests({ operation, testOpts })
  const response = getResponse({ operation, testOpts })
  const operationA = pick(operation, ['method', 'path'])

  return { name, operation: operationA, requests, response }
}

module.exports = {
  getTests,
}

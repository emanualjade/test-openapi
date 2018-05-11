'use strict'

const { pick } = require('lodash')

const { getDeps } = require('./deps')
const { getOperation } = require('./operation')
const { getRequests } = require('./request')
const { getResponse } = require('./response')

// Returns lists of tests to perform
// Normalize each combination of endpoint + response + parameters
// into something tests can use
const getTests = function({ opts, opts: { spec, tests } }) {
  const testKeys = Object.keys(tests)

  return Object.entries(tests).map(([testKey, testOpts]) =>
    getTest({ testKeys, testKey, testOpts, spec }),
  )
}

const getTest = function({ testKeys, testKey, testOpts, spec }) {
  const { deps, depKeys } = getDeps({ testOpts, testKeys })
  const { name, operation } = getOperation({ testKey, testOpts, spec })
  const requests = getRequests({ operation, testOpts })
  const response = getResponse({ operation, testOpts })
  const operationA = pick(operation, ['method', 'path'])

  return { name, deps, depKeys, operation: operationA, requests, response }
}

module.exports = {
  getTests,
}

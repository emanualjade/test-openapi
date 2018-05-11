'use strict'

const { pick } = require('lodash')

const { findTests } = require('./find')
const { getOperation } = require('./operation')
const { getRequests } = require('./request')
const { getResponse } = require('./response')

// Returns lists of tests to perform
const getTests = function({ opts: { spec } }) {
  const tests = findTests({ spec })

  validateTests({ tests })

  const testsA = normalizeTests({ tests, spec })
  return testsA
}

const validateTests = function({ tests }) {
  if (Object.keys(tests).length === 0) {
    throw new Error('No tests were found')
  }
}

// Normalize each combination of endpoint + response + parameters
// into something tests can use
const normalizeTests = function({ tests, spec }) {
  return Object.entries(tests).map(([testKey, testOpts]) =>
    normalizeTest({ testKey, testOpts, spec }),
  )
}

const normalizeTest = function({ testKey, testOpts, spec }) {
  const { name, operation } = getOperation({ testKey, testOpts, spec })
  const requests = getRequests({ operation, testOpts })
  const response = getResponse({ operation, testOpts })
  const operationA = pick(operation, ['method', 'path'])

  return { name, operation: operationA, requests, response }
}

module.exports = {
  getTests,
}

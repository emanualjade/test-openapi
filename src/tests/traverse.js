'use strict'

const { flattenDeep } = require('lodash')

// Finds all tests
const findTests = function({ opts }) {
  const tests = findOperations({ opts })
  const testsA = flattenDeep(tests)
  return testsA
}

// Iterates over operations (i.e. path + HTTP method)
const findOperations = function({ opts: { spec } }) {
  const operations = spec.getOperations()
  const tests = operations.map(findResponses)
  return tests
}

// Iterates over responses for each operation
const findResponses = function({ responseObjects }) {
  return responseObjects.map(findTestOpts)
}

// Iterates over `testOpts`
const findTestOpts = function(response) {
  // Defaults to {}, i.e. no tests
  const tests = response['x-tests'] || {}

  return Object.entries(tests).map(([name, testOpts]) => ({
    ...response,
    name,
    testOpts,
  }))
}

module.exports = {
  findTests,
}

'use strict'

const { flattenDeep } = require('lodash')

// Finds all `x-tests`
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
  return responseObjects.map(findTestSettings)
}

// Iterates over `x-tests`
const findTestSettings = function(response) {
  // Defaults to {}, i.e. no tests
  const tests = response['x-tests'] || {}

  return Object.entries(tests).map(([name, settings]) => ({
    ...response,
    name,
    settings,
  }))
}

module.exports = {
  findTests,
}

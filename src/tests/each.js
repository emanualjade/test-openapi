'use strict'

const { mapValues, merge, pickBy, omitBy } = require('lodash')

// Merge `each` to each test and `operationId.each` to each `operationId.*` test
// I.e. `each` is a special test name to allow for shared `request|response` properties
const mergeEach = function({ tests }) {
  const testsA = mergeTopEach({ tests })
  const testsB = mergeOperationsEach({ tests: testsA })
  return testsB
}

// Merge `each`
const mergeTopEach = function({ tests: { each: eachTest, ...tests } }) {
  if (eachTest === undefined) {
    return tests
  }

  const testsA = mapValues(tests, test => merge({}, eachTest, test))
  return testsA
}

// Merge `operationId.each`
// Note that one can also use `operationId.testPrefix.each` for all
// `operationId.testPrefix.*`
const mergeOperationsEach = function({ tests }) {
  const operationsEach = pickBy(tests, isOperationEach)
  const testsA = omitBy(tests, isOperationEach)
  const testsB = mapValues(testsA, (test, testName) =>
    mergeOperationEach({ test, testName, operationsEach }),
  )
  return testsB
}

const mergeOperationEach = function({ test, testName, operationsEach }) {
  const operationEach = Object.entries(operationsEach).find(([eachName]) =>
    startWithEachPrefix({ testName, eachName }),
  )
  if (operationEach === undefined) {
    return test
  }

  return merge({}, operationEach[1], test)
}

const isOperationEach = function(value, testName) {
  return EACH_REGEXP.test(testName)
}

const startWithEachPrefix = function({ testName, eachName }) {
  const prefix = eachName.replace(EACH_REGEXP, '')
  return testName.startsWith(`${prefix}.`)
}

const EACH_REGEXP = /\.each$/

module.exports = {
  mergeEach,
}

'use strict'

const { flattenDeep } = require('lodash')

const { DEFAULT_STATUS_CODE } = require('../constants')

// Finds all tests
const findTests = function({
  opts: {
    spec: { operations },
  },
}) {
  const tests = getTests({ operations })
  const testsA = tests.map(test => addOperation({ test, operations }))
  return testsA
}

const getTests = function({ operations }) {
  const tests = operations.map(getResponseTests)
  const testsA = flattenDeep(tests)
  return testsA
}

const getResponseTests = function({ responses }) {
  return Object.values(responses).map(({ tests }) => tests)
}

// Find the operation related to a specific test, and add it
// Does so by checking test key which should be `OperationId.testName`
const addOperation = function({ test: { testKey, testOpts }, operations }) {
  const operation = operations.find(({ operationId = '' }) => testKey.startsWith(`${operationId}.`))
  const name = testKey.replace(`${operation.operationId}.`, '')

  const response = findResponse({ operation, testOpts })
  const operationA = { ...operation, response }

  return { name, operation: operationA, testOpts }
}

// Find the operation's response related to a specific test, and add it
// Does so by checking `test.response.status`
const findResponse = function({
  operation: { responses },
  testOpts: { response: { status = DEFAULT_STATUS_CODE } = {} },
}) {
  if (responses[String(status)] !== undefined) {
    return responses[String(status)]
  }

  return {}
}

module.exports = {
  findTests,
}

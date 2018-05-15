'use strict'

const { throwTestError } = require('../errors')
const { DEFAULT_STATUS_CODE } = require('../constants')

// Find the operation related to a specific test, and add it
// Does so by checking test key which should be `OperationId.testName`
const getOperation = function({ testKey, testOpts, spec }) {
  const operation = findOperation({ testKey, spec })
  const name = testKey.replace(`${operation.operationId}.`, '')

  const response = findResponse({ operation, testOpts })
  const operationA = { ...operation, response }

  return { name, operation: operationA }
}

const findOperation = function({ testKey, spec: { operations } }) {
  const operation = operations
    .filter(({ operationId }) => operationId)
    .find(({ operationId }) => testKey.startsWith(`${operationId}.`))
  if (operation !== undefined) {
    return operation
  }

  throwTestError(`Test named '${testKey}' does not match any operation in the specification`, {
    test: testKey,
  })
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

  return { body: {}, headers: [] }
}

module.exports = {
  getOperation,
}

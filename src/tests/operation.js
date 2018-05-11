'use strict'

const { DEFAULT_STATUS_CODE } = require('../constants')

// Find the operation related to a specific test, and add it
// Does so by checking test key which should be `OperationId.testName`
const getOperation = function({ testKey, testOpts, spec: { operations } }) {
  const operation = operations.find(({ operationId = '' }) => testKey.startsWith(`${operationId}.`))
  const name = testKey.replace(`${operation.operationId}.`, '')

  const response = findResponse({ operation, testOpts })
  const operationA = { ...operation, response }

  return { name, operation: operationA }
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

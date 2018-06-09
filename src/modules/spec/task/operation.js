'use strict'

// Find the operation related to a specific task, and add it
// Does so by checking task key which should be `OperationId.key`
const getSpecOperation = function({ key, spec: { operations } }) {
  return operations.find(({ operationId }) => operationId && key.startsWith(`${operationId}.`))
}

// Find the specification response matching both the current operation and
// the received status code
const getSpecResponse = function({ key, spec }) {
  const operation = getSpecOperation({ key, spec })

  if (operation === undefined) {
    return
  }

  // `{ '200': validate, default: validate, ... }`
  const { responses } = operation
  return responses
}

module.exports = {
  getSpecOperation,
  getSpecResponse,
}
